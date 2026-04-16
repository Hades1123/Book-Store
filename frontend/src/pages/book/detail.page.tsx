import { Link, useParams } from 'react-router';
import './detail.page.scss';
import thumbnail from '@/assets/book1.png';
import { formatCurrency } from '@/utils/helper';
import { useBookDetail } from '@/hooks/queries/useBookQuery';
import { CartButton } from '@/components/cart/cart.btn';

export const DetailBookPage = () => {
  const { id } = useParams();
  const { data: currentBook } = useBookDetail(id!);

  return (
    <>
      <div className="detailbook">
        <section className="detailbook__main">
          <div className="detailbook__img-wrapper">
            <img src={thumbnail} alt="thumbnail" />
          </div>
          <div className="detailbook__detail">
            <nav className="detailbook__nav">
              {' '}
              <Link to={'/book'} style={{ textDecoration: 'none', color: 'red' }}>
                Books
              </Link>{' '}
              / {currentBook?.name}
            </nav>
            <h1 className="detailbook__title">{currentBook?.name}</h1>
            <span className="detailbook__author">By {currentBook?.author}</span>
            <div className="detailbook__price">{formatCurrency(Number(currentBook?.price))}</div>
            <div className="detailbook__note">
              <h3 className="detailbook__note-title">The Curator's Note</h3>
              <p className="detailbook__note-desc">
                "Sterling's meditation on the spaces we inhabit alone is a masterwork of quiet
                observation. It treats the home not just as a structure, but as a vessel for the
                internal life. A vital volume for the contemporary thinker's shelf."
              </p>
              <div className="detailbook__note-quote">“</div>
            </div>
            {currentBook && (
              <div className="detailbook__btn">
                <button className="detailbook__checkout">Checkout</button>
                <CartButton item={currentBook} />
              </div>
            )}
            <ul className="detailbook__spec">
              <li>
                <h4>Publisher</h4>
                <span>{currentBook?.publisher}</span>
              </li>
              <li>
                <h4>ISBN-13</h4>
                <span>{currentBook?.isbn}</span>
              </li>
              <li>
                <h4>Publication Date</h4>
                <span>October 2023</span>
              </li>
              <li>
                <h4>Binding</h4>
                <span>Cloth-bound Hardcover</span>
              </li>
            </ul>
          </div>
        </section>
        <section className="detailbook__relation"></section>
      </div>
    </>
  );
};
