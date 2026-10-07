
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function OrderEmptyState({ onBack }) {
  return (
    <div className="ot-empty-wrapper">
      <div className="ot-empty-icon">
        <AlertCircle size={56} />
      </div>
      <h2>Không tìm thấy đơn hàng</h2>
      <p>Vui lòng đặt hàng trước khi xem trạng thái</p>
      <button onClick={onBack} className="ot-empty-btn">
        <ArrowLeft size={18} />
        Về trang chủ
      </button>
    </div>
  );
}