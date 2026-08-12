import { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';

import { navigate } from '../routing';
import { listProjectsApi } from '../api/projectApi';
import ProjectRow from './ProjectRow';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await listProjectsApi();
    console.log('API response:', response); // TẠM THỜI để debug
    setProjects(response.data || []);
  } catch (err) {
    console.error('API error:', err); // TẠM THỜI
    setError(
      err?.response?.data?.message || err.message || 'Failed to load projects.',
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    navigate('#/projects/new');
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            component="h1"
            sx={{ fontSize: { xs: 24, sm: 28 }, fontWeight: 700, lineHeight: 1.2 }}
          >
            Your projects
          </Typography>

          <Button
            variant="contained"
            onClick={handleNewProject}
            sx={{
              flexShrink: 0,
              height: 38,
              px: 2,
              borderRadius: 1.8,
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            + New project
          </Button>
        </Box>

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Error state */}
        {!loading && error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchProjects}>
                Retry
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <Box
            sx={{
              minHeight: 200,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}>
              No projects yet.
            </Typography>

            <Button
              variant="contained"
              onClick={handleNewProject}
              sx={{
                height: 38,
                px: 2.2,
                borderRadius: 1.8,
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              + New project
            </Button>
          </Box>
        )}

        {/* Project rows */}
        {!loading && !error && projects.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}