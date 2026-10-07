// src/features/cart/components/CartSummary.jsx
import { motion } from 'framer-motion';
import OrderNotesInput from './OrderNotesInput';

export default function CartSummary({
  total = 0,
  notes = '',
  onNotesChange,
  onCheckout,
  onViewOrderStatus,
  onClearCart,
  isProcessing = false,
}) {
  const safeTotal = typeof total === 'number' && !Number.isNaN(total) ? total : 0;

  return (
    <motion.div
      className="card shadow-lg border-0 p-4 position-sticky"
      style={{ top: '120px', borderRadius: '16px' }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="fw-bold mb-3" style={{ color: '#5c4033' }}>
        Tổng đơn hàng
      </h4>

      <div className="d-flex justify-content-between mb-2">
        <span>Tạm tính</span>
        <span>{safeTotal.toLocaleString('vi-VN')} đ</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
        <span>Tổng cộng</span>
        <span style={{ color: '#5c4033' }}>
          {safeTotal.toLocaleString('vi-VN')} đ
        </span>
      </div>

      <OrderNotesInput value={notes} onChange={onNotesChange} />

      {/* NÚT GỬI ĐƠN */}
      <button
        className="btn w-100 mb-2"
        style={{
          backgroundColor: '#5c4033',
          color: '#fff',
          border: 'none',
          padding: '12px',
          fontWeight: '700',
          transition: 'all 0.3s ease',
        }}
        onClick={onCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Đang xử lý...
          </>
        ) : (
          <>☕ Gửi đơn hàng</>
        )}
      </button>

      {/* NÚT XEM TRẠNG THÁI */}
      <button
        className="btn w-100 mb-2"
        onClick={onViewOrderStatus}
        disabled={isProcessing}
        style={{
          backgroundColor: '#8B4513',
          color: '#fff',
          border: 'none',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6F3609')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8B4513')}
      >
        <i className="bi bi-list-check me-2"></i>
        Xem trạng thái đơn hàng
      </button>

      {/* NÚT XÓA TẤT CẢ */}
      <button
        className="btn btn-outline-danger w-100"
        onClick={onClearCart}
        disabled={isProcessing}
      >
        🗑 Xóa tất cả
      </button>
    </motion.div>
  );
}