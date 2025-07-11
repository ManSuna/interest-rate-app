return (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Interest Rate Grid</h2>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Add Interest Rate
        </Button>
      </Box>

      {/* 🔽 Show form on top */}
      {showForm && (
        <Box mb={2}>
          <AddForm
            onAdd={(data) => handleAdd({ ...data, id: uuidv4() })}
            onCancel={() => setShowForm(false)}
          />
        </Box>
      )}

      {/* 🔽 Grid below form */}
      <InterestGrid rows={rows} onDelete={handleDelete} />

      <ConfirmDialog {...confirm} onClose={() => setConfirm({ open: false })} />
    </Container>
  </LocalizationProvider>
);
