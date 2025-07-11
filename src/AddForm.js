import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function AddForm({ onAdd, onCancel }) {
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [errors, setErrors] = useState({});

  // 🔄 Optional: reset form on unmount
  useEffect(() => {
    return () => {
      setInterestRate('');
      setStartDate(null);
      setErrors({});
    };
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!interestRate || isNaN(interestRate) || interestRate <= 0)
      newErrors.interestRate = 'Enter a valid interest rate';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd({
        interestRate: parseFloat(interestRate),
        startDate: startDate.format('YYYY-MM-DD')
      });
    }
  };

  return (
    <Box display="flex" gap={2} alignItems="center" mb={2}>
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue)}
        slotProps={{
          textField: {
            error: !!errors.startDate,
            helperText: errors.startDate
          }
        }}
      />
      <TextField
        label="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        error={!!errors.interestRate}
        helperText={errors.interestRate}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
  );
}
