
import { URGENT_THRESHOLD_SEC } from '../constants';

export default function ConfirmBar({
  selectedTable,
  myHeldTable,
  countdown,
  onConfirm,
}) {
  const isHolding = selectedTable && myHeldTable === selectedTable && countdown > 0;
  const isUrgent = countdown <= URGENT_THRESHOLD_SEC;

  const renderInfo = () => {
    if (isHolding) {
      return (
        <div className="ts-hold-info">
          <div className="ts-hold-info-left">
            <i className="bi bi-clock-history" />
            <div>
              <span className="ts-hold-info-title">
                Đang giữ <b>Bàn {selectedTable}</b>
              </span>
              <span className="ts-hold-info-desc">
                Vui lòng xác nhận trước khi hết thời gian
              </span>
            </div>
          </div>
          <div className={`ts-hold-countdown ${isUrgent ? 'urgent' : ''}`}>
            <span className="ts-hold-countdown-num">
              {String(Math.floor(countdown / 60)).padStart(2, '0')}
            </span>
            <span className="ts-hold-countdown-sep">:</span>
            <span className="ts-hold-countdown-num">
              {String(countdown % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      );
    }

    if (selectedTable) {
      return (
        <div className="ts-selected-info">
          <i className="bi bi-check-circle-fill" />
          <span>
            Bạn đã chọn <b>Bàn {selectedTable}</b>
          </span>
        </div>
      );
    }

    return (
      <div className="ts-selected-hint">
        <i className="bi bi-info-circle" />
        <span>Chọn một bàn còn trống trên sơ đồ để tiếp tục</span>
      </div>
    );
  };

  return (
    <div className="ts-confirm">
      {renderInfo()}
      <button
        className="ts-confirm-btn"
        onClick={onConfirm}
        disabled={!selectedTable}
        type="button"
      >
        <span>Xác nhận bàn</span>
        <i className="bi bi-arrow-right" />
      </button>
    </div>
  );
}