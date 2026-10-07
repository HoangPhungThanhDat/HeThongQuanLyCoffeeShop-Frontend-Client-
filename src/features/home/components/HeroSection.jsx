import { useState, useEffect, useCallback } from 'react';
import banner1 from '@/assets/images/banners/banner2.jpg';
import banner2 from '@/assets/images/banners/banner3.jpg';
import banner3 from '@/assets/images/banners/banner31.webp';

const SLIDES = [
  {
    image: banner1,
    eyebrow: 'Nghệ Thuật Cà Phê Thủ Công',
    titleTop: 'Khám Phá',
    titleMain: 'Hương Vị',
    titleAccent: 'Cà Phê',
    titleBottom: 'Đích Thực',
    subtitle:
      'Mỗi tách cà phê là một câu chuyện — chắt lọc từ những hạt Robusta & Arabica thượng hạng, rang xay tại chỗ và phục vụ bằng cả trái tim.',
  },
  {
    image: banner2,
    eyebrow: 'Không Gian Đậm Chất Hà Nội',
    titleTop: 'Đánh Thức',
    titleMain: 'Mọi Giác',
    titleAccent: 'Quan',
    titleBottom: 'Mỗi Sớm Mai',
    subtitle:
      'Không gian ấm cúng giữa lòng phố cổ — nơi hương cà phê quyện cùng tiếng cười, mở ra những buổi sáng trọn vẹn.',
  },
  {
    image: banner3,
    eyebrow: 'Rang Xay Tại Chỗ',
    titleTop: 'Tận Hưởng',
    titleMain: 'Từng Giọt',
    titleAccent: 'Đậm',
    titleBottom: 'Nguyên Bản',
    subtitle:
      'Từng hạt cà phê được tuyển chọn, rang mộc theo công thức riêng — giữ trọn hương vị nguyên bản của đất trời.',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload ảnh đầu tiên rồi mới reveal nội dung
  useEffect(() => {
    const img = new Image();
    img.src = SLIDES[0].image;
    const reveal = () => requestAnimationFrame(() => setIsLoaded(true));
    img.onload = reveal;
    img.onerror = reveal;

    // Fallback nếu ảnh load quá lâu
    const fallback = setTimeout(reveal, 800);
    return () => clearTimeout(fallback);
  }, []);

  // Tự chuyển slide + pause khi tab ẩn
  useEffect(() => {
    let timer = null;

    const start = () => {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 6500);
    };

    const stop = () => timer && clearInterval(timer);

    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const goToSlide = useCallback((idx) => setCurrentSlide(idx), []);

  const handleSmoothScroll = useCallback((e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="hero-section" id="section_1">
      {/* ----- Background slideshow ----- */}
      <div className="hero-slides" aria-hidden="true">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`hero-slide ${currentSlide === idx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}
      </div>

      {/* ----- Overlay (chỉ 1 lớp, không blend-mode) ----- */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* ----- Decorative frame ----- */}
      <div className="hero-frame" aria-hidden="true">
        <span className="frame-corner frame-tl" />
        <span className="frame-corner frame-tr" />
        <span className="frame-corner frame-bl" />
        <span className="frame-corner frame-br" />
      </div>

      {/* ----- Content ----- */}
      <div className="container hero-container">
        <div className="row align-items-center justify-content-center min-vh-100">
          <div className="col-lg-9 col-md-11 col-12 text-center">
            <div className={`hero-eyebrow ${isLoaded ? 'reveal' : ''}`}>
              <span className="eyebrow-line" />
              <span className="eyebrow-text">
                <i className="bi bi-cup-hot-fill" />
                {slide.eyebrow}
              </span>
              <span className="eyebrow-line" />
            </div>

            {/* Key giúp title animate lại mỗi khi slide đổi */}
            <h1
              key={currentSlide}
              className={`hero-title ${isLoaded ? 'reveal delay-1' : ''}`}
            >
              <span className="title-line-1">{slide.titleTop}</span>
              <span className="title-line-2">
                {slide.titleMain} <em>{slide.titleAccent}</em>
              </span>
              <span className="title-line-3">{slide.titleBottom}</span>
            </h1>

            <p
              key={`sub-${currentSlide}`}
              className={`hero-subtitle ${isLoaded ? 'reveal delay-2' : ''}`}
            >
              {slide.subtitle}
            </p>

            <div className={`hero-actions ${isLoaded ? 'reveal delay-3' : ''}`}>
              <a
                href="#section_3"
                className="btn-hero btn-hero-solid"
                onClick={(e) => handleSmoothScroll(e, '#section_3')}
              >
                <span>Khám Phá Thực Đơn</span>
                <i className="bi bi-arrow-right" />
              </a>

              <a
                href="#section_2"
                className="btn-hero btn-hero-ghost"
                onClick={(e) => handleSmoothScroll(e, '#section_2')}
              >
                <i className="bi bi-play-circle" />
                <span>Câu Chuyện Của Chúng Tôi</span>
              </a>
            </div>

            <div className={`hero-stats ${isLoaded ? 'reveal delay-4' : ''}`}>
              <div className="stat-item">
                <span className="stat-icon">
                  <i className="bi bi-clock-history" />
                </span>
                <div className="stat-content">
                  <strong>7:00 – 22:00</strong>
                  <small>Mở cửa hàng ngày</small>
                </div>
              </div>

              <div className="stat-divider" />

              <div className="stat-item">
                <span className="stat-icon">
                  <i className="bi bi-geo-alt-fill" />
                </span>
                <div className="stat-content">
                  <strong>Hà Nội</strong>
                  <small>123 Phố Cổ</small>
                </div>
              </div>

              <div className="stat-divider" />

              <div className="stat-item">
                <span className="stat-icon">
                  <i className="bi bi-star-fill" />
                </span>
                <div className="stat-content">
                  <strong>4.9 / 5.0</strong>
                  <small>2,500+ đánh giá</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----- Pagination ----- */}
      <div className="hero-pagination" role="tablist" aria-label="Hero slides">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={currentSlide === idx}
            aria-label={`Slide ${idx + 1}`}
            className={`page-dot ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
          >
            <span className="dot-fill" />
            <span className="dot-number">0{idx + 1}</span>
          </button>
        ))}
      </div>

      {/* ----- Scroll hint ----- */}
      <a
        href="#section_2"
        className="scroll-hint"
        onClick={(e) => handleSmoothScroll(e, '#section_2')}
        aria-label="Cuộn xuống"
      >
        <span className="scroll-label">Cuộn xuống</span>
        <span className="scroll-bar">
          <span className="scroll-progress" />
        </span>
      </a>
    </section>
  );
}