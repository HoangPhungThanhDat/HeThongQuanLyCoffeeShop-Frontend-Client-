

export default function MenuHeader() {
    return (
      <header className="mop-header">
        <span className="mop-eyebrow">
          <span className="mop-eyebrow-line" />
          <i className="bi bi-cup-hot-fill" />
          Thực Đơn
          <span className="mop-eyebrow-line" />
        </span>
  
        <h2 className="mop-title">
          Khám Phá <em>Hương Vị</em>
        </h2>
  
        <p className="mop-desc">
          Những ly cà phê tuyệt vời và bánh ngọt thơm ngon được chế biến từ
          nguyên liệu cao cấp nhất
        </p>
      </header>
    );
  }