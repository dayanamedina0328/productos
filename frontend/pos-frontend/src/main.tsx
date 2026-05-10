import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/ui/store';
import { Spinner } from '@/ui/components/base/Spinner';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/*
          PersistGate retrasa el renderizado hasta que el estado
          persistido se haya rehidratado desde localStorage.
          Muestra un spinner mientras carga.
        */}
        <PersistGate
          loading={
            <div className="flex h-screen items-center justify-center">
              <Spinner size="lg" aria-label="Cargando datos guardados..." />
            </div>
          }
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
