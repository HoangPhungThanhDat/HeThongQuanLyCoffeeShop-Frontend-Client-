// src/features/about/components/TeamSection.jsx
import anhMinh from '@/assets/images/team/portrait-elegant-old-man-wearing-suit.jpg';
import chiLan from '@/assets/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg';
import anhTuan from '@/assets/images/team/small-business-owner-drinking-coffee.jpg';
import maiAnh from '@/assets/images/team/smiley-business-woman-working-cashier.jpg';

const TEAM_MEMBERS = [
  {
    name: 'Anh Minh',
    role: 'Chủ quán',
    desc: 'Người sáng lập Coffee Shop với niềm đam mê cà phê bất tận.',
    image: anhMinh,
    alt: 'Anh Minh - Chủ quán',
  },
  {
    name: 'Chị Lan',
    role: 'Quản lý',
    desc: 'Luôn đảm bảo mỗi khách hàng đều nhận được trải nghiệm tốt nhất.',
    image: chiLan,
    alt: 'Chị Lan - Quản lý',
  },
  {
    name: 'Anh Tuấn',
    role: 'Trưởng pha chế',
    desc: 'Chuyên gia tạo ra những hương vị cà phê đậm đà, độc đáo.',
    image: anhTuan,
    alt: 'Anh Tuấn - Trưởng pha chế',
  },
  {
    name: 'Mai Anh',
    role: 'Nhân viên pha chế',
    desc: 'Luôn phục vụ với nụ cười và niềm đam mê dành cho cà phê.',
    image: maiAnh,
    alt: 'Mai Anh - Nhân viên pha chế',
  },
];

export default function TeamSection() {
  return (
    <section
      className="barista-section section-padding section-bg"
      id="barista-team"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 col-12 text-center mb-4 pb-lg-2">
            <h2 className="text-white">Đội ngũ Coffee Shop</h2>
            <p className="text-white-50">
              Những con người tận tâm mang đến cho bạn ly cà phê hoàn hảo mỗi
              ngày.
            </p>
          </div>

          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="col-lg-3 col-md-6 col-12 mb-4"
            >
              <div className="team-block-wrap">
                <div className="team-block-info d-flex flex-column">
                  <div className="d-flex mt-auto mb-3">
                    <h4 className="text-white mb-0">{member.name}</h4>
                    <p className="badge ms-4">
                      <em>{member.role}</em>
                    </p>
                  </div>
                  <p className="text-white mb-0">{member.desc}</p>
                </div>

                <div className="team-block-image-wrap">
                  <img
                    src={member.image}
                    className="team-block-image img-fluid"
                    alt={member.alt}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}