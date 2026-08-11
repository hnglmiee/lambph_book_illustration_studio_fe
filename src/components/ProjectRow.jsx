import { Box, Chip, Typography } from '@mui/material';

import { navigate } from '../routing';
import { statusIndex } from '../utils';
import { STEPS } from '../constants';

function projectSubtitle(project) {
  if (project.status === 'CREATED') {
    return 'Book text saved · style not yet generated';
  }

  if (project.status === 'DONE') {
    return 'All 5 steps complete';
  }

  const idx = statusIndex(project.status);

  return `${STEPS.slice(0, idx)
    .map((step) => step.label)
    .join(' + ')} done`;
}

export default function ProjectRow({ project, index }) {
  const idx = statusIndex(project.status);

  return (
    <Box
      className="project-row"
      sx={{
        '--stagger': `${index * 45}ms`,

        minHeight: 78,
        px: { xs: 2, sm: 2.5 },
        py: 1.5,

        display: 'flex',
        alignItems: 'center',
        gap: 2,

        border: '1px solid',
        borderColor: '#e5e1dd',
        borderRadius: 2.5,
        backgroundColor: '#fff',

        cursor: 'pointer',

        transition: 'all 0.2s ease',

        '&:hover': {
          borderColor: '#d5d0ca',
          boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
        },

        '&:focus-visible': {
          outline: '2px solid #ff6500',
          outlineOffset: 2,
        },
      }}
      tabIndex={0}
      onClick={() => navigate(`#/projects/${project.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          navigate(`#/projects/${project.id}`);
        }
      }}
    >
      {/* Project information */}
      <Box
        className="title"
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          component="h4"
          sx={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 0.4,
            color: '#242424',
          }}
        >
          {project.title}
        </Typography>

        <Typography
          component="span"
          sx={{
            display: 'block',
            fontSize: 12.5,
            lineHeight: 1.4,
            color: '#9a9a9a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Created{' '}
          {new Date(project.createdAt).toLocaleDateString()} ·{' '}
          {projectSubtitle(project)}
        </Typography>
      </Box>

      {/* Progress */}
      <Box
        className="progress-mini"
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
          alignItems: 'center',
          gap: 0.6,
          flexShrink: 0,
        }}
      >
        {STEPS.map((_, i) => (
          <Box
            key={i}
            component="span"
            className={`seg ${i < idx ? 'on' : ''}`}
            sx={{
              width: 25,
              height: 4,
              borderRadius: 10,
              backgroundColor:
                i < idx ? '#ff6500' : '#c8c5c1',
            }}
          />
        ))}
      </Box>

      {/* Status */}
      {project.status === 'DONE' ? (
        <Chip
          label="Done"
          sx={{
            flexShrink: 0,
            minWidth: 100,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#242424',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,

            '& .MuiChip-label': {
              px: 1.8,
            },
          }}
        />
      ) : project.status === 'CREATED' ? (
        <Chip
          label="Draft"
          sx={{
            flexShrink: 0,
            minWidth: 100,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#9da2a4',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,

            '& .MuiChip-label': {
              px: 1.8,
            },
          }}
        />
      ) : (
        <Chip
          label={
            <>
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  mr: 0.8,
                }}
              />
              In progress
            </>
          }
          sx={{
            flexShrink: 0,
            minWidth: 112,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#ff6500',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,

            '& .MuiChip-label': {
              px: 1.6,
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />
      )}
    </Box>
  );
}