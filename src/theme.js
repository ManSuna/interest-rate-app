import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return (
    <Box
      role="tabpanel"
      sx={{
        backgroundColor: '#f0f8ff',
        padding: '1rem',
        border: '1px solid #ccc',
        borderTop: 'none',
      }}
    >
      {children}
    </Box>
  );
}

export default function SimpleTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Daily" />
        <Tab label="Cycle" />
        <Tab label="Reports" />
      </Tabs>

      <TabPanel value={value} index={0}>Daily content</TabPanel>
      <TabPanel value={value} index={1}>Cycle content</TabPanel>
      <TabPanel value={value} index={2}>Reports content</TabPanel>
    </Box>
  );
}