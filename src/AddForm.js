import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export default function AddForm({ onAdd, onCancel }) {
  const [startDate, setStartDate] = useState(null);
  const [rate, setRate] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!startDate) err.startDate = 'Required';
    if (!rate || isNaN(rate) || rate <= 0) err.rate = 'Must be > 0';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onAdd({ startDate: startDate.format('YYYY-MM-DD'), interestRate: parseFloat(rate) });
  };

  return (
    <Box mb={2} p={2} border="1px solid #ccc" borderRadius={1}>
      <Box display="flex" gap={2} alignItems="center">
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(v) => setStartDate(v)}
          renderInput={(params) => <TextField {...params} error={!!errors.startDate} helperText={errors.startDate} />}
        />
        <TextField
          label="Interest Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          error={!!errors.rate}
          helperText={errors.rate}
          type="number"
        />
        <Button variant="contained" onClick={submit}>Add</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}
