<TableBody>
  {gridRows.map((row) => {
    const ok = row.resultCode === 0;

    return (
      <TableRow key={row.id} hover>
        <TableCell>{row.businessDate ?? '—'}</TableCell>

        <TableCell>
          <Chip
            size="small"
            label={ok ? 'Success' : 'Failed'}
            color={ok ? 'success' : 'error'}
            variant={ok ? 'outlined' : 'filled'}
          />
        </TableCell>

        <TableCell align="right">
          {row.rtpTotalInterest?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? '—'}
        </TableCell>

        <TableCell align="right" sx={{ width: 96 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setSelectedRow(row._raw);   // the full object you stored
              setOpen(true);
            }}
          >
            More
          </Button>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>