
import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

import socket from '@/lib/socket';
import { showToast } from '../utils/orderToast';

/**
 * Hủy đơn + Gọi nhân viên
 */
export function useOrderActions({ orderDetails, isConnected }) {
  const [isCallingStaff, setIsCallingStaff] = useState(false);

  /* ---------- HỦY ĐƠN ---------- */
  const cancelOrder = useCallback(() => {
    if (!orderDetails) return;

    Swal.fire({
      icon: 'warning',
      title: 'Xác nhận hủy đơn?',
      html: `
        <p style="color: #6b5b4d;">Bạn có chắc chắn muốn hủy đơn hàng <strong>#${orderDetails.orderNumber}</strong>?</p>
        <div style="background: #fffaf0; border-left: 4px solid #ffb300; padding: 12px; border-radius: 8px; margin-top: 15px; text-align: left;">
          <p style="color: #cc8f00; margin: 0; font-size: 13px;">
            ⚠️ <strong>Lưu ý:</strong> Đơn hàng đang pha chế không thể hoàn tiền
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận hủy',
      cancelButtonText: 'Quay lại',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#8a7a6d',
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit('cancel-order', {
          orderId: orderDetails.orderNumber,
          reason: 'Khách hàng yêu cầu hủy',
        });
        showToast('info', 'Đã gửi yêu cầu hủy đơn', 'Vui lòng đợi nhân viên xác nhận');
      }
    });
  }, [orderDetails]);

  /* ---------- GỌI NHÂN VIÊN ---------- */
  const callStaff = useCallback(() => {
    if (!isConnected) {
      showToast('error', 'Không có kết nối', 'Vui lòng kiểm tra kết nối mạng');
      return;
    }
    if (!orderDetails) return;

    Swal.fire({
      title: '🔔 Gọi nhân viên',
      html: `
        <div style="text-align: left; padding: 5px;">
          <div style="background: linear-gradient(135deg, #faf7f2, #f5efe6); padding: 16px; border-radius: 12px; margin-bottom: 15px; border: 1px solid rgba(200,162,122,0.3);">
            <p style="margin: 0; font-size: 12px; color: #8a7a6d; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Bàn số</p>
            <p style="margin: 6px 0 0 0; font-size: 24px; font-weight: 800; color: #8b5e3c;">
              🪑 ${orderDetails.tableNumber}
            </p>
          </div>
          <p style="color: #6b5b4d; font-size: 14px; margin: 0;">
            Chúng tôi sẽ thông báo cho nhân viên đến hỗ trợ bạn ngay.
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '📞 Gọi ngay',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#8b5e3c',
      cancelButtonColor: '#8a7a6d',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsCallingStaff(true);

        socket.emit('call-staff', {
          tableNumber: orderDetails.tableNumber,
          orderId: orderDetails.orderNumber,
          customerName:
            orderDetails.customerName ||
            `Khách bàn ${orderDetails.tableNumber}`,
          message: 'Khách hàng yêu cầu hỗ trợ',
          timestamp: new Date().toISOString(),
        });

        Swal.fire({
          title: 'Đang gọi nhân viên...',
          html: `
            <div style="text-align: center; padding: 20px;">
              <div style="font-size: 48px; margin-bottom: 15px;">📡</div>
              <p style="color: #6b5b4d; font-size: 15px; margin: 0;">
                Đang gửi thông báo đến nhân viên...
              </p>
            </div>
          `,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Đã gọi nhân viên!',
            html: `
              <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                <p style="font-size: 15px; color: #6b5b4d; margin-bottom: 8px;">
                  Thông báo đã được gửi
                </p>
                <p style="font-size: 14px; color: #00a843; font-weight: 800; margin: 0;">
                  🪑 Bàn ${orderDetails.tableNumber}
                </p>
              </div>
            `,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => setIsCallingStaff(false), 3000);
        });
      }
    });
  }, [orderDetails, isConnected]);

  return {
    isCallingStaff,
    cancelOrder,
    callStaff,
  };
}