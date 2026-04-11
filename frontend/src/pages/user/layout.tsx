import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import './layout.scss';
import BookIcon from '@/assets/book.svg?react';
import UserIcon from '@/assets/user.svg?react';
import LocationIcon from '@/assets/location.svg?react';
import ResetPassIcon from '@/assets/auth/confirm-pass.svg?react';
import LogoutIcon from '@/assets/auth/logout.svg?react';
import NotifyIcon from '@/assets/notify.svg?react';
import SettingIcon from '@/assets/setting.svg?react';
import { useAuthStore } from '@/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';

const MENU_ITEMS = [
  { id: 'info', label: 'Profile Info', icon: UserIcon, path: '/user' },
  { id: 'address', label: 'Addresses', icon: LocationIcon, path: '/user/address' },
  { id: 'password', label: 'Reset Password', icon: ResetPassIcon, path: '/' },
  { id: 'order', label: 'Order History', icon: BookIcon, path: '/' },
];

export const ProfileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logoutAction);
  const queryClient = useQueryClient();

  const onLogout = () => {
    logout(queryClient);
    navigate('/');
  };

  return (
    <>
      <div className="profile">
        {/* Sidebar  */}
        <aside className="profile__sidebar">
          <div className="profile__brand" onClick={() => navigate('/')}>
            <h1 className="profile__title">The Literary Curator</h1>
            <span className="profile__subtitle">Modern Archivist Edition</span>
          </div>
          <nav className="profile__nav">
            <ul className="profile__nav-list">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    style={{ textDecoration: 'none' }}
                    to={item.path}
                    className={`profile__nav-item ${location.pathname === item.path && 'profile__nav-item--active'}`}
                    key={item.id}
                  >
                    <Icon className="profile__icon" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </ul>
          </nav>
          <div className="profile__logout" onClick={onLogout}>
            <LogoutIcon className="profile__icon" />
            <span>Logout</span>
          </div>
        </aside>

        {/* Right area  */}
        <div className="profile__content">
          <header className="profile__header">
            <h2 className="profile__page-title">Profile Settings</h2>
            <div className="profile__actions">
              <div className="profile__action-btn">
                <NotifyIcon />
              </div>
              <div className="profile__action-btn">
                <SettingIcon />
              </div>
            </div>
          </header>

          <main className="profile__main">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
