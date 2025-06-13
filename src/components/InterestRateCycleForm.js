import React from 'react';
import { TextField, Button, Grid, Tooltip, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useForm } from 'react-hook-form';

const datePairs = [
  { id: 1, startDate: '2025/04/25', endDate: '2025/04/29' },
  { id: 2, startDate: '2025/04/30', endDate: '2025/05/08' },
  { id: 3, startDate: '2025/05/09', endDate: '2025/05/22' },
];

const InterestRateCycleForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Select the Start Date">
            <FormControl fullWidth>
              <InputLabel>Start Date</InputLabel>
              <Select
                label="Start Date"
                {...register('startDate', { required: 'Start Date is required' })}
                error={!!errors.startDate}
              >
                {datePairs.map((pair) => (
                  <MenuItem key={pair.id} value={pair.startDate}>
                    {pair.startDate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Select the End Date">
            <FormControl fullWidth>
              <InputLabel>End Date</InputLabel>
              <Select
                label="End Date"
                {...register('endDate', { required: 'End Date is required' })}
                error={!!errors.endDate}
              >
                {datePairs.map((pair) => (
                  <MenuItem key={pair.id} value={pair.endDate}>
                    {pair.endDate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Enter the Interest Payment Amount in digit and decimal format (e.g., 12345.67)">
            <TextField
              label="Interest Payment Amount"
              type="number"
              fullWidth
              {...register('interestPaymentAmount', { required: 'Interest Payment Amount is required' })}
              error={!!errors.interestPaymentAmount}
              helperText={errors.interestPaymentAmount?.message}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Recalculate and Resend
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default InterestRateCycleForm;