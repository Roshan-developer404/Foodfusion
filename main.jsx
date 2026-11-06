import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// all the old stylesheets are reused as they were
import './styles/style.css';
import './styles/compare.css';
import './styles/track.css';
import './styles/bot.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
