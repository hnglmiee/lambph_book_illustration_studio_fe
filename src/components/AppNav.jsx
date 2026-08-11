import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';

import LOGO from '../assets/logo.jpg';
import { navigate } from '../routing';
import { getInitials } from '../utils';

export default function AppNav({ user, onSignOut }) {
  const initials = getInitials(user.name || '?');

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          minHeight: '64px !important',
          px: { xs: 2, sm: 3, md: 5 },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate('#/projects')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={LOGO}
            alt="Gradion"
            sx={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: 1.5,
              display: 'block',
            }}
          />
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 2,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate('#/projects')}
            sx={{
              minWidth: 'auto',
              px: 1.5,
              py: 1,
              color: 'text.primary',
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Projects
          </Button>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* User section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>

          <Typography
            sx={{
              display: { xs: 'none', sm: 'block' },
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {user.name}
          </Typography>

          <Button
            variant="text"
            onClick={onSignOut}
            sx={{
              minWidth: 'auto',
              px: { xs: 1, sm: 1.5 },
              py: 1,
              color: 'text.secondary',
              textTransform: 'none',
              fontSize: 14,
              borderRadius: 1.5,
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Sign out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
