
import { Check, Clock, TrendingUp } from 'lucide-react';
import { TIMELINE_STEPS } from '../constants';

export default function StatusTimelineCard({
  currentStatus,
  orderTime,
  estimatedTime,
}) {
  const progressPercent = Math.round(
    (currentStatus / TIMELINE_STEPS.length) * 100,
  );

  return (
    <div className="ot-card ot-timeline-card">
      <div className="ot-card-header">
        <h2 className="ot-card-title">
          <TrendingUp size={22} />
          Trạng thái đơn hàng
        </h2>
        <div className="ot-live-indicator">
          <span className="ot-live-dot"></span>
          Live
        </div>
      </div>

      <div className="ot-timeline">
        {TIMELINE_STEPS.map((status, index) => {
          const Icon = status.icon;
          const stepIndex = index + 1;
          const isActive = stepIndex <= currentStatus;
          const isCurrent = stepIndex === currentStatus;
          const displayTime = status.usesOrderTime ? orderTime : '';

          return (
            <div
              key={status.id}
              className={`ot-timeline-item ${isActive ? 'active' : ''} ${
                isCurrent ? 'current' : ''
              }`}
            >
              <div className="ot-timeline-icon-wrapper">
                <div className="ot-timeline-icon">
                  <Icon size={22} />
                </div>
                {stepIndex < currentStatus && (
                  <div className="ot-status-check">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="ot-timeline-content">
                <div className="ot-timeline-label">{status.label}</div>
                {displayTime && (
                  <div className="ot-timeline-time">{displayTime}</div>
                )}
                <div className="ot-timeline-desc">{status.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ot-progress-section">
        <div className="ot-progress-header">
          <span className="ot-progress-text">Tiến độ đơn hàng</span>
          <span className="ot-progress-percent">{progressPercent}%</span>
        </div>
        <div className="ot-progress-track">
          <div
            className="ot-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="ot-estimated-time">
          <Clock size={16} />
          <span>Thời gian dự kiến: {estimatedTime || '15-20 phút'}</span>
        </div>
      </div>
    </div>
  );
}