// src/features/payment/PaymentResultPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Home,
  Receipt,
  Coffee,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Clock,
  CreditCard,
  CheckCheck,
} from 'lucide-react';

import { ROUTES } from '@/constants/routes';

// ✅ Đọc API URL từ .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [backendResult, setBackendResult] = useState(null);

  useEffect(() => {
    checkPaymentResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPaymentResult = async () => {
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const vnp_Amount = searchParams.get('vnp_Amount');
    const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
    const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
    const vnp_PayDate = searchParams.get('vnp_PayDate');
    const vnp_SecureHash = searchParams.get('vnp_SecureHash');

    console.log('📥 VNPay callback params:', {
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_SecureHash,
    });

    const orderId = vnp_TxnRef ? vnp_TxnRef.split('_')[0] : null;

    if (vnp_ResponseCode === '00') {
      setPaymentStatus('success');
      setPaymentInfo({
        orderId,
        amount: parseInt(vnp_Amount) / 100,
        transactionNo: vnp_TransactionNo,
        payDate: vnp_PayDate,
        orderInfo: vnp_OrderInfo,
      });
      localStorage.removeItem('pendingPayment');

      setTimeout(() => setShowConfetti(true), 500);
      setTimeout(() => setShowConfetti(false), 4000);

      // ✅ Gọi BACKEND xác nhận thanh toán (gọi endpoint notify-success)
      try {
        const currentOrder = JSON.parse(
          localStorage.getItem('currentOrder') || '{}'
        );

        console.log('\n💳 ==========================================');
        console.log('💳 GỬI YÊU CẦU CẬP NHẬT THANH TOÁN');
        console.log('💳 ==========================================');
        console.log(`   - Order ID: ${orderId}`);
        console.log(`   - Table: ${currentOrder.tableNumber}`);
        console.log(`   - Amount: ${parseInt(vnp_Amount) / 100}₫`);
        console.log('==========================================\n');

        const response = await fetch(`${API_URL}/payment/notify-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            tableNumber: currentOrder.tableNumber,
            amount: parseInt(vnp_Amount) / 100,
            paymentMethod: 'VNPay',
            transactionNo: vnp_TransactionNo,
            timestamp: new Date().toISOString(),
          }),
        });

        const result = await response.json();
        setBackendResult(result);

        if (result.success) {
          console.log('✅ Backend xử lý thanh toán thành công');
          console.log(`   - Order Status: ${result.orderStatus}`);
          console.log(`   - Bill Updated: ${result.billUpdated}`);
        } else {
          console.error('❌ Backend xử lý thất bại:', result.message);
        }
      } catch (error) {
        console.error('❌ Lỗi khi gọi backend:', error);
      }
    } else {
      setPaymentStatus('failed');
      setPaymentInfo({
        orderId,
        responseCode: vnp_ResponseCode,
        orderInfo: vnp_OrderInfo,
      });
    }
  };

  const getErrorMessage = (code) => {
    const errors = {
      '07': 'Giao dịch bị nghi ngờ gian lận',
      '09': 'Thẻ chưa đăng ký Internet Banking',
      10: 'Xác thực thông tin thẻ không đúng',
      11: 'Quá thời gian thanh toán',
      12: 'Thẻ bị khóa',
      13: 'Sai mật khẩu OTP',
      24: 'Giao dịch bị hủy',
      51: 'Tài khoản không đủ số dư',
      65: 'Vượt quá giới hạn giao dịch',
      75: 'Ngân hàng đang bảo trì',
      79: 'Giao dịch vượt quá số lần nhập sai mật khẩu',
      99: 'Lỗi không xác định',
    };
    return errors[code] || 'Đã có lỗi xảy ra, vui lòng thử lại';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  // ============ LOADING ============
  if (paymentStatus === 'checking') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #8B4513 0%, #6F4E37 50%, #3E2723 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <style>{`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes steam {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
            50% { transform: translateY(-30px) translateX(10px) scale(1.2); opacity: 0.3; }
            100% { transform: translateY(-60px) translateX(-10px) scale(1.5); opacity: 0; }
          }
        `}</style>

        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              left: '50%',
              bottom: '40%',
              animation: `steam 3s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
              filter: 'blur(10px)',
            }}
          />
        ))}

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 30px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                border: '4px solid rgba(255,255,255,0.3)',
                borderTop: '4px solid #D4A574',
                borderRadius: '50%',
                animation: 'rotate 1s linear infinite',
              }}
            />
            <Coffee
              size={50}
              color="#D4A574"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'bounce 1s ease-in-out infinite',
              }}
            />
          </div>

          <h2
            style={{
              fontSize: '28px',
              color: '#D4A574',
              fontWeight: '700',
              marginBottom: '10px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Đang xử lý thanh toán
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(212, 165, 116, 0.8)' }}>
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </div>
    );
  }

  // ============ MAIN ============
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          paymentStatus === 'success'
            ? 'linear-gradient(135deg, #8B4513 0%, #6F4E37 50%, #3E2723 100%)'
            : 'linear-gradient(135deg, #D32F2F 0%, #C62828 50%, #B71C1C 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .btn-modern {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .btn-modern:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .btn-modern:active { transform: translateY(-1px); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-5px); }
      `}</style>

      {/* Confetti */}
      {showConfetti && paymentStatus === 'success' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
                background: [
                  '#8B4513',
                  '#6F4E37',
                  '#D4A574',
                  '#A0826D',
                  '#C19A6B',
                  '#DEB887',
                ][i % 6],
                left: `${Math.random() * 100}%`,
                top: '-50px',
                borderRadius: Math.random() > 0.3 ? '50%' : '40% 60%',
                animation: `confettiFall ${3 + Math.random() * 2}s linear`,
                animationDelay: `${Math.random() * 0.5}s`,
                opacity: 0.9,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
      )}

      {/* Floating coffee beans */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${40 + Math.random() * 80}px`,
              height: `${40 + Math.random() * 80}px`,
              background: '#D4A574',
              borderRadius: Math.random() > 0.5 ? '50%' : '40% 60%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1.2fr' : '1fr',
          gap: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* LEFT — Status card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #FFF8E7 0%, #FFEFD5 100%)',
            borderRadius: '30px',
            padding: '50px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            textAlign: 'center',
            animation: 'scaleUp 0.6s ease-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '3px solid rgba(139, 69, 19, 0.2)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background:
                paymentStatus === 'success'
                  ? 'radial-gradient(circle, rgba(139, 69, 19, 0.15), transparent)'
                  : 'radial-gradient(circle, rgba(211, 47, 47, 0.15), transparent)',
              borderRadius: '50%',
            }}
          />

          {/* Status icon */}
          <div
            style={{
              width: '140px',
              height: '140px',
              margin: '0 auto 30px',
              position: 'relative',
              animation:
                'scaleUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background:
                  paymentStatus === 'success'
                    ? 'linear-gradient(135deg, #8B4513 0%, #6F4E37 100%)'
                    : 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  paymentStatus === 'success'
                    ? '0 15px 40px rgba(139, 69, 19, 0.5)'
                    : '0 15px 40px rgba(211, 47, 47, 0.5)',
                position: 'relative',
                border: '4px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {paymentStatus === 'success' ? (
                <CheckCircle size={80} color="#FFF8E7" strokeWidth={2.5} />
              ) : (
                <XCircle size={80} color="white" strokeWidth={2.5} />
              )}

              {paymentStatus === 'success' && (
                <>
                  <Sparkles
                    size={30}
                    color="#D4A574"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      animation: 'float 2s ease-in-out infinite',
                    }}
                  />
                  <Sparkles
                    size={25}
                    color="#D4A574"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      animation: 'float 2s ease-in-out infinite',
                      animationDelay: '0.5s',
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Text */}
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '800',
              background:
                paymentStatus === 'success'
                  ? 'linear-gradient(135deg, #8B4513 0%, #6F4E37 100%)'
                  : 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '15px',
              animation: 'fadeInUp 0.8s ease-out 0.3s both',
            }}
          >
            {paymentStatus === 'success' ? 'Thành công!' : 'Thất bại!'}
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#6F4E37',
              lineHeight: '1.6',
              marginBottom: '30px',
              animation: 'fadeInUp 0.8s ease-out 0.4s both',
              fontWeight: '500',
            }}
          >
            {paymentStatus === 'success'
              ? 'Thanh toán thành công! Cảm ơn bạn đã ghé thưởng thức cà phê tại Coffee Shop.'
              : 'Giao dịch không thể hoàn tất. Vui lòng kiểm tra lại thông tin và thử lại.'}
          </p>

          {/* Order ID badge */}
          {paymentInfo && (
            <div
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background:
                  paymentStatus === 'success'
                    ? 'linear-gradient(135deg, #8B4513 0%, #6F4E37 100%)'
                    : 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                borderRadius: '50px',
                color: '#FFF8E7',
                fontWeight: '700',
                fontSize: '14px',
                margin: '0 auto',
                animation: 'fadeInUp 0.8s ease-out 0.5s both',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Receipt
                size={16}
                style={{
                  display: 'inline',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                }}
              />
              Đơn hàng #{paymentInfo.orderId}
            </div>
          )}
        </div>

        {/* RIGHT — Payment details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {paymentInfo && paymentStatus === 'success' ? (
            <>
              {/* Amount card */}
              <div
                className="card-hover"
                style={{
                  background:
                    'linear-gradient(145deg, #FFF8E7 0%, #FFEFD5 100%)',
                  borderRadius: '25px',
                  padding: '35px',
                  boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                  animation: 'slideRight 0.6s ease-out 0.2s both',
                  border: '3px solid rgba(139, 69, 19, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#8B4513',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Tổng thanh toán
                  </div>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background:
                        'linear-gradient(135deg, #8B4513 0%, #6F4E37 100%)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 5px 15px rgba(139, 69, 19, 0.4)',
                    }}
                  >
                    <CreditCard size={24} color="#FFF8E7" />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    background:
                      'linear-gradient(135deg, #8B4513 0%, #6F4E37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-1px',
                  }}
                >
                  {paymentInfo.amount.toLocaleString('vi-VN')}₫
                </div>
              </div>

              {/* Transaction details */}
              <div
                className="card-hover"
                style={{
                  background:
                    'linear-gradient(145deg, #FFF8E7 0%, #FFEFD5 100%)',
                  borderRadius: '25px',
                  padding: '30px',
                  boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                  animation: 'slideRight 0.6s ease-out 0.3s both',
                  border: '3px solid rgba(139, 69, 19, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#6F4E37',
                    marginBottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <CheckCheck size={22} color="#8B4513" />
                  Chi tiết giao dịch
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '15px',
                      borderBottom: '2px dashed rgba(139, 69, 19, 0.2)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8B4513',
                          marginBottom: '5px',
                          fontWeight: '600',
                        }}
                      >
                        Mã giao dịch
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#6F4E37',
                          fontFamily: 'monospace',
                        }}
                      >
                        {paymentInfo.transactionNo}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background:
                          'linear-gradient(135deg, #D4A574, #C19A6B)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      🔐
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8B4513',
                          marginBottom: '5px',
                          fontWeight: '600',
                        }}
                      >
                        Thời gian thanh toán
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#6F4E37',
                        }}
                      >
                        {formatDate(paymentInfo.payDate)}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background:
                          'linear-gradient(135deg, #D4A574, #C19A6B)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Clock size={20} color="#6F4E37" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : paymentInfo && paymentStatus === 'failed' ? (
            <div
              className="card-hover"
              style={{
                background: 'linear-gradient(145deg, #FFEBEE 0%, #FFCDD2 100%)',
                borderRadius: '25px',
                padding: '35px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                animation: 'slideRight 0.6s ease-out 0.2s both',
                border: '3px solid rgba(211, 47, 47, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #EF5350, #E53935)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle size={28} color="white" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#C62828',
                      marginBottom: '10px',
                    }}
                  >
                    Lý do thất bại
                  </h3>
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#B71C1C',
                      lineHeight: '1.6',
                      fontWeight: '500',
                    }}
                  >
                    {getErrorMessage(paymentInfo.responseCode)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              animation: 'fadeInUp 0.8s ease-out 0.6s both',
            }}
          >
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="btn-modern"
              style={{
                padding: '18px',
                background:
                  'linear-gradient(145deg, #FFF8E7 0%, #FFEFD5 100%)',
                border: '3px solid rgba(139, 69, 19, 0.3)',
                borderRadius: '18px',
                color: '#6F4E37',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
              }}
            >
              <Home size={20} />
              Trang chủ
            </button>

            <button
              onClick={() =>
                navigate(`/trang-thai-don-hang/${paymentInfo?.orderId}`)
              }
              className="btn-modern"
              style={{
                padding: '18px',
                background:
                  paymentStatus === 'success'
                    ? 'linear-gradient(135deg, #8B4513 0%, #6F4E37 100%)'
                    : 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                border: 'none',
                borderRadius: '18px',
                color: '#FFF8E7',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow:
                  paymentStatus === 'success'
                    ? '0 8px 20px rgba(139, 69, 19, 0.5)'
                    : '0 8px 20px rgba(211, 47, 47, 0.5)',
              }}
            >
              Xem đơn hàng
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Thank you */}
          {paymentStatus === 'success' && (
            <div
              style={{
                background:
                  'linear-gradient(145deg, #FFF8E7 0%, #FFEFD5 100%)',
                borderRadius: '20px',
                padding: '25px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                animation: 'fadeInUp 0.8s ease-out 0.7s both',
                border: '3px dashed #D4A574',
              }}
            >
              <div
                style={{
                  fontSize: '40px',
                  marginBottom: '10px',
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
                }}
              >
                ☕
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: '#6F4E37',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                Cảm ơn bạn đã tin tưởng Coffee Shop!
                <br />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8B4513',
                  }}
                >
                  Hẹn gặp lại bạn ☕️
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}