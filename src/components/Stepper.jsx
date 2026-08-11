import { Box, Typography } from '@mui/material';
import { STEPS } from '../constants';

export default function Stepper({ status }) {
  const currentIndex = STEPS.findIndex(
    (step) => step.status === status
  );

  const isDone = status === 'DONE';

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        pb: 1,
      }}
    >
      {STEPS.map((step, index) => {
        const completed =
          isDone ||
          (currentIndex >= 0 && index < currentIndex);

        const current =
          !isDone &&
          currentIndex === index;

        return (
          <Box
            key={step.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex:
                index === STEPS.length - 1
                  ? '0 0 auto'
                  : 1,
              minWidth: {
                xs: 125,
                md: 150,
              },
            }}
          >
            {/* STEP */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.3,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,

                  bgcolor: completed
                    ? '#242424'
                    : current
                    ? '#ff6500'
                    : '#c5c2bd',

                  color: '#fff',

                  fontWeight: 700,
                  fontSize: 17,

                  boxShadow: current
                    ? '0 0 0 5px rgba(255,101,0,.13)'
                    : 'none',
                }}
              >
                {completed ? '✓' : step.number}
              </Box>

              <Typography
                sx={{
                  fontSize: {
                    xs: 15,
                    md: 17,
                  },

                  fontWeight:
                    current || completed
                      ? 700
                      : 500,

                  color:
                    current || completed
                      ? '#333'
                      : '#8f8f8f',

                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </Typography>
            </Box>

            {/* LINE */}
            {index < STEPS.length - 1 && (
              <Box
                sx={{
                  height: 2,
                  flex: 1,
                  mx: {
                    xs: 1.5,
                    md: 2.2,
                  },

                  bgcolor:
                    isDone ||
                    (currentIndex >= 0 &&
                      index < currentIndex)
                      ? '#ff6500'
                      : '#c8c5c1',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}