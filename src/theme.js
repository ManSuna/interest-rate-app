// inside Formik render: ({ values, setFieldValue }) => ( ... )

<DatePicker
  label="Business Date"
  value={values.businessDate}
  onChange={async (d) => {
    if (!d) {
      // clear date and dependent fields if user clears
      setFieldValue('businessDate', null, false);
      setFieldValue('fedCloseTime', '', false);
      setFieldValue('fedBalance', '', false);
      setFieldValue('rate', '', false);
      return;
    }

    const dateStr = d.format('YYYY-MM-DD');
    setFieldValue('businessDate', dateStr, false);

    try {
      const res = await fetch(`/api/rates/defaults?businessDate=${encodeURIComponent(dateStr)}`);
      if (!res.ok) throw new Error('Failed to load defaults');
      const data = await res.json(); // { fedCloseTime, fedBalance, rate }

      // OVERRIDE existing values no matter what
      setFieldValue('fedCloseTime', data.fedCloseTime ?? '', false);
      setFieldValue('fedBalance', data.fedBalance ?? '', false);
      setFieldValue('rate', data.rate ?? '', false);
    } catch (e) {
      // optional: surface error
      // setFieldValue('serverError', 'Could not load defaults', false);
    }
  }}
  format="YYYY-MM-DD"
  slotProps={{
    textField: {
      id: 'businessDate',
      name: 'businessDate',
      fullWidth: true,
      inputProps: { placeholder: 'YYYY-MM-DD' },
      style: { width: '300px' },
    },
  }}
/>