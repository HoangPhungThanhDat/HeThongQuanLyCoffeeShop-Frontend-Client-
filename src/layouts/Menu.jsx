
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { ROUTES } from '@/constants/routes';
import '@/assets/css/tooplate-barista.css';
import coffeeBeans from '@/assets/images/coffee-beans.png';   // 👈 THÊM import ảnh

function Menu() {
  const { cartCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);

  useEffect(() => {
    if (cartCount > prevCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCount(cartCount);
  }, [cartCount, prevCount]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top">   {/* 👈 bỏ ${styles.navbar} */}
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to={ROUTES.HOME}>
          <img
            src={coffeeBeans}                           
            className="navbar-brand-image img-fluid"
            alt="Coffee Shop Logo"
          />
          Coffee Shop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-lg-auto">
            <li className="nav-item">
              <Link to={ROUTES.HOME} className="nav-link">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section_2">Giới thiệu</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section_3">Thực đơn</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section_4">Đánh giá</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section_5">Liên hệ</a>
            </li>
            <li className="nav-item">
              <Link
                to={ROUTES.CART}
                className={`nav-link cart-link-wrapper ${isAnimating ? 'animating' : ''}`} data-cart-icon 
              >
                <i className="bi bi-cart-fill cart-icon-coffee"></i>
                Giỏ hàng
                {cartCount > 0 && (
                  <span className={`cart-badge ${isAnimating ? 'animating' : ''}`}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          <div className="ms-lg-3">
            <Link to={ROUTES.TABLE_SELECT} className="btn custom-btn custom-border-btn">
              Chọn bàn
              <i className="bi-arrow-up-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Menu;