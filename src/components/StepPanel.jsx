import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const STEP_CONTENT = {
  STYLE: {
    title: 'Style',
    description:
      'Choose the visual art direction for your book.',
    inputLabel: 'Art style (optional)',
    placeholder:
      'Leave blank to let Gemini choose a style based on your book',
    button: 'Generate Style',
  },

  CHARACTERS: {
    title: 'Characters',
    description:
      'Generate character descriptions based on your book.',
    button: 'Generate Characters',
  },

  PORTRAITS: {
    title: 'Portraits',
    description:
      'Generate portraits for the characters in your book.',
    button: 'Generate Portraits',
  },

  CHAPTERS: {
    title: 'Chapters',
    description:
      'Analyze the chapters of your book.',
    button: 'Analyze Chapters',
  },

  ILLUSTRATIONS: {
    title: 'Illustrations',
    description:
      'Generate illustrations for your book chapters.',
    button: 'Generate Illustrations',
  },
};

export default function StepPanel({
  project,
  currentStep,
  onRunStep,
}) {
  const [style, setStyle] = useState(
    project?.style || ''
  );

  useEffect(() => {
    setStyle(project?.style || '');
  }, [project?.id]);

  if (!currentStep) {
    return null;
  }

  const stepKey = currentStep.key;
  const content = STEP_CONTENT[stepKey];

  if (!content) {
    return null;
  }

  const handleGenerate = () => {
    onRunStep?.(
      stepKey,
      style
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid #e3dfda',
        borderRadius: '18px',
        backgroundColor: '#fff',

        px: {
          xs: 3,
          sm: 4,
          md: 5,
        },

        py: {
          xs: 3,
          sm: 4,
          md: 4.5,
        },

        boxSizing: 'border-box',
      }}
    >
      {/* TOP TEXT */}

      <Typography
        sx={{
          fontSize: {
            xs: 16,
            sm: 18,
          },
          color: '#333',
          mb: 3,
        }}
      >
        Ready for the next step:{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {content.title}
        </Box>
        .
      </Typography>

      {/* =========================
          STYLE
      ========================= */}

      {stepKey === 'STYLE' && (
        <>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: '#333',
              mb: 1.2,
            }}
          >
            {content.inputLabel}
          </Typography>

          <TextField
            fullWidth
            value={style}
            onChange={(event) =>
              setStyle(event.target.value)
            }
            placeholder={content.placeholder}
            variant="outlined"
            sx={{
              mb: 2.5,

              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#fff',

                '& fieldset': {
                  borderColor: '#bbb7b2',
                  borderWidth: 1.5,
                },

                '&:hover fieldset': {
                  borderColor: '#99948f',
                },

                '&.Mui-focused fieldset': {
                  borderColor: '#ff6500',
                  borderWidth: 2,
                },
              },

              '& input': {
                fontSize: 16,
                py: 2.1,
              },

              '& input::placeholder': {
                color: '#888',
                opacity: 1,
              },
            }}
          />

          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.55,
              color: '#a1a4a5',
              mb: 2.8,
            }}
          >
            Reopening this page mid-step won't fire a
            second request — it just shows the same
            in-flight state until it lands.
          </Typography>
        </>
      )}

      {/* =========================
          OTHER STEPS
      ========================= */}

      {stepKey !== 'STYLE' && (
        <Typography
          sx={{
            fontSize: 15,
            lineHeight: 1.6,
            color: '#8f8f8f',
            mb: 3,
          }}
        >
          {content.description}
        </Typography>
      )}

      {/* =========================
          BUTTON
      ========================= */}

      <Button
        variant="contained"
        onClick={handleGenerate}
        sx={{
          minWidth: {
            xs: '100%',
            sm: 260,
          },

          height: 62,

          px: 4,

          borderRadius: '12px',

          backgroundColor: '#ff6500',

          color: '#fff',

          fontSize: 18,

          fontWeight: 700,

          textTransform: 'none',

          boxShadow: 'none',

          '&:hover': {
            backgroundColor: '#e85b00',
            boxShadow: 'none',
          },
        }}
      >
        {content.button}

        <Box
          component="span"
          sx={{
            ml: 1.2,
            fontSize: 23,
            lineHeight: 1,
          }}
        >
          →
        </Box>
      </Button>
    </Box>
  );
}