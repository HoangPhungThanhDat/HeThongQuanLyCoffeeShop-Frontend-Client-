
import { memo, useCallback } from 'react';
import Seats from './Seats';
import { formatCountdown } from '../utils/statusHelpers';

const TableItem = memo(function TableItem({
  table,
  idx,
  isSelected,
  isSelecting,
  isDimmed,
  holdInfo,
  countdown,
  onSelect,
}) {
  const isHeldByOther = holdInfo && !holdInfo.isMine;
  const isHeldByMe = holdInfo && holdInfo.isMine;
  const isReserved = holdInfo?.isReserved;
  const isDisabled =
    (table.status !== 'available' && !isSelected) || isHeldByOther;

  const handleClick = useCallback(() => {
    onSelect(table.number, table.status);
  }, [onSelect, table.number, table.status]);

  const tooltipContent = () => {
    if (isHeldByOther) {
      return (
        <>
          <i className="bi bi-lock-fill" />{' '}
          {isReserved ? 'Đã đặt trước' : 'Đang giữ'} bởi {holdInfo.userName}
        </>
      );
    }
    if (isHeldByMe) {
      return (
        <>
          <i className="bi bi-clock-fill" /> Bạn đang giữ •{' '}
          {formatCountdown(countdown)}
        </>
      );
    }
    const statusText =
      table.status === 'available'
        ? 'Còn trống'
        : table.status === 'occupied'
          ? 'Đang có khách'
          : 'Đã đặt';
    return (
      <>
        {table.seats} chỗ • {statusText}
      </>
    );
  };

  return (
    <button
      type="button"
      className={`floor-table table-${table.status} shape-${table.shape} ${
        isSelected ? 'is-selected' : ''
      } ${isSelecting ? 'is-selecting' : ''} ${
        isDisabled ? 'is-disabled' : ''
      } ${isHeldByOther ? 'is-held' : ''} ${
        isHeldByMe ? 'is-held-by-me' : ''
      } ${isReserved ? 'is-reserved' : ''} ${
        isDimmed ? 'is-dimmed' : ''
      }`}
      onClick={handleClick}
      disabled={isDisabled}
      style={{ '--idx': idx }}
      aria-label={`Bàn ${table.number}`}
    >
      <Seats shape={table.shape} seats={table.seats} />

      <div className="table-body">
        <div className="table-shine" />
        <span className="table-number">
          {String(table.number).padStart(2, '0')}
        </span>
        <span className="table-seats-label">
          {table.seats} <i className="bi bi-person-fill" />
        </span>

        {isHeldByMe && countdown > 0 && (
          <span className="table-countdown">
            <i className="bi bi-clock-fill" />
            {formatCountdown(countdown)}
          </span>
        )}
      </div>

      <span className="table-status-dot" />

      {isSelected && (
        <span className="table-check">
          <i className="bi bi-check-lg" />
        </span>
      )}

      {isSelecting && (
        <span className="table-selecting-badge">
          <span className="pulse-ring" />
          <i className="bi bi-person-fill" />
        </span>
      )}

      {isHeldByOther && (
        <span className="table-held-lock">
          <i className="bi bi-lock-fill" />
        </span>
      )}

      <span className="table-tooltip">
        <strong>Bàn {table.number}</strong>
        <small>{tooltipContent()}</small>
      </span>
    </button>
  );
});

export default TableItem;