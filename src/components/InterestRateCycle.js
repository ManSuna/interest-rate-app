import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object().shape({
  startDate: Yup.date()
    .required('Start Date is required')
    .typeError('Invalid date format (YYYY-MM-DD)'),
  endDate: Yup.date()
    .required('End Date is required')
    .typeError('Invalid date format (YYYY-MM-DD)'),
  interestPaymentAmount: Yup.string()
    .required('Interest Payment Amount is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Must be a valid amount (e.g., 12345.67)'),
});

function InterestRateCycle() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Formik
      initialValues={{
        startDate: '',
        endDate: '',
        interestPaymentAmount: '',
      }}
      validationSchema={validationSchema}
      onSubmit={() => setSubmitted(true)}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className="mb-3">
            <label>Start Date</label>
            <DatePicker
              selected={values.startDate ? new Date(values.startDate) : null}
              onChange={date => setFieldValue('startDate', date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"
              title="Enter or select the Start Date for Cycle"
            />
            <ErrorMessage name="startDate" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>End Date</label>
            <DatePicker
              selected={values.endDate ? new Date(values.endDate) : null}
              onChange={date => setFieldValue('endDate', date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"
              title="Enter or select the End Date for Cycle"
            />
            <ErrorMessage name="endDate" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>Interest Payment Amount Reported by the Fed</label>
            <Field
              name="interestPaymentAmount"
              type="text"
              className="form-control"
              title="Enter the Interest Payment Amount in digit and decimal format (e.g., 12345.67)"
            />
            <ErrorMessage name="interestPaymentAmount" component="div" className="text-danger" />
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

export default InterestRateCycle;
