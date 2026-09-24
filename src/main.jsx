import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { startPwaAutoUpdate } from './pwaUpdate.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('تعذر تسجيل Service Worker:', error);
    });
  });
}

// يفحص نسخة Vercel عند فتح التطبيق وعودته من الخلفية وكل 5 دقائق.
startPwaAutoUpdate();
