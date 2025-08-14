
Sunil Gurung <linusgnurug@gmail.com>
12:55 AM (0 minutes ago)
to me

<DataGrid
  rows={gridRows}
  columns={columns}
  autoHeight
  disableColumnMenu
  disableRowSelectionOnClick
  density="compact"
  rowHeight={32} // optional, for extra compactness
  pageSizeOptions={[15, 30]}
  initialState={{
    pagination: { paginationModel: { pageSize: 15 } }
  }}
  sx={{
    '& .MuiDataGrid-cell': {
      py: 0.5, // reduce vertical padding in cells
    },
    '& .MuiDataGrid-columnHeaders': {
      minHeight: 36,
      maxHeight: 36,
      lineHeight: '36px',
    },
  }}
/>