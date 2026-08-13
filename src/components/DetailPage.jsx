import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { STEPS } from '../constants';
import { navigate } from '../routing';
import { getProjectApi, runStepApi, retryStepApi } from '../api/projectApi';
import {
  nextStepKeyFromStatus,
  endpointForStepKey,
  toAbsoluteImageUrl,
} from '../utils/pipeline';

import Stepper from '../components/Stepper';
import StepPanel from '../components/StepPanel';
import EntityCard from '../components/EntityCard';
import SideNote from '../components/SideNote';

const POLL_INTERVAL_MS = 3000;

export default function DetailPage({ user, onOpenBook }) {
  const projectId = window.location.hash.split('/')[2]; // '#/projects/:id'

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pollTimerRef = useRef(null);

  const fetchProject = useCallback(async () => {
    try {
      const response = await getProjectApi(projectId);
      setProject(response.data);
      setFetchError('');
      return response.data;
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || err.message || 'Failed to load project.',
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch lần đầu khi mở trang / đổi project
  useEffect(() => {
    setLoading(true);
    fetchProject();

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [fetchProject]);

  // Polling khi đang RUNNING — dừng ngay khi chuyển IDLE/FAILED
  useEffect(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (project?.stepState === 'RUNNING') {
      pollTimerRef.current = setTimeout(() => {
        fetchProject();
      }, POLL_INTERVAL_MS);
    }

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [project, fetchProject]);

  const currentStepKey = project ? nextStepKeyFromStatus(project.status) : null;
  const statusIndex = STEPS.findIndex((step) => step.key === currentStepKey);
  const currentStep = statusIndex >= 0 ? STEPS[statusIndex] : null;

  const running = project?.stepState === 'RUNNING';
  const failed = project?.stepState === 'FAILED';
  const stale = Boolean(project?.stale);

  const portraitsRunning = running && currentStepKey === 'PORTRAITS';
  const illustrationsRunning = running && currentStepKey === 'ILLUSTRATIONS';

  const handleRunStep = useCallback(
  async (stepKey, userStyle = '') => {
    if (!project || submitting || running) return;

    setSubmitting(true);
    setActionError('');

    try {
      const endpoint = endpointForStepKey(stepKey);
      const body = stepKey === 'STYLE' ? { userStyle: userStyle || null } : {};
      await runStepApi(project.id, endpoint, body);
      await fetchProject();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        await fetchProject();
      } else {
        setActionError(
          err?.response?.data?.message || err.message || 'Failed to start step.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  },
  [project, submitting, running, fetchProject],
);

  const handleRetry = async () => {
    if (!project || submitting) return;

    setSubmitting(true);
    setActionError('');

    try {
      await retryStepApi(project.id, {});
      await fetchProject();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || err.message || 'Failed to retry step.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const entities = useMemo(() => {
  if (!project) return [];
  const result = [];

  if (project.chapters?.length) {
    result.push(
      <Box key="chapters">
        <Typography component="h3" sx={{ fontSize: 17, fontWeight: 600, mb: 1.5 }}>
          Chapters ({project.chapters.length})
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5, mb: 3.5 }}>
          {project.chapters.map((chapter, index) => (
            <EntityCard
              key={chapter.id || index}
              item={{
                ...chapter,
                illustrationUrl: toAbsoluteImageUrl(chapter.illustrationUrl),
              }}
              kind="chapter"
              generating={illustrationsRunning}
              index={index}
            />
          ))}
        </Box>
      </Box>,
    );
  }

  if (project.characters?.length) {
    result.push(
      <Box key="characters">
        <Typography component="h3" sx={{ fontSize: 17, fontWeight: 600, mb: 1.5 }}>
          Characters ({project.characters.length})
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.5,
          }}
        >
          {project.characters.map((character, index) => (
            <EntityCard
              key={character.id || index}
              item={{
                ...character,
                portraitUrl: toAbsoluteImageUrl(character.portraitUrl),
              }}
              kind="character"
              generating={portraitsRunning}
              index={index}
            />
          ))}
        </Box>
      </Box>,
    );
  }

  return result;
}, [project, portraitsRunning, illustrationsRunning]);

  // Auto-start STYLE step when project is newly created
//   useEffect(() => {
//   if (project && project.status === 'CREATED' && project.stepState === 'IDLE') {
//     handleRunStep('STYLE');
//   }
// }, [project?.id, project?.status, project?.stepState, handleRunStep]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <Typography sx={{ color: 'text.secondary' }}>Loading project…</Typography>
      </Box>
    );
  }

  if (fetchError || !project) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography sx={{ color: 'error.main', mb: 2 }}>
          {fetchError || 'Project not found.'}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate('#/projects')}
          sx={{ border: 'none', background: 'none', color: '#ff6500', cursor: 'pointer' }}
        >
          ← Back to projects
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Box
          component="button"
          onClick={() => navigate('#/projects')}
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
            '&:hover': { color: '#222' },
          }}
        >
          ← Back to projects
        </Box>

        <Typography
          component="h1"
          sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}
        >
          {project.title}
        </Typography>

        <Typography sx={{ color: '#9a9a9a', fontSize: 16, mb: 4 }}>
          Created {new Date(project.createdAt).toLocaleDateString()} by{' '}
          {user?.name || 'user'}
        </Typography>

        <Box sx={{ mb: 5 }}>
          <Stepper status={currentStepKey} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
            gap: { xs: 3, lg: 4 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {currentStep && (
              <StepPanel
                project={project}
                currentStep={currentStep}
                onRunStep={handleRunStep}
                onRetry={handleRetry}
                running={running}
                failed={failed}
                stale={stale}
                submitting={submitting}
                errorMessage={actionError || project.stepFailureReason}
              />
            )}

            {entities.length > 0 && <Box sx={{ mt: 4 }}>{entities}</Box>}
          </Box>

          <Box sx={{ minWidth: 0, position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <SideNote project={project} onOpenBook={onOpenBook} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}