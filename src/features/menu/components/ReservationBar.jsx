
export default function ReservationBar({
    selectedTable,
    countdown,
    isUrgent,
    onCancel,
  }) {
    if (!selectedTable || countdown <= 0) return null;
  
    const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
    const seconds = String(countdown % 60).padStart(2, '0');
  
    return (
      <div className={`mop-reservation-bar ${isUrgent ? 'urgent' : ''}`}>
        <div className="mop-reservation-left">
          <i className="bi bi-clock-history" />
          <div className="mop-reservation-info">
            <span className="mop-reservation-title">
              Bàn <b>{selectedTable.tableNumber}</b> đang được giữ
            </span>
            <span className="mop-reservation-desc">
              Vui lòng chọn món trước khi hết thời gian
            </span>
          </div>
        </div>
        <div className="mop-reservation-right">
          <div className={`mop-reservation-countdown ${isUrgent ? 'urgent' : ''}`}>
            <span className="mop-reservation-num">{minutes}</span>
            <span className="mop-reservation-sep">:</span>
            <span className="mop-reservation-num">{seconds}</span>
          </div>
          <button
            className="mop-reservation-cancel"
            onClick={onCancel}
            title="Hủy bàn"
            aria-label="Hủy bàn"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>
    );
  }