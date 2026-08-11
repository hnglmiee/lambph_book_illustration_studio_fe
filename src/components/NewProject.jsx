  import { useRef, useState } from 'react';
  import {
    Box,
    Button,
    TextField,
    Typography,
  } from '@mui/material';

  import { navigate } from '../routing';

  export default function NewProject({ onCreateProject }) {
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [bookText, setBookText] = useState('');
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const handleFile = (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;

        setBookText(text);
        setFileName(file.name);
        setError('');
      };

      reader.readAsText(file);
    };

    const createProject = () => {
      const cleanTitle = title.trim();
      const cleanText = bookText.trim();

      if (!cleanTitle || !cleanText) {
        setError(
          'Give the project a title and provide the book text (paste or upload).',
        );
        return;
      }

      setError('');
      onCreateProject(cleanTitle, cleanText);
    };

    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 5 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 680,
          }}
        >
          {/* Back */}
          <Box
            component="button"
            onClick={() => navigate('#/projects')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 3,
              padding: 0,
              border: 'none',
              background: 'none',
              color: 'text.secondary',
              fontSize: 14,
              cursor: 'pointer',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            ← Back to projects
          </Box>

          {/* Header */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 1,
            }}
          >
            Start a new illustration project
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: 14,
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            Give it a title, then paste the book's text or upload a .txt file.
          </Typography>

          {/* Project title */}
          <Box sx={{ mb: 3 }}>
            <Typography
              component="label"
              htmlFor="f-title"
              sx={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                mb: 0.75,
              }}
            >
              Project title{' '}
              <Box
                component="span"
                sx={{ color: 'error.main' }}
              >
                *
              </Box>
            </Typography>

            <TextField
              id="f-title"
              fullWidth
              placeholder="e.g. The Wind in the Willows — cottage-core"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>

          {/* Book text */}
          <Box>
            <Typography
              component="label"
              htmlFor="book-textarea"
              sx={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                mb: 0.75,
              }}
            >
              Book text{' '}
              <Box
                component="span"
                sx={{ color: 'error.main' }}
              >
                *
              </Box>
            </Typography>

            {/* Upload area */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: '100%',
                minHeight: 110,
                border: '1.5px dashed',
                borderColor: fileName
                  ? 'success.main'
                  : 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: fileName
                  ? 'success.50'
                  : 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: fileName
                    ? 'success.main'
                    : 'text.primary',
                }}
              >
                {fileName
                  ? `✓ ${fileName} loaded`
                  : 'Click to choose a .txt file'}
              </Typography>

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: 12.5,
                  color: 'text.secondary',
                }}
              >
                Plain text only · used once as context for every step below
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              hidden
              onChange={handleFile}
            />

            {/* Divider */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                my: 2,
                color: 'text.secondary',
                fontSize: 12,
                '&::before, &::after': {
                  content: '""',
                  flex: 1,
                  height: '1px',
                  backgroundColor: 'divider',
                },
              }}
            >
              or paste text
            </Box>

            {/* Text area */}
            <TextField
              id="book-textarea"
              fullWidth
              multiline
              minRows={8}
              placeholder="Once upon a time, in a small burrow by the river..."
              value={bookText}
              onChange={(e) => setBookText(e.target.value)}
            />
          </Box>

          {/* Error */}
          <Box
            sx={{
              minHeight: error ? 22 : 8,
              mt: 1.5,
              color: 'error.main',
              fontSize: 13,
            }}
          >
            {error}
          </Box>

          {/* Create button */}
          <Button
            fullWidth
            variant="contained"
            onClick={createProject}
            sx={{
              height: 46,
              mt: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Create project

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
        </Box>
      </Box>
    );
  }
