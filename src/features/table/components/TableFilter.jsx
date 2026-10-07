
import { FILTER } from '../constants';

export default function TableFilter({ filter, onChange, counts, total }) {
  const items = [
    {
      key: FILTER.ALL,
      label: 'Tất cả',
      icon: <i className="bi bi-grid-3x3-gap" />,
      count: total,
      className: '',
    },
    {
      key: FILTER.AVAILABLE,
      label: 'Còn trống',
      dot: true,
      count: counts.available,
      className: 'ts-filter-available',
    },
    {
      key: FILTER.OCCUPIED,
      label: 'Đang dùng',
      dot: true,
      count: counts.occupied,
      className: 'ts-filter-occupied',
    },
    {
      key: FILTER.RESERVED,
      label: 'Đã đặt',
      dot: true,
      count: counts.reserved,
      className: 'ts-filter-reserved',
    },
  ];

  return (
    <div className="ts-filter">
      {items.map((item) => (
        <button
          key={item.key}
          className={`ts-filter-btn ${item.className} ${
            filter === item.key ? 'active' : ''
          }`}
          onClick={() => onChange(item.key)}
        >
          {item.dot ? (
            <span className="ts-filter-dot" />
          ) : (
            item.icon
          )}
          {item.label}
          <span className="ts-filter-count">{item.count}</span>
        </button>
      ))}
    </div>
  );
}