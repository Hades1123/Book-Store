import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import '@/styles/global.scss';
import { router } from '@/routes/main.route';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode } from 'react';
import { AuthProvider } from '@/contexts/auth.context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
