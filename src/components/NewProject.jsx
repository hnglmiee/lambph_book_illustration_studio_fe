import { useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { navigate } from '../routing';
import { createProjectApi } from '../api/projectApi';

export default function NewProject() {
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [bookText, setBookText] = useState('');
  const [bookFile, setBookFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setBookFile(file);
    setFileName(file.name);
    setError('');

    // Vẫn đọc preview text để hiện trong textarea (UX giữ nguyên như cũ),
    // nhưng file gốc mới là thứ gửi lên API.
    const reader = new FileReader();
    reader.onload = (e) => {
      setBookText(e.target.result);
    };
    reader.readAsText(file);
  };

  const createProject = async () => {
    const cleanTitle = title.trim();
    const cleanText = bookText.trim();

    if (!cleanTitle || !cleanText) {
      setError(
        'Give the project a title and provide the book text (paste or upload).'
      );
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await createProjectApi({
        title: cleanTitle,
        bookText: bookFile ? undefined : cleanText,
        bookFile: bookFile || undefined,
      });

      const project = response.data;
      navigate(`#/projects/${project.id}`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to create project. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
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
      <Box sx={{ width: '100%', maxWidth: 680 }}>
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
            '&:hover': { color: 'text.primary' },
          }}
        >
          ← Back to projects
        </Box>

        {/* Header */}
        <Typography
          component="h1"
          sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 600, lineHeight: 1.3, mb: 1 }}
        >
          Start a new illustration project
        </Typography>

        <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.6, mb: 4 }}>
          Give it a title, then paste the book's text or upload a .txt file.
        </Typography>

        {/* Project title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            htmlFor="f-title"
            sx={{ display: 'block', fontSize: 14, fontWeight: 500, mb: 0.75 }}
          >
            Project title <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>

          <TextField
            id="f-title"
            fullWidth
            placeholder="e.g. The Wind in the Willows — cottage-core"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </Box>

        {/* Book text */}
        <Box>
          <Typography
            component="label"
            htmlFor="book-textarea"
            sx={{ display: 'block', fontSize: 14, fontWeight: 500, mb: 0.75 }}
          >
            Book text <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>

          {/* Upload area */}
          <Box
            onClick={() => !submitting && fileInputRef.current?.click()}
            sx={{
              width: '100%',
              minHeight: 110,
              border: '1.5px dashed',
              borderColor: fileName ? 'success.main' : 'divider',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: submitting ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: fileName ? 'success.50' : 'background.paper',
              opacity: submitting ? 0.6 : 1,
              '&:hover': submitting
                ? {}
                : { borderColor: 'primary.main', backgroundColor: 'action.hover' },
            }}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: fileName ? 'success.main' : 'text.primary' }}
            >
              {fileName ? `✓ ${fileName} loaded` : 'Click to choose a .txt file'}
            </Typography>

            <Typography sx={{ mt: 0.75, fontSize: 12.5, color: 'text.secondary' }}>
              Plain text only · used once as context for every step below
            </Typography>
          </Box>

          <input ref={fileInputRef} type="file" accept=".txt" hidden onChange={handleFile} />

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
            onChange={(e) => {
              setBookText(e.target.value);
              // Nếu người dùng gõ tay sau khi đã chọn file, ưu tiên coi như dùng text paste
              setBookFile(null);
              setFileName('');
            }}
            disabled={submitting}
          />
        </Box>

        {/* Error */}
        <Box sx={{ minHeight: error ? 22 : 8, mt: 1.5, color: 'error.main', fontSize: 13 }}>
          {error}
        </Box>

        {/* Create button */}
        <Button
          fullWidth
          variant="contained"
          onClick={createProject}
          disabled={submitting}
          sx={{
            height: 46,
            mt: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {submitting ? (
            <CircularProgress size={22} sx={{ color: '#fff' }} />
          ) : (
            <>
              Create project
              <Box component="span" sx={{ ml: 1, fontSize: 18, lineHeight: 1 }}>→</Box>
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}