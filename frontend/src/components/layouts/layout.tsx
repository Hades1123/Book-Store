import { HeaderComponent } from './header';
import { FooterComponent } from './footer';
import { Outlet } from 'react-router';
import './layout.scss';
export const MainLayout = () => {
  return (
    <>
      <div className="layout-container">
        <HeaderComponent />
        <Outlet />
        <FooterComponent />
      </div>
    </>
  );
};
