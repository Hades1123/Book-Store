import { Outlet } from 'react-router';
import './layout.scss';
import bookIcon from '@/assets/book.svg';

const MENU_ITEMS = [
  { id: 'info', label: 'Profile Info', icon: bookIcon, path: '/' },
  { id: 'address', label: 'Addresses', icon: bookIcon, path: '/' },
  { id: 'password', label: 'Reset Password', icon: bookIcon, path: '/' },
  { id: 'order', label: 'Order History', icon: bookIcon, path: '/' },
];

export const ProfileLayout = () => {
  return (
    <>
      <div className="profile">
        {/* Sidebar  */}
        <aside className="profile__sidebar">
          <div className="profile__brand">
            <h1 className="profile__title">The Literary Curator</h1>
            <span className="profile__subtitle">Modern Archivist Edition</span>
          </div>
          <nav className="profile__nav">
            <ul className="profile__nav-list">
              {MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <img src={item.icon} alt="icon" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
          <div className="profile__logout">
            <img src={bookIcon} alt="icon" />
            <span>Logout</span>
          </div>
        </aside>

        {/* Right area  */}
        <div className="profile__content">
          <header className="profile__header">
            <h2 className="profile__page-title">Profile Settings</h2>
            <div className="profile__actions">
              <div className="profile__action-btn">
                <img src={bookIcon} alt="icon" />
              </div>
              <div className="profile__action-btn">
                <img src={bookIcon} alt="icon" />
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
