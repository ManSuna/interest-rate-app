
Sunil Gurung <linusgnurug@gmail.com>
12:10 AM (0 minutes ago)
to me

<Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
  <Box>
    <Typography variant="overline" color="text.secondary">Start Date</Typography>
    <Typography variant="h6" fontWeight={600}>{fmt(data.startDate)}</Typography>
  </Box>
  <Box>
    <Typography variant="overline" color="text.secondary">End Date</Typography>
    <Typography variant="h6" fontWeight={600}>{fmt(data.endDate)}</Typography>
  </Box>
</Box>


<CardHeader
  title="Current Cycle"
  sx={{
    pb: 0.5,
    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
    '& .MuiCardHeader-title': { fontWeight: 700, fontSize: '1.1rem' }
  }}
/>