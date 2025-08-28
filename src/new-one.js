<Field name="interestRate">
  {({ field, form }) => (
    <TextField
      {...field}
      label="Interest Rate"
      type="text"              // <- not "number" to keep 1.20
      inputMode="decimal"
      value={field.value ?? ""} 
      onBlur={(e) => {
        const formatted = formatRate(e.target.value);
        form.setFieldValue(field.name, formatted, false); // <- update Formik state
      }}
    />
  )}
</Field>


// from your fetch:
setFieldValue('interestRate', formatRate(data.rate), false);

// when clearing:
setFieldValue('interestRate', '', false);


interestRate: Yup.string()
  .required('Interest Rate is required')
  .matches(/^\d+(\.\d+)?$/, 'Enter a valid decimal');


onSubmit={(values) => {
  const payload = {
    ...values,
    interestRate: values.interestRate === "" ? null : Number(values.interestRate)
  };
  // send payload
});