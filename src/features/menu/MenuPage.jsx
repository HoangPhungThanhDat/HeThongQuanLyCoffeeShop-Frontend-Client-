// src/features/menu/MenuPage.jsx
import { useEffect, useState, useRef } from 'react';
import productApi from '@/api/productApi';
import categoryApi from '@/api/categoryApi';
import '@/assets/css/MenuMon.css';   
import menuBg from '@/assets/images/menu.png';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const formatVND = (value) => (value || 0).toLocaleString('vi-VN') + '₫';

  // ============ FETCH CATEGORIES ============
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const cats = res.data || [];
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0].id);
      } catch (error) {
        console.error('❌ Lỗi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  // ============ FETCH PRODUCTS ============
  useEffect(() => {
    if (!activeCategory) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getByCategory(activeCategory);
        setProducts(res.data || []);
      } catch (error) {
        console.error('❌ Lỗi tải sản phẩm:', error);
        setProducts([]);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  // ============ IntersectionObserver ============
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ============ HELPERS ============
  const hasPromotion = (product) =>
    product.promotions && product.promotions.length > 0;

  const getDiscountedPrice = (product) => {
    if (!hasPromotion(product)) return product.price;
    return (
      product.price * (1 - product.promotions[0].discountPercentage / 100)
    );
  };

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <section
      className="mp-section"
      id="section_3"
      ref={sectionRef}
      style={{ backgroundImage: `url(${menuBg})` }}
    >
      <div className="mp-overlay" />

      <div className="container mp-container">
        {/* ============ HEADER ============ */}
        <header className={`mp-header ${visible ? 'mp-reveal' : ''}`}>
          <span className="mp-eyebrow">
            <span className="mp-eyebrow-line" />
            <i className="bi bi-bookmark-star-fill" />
            Thực Đơn
            <span className="mp-eyebrow-line" />
          </span>

          <h2 className="mp-title">
            Khám Phá <em>Hương Vị</em>
          </h2>

          <p className="mp-desc">
            Mỗi món ăn và thức uống tại Coffee Shop đều được chăm chút tỉ mỉ,
            từ nguyên liệu tươi ngon đến cách trình bày tinh tế.
          </p>
        </header>

        {/* ============ TABS ============ */}
        <div className={`mp-tabs-wrapper ${visible ? 'mp-reveal' : ''}`}>
          <div className="mp-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`mp-tab ${
                  activeCategory === cat.id ? 'mp-tab-active' : ''
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="mp-tab-icon">
                  <i className="bi bi-cup-hot-fill" />
                </span>
                <span className="mp-tab-label">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ============ INFO BAR ============ */}
        <div className={`mp-info-bar ${visible ? 'mp-reveal' : ''}`}>
          <div className="mp-info-left">
            <span className="mp-info-dot" />
            <span className="mp-info-text">
              {currentCategory?.description || 'Khám phá hương vị tuyệt vời'}
            </span>
          </div>
          <div className="mp-info-count">
            <strong>{String(products.length).padStart(2, '0')}</strong>
            <span>món</span>
          </div>
        </div>

        {/* ============ PRODUCTS GRID ============ */}
        {loading ? (
          <div className="mp-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mp-card mp-skeleton">
                <div className="mp-skeleton-img" />
                <div className="mp-skeleton-body">
                  <div className="mp-skeleton-line mp-skeleton-title" />
                  <div className="mp-skeleton-line mp-skeleton-desc" />
                  <div className="mp-skeleton-line mp-skeleton-price" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mp-empty">
            <i className="bi bi-inbox" />
            <p>Chưa có sản phẩm trong danh mục này</p>
          </div>
        ) : (
          <div className="mp-grid">
            {products.map((product, index) => {
              const discounted = getDiscountedPrice(product);
              const hasPromo = hasPromotion(product);

              return (
                <article
                  key={product.id}
                  className="mp-card"
                  style={{ '--card-delay': `${index * 0.06}s` }}
                >
                  {/* Image */}
                  <div className="mp-card-img-wrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="mp-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('mp-img-fallback');
                      }}
                    />

                    {/* Promo badge */}
                    {hasPromo && (
                      <div className="mp-badge-promo">
                        <i className="bi bi-fire" />
                        -{product.promotions[0].discountPercentage}%
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="mp-card-hover">
                      <span className="mp-card-view">
                        <i className="bi bi-eye" />
                        Xem chi tiết
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mp-card-body">
                    <h3 className="mp-card-title">{product.name}</h3>
                    <p className="mp-card-desc">
                      {product.description || 'Thức uống tuyệt vời cho ngày hoàn hảo'}
                    </p>

                    <div className="mp-card-footer">
                      <div className="mp-card-price">
                        {hasPromo && (
                          <span className="mp-price-old">
                            {formatVND(product.price)}
                          </span>
                        )}
                        <span className="mp-price-new">
                          {formatVND(discounted)}
                        </span>
                      </div>

                      <a
                        href="#section_4"
                        className="mp-card-btn"
                        aria-label={`Đặt ${product.name}`}
                      >
                        <i className="bi bi-bag-plus-fill" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ============ CTA ============ */}
        <div className={`mp-cta ${visible ? 'mp-reveal' : ''}`}>
        <Link to={ROUTES.TABLE_SELECT}  className="mp-cta-btn">
            <span>Đặt bàn ngay</span>
            <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}