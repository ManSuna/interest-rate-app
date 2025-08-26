<Accordion defaultExpanded disableGutters square>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    sx={{
      minHeight: 32,  // reduce overall height
      px: 1,          // horizontal padding
      py: 0.25,       // vertical padding
      '& .MuiAccordionSummary-content': {
        margin: 0,    // remove extra margin
        py: 0.25,
      },
    }}
  >
    <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
      Business Date: {dateKey}
    </Typography>
    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
      ({rows.length} jobs)
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={{ px: 1, py: 0.5 }}>
    {/* your Table goes here */}
  </AccordionDetails>
</Accordion>
