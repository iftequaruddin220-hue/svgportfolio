import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

import './styles/styles.css';
import './styles/fantasy.css';
import './styles/rift.css';
import './styles/jojo-overdrive.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
