// src/features/cart/hooks/useCheckout.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { ROUTES } from '@/constants/routes';
import { createOrderAndBill } from '../services/orderService';

export function useCheckout({ cart, total, notes, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const checkout = useCallback(async () => {
    // Validate
    if (cart.length === 0) {
      Swal.fire('Giỏ hàng trống!', 'Vui lòng chọn món trước khi đặt hàng.', 'warning');
      return;
    }

    const selectedTable = JSON.parse(localStorage.getItem('selectedTable') || 'null');
    if (!selectedTable?.id) {
      Swal.fire({
        title: 'Chưa chọn bàn!',
        text: 'Vui lòng chọn bàn trước khi đặt hàng.',
        icon: 'warning',
        confirmButtonColor: '#5c4033',
      });
      navigate(ROUTES.TABLE_SELECT);
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { createdOrder } = await createOrderAndBill({
        selectedTable,
        cart,
        total,
        notes,
      });

      // Xóa giỏ hàng
      onSuccess?.();

      // Thông báo thành công
      await Swal.fire({
        title: '☕ Gửi đơn hàng thành công!',
        html: `
          <b>Bàn:</b> ${selectedTable.tableNumber}<br/>
          <b>Mã đơn:</b> #${createdOrder.id}<br/>
          <b>Tổng tiền:</b> ${total.toLocaleString()} đ<br/>
          ${notes ? `<b>Ghi chú:</b> ${notes}<br/>` : ''}
          <small class="text-muted">Vui lòng chờ nhân viên xác nhận</small>
        `,
        icon: 'success',
        confirmButtonColor: '#5c4033',
        confirmButtonText: 'Xem trạng thái đơn hàng',
      });

      navigate(`/trang-thai-don-hang/${createdOrder.id}`);
    } catch (error) {
      console.error('❌ Lỗi gửi đơn hàng:', error);
      Swal.fire({
        title: 'Lỗi!',
        text:
          error.response?.data?.message ||
          'Không thể gửi đơn hàng. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonColor: '#5c4033',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [cart, total, notes, isProcessing, navigate, onSuccess]);

  return { isProcessing, checkout };
}