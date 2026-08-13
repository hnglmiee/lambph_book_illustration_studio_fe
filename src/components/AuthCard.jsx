import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
} from '@mui/material';

import LOGO from '../assets/logo.jpg';

export default function AuthCard({ onSignIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !cleanEmail.includes('@')) {
      setError('Enter your name and a valid email to continue.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSignIn(cleanName, cleanEmail);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        boxSizing: 'border-box',
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 440,
          boxSizing: 'border-box',
          px: { xs: 3, sm: 4 },
          py: 4,
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <Box
            component="img"
            src={LOGO}
            alt="Gradion"
            sx={{
              width: 72,
              height: 72,
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            fontSize: { xs: 20, sm: 22 },
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          Book Illustration Studio
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 340,
            mx: 'auto',
            mb: 3.5,
          }}
        >
          Enter your details to start or resume an illustration project.
        </Typography>

        {/* Name */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            component="label"
            htmlFor="f-name"
            sx={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              mb: 0.75,
            }}
          >
            Full name <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>

          <TextField
            id="f-name"
            fullWidth
            placeholder="Mira Hassan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="medium"
          />
        </Box>

        {/* Email */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            component="label"
            htmlFor="f-email"
            sx={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              mb: 0.75,
            }}
          >
            Email <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>

          <TextField
            id="f-email"
            type="email"
            fullWidth
            placeholder="mira@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submit();
              }
            }}
            size="medium"
          />
        </Box>

        {/* Error */}
        <Box
          sx={{
            minHeight: error ? 22 : 8,
            mb: 1.5,
            color: 'error.main',
            fontSize: 13,
          }}
        >
          {error}
        </Box>

        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={submit}
          disabled={submitting}
          sx={{
            height: 46,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Continue
          <Box
            component="span"
            sx={{
              ml: 1,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            →
          </Box>
        </Button>

        {/* Footer */}
        <Typography
          sx={{
            mt: 2.5,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: 12.5,
            lineHeight: 1.6,
          }}
        >
          No password — this is a lightweight identity check. Using an email
          that already has projects resumes them exactly where you left off.
        </Typography>
      </Card>
    </Box>
  );
}