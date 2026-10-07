function ProductCard({ product, index, isAdding, onAddToCart }) {
  const hasPromo = product.promotions?.length > 0;
  const discount = hasPromo ? product.promotions[0].discountPercentage : 0;
  const discountedPrice = hasPromo
    ? product.price * (1 - discount / 100)
    : product.price;

  // ⭐ Chuẩn hóa ảnh — hỗ trợ nhiều tên field
  const imageSrc =
    product.imageUrl || product.image || '/icons/iconcoffee.png';

  return (
    <article
      className="mop-card"
      style={{ '--card-delay': `${index * 0.06}s` }}
    >
      <div className="mop-card-img-wrap">
        <img
          src={imageSrc}
          alt={product.name}
          className="mop-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/icons/iconcoffee.png';
          }}
        />

        {hasPromo && (
          <div className="mop-badge-promo">
            <i className="bi bi-fire" />-{discount}%
          </div>
        )}

        {isAdding && (
          <div className="mop-adding-indicator">
            <i className="bi bi-person-fill" />
            Đang thêm
          </div>
        )}

        <div className="mop-card-actions">
          <button type="button" className="mop-action-btn" title="Yêu thích">
            <i className="bi bi-heart" />
          </button>
          <button type="button" className="mop-action-btn" title="Xem nhanh">
            <i className="bi bi-eye" />
          </button>
        </div>
      </div>

      <div className="mop-card-body">
        <h3 className="mop-card-title">{product.name}</h3>
        <p className="mop-card-desc">
          {product.description || 'Thức uống tuyệt vời cho một ngày hoàn hảo'}
        </p>

        <div className="mop-card-footer">
          <div className="mop-card-price">
            {hasPromo && (
              <span className="mop-price-old">
                {product.price.toLocaleString()}đ
              </span>
            )}
            <span className="mop-price-new">
              {discountedPrice.toLocaleString()}
              <span className="mop-price-currency">đ</span>
            </span>
          </div>

          <button
            className="mop-add-btn"
            onClick={(e) => onAddToCart(product, e)}
            disabled={isAdding}
            aria-label={`Thêm ${product.name} vào giỏ`}
          >
            <i className="bi bi-cart-plus-fill" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MenuProductGrid({
  products,
  addingStatus,
  searchTerm,
  onAddToCart,
}) {
  if (!products.length) {
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

  return (
    <div className="mop-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          isAdding={!!addingStatus[product.id]}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}