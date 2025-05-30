// src/components/InterestRateReports.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function InterestRateReports() {
  const [submittedMessage, setSubmittedMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      reportType: 'daily',
      businessDate: '',
      startDate: '',
      endDate: ''
    },
    validationSchema: Yup.object().shape({
      reportType: Yup.string().required('Report type is required'),
      businessDate: Yup.string().when('reportType', {
        is: 'daily',
        then: Yup.string()
          .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (CCYY-MM-DD)')
          .required('Business Date is required')
      }),
      startDate: Yup.string().when('reportType', {
        is: 'cycle',
        then: Yup.string()
          .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format (CCYY-MM-DD)')
          .required('Start Date is required')
      }),
      endDate: Yup.string().when('reportType', {
        is: 'cycle',
        then: Yup.string()
          .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format (CCYY-MM-DD)')
          .required('End Date is required')
      }),
    }),
    onSubmit: (values) => {
      setSubmittedMessage('Request has been submitted');
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mb-3">
      {/* Report Type Dropdown */}
      <div className="mb-3">
        <label htmlFor="reportType" className="form-label">Report Type</label>
        <select
          id="reportType"
          name="reportType"
          className="form-select"
          title="Select the report type"
          value={formik.values.reportType}
          onChange={formik.handleChange}
        >
          <option value="daily">Daily Report</option>
          <option value="cycle">Cycle Report</option>
        </select>
        {formik.touched.reportType && formik.errors.reportType && (
          <div className="text-danger">{formik.errors.reportType}</div>
        )}
      </div>

      {/* Daily Report Fields */}
      {formik.values.reportType === 'daily' && (
        <div className="mb-3">
          <label htmlFor="businessDate" className="form-label">Business Date</label>
          <input
            type="date"
            id="businessDate"
            name="businessDate"
            className="form-control"
            title="Enter or select the Business Date"
            value={formik.values.businessDate}
            onChange={formik.handleChange}
          />
          {formik.touched.businessDate && formik.errors.businessDate && (
            <div className="text-danger">{formik.errors.businessDate}</div>
          )}
          <button type="submit" className="btn btn-primary mt-2">Download Report</button>
        </div>
      )}

      {/* Cycle Report Fields */}
      {formik.values.reportType === 'cycle' && (
        <>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="form-control"
              title="Enter or select the Start Date for Cycle"
              value={formik.values.startDate}
              onChange={formik.handleChange}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-danger">{formik.errors.startDate}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="form-control"
              title="Enter or select the End Date for Cycle"
              value={formik.values.endDate}
              onChange={formik.handleChange}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-danger">{formik.errors.endDate}</div>
            )}
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">Download Bank Wire File</button>
            <button type="submit" className="btn btn-primary">Download Report</button>
          </div>
        </>
      )}

      {submittedMessage && <div className="text-success mt-3">{submittedMessage}</div>}
    </form>
  );
}

export default InterestRateReports;
