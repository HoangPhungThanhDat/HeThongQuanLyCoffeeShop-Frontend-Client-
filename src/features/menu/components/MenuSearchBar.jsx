

export default function MenuSearchBar({ value, onChange }) {
    return (
      <div className="mop-search-wrapper">
        <div className="mop-search-box">
          <i className="bi bi-search mop-search-icon" />
          <input
            type="text"
            className="mop-search-input"
            placeholder="Tìm món yêu thích của bạn..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              type="button"
              className="mop-search-clear"
              onClick={() => onChange('')}
              aria-label="Xóa tìm kiếm"
            >
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>
      </div>
    );
  }