import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Required'),
  endDate: Yup.date().required('Required'),
  interestPaymentAmount: Yup.number()
    .required('Required')
    .typeError('Must be a number')
});

function InterestRateCycle() {
  const [submitted, setSubmitted] = useState(false);

  return (

::contentReference[oaicite:0]{index=0}
 
