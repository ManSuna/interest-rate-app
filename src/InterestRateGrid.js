import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function InterestGrid({ rows, onDelete }) {
  const columns = [
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'interestRate', headerName: 'Interest Rate (%)', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        const sortedRowIds = params.api.getAllRowIds();
        const isFirstRow = sortedRowIds[0] === params.id;

        return isFirstRow ? (
          <Button variant="outlined" color="error" onClick={() => onDelete(params.row)}>
            Delete
          </Button>
        ) : null;
      }
    }
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
    </div>
  );
}
