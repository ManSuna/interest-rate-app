import React from 'react';
import { TextField, Button, Grid, Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';

const InterestRateDailyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Enter or select the Business Date">
            <TextField
              label="Business Date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              fullWidth
              {...register('businessDate', { required: 'Business Date is required' })}
              error={!!errors.businessDate}
              helperText={errors.businessDate?.message}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Enter the time in HH:MM:SS format">
            <TextField
              label="FED Close Time"
              type="time"
              defaultValue="19:00:59"
              fullWidth
              {...register('fedCloseTime', { required: 'FED Close Time is required' })}
              error={!!errors.fedCloseTime}
              helperText={errors.fedCloseTime?.message}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Enter the percentage rate in decimal format">
            <TextField
              label="Interest Rate"
              type="number"
              step="0.01"
              fullWidth
              {...register('interestRate', { required: 'Interest Rate is required' })}
              error={!!errors.interestRate}
              helperText={errors.interestRate?.message}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Enter FED balance in digit and decimal format (e.g., 12345.67)">
            <TextField
              label="Fed Closing Balance"
              type="number"
              fullWidth
              {...register('fedClosingBalance', { required: 'Fed Closing Balance is required' })}
              error={!!errors.fedClosingBalance}
              helperText={errors.fedClosingBalance?.message}
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

export default InterestRateDailyForm;