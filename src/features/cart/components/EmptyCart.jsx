// src/features/cart/components/EmptyCart.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function EmptyCart() {
  return (
    <motion.div
      className="text-center mt-5 py-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <i className="bi bi-bag-x fs-1 text-warning"></i>
      <p className="mt-3 fs-5 fw-semibold text-light">
        Giỏ hàng trống ☕
      </p>
      <p className="text-muted">Hãy chọn vài món yêu thích của bạn nhé!</p>

      <Link
        to={ROUTES.MENU}
        className="btn mt-3"
        style={{
          backgroundColor: '#5c4033',
          color: '#fff',
          padding: '10px 28px',
          borderRadius: '10px',
          fontWeight: 600,
        }}
      >
        <i className="bi bi-cup-hot me-2"></i>
        Xem thực đơn
      </Link>
    </motion.div>
  );
}