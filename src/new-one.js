const cellSx = { py: 0.5, px: 1, fontSize: 12 };        // table cells
const detailsSx = { py: 0.5, px: 1 };                   // accordion body
const summarySx = {
  minHeight: 34,                                        // header height
  '& .MuiAccordionSummary-content': { my: 0, py: 0.25 },
};

<Accordion defaultExpanded disableGutters square>
  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
    <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 12 }}>
      Business Date: {dateKey}
    </Typography>
    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
      ({rows.length} jobs)
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={detailsSx}>  {/* 👈 compact body */}
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ boxShadow: 'none' }}      // lean look
    >
      <Table
        size="small"
        stickyHeader
        sx={{
          '& th': cellSx,
          '& td': { ...cellSx, verticalAlign: 'middle' },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell width={90}>Type</TableCell>
            <TableCell>Message</TableCell>
            <TableCell width={120} align="right">Processed</TableCell>
            <TableCell width={100}>Result</TableCell>
            <TableCell width={120}>Selector</TableCell>
            <TableCell width={160}>Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.filter(Boolean).map((row, idx) => (
            <TableRow key={row.id ?? `${dateKey}-${idx}`} hover>
              <TableCell>{row.type ?? ''}</TableCell>
              <TableCell sx={{ maxWidth: 320, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {row.message ?? ''}
              </TableCell>
              <TableCell align="right">{row.processedAccountsCount ?? ''}</TableCell>
              <TableCell>{row.resultCode ?? ''}</TableCell>
              <TableCell>{row.selector ?? ''}</TableCell>
              <TableCell>{row.updatedTs ?? ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </AccordionDetails>
</Accordion>
