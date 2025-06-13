import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SyncIcon from '@mui/icons-material/Sync';
import { FaFileAlt, FaWrench } from 'react-icons/fa';
import InterestRateDailyForm from './InterestRateDailyForm';
import InterestRateCycleForm from './InterestRateCycleForm';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

const TabsComponent = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} aria-label="Interest Rate Tabs">
        <Tab icon={<CalendarTodayIcon />} label="Interest Rate - Daily" />
        <Tab icon={<SyncIcon />} label="Interest Rate - Cycle" />
        <Tab icon={<FaFileAlt />} label="Interest Rate - Reports" />
        <Tab icon={<FaWrench />} label="Interest Rate Maintenance" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <InterestRateDailyForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InterestRateCycleForm />
      </TabPanel>
      {/* Add TabPanels for Reports and Maintenance as needed */}
    </>
  );
};

export default TabsComponent;