// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/css/tooplate-barista.css';

// 👇 THÊM dòng này — Bootstrap JS (xử lý dropdown, collapse, modal...)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from '@/app/App';
import AppProviders from '@/app/AppProviders';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);