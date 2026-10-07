
import { motion } from 'framer-motion';

export default function CartItem({ item, index, onQtyChange, onRemove }) {
  const qty = item.qty ?? item.quantity ?? 1;
  const price = item.price ?? 0;
  const subtotal = price * qty;

  // ⭐ Chuẩn hóa ảnh — hỗ trợ nhiều tên field
  const imageSrc =
    item.imageUrl || item.image || '/icons/iconcoffee.png';

  const handleQtyInput = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onQtyChange(index, 1);
      return;
    }
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n)) {
      onQtyChange(index, n);
    }
  };

  return (
    <motion.div
      className="col-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="card shadow-sm border-0 cart-item-card">
        <div className="row g-0 align-items-center">
          <div className="col-4 col-md-3 text-center">
            <img
              src={imageSrc}
              alt={item.name}
              className="img-fluid rounded-3 cart-img"
              onError={(e) => {
                e.target.src = '/icons/iconcoffee.png';
              }}
            />
          </div>
          <div className="col-8 col-md-9">
            <div className="card-body">
              <h5 className="card-title fw-bold">{item.name}</h5>
              <p className="mb-1 text-muted">
                {price.toLocaleString('vi-VN')} đ
              </p>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={qty}
                  onChange={handleQtyInput}
                  className="form-control form-control-sm text-center"
                  style={{ width: '70px' }}
                />
                <span className="fw-bold" style={{ color: '#5c4033' }}>
                  {subtotal.toLocaleString('vi-VN')} đ
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onRemove(index)}
                  aria-label="Xóa món"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}