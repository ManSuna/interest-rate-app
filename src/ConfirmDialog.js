import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, type, row, onConfirm, onClose }) {
  if (!open || !row) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm {type === 'add' ? 'Addition' : 'Deletion'}</DialogTitle>
      <DialogContent>
        <Typography>
          Start Date: <strong>{new Date(row.startDate).toLocaleDateString()}</strong><br/>
          Interest Rate: <strong>{row.interestRate}%</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained">Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
