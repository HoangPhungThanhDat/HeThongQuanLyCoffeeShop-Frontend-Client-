// src/features/contact/ContactPage.jsx
import { useState } from 'react';

const INITIAL_FORM = { name: '', email: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(INITIAL_FORM);

    // Reset thông báo sau 3 giây
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="contact-section section-padding" id="section_5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12">
            <em className="text-white">Liên hệ với chúng tôi</em>
            <h2 className="text-white mb-4 pb-lg-2">Thông tin liên hệ</h2>
          </div>

          {/* ============ FORM ============ */}
          <div className="col-lg-6 col-12">
            <form
              onSubmit={handleSubmit}
              className="custom-form contact-form"
              role="form"
            >
              <div className="row">
                <div className="col-lg-6 col-12">
                  <label htmlFor="name" className="form-label">
                    Họ và tên <sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-lg-6 col-12">
                  <label htmlFor="email" className="form-label">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    pattern="[^ @]*@[^ @]*"
                    className="form-control"
                    placeholder="nguyenvana@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="message" className="form-label">
                    Chúng tôi có thể giúp gì cho bạn?
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className="form-control"
                    id="message"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-5 col-12 mx-auto mt-3">
                <button type="submit" className="form-control">
                  Gửi tin nhắn
                </button>
              </div>

              {/* Thông báo thành công */}
              {submitted && (
                <div
                  className="alert alert-success mt-3 text-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.
                </div>
              )}
            </form>
          </div>

          {/* ============ GOOGLE MAP ============ */}
          <div className="col-lg-6 col-12 mx-auto mt-5 mt-lg-0 ps-lg-5">
            <iframe
              className="google-map"
              title="Bản đồ Coffee Shop"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.498337877892!2d106.69299531474858!3d10.77338229232264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3e0b9b5d91%3A0x7d5f8f8b8b8b8b8b!2zMTIzIE5ndXnhu4VuIFRyw6NpLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}