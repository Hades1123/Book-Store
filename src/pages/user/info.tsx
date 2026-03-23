import CameraIcon from '@/assets/camera.svg?react';
import UserIcon from '@/assets/user.svg?react';
import EditIcon from '@/assets/edit-profile.svg?react';
import avatar from '@/assets/avatar.png';
import './info.scss';
import { useAuthContext } from '@/contexts/auth.context';

const ORDER_ITEMS = [
  {
    id: 1,
    title: 'The Unbearable Lightness of Being',
    date: 'Oct 24, 2024',
    price: '£32.00',
    status: 'delivered',
  },
  {
    id: 2,
    title: 'In Search of Lost Time (Box Set)',
    date: 'Sep 12, 2024',
    price: '£145.50',
    status: 'delivered',
  },
  {
    id: 3,
    title: 'Ulysses (First Edition Repr.)',
    date: 'Aug 30, 2024',
    price: '£64.00',
    status: 'processing',
  },
];

export const ProfileInfo = () => {
  const { user } = useAuthContext();
  return (
    <>
      <div className="profile-info-page">
        {/* user profile section  */}
        <section className="user-profile profile-card">
          <div className="user-profile__img-wrapper">
            <img src={avatar} alt="avatar" />
            <label htmlFor="profile-upload-avatar">
              <div className="user-profile__upload">
                <CameraIcon />
              </div>
            </label>
            <input type="file" id="profile-upload-avatar" />
          </div>
          <div className="user-profile__info">
            <h1 className="user-profile__name">{user?.fullName}</h1>
            <div className="user-profile__position">{user?.role}</div>
            <p className="user-profile__desc">
              Curating the world's most evocative literature since 2018. Specializing in rare first
              editions and modernist prose.
            </p>
          </div>
          <div className="user-profile__edit">
            <EditIcon />
            <span>Edit Profile</span>
          </div>
        </section>

        {/* contact info  */}
        <section className="contact-info profile-card">
          <div className="contact-info__header profile-card__header">
            <UserIcon style={{ color: 'red', width: '1.5rem', height: '1.75rem' }} />
            <h3 className="contact-info__title">Contact Information</h3>
          </div>
          <div className="contact-info__main profile-card__main">
            <div className="contact-info__field">
              <div className="contact-info__label">Full Name</div>
              <div className="contact-info__value">{user?.fullName}</div>
            </div>
            <div className="contact-info__field">
              <div className="contact-info__label">Email Address</div>
              <div className="contact-info__value">{user?.email}</div>
            </div>
            <div className="contact-info__field">
              <div className="contact-info__label">Phone Number</div>
              <div className="contact-info__value">{user?.phone}</div>
            </div>
            <div className="contact-info__field">
              <div className="contact-info__label">Location</div>
              <div className="contact-info__value">London, United Kingdom</div>
            </div>
          </div>
        </section>

        {/* recent order  */}
        <section className="order profile-card">
          <div className="order__header profile-card__header">
            <div className="order__img-wrapper">
              <EditIcon style={{ color: 'red', height: '1.75rem', width: '1.5rem' }} />
              <h3 className="order__title">Recent Orders</h3>
            </div>
            <div className="order__link">View All History</div>
          </div>
          <div className="order__table-wrapper">
            <table className="order__table">
              <thead className="order__table-header">
                <th>Book Title</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
              </thead>
              <tbody>
                {ORDER_ITEMS.map((item) => (
                  <tr>
                    <td className="order__book-title">{item.title}</td>
                    <td className="order__date">{item.date}</td>
                    <td className="order__price">{item.price}</td>
                    <td className={`order__status--${item.status} order__status`}>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};
