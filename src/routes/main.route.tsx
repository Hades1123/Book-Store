import { createBrowserRouter } from 'react-router';
import { AuthRoute } from './auth.route';
import { UserRoute } from './user.route';

export const router = createBrowserRouter([...AuthRoute, ...UserRoute]);
