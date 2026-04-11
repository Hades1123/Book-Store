import './home.page.scss';
import LandingBook from '@/assets/book-landing.png';
import bookIcon from '@/assets/book.svg';
import artIcon from '@/assets/art.svg';
import editIcon from '@/assets/edit.svg';
import demoThumbnail from '@/assets/book.png';
import { formatCurrency } from '@/utils/helper';
export const HomePage = () => {
  return (
    <>
      <section className="hero-container">
        <div className="left-media">
          <div className="title">Editor's Choice — Winter 2024</div>
          <h1>
            The Architecture of <div></div> Modern <span>Solitude.</span>
          </h1>
          <p>
            A profound exploration of silence in the digital age. This month's featured masterpiece
            invites you to rediscover the art of being present.
          </p>
          <div className="btn-discover">Discover the Volume</div>
        </div>
        <div className="right-media">
          <div className="img-wrapper">
            <img src={LandingBook} alt="" />
          </div>

          <div className="brown-box">
            <div className="book-icon-wrapper">
              <img src={bookIcon} alt="bookIcon" />
            </div>
            <span>"A triumph of lyrical prose."</span>
          </div>
        </div>
      </section>
      <section className="curated-selection">
        <div className="title">
          <div>Curated Selection</div>
          <div>View All Arrivals</div>
        </div>
        <div className="books">
          {[0, 1, 2, 3].map((_, index) => {
            return (
              <div className="book" key={`homepage-${index}`}>
                <div className="thumbnail-wrapper">
                  <img src={demoThumbnail} alt="thumbnail" />
                </div>
                <div className="book__category">Essays & Critique</div>
                <div className="book__title">The Invisible Thread</div>
                <div className="book__author">Elena Rossi</div>
                <div className="book__price">{formatCurrency(200000)}</div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="category">
        <h2 className="category__title">Browse the Archives</h2>
        <div className="category__container">
          <div className="category__main">
            <div className="category__main-content">
              <div className="category__main-number">01</div>
              <div className="category__main-title">Philosophy & Theory</div>
              <p className="category__main-desc">
                Deep dives into the fundamental nature of knowledge and existence.
              </p>
            </div>
          </div>
          <div className="category__side category__side--top">
            <img src={artIcon} alt="art" />
            <h3>Art & Design</h3>
            <span>Explore Collection</span>
          </div>
          <div className="category__side category__side--bottom">
            <img src={editIcon} alt="edit" />
            <h3>First Editions</h3>
            <span>Rare Finds</span>
          </div>
        </div>
      </section>
      <section className="culator">
        <div className="culator__container">
          <span className="culator__title">The Curator's Note</span>
          <p className="culator__note">
            "A library is not a luxury but one of the necessities of life. Our collection is curated
            not for the masses, but for the soul that seeks a quiet corner in a loud world."
          </p>
          <span className="culator__author">Thomas H. Blackwood</span>
        </div>
      </section>
      <section className="newsletter">
        <div className="newsletter__container">
          <div className="newsletter__title">
            <h3>Join the Registry</h3>
            <p>
              Weekly dispatches from the curation desk, including rare find alerts and literary
              essays.
            </p>
          </div>
          <div className="newsletter__email">
            <input type="text" placeholder="Your Email Address" />
            <span>By subscribing, you agree to our privacy standards.</span>
          </div>
        </div>
      </section>
    </>
  );
};
