const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  color: '#333',
  borderRadius: '8px 8px 0 0',
  padding: '8px 16px',
  minHeight: '48px',
  '&.Mui-selected': {
    backgroundColor: '#f0f8ff',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    borderBottom: '2px solid #f0f8ff', // blends into content
  },
}));

<Tabs
  value={value}
  onChange={handleChange}
  aria-label="Interest Tabs"
  sx={{
    backgroundColor: '#f0f8ff',
    px: 2,
    pt: 1,
    borderRadius: '8px 8px 0 0',
    borderBottom: '1px solid #ccc',
  }}
>
  <StyledTab icon={<SomeIcon />} label="Daily" />
  ...
</Tabs>