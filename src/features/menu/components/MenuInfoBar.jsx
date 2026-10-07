

export default function MenuInfoBar({ categoryName, count }) {
    return (
      <div className="mop-info-bar">
        <div className="mop-info-left">
          <span className="mop-info-dot" />
          <span className="mop-info-text">{categoryName || 'Tất cả sản phẩm'}</span>
        </div>
        <div className="mop-info-count">
          <strong>{String(count).padStart(2, '0')}</strong>
          <span>món</span>
        </div>
      </div>
    );
  }