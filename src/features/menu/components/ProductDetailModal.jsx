// src/features/menu/components/ProductDetailModal.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Search, Sparkles, Check } from 'lucide-react';

import productApi from '@/api/productApi';
import categoryApi from '@/api/categoryApi';
import socket from '@/lib/socket';
import '@/assets/css/MenuModal.css';

/* Helper: đảm bảo luôn trả về array */
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function ProductDetailModal({
  isOpen,
  onClose,
  currentOrder,
  onAddItems,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchProducts();
    }
  }, [isOpen, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(ensureArray(res.data));
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // ⭐ Dùng endpoint /menu cho "Tất cả", giữ getByCategory cho filter
      const res = selectedCategory
        ? await productApi.getByCategory(selectedCategory)
        : await productApi.getMenuProducts();
      setProducts(ensureArray(res.data));
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setProducts([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleQuantityChange = (product, delta) => {
    const hasPromotion = product.promotions && product.promotions.length > 0;
    const finalPrice = hasPromotion
      ? product.price * (1 - product.promotions[0].discountPercentage / 100)
      : product.price;

    // ⭐ Lấy URL ảnh — dùng trực tiếp, không ghép prefix
    const imageUrl =
      product.imageUrl || product.image || '/icons/iconcoffee.png';

    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((item) => item.id !== product.id);
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item,
        );
      } else if (delta > 0) {
        return [
          ...prev,
          {
            id: product.id,
            productId: product.id,
            name: product.name,
            price: finalPrice,
            originalPrice: product.price,
            quantity: 1,
            image: imageUrl,        // ⭐ URL Cloudinary đầy đủ
            imageUrl: imageUrl,     // ⭐ Cho CartItem đọc
            discountPercentage: hasPromotion
              ? product.promotions[0].discountPercentage
              : 0,
          },
        ];
      }
      return prev;
    });
  };

  const getItemQuantity = (productId) => {
    const item = selectedItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalAmount = () =>
    selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotalItems = () =>
    selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmAdd = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một món!');
      return;
    }

    socket.emit('add-items-to-order', {
      orderId: currentOrder.orderNumber,
      items: selectedItems,
      additionalAmount: getTotalAmount(),
    });

    onAddItems(selectedItems);
    setSelectedItems([]);
    onClose();
  };

  if (!isOpen) return null;

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) =>
        p?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className="mmo-overlay" onClick={onClose}>
      <div className="mmo-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="mmo-header">
          <div className="mmo-header-left">
            <div className="mmo-header-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="mmo-title">Thêm món vào đơn</h3>
              <p className="mmo-subtitle">
                Đơn hàng <strong>#{currentOrder.orderNumber}</strong> • Bàn{' '}
                <strong>{currentOrder.tableNumber}</strong>
              </p>
            </div>
          </div>
          <button className="mmo-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="mmo-body">
          {/* Search */}
          <div className="mmo-search-box">
            <Search size={18} className="mmo-search-icon" />
            <input
              type="text"
              className="mmo-search-input"
              placeholder="Tìm món yêu thích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="mmo-search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Xóa"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="mmo-categories">
            <button
              className={`mmo-cat-btn ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`mmo-cat-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="mmo-loading">
              <div className="mmo-loading-spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mmo-empty">
              <ShoppingCart size={48} />
              <p>Không tìm thấy món nào</p>
            </div>
          ) : (
            <div className="mmo-grid">
              {filteredProducts.map((product) => {
                const hasPromotion =
                  product.promotions && product.promotions.length > 0;
                const discountedPrice = hasPromotion
                  ? product.price *
                    (1 - product.promotions[0].discountPercentage / 100)
                  : product.price;
                const quantity = getItemQuantity(product.id);

                // ⭐ Ảnh — URL Cloudinary đầy đủ
                const imageSrc =
                  product.imageUrl || product.image || '/icons/iconcoffee.png';

                return (
                  <div
                    key={product.id}
                    className={`mmo-product-card ${quantity > 0 ? 'selected' : ''}`}
                  >
                    <div className="mmo-product-img-wrap">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="mmo-product-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/icons/iconcoffee.png';
                        }}
                      />
                      {hasPromotion && (
                        <div className="mmo-promo-badge">
                          -{product.promotions[0].discountPercentage}%
                        </div>
                      )}
                      {quantity > 0 && (
                        <div className="mmo-selected-check">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="mmo-product-info">
                      <h4 className="mmo-product-name">{product.name}</h4>

                      <div className="mmo-product-price">
                        {hasPromotion && (
                          <span className="mmo-original-price">
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                        <span className="mmo-current-price">
                          {discountedPrice.toLocaleString()}đ
                        </span>
                      </div>

                      {quantity > 0 ? (
                        <div className="mmo-qty-controls">
                          <button
                            className="mmo-qty-btn mmo-qty-minus"
                            onClick={() => handleQuantityChange(product, -1)}
                            aria-label="Giảm"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mmo-qty-value">{quantity}</span>
                          <button
                            className="mmo-qty-btn mmo-qty-plus"
                            onClick={() => handleQuantityChange(product, 1)}
                            aria-label="Tăng"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mmo-add-btn"
                          onClick={() => handleQuantityChange(product, 1)}
                        >
                          <Plus size={16} />
                          Thêm
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mmo-footer">
          <div className="mmo-footer-info">
            <div className="mmo-footer-count">
              Đã chọn: <strong>{getTotalItems()}</strong> món
            </div>
            <div className="mmo-footer-total">
              {getTotalAmount().toLocaleString('vi-VN')}
              <span>₫</span>
            </div>
          </div>

          <div className="mmo-footer-actions">
            <button className="mmo-btn mmo-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button
              className="mmo-btn mmo-btn-confirm"
              onClick={handleConfirmAdd}
              disabled={selectedItems.length === 0}
            >
              <ShoppingCart size={18} />
              Xác nhận thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}