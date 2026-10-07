// src/features/cart/hooks/useViewOrderStatus.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export function useViewOrderStatus() {
  const navigate = useNavigate();

  const viewOrderStatus = useCallback(() => {
    const raw = localStorage.getItem('currentOrder');
    if (!raw) {
      Swal.fire({
        title: 'Chưa có đơn hàng!',
        text: 'Bạn chưa có đơn hàng nào đang xử lý.',
        icon: 'info',
        confirmButtonColor: '#5c4033',
      });
      return;
    }

    try {
      const orderData = JSON.parse(raw);
      navigate(`/trang-thai-don-hang/${orderData.orderNumber}`);
    } catch (err) {
      console.error('Lỗi parse currentOrder:', err);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể đọc thông tin đơn hàng.',
        icon: 'error',
        confirmButtonColor: '#5c4033',
      });
    }
  }, [navigate]);

  return { viewOrderStatus };
}