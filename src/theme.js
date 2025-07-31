import React, { useState } from 'react';
import { Tabs, Tab, Box, Fade, styled } from '@mui/material';
import { CalendarToday, Sync } from '@mui/icons-material';
import { FaFileAlt, FaWrench } from 'react-icons/fa';

// --- Styled Tab ---
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '8px 8px 0 0',
  padding: '8px 16px',
  minWidth: 140,
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    backgroundColor: '#f0f8ff',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    border: '1px solid #ccc',
    borderBottom: 'none',
  },
}));

// --- Tab Panel ---
function TabPanel({ children, value, index }) {
  return (
    <Fade in={value === index} timeout={300} unmountOnExit>
      <Box
        role="tabpanel"
        hidden={value !== index}
        sx={{
          backgroundColor: '#f0f8ff',
          padding: 3,
          border: '1px solid #ccc',
          borderTop: 'none',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

// --- Main Component ---
export default function SystemManagementTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="System Management Tabs"
        sx={{ backgroundColor: '#fff' }}
      >
        <StyledTab icon={<CalendarToday />} label="Interest Rate - Daily" />
        <StyledTab icon={<Sync />} label="Interest Rate - Cycle" />
        <StyledTab icon={<FaFileAlt />} label="Reports" />
        <StyledTab icon={<FaWrench />} label="Maintenance" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <div>Daily tab content goes here</div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div>Cycle tab content goes here</div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div>Reports tab content goes here</div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div>Maintenance tab content goes here</div>
      </TabPanel>
    </Box>
  );
}