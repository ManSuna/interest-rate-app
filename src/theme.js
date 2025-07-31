import { Fade } from '@mui/material';

function TabPanel({ children, value, index }) {
  return (
    <Fade in={value === index} timeout={300} unmountOnExit>
      <Box
        role="tabpanel"
        hidden={value !== index}
        sx={{
          backgroundColor: '#f0f8ff',
          padding: '1rem',
          border: '1px solid #ccc',
          borderTop: 'none',
        }}
      >
        {value === index && children}
      </Box>
    </Fade>
  );
}