<AccordionSummary
  expandIcon={<ExpandMoreIcon />}
  sx={{
    minHeight: "unset",   // remove the default 48px
    px: 1,
    py: 0.25,
    '& .MuiAccordionSummary-content': {
      margin: 0,
      minHeight: "unset", // also reset inside content
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
