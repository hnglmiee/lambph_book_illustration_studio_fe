import { Box, Button, Typography } from '@mui/material';

import { navigate } from '../routing';
import ProjectRow from './ProjectRow';

export default function ProjectList({ user }) {
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
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
        }}
      >
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
            sx={{
              fontSize: { xs: 24, sm: 28 },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
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

        {/* Empty state */}
        {!user.projects.length ? (
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
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                mb: 2,
              }}
            >
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
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
            }}
          >
            {user.projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}