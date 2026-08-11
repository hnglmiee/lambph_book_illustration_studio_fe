import { Box, Link } from '@mui/material';

import { clearDB } from '../storage';
import { navigate } from '../routing';

export default function AppFooter() {
  const handleReset = () => {
    if (!window.confirm('Clear all demo data?')) return;

    clearDB();
    navigate('#/');
    window.location.reload();
  };

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        py: 2.5,
        mt: 3,

        color: '#a0a0a0',
        fontSize: 11.5,
        lineHeight: 1,

        borderTop: '1px solid #eeeeee',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          GRADION{' '}
          <Box
            component="b"
            sx={{
              fontWeight: 600,
              mx: 0.3,
            }}
          >
            |
          </Box>{' '}
          Scaling Business
        </Box>

        <Box
          component="span"
          sx={{
            color: '#c5c5c5',
          }}
        >
          ·
        </Box>

        <Link
          component="button"
          onClick={handleReset}
          underline="none"
          sx={{
            border: 'none',
            background: 'none',
            padding: 0,

            color: '#a0a0a0',
            fontSize: 11.5,
            fontFamily: 'inherit',

            cursor: 'pointer',

            '&:hover': {
              color: '#ff6500',
            },
          }}
        >
          reset demo data
        </Link>
      </Box>
    </Box>
  );
}