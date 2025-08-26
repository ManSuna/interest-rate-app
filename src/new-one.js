<Accordion
  defaultExpanded
  disableGutters
  square
  sx={{
    mb: 0.5,        // margin-bottom (reduce spacing, e.g. 4px)
    '&:last-of-type': { mb: 0 }, // no gap after the last one
  }}
>
  <AccordionSummary ...>...</AccordionSummary>
  <AccordionDetails ...>...</AccordionDetails>
</Accordion>
