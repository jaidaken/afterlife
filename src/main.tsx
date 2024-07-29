import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CharacterProvider } from './context/CharacterContext';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CharacterProvider>
        <App />
      </CharacterProvider>
    </BrowserRouter>
  </React.StrictMode>
);
