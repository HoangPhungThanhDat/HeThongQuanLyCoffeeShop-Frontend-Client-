// src/features/review/ReviewSection.jsx
import userAvatar from '@/assets/images/reviews/user.png';

const REVIEWS = [
  {
    name: 'Quân',
    role: 'Khách hàng',
    rating: 4.5,
    stars: 4.5,
    text: 'Không gian quán rất ấm cúng, âm nhạc nhẹ nhàng và cà phê cực kỳ thơm ngon. Đây chắc chắn là nơi lý tưởng để thư giãn sau những giờ làm việc căng thẳng.',
  },
  {
    name: 'Thảo',
    role: 'Khách hàng thân thiết',
    rating: 5.0,
    stars: 5,
    text: 'Tôi đã thử rất nhiều quán cà phê ở CAang, nhưng Cafe CA vẫn là nơi tôi quay lại nhiều nhất. Cà phê đậm đà, phục vụ chu đáo và luôn có cảm giác thân quen mỗi khi ghé.',
  },
  {
    name: 'Mai',
    role: 'Khách hàng',
    rating: 4.8,
    stars: 4.5,
    text: 'Nhân viên rất dễ thương và phục vụ nhanh chóng. Đồ uống được trình bày đẹp mắt, hương vị tuyệt vời – đặc biệt là cà phê sữa đá, rất đúng gu của tôi!',
  },
];

export default function ReviewSection() {
  return (
    <section
      className="reviews-section section-padding section-bg"
      id="section_4"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 col-12 text-center mb-4 pb-lg-2">
            <em className="text-white">Đánh giá từ khách hàng</em>
            <h2 className="text-white">Cảm nhận của khách hàng</h2>
          </div>

          <div className="timeline">
            {REVIEWS.map((review, idx) => {
              const side = idx % 2 === 0 ? 'left' : 'right';
              const fullStars = Math.floor(review.stars);
              const hasHalf = review.stars % 1 !== 0;
              const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

              return (
                <div
                  key={idx}
                  className={`timeline-container timeline-container-${side}`}
                >
                  <div className="timeline-content">
                    <div className="reviews-block">
                      <div className="reviews-block-image-wrap d-flex align-items-center">
                        <img
                          src={userAvatar}
                          className="reviews-block-image img-fluid"
                          alt={`Khách hàng ${review.name}`}
                        />

                        <div>
                          <h6 className="text-white mb-0">{review.name}</h6>
                          <em className="text-white">{review.role}</em>
                        </div>
                      </div>

                      <div className="reviews-block-info">
                        <p>{review.text}</p>

                        <div className="d-flex border-top pt-3 mt-4">
                          <strong className="text-white">
                            {review.rating}{' '}
                            <small className="ms-2">Điểm đánh giá</small>
                          </strong>

                          <div className="reviews-group ms-auto">
                            {[...Array(fullStars)].map((_, i) => (
                              <i key={`full-${i}`} className="bi-star-fill"></i>
                            ))}
                            {hasHalf && <i className="bi-star-half"></i>}
                            {[...Array(emptyStars)].map((_, i) => (
                              <i key={`empty-${i}`} className="bi-star"></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}