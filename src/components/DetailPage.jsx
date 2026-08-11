import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import { STEPS } from '../constants';
import { navigate } from '../routing';

import Stepper from '../components/Stepper';
import StepPanel from '../components/StepPanel';
import EntityCard from '../components/EntityCard';
import SideNote from '../components/SideNote';

export default function DetailPage({
  user,
  project,
  onRunStep,
  onRetry,
  onOpenBook,
}) {
  /*
   * =========================================================
   * FE DEMO STATUS
   * =========================================================
   *
   * Không dùng project.status để điều khiển UI.
   *
   * FE demo sẽ chạy:
   *
   * STYLE
   *   ↓
   * CHARACTERS
   *   ↓
   * PORTRAITS
   *   ↓
   * CHAPTERS
   *   ↓
   * ILLUSTRATIONS
   *   ↓
   * DONE
   */

  const [demoStatus, setDemoStatus] =
    useState('STYLE');

  /*
   * Khi đổi project:
   * luôn bắt đầu lại từ STYLE.
   *
   * Điều này tránh trường hợp project.status
   * từ BE có giá trị như DRAFT / PENDING khiến
   * currentStep = undefined.
   */

  useEffect(() => {
    setDemoStatus('STYLE');
  }, [project?.id]);

  /*
   * =========================================================
   * HANDLE GENERATE
   * =========================================================
   */

  const handleRunStep = (
    stepKey,
    style = ''
  ) => {
    console.log(
      'Generate step:',
      stepKey
    );

    console.log(
      'Style:',
      style
    );

    /*
     * FE DEMO
     */

    switch (stepKey) {
      case 'STYLE':
        setDemoStatus('CHARACTERS');
        break;

      case 'CHARACTERS':
        setDemoStatus('PORTRAITS');
        break;

      case 'PORTRAITS':
        setDemoStatus('CHAPTERS');
        break;

      case 'CHAPTERS':
        setDemoStatus('ILLUSTRATIONS');
        break;

      case 'ILLUSTRATIONS':
        setDemoStatus('DONE');
        break;

      default:
        console.warn(
          'Unknown step:',
          stepKey
        );
    }

    /*
     * Sau này nối BE:
     *
     * await onRunStep(stepKey, style)
     *
     * rồi update status từ response BE.
     */
  };

  /*
   * =========================================================
   * CURRENT STEP
   * =========================================================
   */

  const statusIndex =
    STEPS.findIndex(
      (step) =>
        step.status === demoStatus
    );

  const currentStep =
    statusIndex >= 0
      ? STEPS[statusIndex]
      : null;

  /*
   * =========================================================
   * DEMO RUNNING
   * =========================================================
   */

  const running = false;

  const portraitsRunning =
    running &&
    currentStep?.key === 'PORTRAITS';

  const illustrationsRunning =
    running &&
    currentStep?.key === 'ILLUSTRATIONS';

  /*
   * =========================================================
   * ENTITIES
   * =========================================================
   */

  const entities = useMemo(() => {
    const result = [];

    /*
     * CHAPTERS
     */

    if (project?.chapters?.length) {
      result.push(
        <Box key="chapters">
          <Typography
            component="h3"
            sx={{
              fontSize: 17,
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            Chapters ({project.chapters.length})
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '1fr',
              gap: 1.5,
              mb: 3.5,
            }}
          >
            {project.chapters.map(
              (chapter, index) => (
                <EntityCard
                  key={index}
                  item={chapter}
                  kind="chapter"
                  generating={
                    illustrationsRunning
                  }
                  index={index}
                />
              )
            )}
          </Box>
        </Box>
      );
    }

    /*
     * CHARACTERS
     */

    if (project?.characters?.length) {
      result.push(
        <Box key="characters">
          <Typography
            component="h3"
            sx={{
              fontSize: 17,
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            Characters (
            {project.characters.length}
            )
          </Typography>

          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },

              gap: 1.5,
            }}
          >
            {project.characters.map(
              (
                character,
                index
              ) => (
                <EntityCard
                  key={index}
                  item={character}
                  kind="character"
                  generating={
                    portraitsRunning
                  }
                  index={index}
                />
              )
            )}
          </Box>
        </Box>
      );
    }

    return result;
  }, [
    project,
    portraitsRunning,
    illustrationsRunning,
  ]);

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <Box
      sx={{
        minHeight:
          'calc(100vh - 64px)',

        width: '100%',

        display: 'flex',

        justifyContent:
          'center',

        boxSizing: 'border-box',

        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
        }}
      >
        {/* =====================================================
            BACK
        ===================================================== */}

        <Box
          component="button"
          onClick={() =>
            navigate('#/projects')
          }
          sx={{
            display: 'inline-flex',

            alignItems: 'center',

            gap: 0.5,

            mb: 4,

            padding: 0,

            border: 'none',

            background: 'none',

            color: '#666',

            fontSize: 16,

            cursor: 'pointer',

            '&:hover': {
              color: '#222',
            },
          }}
        >
          ← Back to projects
        </Box>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <Typography
          component="h1"
          sx={{
            fontSize: {
              xs: 28,
              sm: 32,
            },

            fontWeight: 700,

            lineHeight: 1.3,

            mb: 0.5,
          }}
        >
          {project?.title}
        </Typography>

        <Typography
          sx={{
            color: '#9a9a9a',

            fontSize: 16,

            mb: 4,
          }}
        >
          Created{' '}
          {project?.createdAt
            ? new Date(
                project.createdAt
              ).toLocaleDateString()
            : ''}{' '}
          by{' '}
          {user?.name || 'user'}
        </Typography>

        {/* =====================================================
            STEPPER
        ===================================================== */}

        <Box
          sx={{
            mb: 5,
          }}
        >
          <Stepper
            status={demoStatus}
          />
        </Box>

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',

              lg:
                'minmax(0, 1fr) 300px',
            },

            gap: {
              xs: 3,

              lg: 4,
            },

            alignItems: 'start',
          }}
        >
          {/* ===================================================
              MAIN CONTENT
          =================================================== */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            {/* STEP PANEL */}

            {currentStep && (
              <StepPanel
                project={project}
                currentStep={currentStep}
                onRunStep={
                  handleRunStep
                }
              />
            )}

            {/* ENTITIES */}

            {entities.length > 0 && (
              <Box sx={{ mt: 4 }}>
                {entities}
              </Box>
            )}
          </Box>

          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <Box
            sx={{
              minWidth: 0,

              position: {
                lg: 'sticky',
              },

              top: {
                lg: 88,
              },
            }}
          >
            <SideNote
              project={project}
              onOpenBook={
                onOpenBook
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}