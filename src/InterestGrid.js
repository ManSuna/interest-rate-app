import React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';

export default function InterestGrid({ rows, onDelete }) {
  const columns = [
    { field: 'startDate', headerName: 'Start Date', flex: 1, type: 'date' },
    { field: 'interestRate', headerName: 'Interest Rate (%)', flex: 1, type: 'number' },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) =>
        params.row.index === 0
          ? [<GridActionsCellItem icon={<DeleteIcon color="error" />} label="Delete" onClick={() => onDelete(params.row)} />]
          : []
    }
  ];

  // Attach index to each row to identify the first row
  const displayRows = rows.map((r, i) => ({ ...r, index: i }));

  return (
    <Box sx={{ height: 400 }}>
      <DataGrid
        rows={displayRows}
        columns={columns}
        disableSelectionOnClick
        hideFooter
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
