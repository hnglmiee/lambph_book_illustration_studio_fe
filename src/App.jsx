import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Box } from '@mui/material';

import {
  DEFAULT_STYLE,
  STEPS,
} from './constants';

import {
  loadDB,
  saveDB,
  createUid,
} from './storage';

import {
  getRoute,
  navigate,
} from './routing';

import {
  snippet,
} from './utils';

import AppNav from './components/AppNav';
import AppFooter from './components/AppFooter';
import AuthCard from './components/AuthCard';
import ProjectList from './components/ProjectList';
import NewProject from './components/NewProject';
import DetailPage from './components/DetailPage';
import BookTextModal from './components/BookTextModal';

/*
 * Polyfill structuredClone for environments
 * that don't provide it.
 */
const structuredClone =
  typeof globalThis !== 'undefined' &&
  typeof globalThis.structuredClone === 'function'
    ? globalThis.structuredClone
    : (obj) =>
        typeof window !== 'undefined' &&
        typeof window.structuredClone === 'function'
          ? window.structuredClone(obj)
          : JSON.parse(JSON.stringify(obj));

export default function App() {
  /*
   * ---------------------------------------------------------
   * GLOBAL APP STATE
   * ---------------------------------------------------------
   */

  const [db, setDb] = useState(loadDB);

  const [routeState, setRouteState] = useState(
    window.location.hash,
  );

  const timersRef = useRef([]);

  const [modalProjectId, setModalProjectId] =
    useState(null);

  /*
   * Current logged-in user
   */
  const currentUser = db.currentEmail
    ? db.users[db.currentEmail] || null
    : null;

  /*
   * Current route
   */
  const route = getRoute(currentUser);

  /*
   * ---------------------------------------------------------
   * PERSISTENCE
   * ---------------------------------------------------------
   */

  const persist = useCallback((nextDb) => {
    setDb(nextDb);
    saveDB(nextDb);
  }, []);

  /*
   * ---------------------------------------------------------
   * HASH CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleHashChange = () => {
      setRouteState(window.location.hash);
    };

    window.addEventListener(
      'hashchange',
      handleHashChange,
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHashChange,
      );
    };
  }, []);

  /*
   * Clear all pending timers when App unmounts.
   */
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * USER HELPERS
   * ---------------------------------------------------------
   */

  const getCurrentUser = useCallback(
    (database = db) => {
      if (!database.currentEmail) {
        return null;
      }

      return (
        database.users[database.currentEmail] ||
        null
      );
    },
    [db],
  );

  const findProject = useCallback(
    (id, database = db) => {
      const user = getCurrentUser(database);

      if (!user) {
        return null;
      }

      return (
        user.projects.find(
          (project) => project.id === id,
        ) || null
      );
    },
    [db, getCurrentUser],
  );

  /*
   * ---------------------------------------------------------
   * AUTH
   * ---------------------------------------------------------
   */

  const signIn = useCallback(
    (name, email) => {
      const nextDb = structuredClone(db);

      if (!nextDb.users[email]) {
        nextDb.users[email] = {
          name,
          email,
          projects: [],
        };
      } else {
        nextDb.users[email].name = name;
      }

      nextDb.currentEmail = email;

      persist(nextDb);

      navigate('#/projects');
    },
    [db, persist],
  );

  const signOut = useCallback(() => {
    const nextDb = structuredClone(db);

    nextDb.currentEmail = null;

    persist(nextDb);

    navigate('#/');
  }, [db, persist]);

  /*
   * ---------------------------------------------------------
   * CREATE PROJECT
   * ---------------------------------------------------------
   *
   * A new project starts at CREATED.
   *
   * CREATED means:
   *
   *     book text exists
   *     ↓
   *     Style has not been generated yet
   *
   * DetailPage maps CREATED -> STYLE for display.
   */

  const createProject = useCallback(
    (title, text) => {
      const nextDb = structuredClone(db);

      const user = getCurrentUser(nextDb);

      if (!user) {
        return;
      }

      const project = {
        id: createUid(),

        title,

        bookText: text,

        createdAt: Date.now(),

        status: 'CREATED',

        style: null,

        characters: [],

        chapters: [],

        stepState: 'IDLE',

        stepStartedAt: null,
      };

      user.projects.unshift(project);

      persist(nextDb);

      navigate(
        `#/projects/${project.id}`,
      );
    },
    [
      db,
      getCurrentUser,
      persist,
    ],
  );

  /*
   * ---------------------------------------------------------
   * REVEAL GENERATED ITEMS ONE BY ONE
   * ---------------------------------------------------------
   */

  const revealSequentially = useCallback(
    (
      projectId,
      itemsKey,
      flagKey,
      onDone,
    ) => {
      let index = 0;

      const next = () => {
        if (index >= itemsKey.length) {
          onDone();
          return;
        }

        const timer = window.setTimeout(
          () => {
            const nextDb =
              structuredClone(loadDB());

            const project =
              findProject(
                projectId,
                nextDb,
              );

            if (!project) {
              return;
            }

            project[itemsKey.name][index][flagKey] =
              true;

            index += 1;

            saveDB(nextDb);

            setDb(nextDb);

            next();
          },
          1100 + Math.random() * 700,
        );

        timersRef.current.push(timer);
      };

      next();
    },
    [findProject],
  );

  /*
   * ---------------------------------------------------------
   * RUN STEP
   * ---------------------------------------------------------
   *
   * This is the important part.
   *
   * DetailPage calls:
   *
   *     onRunStep(
   *       project.id,
   *       stepKey,
   *       customStyle
   *     )
   *
   * This function:
   *
   *     1. Finds project
   *     2. Sets RUNNING
   *     3. Waits
   *     4. Generates result
   *     5. Changes project.status
   *     6. Sets IDLE
   *     7. Saves DB
   *     8. React re-renders
   *
   * Flow:
   *
   * STYLE
   *   ↓
   * STYLE_SET
   *   ↓
   * CHARACTERS
   *
   * CHARACTERS
   *   ↓
   * CHARACTERS_GENERATED
   *   ↓
   * PORTRAITS
   *
   * PORTRAITS
   *   ↓
   * PORTRAITS_GENERATED
   *   ↓
   * CHAPTERS
   *
   * CHAPTERS
   *   ↓
   * CHAPTERS_GENERATED
   *   ↓
   * ILLUSTRATIONS
   *
   * ILLUSTRATIONS
   *   ↓
   * DONE
   */

  const runStep = useCallback(
    (
      projectId,
      stepKey,
      customStyle = '',
    ) => {
      const currentProject =
        findProject(projectId);

      /*
       * Prevent duplicate generation.
       */
      if (
        !currentProject ||
        currentProject.stepState === 'RUNNING'
      ) {
        return;
      }

      /*
       * Clone DB before changing state.
       */
      const startDb =
        structuredClone(db);

      const startProject =
        findProject(
          projectId,
          startDb,
        );

      if (!startProject) {
        return;
      }

      /*
       * Immediately show RUNNING.
       */
      startProject.stepState =
        'RUNNING';

      startProject.stepStartedAt =
        Date.now();

      persist(startDb);

      /*
       * Simulate Gemini generation time.
       */
      const delay =
        1600 + Math.random() * 900;

      const timer =
        window.setTimeout(() => {
          /*
           * Reload the latest DB.
           *
           * This is important because the project
           * may have changed while the request was
           * running.
           */
          const nextDb =
            structuredClone(loadDB());

          const project =
            findProject(
              projectId,
              nextDb,
            );

          if (!project) {
            return;
          }

          /*
           * -------------------------------------------------
           * STYLE
           * -------------------------------------------------
           */

          if (stepKey === 'STYLE') {
            project.style =
              customStyle
                ? `${customStyle} (as you specified — Gemini will keep this in mind for every prompt below).`
                : DEFAULT_STYLE;

            project.status =
              'STYLE_SET';

            project.stepState =
              'IDLE';

            project.stepStartedAt =
              null;

            saveDB(nextDb);

            setDb(nextDb);

            return;
          }

          /*
           * -------------------------------------------------
           * CHARACTERS
           * -------------------------------------------------
           */

          if (stepKey === 'CHARACTERS') {
            project.characters = [
              {
                name: 'Character A',

                prompt:
                  `A protagonist drawn from your book’s opening: "${snippet(
                    project.bookText,
                    90,
                  )}"`,

                portraitReady: false,
              },

              {
                name: 'Character B',

                prompt:
                  'A companion or foil who appears alongside Character A throughout the story.',

                portraitReady: false,
              },
            ];

            /*
             * Move to Portraits.
             */
            project.status =
              'CHARACTERS_GENERATED';

            project.stepState =
              'IDLE';

            project.stepStartedAt =
              null;

            saveDB(nextDb);

            setDb(nextDb);

            return;
          }

          /*
           * -------------------------------------------------
           * PORTRAITS
           * -------------------------------------------------
           */

          if (stepKey === 'PORTRAITS') {
            project.characters.forEach(
              (character) => {
                character.portraitReady =
                  false;
              },
            );

            saveDB(nextDb);

            setDb(nextDb);

            revealSequentially(
              projectId,

              {
                name: 'characters',

                length:
                  project.characters.length,
              },

              'portraitReady',

              () => {
                const finalDb =
                  structuredClone(
                    loadDB(),
                  );

                const finalProject =
                  findProject(
                    projectId,
                    finalDb,
                  );

                if (!finalProject) {
                  return;
                }

                /*
                 * Move to Chapters.
                 */
                finalProject.status =
                  'PORTRAITS_GENERATED';

                finalProject.stepState =
                  'IDLE';

                finalProject.stepStartedAt =
                  null;

                saveDB(finalDb);

                setDb(finalDb);
              },
            );

            return;
          }

          /*
           * -------------------------------------------------
           * CHAPTERS
           * -------------------------------------------------
           */

          if (stepKey === 'CHAPTERS') {
            project.chapters = [
              {
                name: 'Opening Scene',

                prompt:
                  `An illustration capturing the opening of your book: "${snippet(
                    project.bookText,
                    110,
                  )}" — featuring Character A and Character B, following the established style.`,

                illustrationReady: false,
              },
            ];

            /*
             * Move to Illustrations.
             */
            project.status =
              'CHAPTERS_GENERATED';

            project.stepState =
              'IDLE';

            project.stepStartedAt =
              null;

            saveDB(nextDb);

            setDb(nextDb);

            return;
          }

          /*
           * -------------------------------------------------
           * ILLUSTRATIONS
           * -------------------------------------------------
           */

          if (
            stepKey === 'ILLUSTRATIONS'
          ) {
            project.chapters.forEach(
              (chapter) => {
                chapter.illustrationReady =
                  false;
              },
            );

            saveDB(nextDb);

            setDb(nextDb);

            revealSequentially(
              projectId,

              {
                name: 'chapters',

                length:
                  project.chapters.length,
              },

              'illustrationReady',

              () => {
                const finalDb =
                  structuredClone(
                    loadDB(),
                  );

                const finalProject =
                  findProject(
                    projectId,
                    finalDb,
                  );

                if (!finalProject) {
                  return;
                }

                /*
                 * Everything is complete.
                 */
                finalProject.status =
                  'DONE';

                finalProject.stepState =
                  'IDLE';

                finalProject.stepStartedAt =
                  null;

                saveDB(finalDb);

                setDb(finalDb);
              },
            );

            return;
          }
        }, delay);

      timersRef.current.push(timer);
    },
    [
      db,
      findProject,
      persist,
      revealSequentially,
    ],
  );

  /*
   * ---------------------------------------------------------
   * RETRY STUCK STEP
   * ---------------------------------------------------------
   */

  const retryStuckStep =
    useCallback(
      (projectId) => {
        const nextDb =
          structuredClone(db);

        const project =
          findProject(
            projectId,
            nextDb,
          );

        if (!project) {
          return;
        }

        project.stepState =
          'IDLE';

        project.stepStartedAt =
          null;

        persist(nextDb);
      },
      [
        db,
        findProject,
        persist,
      ],
    );

  /*
   * ---------------------------------------------------------
   * BOOK MODAL
   * ---------------------------------------------------------
   */

  const modalProject =
    modalProjectId
      ? findProject(
          modalProjectId,
        )
      : null;

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  if (route.name === 'auth') {
    return (
      <>
        <AuthCard
          onSignIn={signIn}
        />

        <BookTextModal
          open={false}
          project={null}
          onClose={() =>
            setModalProjectId(null)
          }
        />
      </>
    );
  }

  return (
    <>
      <AppNav
        user={currentUser}
        onSignOut={signOut}
      />

      {route.name === 'list' && (
        <ProjectList
          user={currentUser}
        />
      )}

      {route.name === 'new' && (
        <NewProject
          onCreateProject={
            createProject
          }
        />
      )}

      {route.name === 'detail' && (
        <DetailPage
          user={currentUser}
          project={
            findProject(route.id) ||
            currentUser.projects[0]
          }
          onRunStep={runStep}
          onRetry={
            retryStuckStep
          }
          onOpenBook={
            setModalProjectId
          }
        />
      )}

      <AppFooter />

      <BookTextModal
        open={Boolean(
          modalProject,
        )}
        project={modalProject}
        onClose={() =>
          setModalProjectId(null)
        }
      />
    </>
  );
}