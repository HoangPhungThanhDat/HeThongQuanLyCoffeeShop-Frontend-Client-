
import { Banknote, CreditCard } from 'lucide-react';

export default function PaymentMethods({
  total,
  disabled,
  onPayMoMo,
  onPayVNPay,
  onPayCash,
}) {
  return (
    <div className="ot-card ot-payment-card">
      <div className="ot-payment-header">
        <div className="ot-payment-header-icon">
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className="ot-payment-title">Thanh toán đơn hàng</h3>
          <p className="ot-payment-subtitle">
            Chọn phương thức thanh toán để hoàn tất
          </p>
        </div>
      </div>

      <div className="ot-payment-total">
        <div className="ot-payment-total-label">Tổng thanh toán</div>
        <div className="ot-payment-total-amount">
          {(total || 0).toLocaleString('vi-VN')}
          <span>₫</span>
        </div>
      </div>

      <div className="ot-payment-methods">
        <button
          className="ot-payment-btn ot-momo"
          onClick={onPayMoMo}
          disabled={disabled}
        >
          <div className="ot-payment-icon ot-icon-momo">
            <img
              src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
              alt="MoMo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="ot-payment-fallback" style={{ display: 'none' }}>
              M
            </div>
          </div>
          <div className="ot-payment-content">
            <div className="ot-payment-name">Ví MoMo</div>
            <div className="ot-payment-desc">
              <span>⚡ Siêu nhanh</span>
              <span>🎁 Nhiều ưu đãi</span>
            </div>
          </div>
          <span className="ot-payment-tag ot-tag-hot">🔥 HOT</span>
          <div className="ot-payment-arrow">→</div>
        </button>

        <button
          className="ot-payment-btn ot-vnpay"
          onClick={onPayVNPay}
          disabled={disabled}
        >
          <div className="ot-payment-icon ot-icon-vnpay">
            <img
              src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
              alt="VNPay"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="ot-payment-fallback" style={{ display: 'none' }}>
              V
            </div>
          </div>
          <div className="ot-payment-content">
            <div className="ot-payment-name">VNPay QR</div>
            <div className="ot-payment-desc">
              <span>🔒 Bảo mật cao</span>
              <span>💳 Đa ngân hàng</span>
            </div>
          </div>
          <span className="ot-payment-tag ot-tag-secure">🛡️ AN TOÀN</span>
          <div className="ot-payment-arrow">→</div>
        </button>

        <button className="ot-payment-btn ot-zalopay" disabled>
          <div className="ot-payment-icon ot-icon-zalopay">
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay.png"
              alt="ZaloPay"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="ot-payment-fallback" style={{ display: 'none' }}>
              Z
            </div>
          </div>
          <div className="ot-payment-content">
            <div className="ot-payment-name">ZaloPay</div>
            <div className="ot-payment-desc">
              <span>💰 Hoàn 15%</span>
              <span>🎯 Tích điểm</span>
            </div>
          </div>
          <span className="ot-payment-tag ot-tag-promo">🎁 -15%</span>
          <div className="ot-payment-arrow">→</div>
        </button>

        <button
          className="ot-payment-btn ot-cash"
          onClick={onPayCash}
          disabled={disabled}
        >
          <div className="ot-payment-icon ot-icon-cash">
            <Banknote size={28} />
          </div>
          <div className="ot-payment-content">
            <div className="ot-payment-name">Tiền mặt</div>
            <div className="ot-payment-desc">
              <span>🏪 Tại quầy</span>
              <span>📝 Xuất hóa đơn</span>
            </div>
          </div>
          <span className="ot-payment-tag ot-tag-classic">
            ⭐ TRUYỀN THỐNG
          </span>
          <div className="ot-payment-arrow">→</div>
        </button>
      </div>

      <div className="ot-payment-security">
        <div className="ot-security-icons">
          <span>🔐</span>
          <span>🛡️</span>
          <span>✓</span>
        </div>
        <div>
          <div className="ot-security-title">
            Thanh toán được mã hóa & bảo mật
          </div>
          <div className="ot-security-desc">
            Chứng nhận SSL • PCI-DSS Level 1 • Xác thực 3D Secure
          </div>
        </div>
      </div>
    </div>
  );
}