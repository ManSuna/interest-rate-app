const validate = () => {
  const newErrors = {};
  if (!startDate) newErrors.startDate = 'Start date is required';
  if (!interestRate || isNaN(interestRate) || interestRate <= 0)
    newErrors.interestRate = 'Enter a valid interest rate';

  // ✅ Example: check if startDate already exists
  const startDateStr = startDate?.format('YYYY-MM-DD');
  if (startDateStr && rows.some(row => row.startDate === startDateStr)) {
    newErrors.startDate = 'Start date already exists';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
