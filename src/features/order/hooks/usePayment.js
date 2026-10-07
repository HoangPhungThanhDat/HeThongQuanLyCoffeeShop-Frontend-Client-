
import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

import { API_URL } from '../constants';

/**
 * Xử lý 3 phương thức thanh toán: VNPay, MoMo, Tiền mặt
 */
export function usePayment({ orderDetails, onCallStaff }) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  /* ---------- VNPAY ---------- */
  const payWithVNPay = useCallback(async () => {
    if (isProcessingPayment || !orderDetails) return;
    setIsProcessingPayment(true);

    try {
      Swal.fire({
        title: 'Đang tạo thanh toán...',
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 15px;">💳</div>
            <p style="color: #6b5b4d; font-size: 15px;">Đang kết nối VNPay...</p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(`${API_URL}/payment/create-vnpay-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderDetails.orderNumber,
          amount: orderDetails.total,
          orderInfo: `Thanh toan don hang ${orderDetails.orderNumber} - Ban ${orderDetails.tableNumber}`,
        }),
      });
      const data = await response.json();

      if (data.success && data.paymentUrl) {
        localStorage.setItem(
          'pendingPayment',
          JSON.stringify({
            orderId: orderDetails.orderNumber,
            amount: orderDetails.total,
            timestamp: new Date().toISOString(),
          }),
        );
        Swal.close();
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || 'Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('❌ Lỗi VNPay:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi thanh toán',
        text: error.message || 'Không thể kết nối đến cổng thanh toán',
        confirmButtonText: 'Thử lại',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  }, [orderDetails, isProcessingPayment]);

  /* ---------- MOMO ---------- */
  const payWithMoMo = useCallback(async () => {
    if (isProcessingPayment || !orderDetails) return;
    setIsProcessingPayment(true);

    try {
      Swal.fire({
        title: 'Đang tạo thanh toán MoMo...',
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 64px; margin-bottom: 15px;">
              <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" style="width: 80px; height: 80px; object-fit: contain;" />
            </div>
            <p style="color: #6b5b4d; font-size: 15px; margin-top: 15px;">Đang kết nối ví MoMo...</p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const uniqueOrderId = `${orderDetails.orderNumber}_${Date.now()}`;
      const response = await fetch(`${API_URL}/momo/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: uniqueOrderId,
          amount: orderDetails.total,
          orderInfo: `Thanh_toan_don_hang_${orderDetails.orderNumber}_Ban_${orderDetails.tableNumber}`,
        }),
      });
      const data = await response.json();

      if (data.success && data.paymentUrl) {
        localStorage.setItem(
          'pendingMoMoPayment',
          JSON.stringify({
            orderId: uniqueOrderId,
            originalOrderId: orderDetails.orderNumber,
            amount: orderDetails.total,
            timestamp: new Date().toISOString(),
          }),
        );
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Đã tạo thanh toán!',
          html: `
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
              <p style="font-size: 15px; color: #6b5b4d;">Đang chuyển đến MoMo...</p>
            </div>
          `,
          timer: 1800,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        }).then(() => {
          window.location.href = data.paymentUrl;
        });
      } else {
        throw new Error(data.message || 'Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('❌ Lỗi MoMo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi thanh toán',
        text: error.message || 'Không thể kết nối đến MoMo',
        confirmButtonText: 'Thử lại',
        confirmButtonColor: '#d946b6',
        showCancelButton: true,
        cancelButtonText: 'Đóng',
        cancelButtonColor: '#8a7a6d',
      }).then((r) => {
        if (r.isConfirmed) payWithMoMo();
      });
    } finally {
      setIsProcessingPayment(false);
    }
  }, [orderDetails, isProcessingPayment]);

  /* ---------- TIỀN MẶT ---------- */
  const payWithCash = useCallback(() => {
    if (!orderDetails) return;

    Swal.fire({
      icon: 'info',
      title: '💵 Thanh toán tiền mặt',
      html: `
        <div style="text-align: left;">
          <p>Quý khách vui lòng thanh toán tại quầy.</p>
          <div style="background: #faf7f2; padding: 12px; border-radius: 8px; margin-top: 12px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Bàn:</strong> ${orderDetails.tableNumber}<br/>
              <strong>Tổng tiền:</strong> ${orderDetails.total?.toLocaleString()}₫
            </p>
          </div>
          <p style="margin-top: 12px; font-size: 13px; color: #8a7a6d;">
            Nhân viên sẽ đến bàn để thu tiền và xuất hóa đơn cho bạn.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '📞 Gọi nhân viên',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#8b5e3c',
      cancelButtonColor: '#8a7a6d',
    }).then((result) => {
      if (result.isConfirmed) onCallStaff?.();
    });
  }, [orderDetails, onCallStaff]);

  return {
    isProcessingPayment,
    payWithVNPay,
    payWithMoMo,
    payWithCash,
  };
}