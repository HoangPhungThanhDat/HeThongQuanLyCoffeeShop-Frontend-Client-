
import { Check, CheckCircle } from 'lucide-react';

export default function PaymentSuccessCard({ orderDetails }) {
  return (
    <div className="ot-card ot-payment-success-card">
      <div className="ot-payment-success-content">
        <div className="ot-payment-success-icon">
          <CheckCircle size={48} />
        </div>
        <h3 className="ot-payment-success-title">
          Bạn đã thanh toán thành công!
        </h3>
        <p className="ot-payment-success-desc">
          Cảm ơn bạn đã sử dụng dịch vụ. Đơn hàng của bạn đã được xác nhận thanh
          toán.
        </p>

        <div className="ot-payment-success-info">
          <div className="ot-payment-success-row">
            <span className="ot-payment-success-label">Mã đơn hàng</span>
            <span className="ot-payment-success-value">
              #{orderDetails.orderNumber}
            </span>
          </div>
          <div className="ot-payment-success-row">
            <span className="ot-payment-success-label">Phương thức</span>
            <span className="ot-payment-success-value">
              {orderDetails.paymentMethod || 'Đã thanh toán'}
            </span>
          </div>
          <div className="ot-payment-success-row ot-payment-success-total">
            <span className="ot-payment-success-label">Số tiền</span>
            <span className="ot-payment-success-amount">
              {(orderDetails.total || 0).toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        <div className="ot-payment-success-badge">
          <Check size={16} strokeWidth={3} />
          Giao dịch hoàn tất
        </div>
      </div>
    </div>
  );
}