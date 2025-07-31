<Tabs
  value={value}
  onChange={handleChange}
  variant="scrollable"
  scrollButtons="auto"
  sx={{
    backgroundColor: '#f0f8ff',
    borderBottom: '1px solid #ccc',
    px: 2,
    pt: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  }}
>
  <StyledTab icon={<CalendarTodayIcon />} label="Daily" />
  <StyledTab icon={<SyncIcon />} label="Cycle" />
  <StyledTab icon={<FaFileAlt />} label="Reports" />
</Tabs>

<TabPanel value={value} index={0}> {/* content */} </TabPanel>




const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  minWidth: 120,
  '&.Mui-selected': {
    backgroundColor: '#f0f8ff',
    borderBottom: '2px solid #1976d2',
    color: '#1976d2',
    fontWeight: 'bold',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
}));


<Box
  sx={{
    backgroundColor: '#f0f8ff',
    border: '1px solid #ccc',
    borderTop: 'none',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    p: 2,
    animation: 'fadeIn 0.3s ease',
  }}
>
  {/* your content */}
</Box>