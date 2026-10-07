
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function MenuCartCTA() {
  return (
    <div className="mop-cta">
      <Link to={ROUTES.CART} className="mop-cta-btn">
        <i className="bi bi-cart-check-fill" />
        <span>Xem giỏ hàng</span>
        <i className="bi bi-arrow-right mop-cta-arrow" />
      </Link>
    </div>
  );
}