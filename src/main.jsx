import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Admin from './Admin.jsx';
import { StoreProvider, useHashRoute } from './store.jsx';
import './styles.css';

function Root() {
  const hash = useHashRoute();
  const isAdmin = hash.startsWith('#/admin');
  return isAdmin ? <Admin /> : <App />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <Root />
    </StoreProvider>
  </React.StrictMode>
);
