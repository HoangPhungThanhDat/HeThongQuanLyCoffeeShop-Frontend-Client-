

export default function MenuEmptyState({ searchTerm }) {
    return (
      <div className="mop-empty">
        <i className="bi bi-inbox" />
        <p>
          {searchTerm
            ? `Không tìm thấy món nào với "${searchTerm}"`
            : 'Không có sản phẩm nào trong danh mục này'}
        </p>
      </div>
    );
  }