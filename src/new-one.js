<Accordion defaultExpanded disableGutters square>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon fontSize="small" />}
    sx={{
      // kill default min-heights
      minHeight: 0,
      '&.Mui-expanded': { minHeight: 0 },

      // compact padding
      px: 1,
      py: 0.25,

      // remove extra content margins (both normal + expanded)
      '& .MuiAccordionSummary-content': { margin: 0 },
      '& .MuiAccordionSummary-content.Mui-expanded': { margin: 0 },

      // (optional) tighten the expand icon wrapper too
      '& .MuiAccordionSummary-expandIconWrapper': { mr: 0, my: 0 },
    }}
  >
    <Typography variant="subtitle2" sx={{ fontSize: 13, lineHeight: 1.2 }}>
      Business Date: {dateKey}
    </Typography>
    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
      ({rows.length} jobs)
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={{ px: 1, py: 0.5 }}>
    {/* your table... */}
  </AccordionDetails>
</Accordion>
