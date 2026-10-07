// src/features/about/components/AboutIntro.jsx
import videoFile from '@/assets/videos/Download.mp4';
// ⚠️ Nếu video nằm trong public/videos/ → dùng '/videos/Download.mp4'

export default function AboutIntro() {
  return (
    <section className="about-section section-padding" id="section_2">
      <div className="section-overlay"></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-12">
            <div className="ratio ratio-1x1">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="custom-video"
              >
                <source src={videoFile} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>

              <div className="about-video-info d-flex flex-column">
                <h4 className="mt-auto">Chúng tôi bắt đầu hành trình</h4>
                <h4>từ năm 2025</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-5 col-12 mt-4 mt-lg-0 mx-auto">
            <em className="text-white">Coffee Shop</em>

            <h2 className="text-white mb-3">
              Cafe CA – Hương vị đậm đà, không gian ấm áp
            </h2>

            <p className="text-white">
              Tọa lạc giữa lòng thị trấn yên bình, Cafe CA là điểm đến quen
              thuộc của những ai yêu thích hương vị cà phê nguyên chất và
              không gian thư giãn nhẹ nhàng.
            </p>

            <p className="text-white">
              Quán được sáng lập và vận hành bởi một nhóm bạn trẻ đầy nhiệt
              huyết, mang trong mình niềm đam mê với hạt cà phê và khát khao
              tạo nên không gian gặp gỡ, sẻ chia cho mọi người.
            </p>

            <a
              href="#barista-team"
              className="smoothscroll btn custom-btn custom-border-btn mt-3 mb-4"
            >
              Gặp gỡ đội ngũ Coffee Shop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}