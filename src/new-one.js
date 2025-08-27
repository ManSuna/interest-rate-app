<Field
  name="interestRate"
  as={TextField}
  label="Interest Rate"
  onBlur={(e) => {
    let value = e.target.value;
    if (value && !isNaN(value)) {
      const formatted = parseFloat(value).toFixed(2); // always .00
      e.target.value = formatted;
    }
  }}
/>