import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import '@/styles/reset.css';
import '@/styles/global.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from './components/ui/toast';
import { useInitStores } from './hooks/useInitStores';
import router from '@/routes/main.route';

const queryClient = new QueryClient();

const App = () => {
  useInitStores();

  return (
    <>
      {/* <AuthLoadingBackdrop /> */}
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
