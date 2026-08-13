import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';

const STEP_CONTENT = {
  STYLE: {
    title: 'Style',
    description: 'Choose the visual art direction for your book.',
    inputLabel: 'Art style (optional)',
    placeholder: 'Leave blank to let Gemini choose a style based on your book',
    button: 'Generate Style',
  },
  CHARACTERS: {
    title: 'Characters',
    description: 'Generate character descriptions based on your book.',
    button: 'Generate Characters',
  },
  PORTRAITS: {
    title: 'Portraits',
    description: 'Generate portraits for the characters in your book.',
    button: 'Generate Portraits',
  },
  CHAPTERS: {
    title: 'Chapters',
    description: 'Analyze the chapters of your book.',
    button: 'Analyze Chapters',
  },
  ILLUSTRATIONS: {
    title: 'Illustrations',
    description: 'Generate illustrations for your book chapters.',
    button: 'Generate Illustrations',
  },
};

export default function StepPanel({
  project,
  currentStep,
  onRunStep,
  onRetry,
  running,
  failed,
  stale,
  submitting,
  errorMessage,
}) {
  const [style, setStyle] = useState(project?.style || '');

  useEffect(() => {
    setStyle(project?.style || '');
  }, [project?.id]);

  if (!currentStep) return null;

  const stepKey = currentStep.key;
  const content = STEP_CONTENT[stepKey];
  if (!content) return null;

  const handleGenerate = () => onRunStep?.(stepKey, style);

  const disabled = submitting || running;

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid #e3dfda',
        borderRadius: '18px',
        backgroundColor: '#fff',
        px: { xs: 3, sm: 4, md: 5 },
        py: { xs: 3, sm: 4, md: 4.5 },
        boxSizing: 'border-box',
      }}
    >
      {/* Stuck-step recovery — ưu tiên hiện trên cùng, đè lên mọi state khác */}
      {stale && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This step was interrupted (likely a server restart) and never finished.
          Nothing already generated was lost — retrying is safe.
          <Box sx={{ mt: 1.5 }}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onRetry}
              disabled={submitting}
            >
              {submitting ? 'Retrying…' : 'Retry now'}
            </Button>
          </Box>
        </Alert>
      )}

      {/* Error state — chỉ hiện khi FAILED và không stale (stale đã xử lý riêng ở trên) */}
      {failed && !stale && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={onRetry} disabled={submitting}>
              {submitting ? 'Retrying…' : 'Retry'}
            </Button>
          }
        >
          {errorMessage || 'This step failed. You can retry without affecting completed steps.'}
        </Alert>
      )}

      {/* In-progress state — nêu rõ bước nào đang chạy */}
      {running ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <CircularProgress size={20} sx={{ color: '#ff6500' }} />
          <Typography sx={{ fontSize: 16, color: '#333' }}>
            Generating <b>{content.title}</b>… this can take up to 30 seconds
            {stepKey === 'PORTRAITS' || stepKey === 'ILLUSTRATIONS' ? ' per image' : ''}.
          </Typography>
        </Box>
      ) : (
        !failed && (
          <Typography sx={{ fontSize: { xs: 16, sm: 18 }, color: '#333', mb: 3 }}>
            Ready for the next step:{' '}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {content.title}
            </Box>
            .
          </Typography>
        )
      )}

      {stepKey === 'STYLE' && !running && (
        <>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#333', mb: 1.2 }}>
            {content.inputLabel}
          </Typography>

          <TextField
            fullWidth
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            placeholder={content.placeholder}
            variant="outlined"
            disabled={disabled}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#fff',
                '& fieldset': { borderColor: '#bbb7b2', borderWidth: 1.5 },
                '&:hover fieldset': { borderColor: '#99948f' },
                '&.Mui-focused fieldset': { borderColor: '#ff6500', borderWidth: 2 },
              },
              '& input': { fontSize: 16, py: 2.1 },
              '& input::placeholder': { color: '#888', opacity: 1 },
            }}
          />
        </>
      )}

      {stepKey !== 'STYLE' && !running && (
        <Typography sx={{ fontSize: 15, lineHeight: 1.6, color: '#8f8f8f', mb: 3 }}>
          {content.description}
        </Typography>
      )}

      {!failed && !stale && (
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={disabled}
          sx={{
            minWidth: { xs: '100%', sm: 260 },
            height: 62,
            px: 4,
            borderRadius: '12px',
            backgroundColor: '#ff6500',
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#e85b00', boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#f0c4a0', color: '#fff' },
          }}
        >
          {running ? 'Generating…' : content.button}
          {!running && (
            <Box component="span" sx={{ ml: 1.2, fontSize: 23, lineHeight: 1 }}>
              →
            </Box>
          )}
        </Button>
      )}
    </Box>
  );
}