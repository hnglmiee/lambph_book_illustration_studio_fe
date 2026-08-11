import { Box, Skeleton, Typography } from '@mui/material';

export default function EntityCard({ item, kind, generating, index }) {
  const isCharacter = kind === 'character';
  const image = isCharacter ? item.portraitUrl : item.illustrationUrl;

  return (
    <Box
      sx={{
        border: '1px solid #e2ded9',
        borderRadius: 2,
        bgcolor: '#fff',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: isCharacter ? '1.45 / 1' : '1.65 / 1',
          bgcolor: '#fff',
          overflow: 'hidden',
        }}
      >
        {generating ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: '100%', height: '100%' }}
          />
        ) : image ? (
          <Box
            component="img"
            src={image}
            alt={item.name || item.title || `Entity ${index + 1}`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, #f7eadc 0%, #ffd19e 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              pb: 1.5,
            }}
          >
            <Typography
              sx={{
                color: '#77716b',
                fontSize: 14,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Not generated yet
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            left: 12,
            bottom: 10,
            bgcolor: 'rgba(255,255,255,.82)',
            borderRadius: 99,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: '#77716b',
              letterSpacing: 1,
            }}
          >
            {isCharacter ? 'PORTRAIT' : 'ILLUSTRATION'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
          {item.name || item.title || `Item ${index + 1}`}
        </Typography>

        {(item.description || item.summary) && (
          <Typography
            sx={{
              mt: 0.7,
              color: 'text.secondary',
              fontSize: 13.5,
              lineHeight: 1.55,
            }}
          >
            {item.description || item.summary}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
