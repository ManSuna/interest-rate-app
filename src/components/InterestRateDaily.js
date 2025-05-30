import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = Yup.object().shape({
  businessDate: Yup.date().required('Required'),
  fedCloseTime: Yup.string()
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format')
    .required('Required'),
  interestRate: Yup.number()
    .required('Required')
    .typeError('Must be a decimal')
    .test('decimal', 'Max 2 decimal places', val => /^\d+(\.\d{1,2})?$/.test(val)),
  fedClosingBalance: Yup.number().required('Required').typeError('Invalid number')
});

function InterestRateDaily() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Formik
      initialValues={{
        businessDate: '',
        fedCloseTime: '19:00:59',
        interestRate: '',
        fedClosingBalance: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        setSubmitted(true);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className="mb-3">
            <label>Business Date</label>
            <DatePicker
              selected={values.businessDate ? new Date(values.businessDate) : null}
              onChange={date => setFieldValue('businessDate', date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"
              title="Enter or select the Business Date"
            />
            <ErrorMessage name="businessDate" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>FED Close Time</label>
            <Field
              name="fedCloseTime"
              type="text"
              className="form-control"
              title="Enter the time in HH:MM:SS"
            />
            <ErrorMessage name="fedCloseTime" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>Interest Rate</label>
            <Field
              name="interestRate"
              type="text"
              className="form-control"
              title="Enter the percentage rate in decimal format"
            />
            <ErrorMessage name="interestRate" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>Fed Closing Balance</label>
            <Field
              name="fedClosingBalance"
              type="text"
              className="form-control"
              title="Enter FED balance in digit and decimal format (e.g., 12345.67)"
            />
            <ErrorMessage name="fedClosingBalance" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary">Recalculate and Resend</button>

          {submitted && (
            <div className="mt-3 text-success">Request has been submitted</div>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default InterestRateDaily;