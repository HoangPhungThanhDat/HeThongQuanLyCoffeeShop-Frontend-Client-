
import { Plus, X } from 'lucide-react';

export default function OrderActionButtons({ onAddItems, onCancel }) {
  return (
    <div className="ot-action-buttons">
      <button className="ot-btn ot-btn-primary" onClick={onAddItems}>
        <Plus size={18} />
        Thêm món
      </button>
      <button className="ot-btn ot-btn-outline" onClick={onCancel}>
        <X size={18} />
        Hủy đơn
      </button>
    </div>
  );
}