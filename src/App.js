import React, { useState, useEffect } from 'react';
import { Container, Button, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import InterestGrid from './InterestGrid';
import AddForm from './AddForm';
import ConfirmDialog from './ConfirmDialog';

export default function App() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState({ open: false });

  useEffect(() => {
    const initial = [
      { id: uuidv4(), startDate: '2025-07-05', interestRate: 5.2 },
      { id: uuidv4(), startDate: '2025-06-01', interestRate: 4.8 },
      { id: uuidv4(), startDate: '2025-05-15', interestRate: 3.9 },
    ];
    setRows(initial.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
  }, []);

  const handleDelete = (row) =>
    setConfirm({
      open: true,
      type: 'delete',
      row,
      onConfirm: () => {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        setConfirm({ open: false });
      }
    });

  const handleAdd = (newRow) =>
    setConfirm({
      open: true,
      type: 'add',
      row: newRow,
      onConfirm: () => {
        setRows((prev) =>
          [...prev, newRow].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        );
        setShowForm(false);
        setConfirm({ open: false });
      }
    });

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Interest Rate Grid</h2>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Add Interest Rate
        </Button>
      </Box>

      {showForm && <AddForm onAdd={(data) => handleAdd({ ...data, id: uuidv4() })} onCancel={() => setShowForm(false)} />}

      <InterestGrid rows={rows} onDelete={handleDelete} />

      <ConfirmDialog {...confirm} onClose={() => setConfirm({ open: false })} />
    </Container>
  );
}