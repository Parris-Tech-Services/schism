import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initialiseDatabase } from './db';
import App from './App';
import './index.css';
import '@xyflow/react/dist/style.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

async function start() {
  await initialiseDatabase();
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

start().catch((error) => {
  console.error(error);
  document.getElementById('root')!.innerHTML = `<main style="padding:2rem;color:#fff;background:#07110f;min-height:100vh"><h1>Schism Codex could not start</h1><pre>${String(error)}</pre></main>`;
});
