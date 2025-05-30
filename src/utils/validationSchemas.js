import * as Yup from 'yup';

// Date regex: CCYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Date regex for Interest Rate Maintenance (CCYY/MM/DD)
const maintenanceDateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

// Time regex HH:MM:SS
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

// Decimal with max 2 decimal places
const decimalRegex = /^\d+(\.\d{1,2})?$/;

// Currency (digits + decimal)
const currencyRegex = /^\d+(\.\d{1,2})?$/;

export const interestRateDailySchema = Yup.object().shape({
  businessDate: Yup.string()
    .required('Business Date is required')
    .matches(dateRegex, 'Date must be in CCYY-MM-DD format'),
  fedCloseTime: Yup.string()
    .required('FED Close Time is required')
    .matches(timeRegex, 'Time must be in HH:MM:SS format'),
  interestRate: Yup.string()
    .required('Interest Rate is required')
    .matches(decimalRegex, 'Must be a decimal with up to 2 decimal places'),
  fedClosingBalance: Yup.string()
    .required('Fed Closing Balance is required')
    .matches(currencyRegex, 'Must be a valid currency amount'),
});

export const interestRateCycleSchema = Yup.object().shape({
  startDate: Yup.string()
    .required('Start Date is required')
    .matches(dateRegex, 'Date must be in CCYY-MM-DD format'),
  endDate: Yup.string()
    .required('End Date is required')
    .matches(dateRegex, 'Date must be in CCYY-MM-DD format'),
  interestPaymentAmount: Yup.string()
    .required('Interest Payment Amount is required')
    .matches(currencyRegex, 'Must be a valid currency amount'),
});

export const interestRateReportsDailySchema = Yup.object().shape({
  businessDate: Yup.string()
    .required('Business Date is required')
    .matches(dateRegex, 'Date must be in CCYY-MM-DD format'),
});

export const interestRateReportsCycleSchema = Yup.object().shape({
  startDate: Yup.string()
    .required('Start Date is required')
    .matches(dateRegex, 'Date must be in CCYY-MM-DD format'),
  endDate: Yup.string()
    .required('End Date is required')
    .matches(dateRegex, 'Date must be in CCYY-MM-DD format'),
});

export const interestRateMaintenanceSchema = Yup.object().shape({
  interestRate: Yup.string()
    .required('Interest Rate is required')
    .matches(decimalRegex, 'Must be a decimal with up to 2 decimal places'),
  effectiveDate: Yup.string()
    .required('Effective Date is required')
    .matches(maintenanceDateRegex, 'Date must be in CCYY/MM/DD format'),
});
