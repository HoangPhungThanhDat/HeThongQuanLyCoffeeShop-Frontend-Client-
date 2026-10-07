
import { Clock, MapPin, Receipt } from 'lucide-react';
import { isCancelled } from '../utils/statusHelpers';

import OrderNoteBox from './OrderNoteBox';
import OrderItemsList from './OrderItemsList';
import OrderActionButtons from './OrderActionButtons';

export default function OrderInfoCard({
  orderDetails,
  currentStatus,
  isPaid,
  refreshKey,
  onAddItems,
  onCancel,
}) {
  const cancelled = isCancelled(orderDetails.status);
  const statusClass = cancelled
    ? 'cancelled'
    : currentStatus < 5
      ? 'processing'
      : 'completed';
  const statusText = cancelled
    ? 'Đã hủy'
    : currentStatus < 5
      ? 'Đang xử lý'
      : 'Hoàn thành';

  return (
    <div className="ot-card">
      <div className="ot-card-header">
        <h2 className="ot-card-title">
          <Receipt size={22} />
          Chi tiết đơn hàng
        </h2>
        <div className={`ot-status-badge ${statusClass}`}>
          <Clock size={14} />
          {statusText}
        </div>
      </div>

      <div className="ot-order-info">
        <div className="ot-order-number">
          <span className="ot-order-hash">#</span>
          {orderDetails.orderNumber}
        </div>
        <div className="ot-order-meta">
          <div className="ot-meta-item">
            <div className="ot-meta-icon">
              <MapPin size={16} />
            </div>
            <div>
              <div className="ot-meta-label">Bàn số</div>
              <div className="ot-meta-value">{orderDetails.tableNumber}</div>
            </div>
          </div>
          <div className="ot-meta-item">
            <div className="ot-meta-icon">
              <Clock size={16} />
            </div>
            <div>
              <div className="ot-meta-label">Thời gian</div>
              <div className="ot-meta-value">
                {orderDetails.time} • {orderDetails.date}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderNoteBox note={orderDetails.note} />

      <OrderItemsList items={orderDetails.items} refreshKey={refreshKey} />

      <div className="ot-total-box">
        <span className="ot-total-label">Tổng cộng</span>
        <span className="ot-total-amount">
          {(orderDetails.total || 0).toLocaleString('vi-VN')}
          <span className="ot-total-currency">₫</span>
        </span>
      </div>

      {!cancelled && currentStatus < 5 && !isPaid && (
        <OrderActionButtons onAddItems={onAddItems} onCancel={onCancel} />
      )}
    </div>
  );
}