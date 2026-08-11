import { Box, Button, Typography } from '@mui/material';

export default function SideNote({ project, onOpenBook }) {
  return (
    <Box>
      {project.style && (
        <Box sx={noteSx}>
          <Typography sx={labelSx}>STYLE</Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.55 }}>
            {project.style}
          </Typography>
        </Box>
      )}

      <Box sx={{ ...noteSx, mt: project.style ? 2 : 0 }}>
        <Typography sx={labelSx}>BOOK TEXT</Typography>
        <Typography
          sx={{
            fontSize: 16,
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            maxHeight: 180,
            overflow: 'hidden',
          }}
        >
          {project.bookText || 'No book text'}
        </Typography>
      </Box>
    </Box>
  );
}

const noteSx = {
  bgcolor: '#f3eee8',
  borderRadius: 2,
  p: 3,
};

const labelSx = {
  color: '#92969a',
  fontWeight: 800,
  fontSize: 13,
  letterSpacing: 1,
  mb: 1.4,
};
