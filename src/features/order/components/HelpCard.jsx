
import { Loader, MessageCircle, Phone } from 'lucide-react';
import { showToast } from '../utils/orderToast';

export default function HelpCard({
  isCallingStaff,
  isConnected,
  onCallStaff,
}) {
  return (
    <div className="ot-card ot-help-card">
      <div className="ot-help-title">
        <span className="ot-help-title-icon">💁</span>
        Cần hỗ trợ?
      </div>
      <p className="ot-help-desc">
        Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy chọn cách liên hệ phù hợp bên
        dưới.
      </p>

      <div className="ot-help-buttons">
        <button
          className="ot-help-btn ot-help-primary"
          onClick={onCallStaff}
          disabled={isCallingStaff || !isConnected}
        >
          {isCallingStaff ? (
            <>
              <Loader size={18} className="ot-spin" />
              Đang gọi...
            </>
          ) : (
            <>
              <Phone size={18} />
              Gọi nhân viên
            </>
          )}
        </button>
        <button
          className="ot-help-btn ot-help-secondary"
          onClick={() =>
            showToast(
              'info',
              'Tính năng đang phát triển',
              'Chat sẽ sớm có mặt',
            )
          }
        >
          <MessageCircle size={18} />
          Nhắn tin
          <span className="ot-badge-soon">Sớm</span>
        </button>
      </div>

      <div className="ot-hotline-box">
        <div className="ot-hotline-title">📞 Liên hệ khẩn cấp</div>
        <div className="ot-hotline-number">1900-xxxx</div>
        <div className="ot-hotline-note">Hoạt động 24/7 để hỗ trợ bạn</div>
      </div>
    </div>
  );
}