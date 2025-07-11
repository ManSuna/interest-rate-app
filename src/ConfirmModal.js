import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export default function ConfirmDialog({ open, type, row, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm {type === 'add' ? 'Addition' : 'Deletion'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {type === 'add'
            ? `Add entry with Interest Rate ${row.interestRate}% starting on ${row.startDate}?`
            : `Delete entry with Interest Rate ${row.interestRate}% starting on ${row.startDate}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color={type === 'add' ? 'primary' : 'error'}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
