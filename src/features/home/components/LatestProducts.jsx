// src/features/home/components/LatestProducts.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import productApi from '@/api/productApi';
import { ROUTES } from '@/constants/routes';
import '@/assets/css/SanPhamMoiNhat.css';   // 👈 CSS thường

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getNewest();
        console.log('Dữ liệu sản phẩm:', response);
        setProducts(response.data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0 && swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, {
        modules: [Navigation, Autoplay, Pagination],
        slidesPerView: 4,
        spaceBetween: 24,
        loop: products.length > 4,
        speed: 800,
        grabCursor: true,
        watchSlidesProgress: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: '.np-pagination',
          clickable: true,
          dynamicBullets: false,
        },
        navigation: {
          nextEl: '.np-nav-next',
          prevEl: '.np-nav-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 16 },
          576: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 22 },
          992: { slidesPerView: 4, spaceBetween: 24 },
        },
      });

      return () => swiper.destroy(true, true);
    }
  }, [loading, products]);

  const SkeletonCard = () => (
    <div className="swiper-slide">
      <div className="product-card skeleton-card">
        <div className="skeleton-img"></div>
        <div className="product-card-body">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text short"></div>
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-line skeleton-btn"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="new-products-section" id="new-products">
      <div className="np-bg-decor">
        <div className="np-circle np-circle-1"></div>
        <div className="np-circle np-circle-2"></div>
        <div className="np-circle np-circle-3"></div>
      </div>

      <div className="container position-relative">
        <div className="np-header text-center">
          <h2 className="np-title">
            Sản phẩm cà phê{' '}
            <span className="np-title-highlight">mới nhất</span>
          </h2>
          <div className="np-divider">
            <span className="np-divider-line"></span>
            <i className="bi bi-cup-hot-fill np-divider-icon"></i>
            <span className="np-divider-line"></span>
          </div>
          <p className="np-subtitle">
            Khám phá những hương vị cà phê mới được chúng tôi chọn lọc kỹ lưỡng,
            mang đến trải nghiệm đậm đà và tinh tế nhất.
          </p>
        </div>

        <div className="np-swiper-wrapper">
          {!loading && products.length > 0 && (
            <button
              type="button"
              className="np-nav-btn np-nav-prev"
              aria-label="Sản phẩm trước"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          )}

          <div className="swiper mySwiper np-swiper" ref={swiperRef}>
            <div className="swiper-wrapper">
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div className="swiper-slide" key={product.id}>
                    <div className="product-card">
                      <div className="product-card-image-wrapper">
                        <img
                          src={product.imageUrl}
                          className="product-card-image"
                          alt={product.name}
                          loading="lazy"
                        />
                        <div className="product-card-overlay"></div>

                        <span className="product-card-badge">
                          <i className="bi bi-fire"></i>
                          Hot
                        </span>

                        <div className="product-card-actions">
                          <button
                            type="button"
                            className="action-btn"
                            title="Yêu thích"
                            aria-label="Yêu thích"
                          >
                            <i className="bi bi-heart"></i>
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            title="Xem nhanh"
                            aria-label="Xem nhanh"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </div>

                      <div className="product-card-body">
                        <h5 className="product-card-title">{product.name}</h5>
                        <p className="product-card-desc">
                          {product.description
                            ? product.description.slice(0, 65) + '...'
                            : 'Không có mô tả'}
                        </p>

                        <div className="product-card-footer">
                          <div className="product-card-price">
                            <span className="price-value">
                              {product.price?.toLocaleString()}
                            </span>
                            <span className="price-currency">đ</span>
                          </div>
                          <Link
                            to={ROUTES.TABLE_SELECT}
                            className="product-card-btn"
                            aria-label={`Đặt ${product.name}`}
                          >
                            Đặt ngay
                            <i className="bi bi-arrow-up-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="np-empty">
                  <i className="bi bi-inbox"></i>
                  <p>Chưa có sản phẩm nào</p>
                </div>
              )}
            </div>

            {!loading && products.length > 0 && (
              <div className="swiper-pagination np-pagination"></div>
            )}
          </div>

          {!loading && products.length > 0 && (
            <button
              type="button"
              className="np-nav-btn np-nav-next"
              aria-label="Sản phẩm tiếp theo"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          )}
        </div>

        {!loading && products.length > 0 && (
          <div className="np-cta text-center">
            <Link to={ROUTES.MENU} className="np-cta-btn">
              Xem tất cả sản phẩm
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}