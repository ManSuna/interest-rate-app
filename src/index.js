import React from 'react';
import ReactDOM from 'react-dom/client';

import 'dayjs/locale/de';  // load German locale data
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { ThemeProvider } from '@mui/material/styles';

import theme from './theme';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <App />
    </LocalizationProvider>
  </ThemeProvider>
);
