import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object().shape({
  reportType: Yup.string().required('Required'),
  businessDate: Yup.date().when('reportType', {
    is: 'daily',
    then: schema => schema.required('Business Date is required'),
  }),
  startDate: Yup.date().when('reportType', {
    is: 'cycle',
    then: schema => schema.required('Start Date is required'),
  }),
  endDate: Yup.date().when('reportType', {
    is: 'cycle',
    then: schema => schema.required('End Date is required'),
  }),
});

function InterestRateReports() {
  const [submittedMessage, setSubmittedMessage] = useState('');

  return (
    <Formik
      initialValues={{
        reportType: 'daily',
        businessDate: '',
        startDate: '',
        endDate: '',
      }}
      validationSchema={validationSchema}
      onSubmit={() => {
        setSubmittedMessage('Request has been submitted');
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="mb-3">
            <label>Report Type</label>
            <Field as="select" name="reportType" className="form-control">
              <option value="daily">Daily report</option>
              <option value="cycle">Cycle Report</option>
            </Field>
          </div>

          {values.reportType === 'daily' && (
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
              <button type="submit" className="btn btn-primary mt-2">Download Report</button>
            </div>
          )}

          {values.reportType === 'cycle' && (
            <>
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
                <button type="submit" className="btn btn-primary me-2">Download Bank Wire File</button>
                <button type="submit" className="btn btn-secondary">Download Report</button>
              </div>
            </>
          )}

          {submittedMessage && (
            <div className="mt-3 text-success">{submittedMessage}</div>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default InterestRateReports;
