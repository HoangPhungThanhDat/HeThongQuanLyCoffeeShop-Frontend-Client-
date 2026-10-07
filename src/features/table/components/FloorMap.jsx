
import TableItem from './TableItem';
import { FILTER } from '../constants';

export default function FloorMap({
  groupedTables,
  tables,
  selectedTable,
  myHeldTable,
  countdown,
  filter,
  getHoldInfo,
  onSelect,
}) {
  const renderSection = (sectionTables, className, label) => {
    if (!sectionTables.length) return null;

    return (
      <div className={`floor-section ${className}`}>
        <span className="section-label">{label}</span>
        <div className="section-tables">
          {sectionTables.map((table, idx) => (
            <TableItem
              key={table.number}
              table={table}
              idx={idx}
              isSelected={selectedTable === table.number}
              isSelecting={false}
              isDimmed={filter !== FILTER.ALL && table.status !== filter}
              holdInfo={getHoldInfo(table.number)}
              countdown={myHeldTable === table.number ? countdown : 0}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="ts-floor-outer">
      <div className="ts-floor-header">
        <div className="ts-floor-label">
          <span className="ts-floor-dot" />
          SƠ ĐỒ TẦNG 1 • {tables.length} BÀN
        </div>
        <div className="ts-floor-legend">
          <span className="ts-legend-item">
            <span className="ts-legend-dot ts-legend-available" />
            Trống
          </span>
          <span className="ts-legend-item">
            <span className="ts-legend-dot ts-legend-occupied" />
            Đang dùng
          </span>
          <span className="ts-legend-item">
            <span className="ts-legend-dot ts-legend-reserved" />
            Đã đặt
          </span>
        </div>
      </div>

      <div className="ts-floor-map">
        <div className="ts-floor-grid" />

        <div className="floor-window">
          <span className="floor-window-icon">🪟</span>
          <span className="floor-window-label">CỬA SỔ</span>
        </div>

        {renderSection(
          groupedTables.window,
          'floor-section-window',
          'Khu cửa sổ',
        )}

        <div className="floor-bar">
          <span className="bar-line" />
          <span className="bar-label">
            <i className="bi bi-cup-hot-fill" />
            QUẦY BAR
          </span>
          <span className="bar-line" />
        </div>

        {renderSection(
          groupedTables.middle,
          'floor-section-middle',
          'Khu trung tâm',
        )}

        {renderSection(
          groupedTables.bottom,
          'floor-section-bottom',
          'Khu lối vào',
        )}

        <div className="floor-door">
          <span className="floor-door-icon">🚪</span>
          <span className="floor-door-label">LỐI VÀO</span>
        </div>
      </div>
    </div>
  );
}