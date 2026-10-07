
import { Package, Sparkles } from 'lucide-react';

export default function OrderItemsList({ items = [], refreshKey = 0 }) {
  return (
    <div className="ot-items-list" key={refreshKey}>
      <h3 className="ot-items-heading">
        <Sparkles size={16} />
        Món đã đặt ({items.length})
      </h3>

      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={`${item.id || item.name}-${index}-${refreshKey}`}
            className="ot-item-row"
          >
            <div className="ot-item-img-wrap">
              <img
                src={item.image}
                alt={item.name}
                className="ot-item-img"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/60?text=☕';
                }}
              />
              <span className="ot-item-qty">{item.quantity}</span>
            </div>
            <div className="ot-item-info">
              <div className="ot-item-name">{item.name}</div>
              <div className="ot-item-unit">
                {item.price?.toLocaleString('vi-VN')}₫ / phần
              </div>
            </div>
            <div className="ot-item-total">
              {((item.price || 0) * (item.quantity || 0)).toLocaleString(
                'vi-VN',
              )}
              ₫
            </div>
          </div>
        ))
      ) : (
        <div className="ot-items-empty">
          <Package size={40} />
          <p>Chưa có món nào trong đơn hàng</p>
        </div>
      )}
    </div>
  );
}