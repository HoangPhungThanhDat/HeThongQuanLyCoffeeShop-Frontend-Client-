

export default function TableStats({ total, available, occupied, reserved }) {
    return (
      <div className="ts-stats">
        <div className="ts-stat ts-stat-all">
          <div className="ts-stat-icon">
            <i className="bi bi-grid-3x3-gap-fill" />
          </div>
          <div className="ts-stat-text">
            <span className="ts-stat-value">{total}</span>
            <span className="ts-stat-label">Tổng bàn</span>
          </div>
        </div>
        <div className="ts-stat ts-stat-available">
          <div className="ts-stat-icon">
            <i className="bi bi-check-circle-fill" />
          </div>
          <div className="ts-stat-text">
            <span className="ts-stat-value">{available}</span>
            <span className="ts-stat-label">Còn trống</span>
          </div>
        </div>
        <div className="ts-stat ts-stat-occupied">
          <div className="ts-stat-icon">
            <i className="bi bi-x-circle-fill" />
          </div>
          <div className="ts-stat-text">
            <span className="ts-stat-value">{occupied}</span>
            <span className="ts-stat-label">Đang dùng</span>
          </div>
        </div>
        <div className="ts-stat ts-stat-reserved">
          <div className="ts-stat-icon">
            <i className="bi bi-clock-fill" />
          </div>
          <div className="ts-stat-text">
            <span className="ts-stat-value">{reserved}</span>
            <span className="ts-stat-label">Đã đặt</span>
          </div>
        </div>
      </div>
    );
  }