import { createBrowserRouter } from 'react-router';
import { AuthRoute } from './auth.route';

export const router = createBrowserRouter([...AuthRoute]);
