import { Button, Typography, Box } from "@mui/material";

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Illustration Studio
      </Typography>

      <Button variant="contained">
        Create Project
      </Button>
    </Box>
  );
}

export default App;