// src/layouts/Footer.jsx
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            {/* Địa chỉ */}
            <div className="col-lg-4 col-12 me-auto">
              <em className="text-white d-block mb-4">Địa chỉ của chúng tôi</em>
              <strong className="text-white">
                <i className="bi-geo-alt me-2"></i>
                123 Đường Nguyễn Trãi, Phường Bến Thành,
                <br />
                Quận 1, TP. Hồ Chí Minh, Việt Nam
              </strong>

              <ul className="social-icon mt-4">
                <li className="social-icon-item">
                  <a
                    href="https://facebook.com/coffeeshopvietnam"
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-link bi-facebook"
                    aria-label="Facebook"
                  ></a>
                </li>
                <li className="social-icon-item">
                  <a
                    href="https://instagram.com/coffeeshopvietnam"
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-link bi-instagram"
                    aria-label="Instagram"
                  ></a>
                </li>
                <li className="social-icon-item">
                  <a
                    href="https://zalo.me/0909123456"
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-link bi-chat-dots-fill"
                    aria-label="Zalo"
                  ></a>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}
            <div className="col-lg-3 col-12 mt-4 mb-3 mt-lg-0 mb-lg-0">
              <em className="text-white d-block mb-4">Liên hệ</em>

              <p className="d-flex mb-2">
                <strong className="me-2">Điện thoại:</strong>
                <a href="tel:0909123456" className="site-footer-link">
                  0909 123 456
                </a>
              </p>

              <p className="d-flex mb-2">
                <strong className="me-2">Email:</strong>
                <a href="mailto:hello@coffeeshop.vn" className="site-footer-link">
                  hello@coffeeshop.vn
                </a>
              </p>

              <p className="d-flex mb-2">
                <strong className="me-2">Wifi:</strong>
                <span className="site-footer-link">CoffeeShop2025</span>
              </p>

              <p className="d-flex mb-0">
                <strong className="me-2">Giờ mở cửa:</strong>
                <span className="site-footer-link">7:30 - 21:00</span>
              </p>
            </div>

            {/* Giờ mở cửa */}
            <div className="col-lg-5 col-12">
              <em className="text-white d-block mb-4">Giờ mở cửa</em>
              <ul className="opening-hours-list">
                <li className="d-flex">
                  Thứ Hai - Thứ Sáu <span className="underline"></span>
                  <strong>7:30 - 21:00</strong>
                </li>
                <li className="d-flex">
                  Thứ Bảy <span className="underline"></span>
                  <strong>8:00 - 22:00</strong>
                </li>
                <li className="d-flex">
                  Chủ Nhật <span className="underline"></span>
                  <strong>8:00 - 18:00</strong>
                </li>
                <li className="d-flex">
                  Ngày lễ, Tết <span className="underline"></span>
                  <strong>8:00 - 20:00</strong>
                </li>
              </ul>
            </div>

            {/* Bản quyền */}
            <div className="col-lg-8 col-12 mt-4">
              <p className="copyright-text mb-0 text-white">
                © {currentYear} Coffee Shop Việt Nam. Thiết kế bởi{' '}
                <a href="/" className="text-white">
                  Coffee Shop Team
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ Footer di động */}
      <nav className="mobile-bottom-nav d-md-none">
        <NavLink
          to={ROUTES.HOME}
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-house-door"></i>
          <span>Trang chủ</span>
        </NavLink>

        <NavLink
          to={ROUTES.TABLE_SELECT}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-cup-hot"></i>
          <span>Chọn Bàn</span>
        </NavLink>

        <NavLink
          to={ROUTES.CART}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-cart3"></i>
          <span>Giỏ hàng</span>
        </NavLink>

        <NavLink
          to="/tai-khoan"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-person-circle"></i>
          <span>Tài khoản</span>
        </NavLink>
      </nav>
    </>
  );
}