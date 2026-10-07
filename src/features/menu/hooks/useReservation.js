
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import socket from '@/lib/socket';
import { ROUTES } from '@/constants/routes';

const RESERVATION_DURATION = 5 * 60 * 1000; // 5 phút
const STORAGE_KEY = 'selectedTable';

/**
 * Hiển thị popup hết hạn (dùng chung)
 */
const showExpiredAlert = (navigate) => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('cart');

  Swal.fire({
    title: '⏰ Hết thời gian giữ bàn!',
    html: `
      <p>Bạn đã không chọn món trong <b>5 phút</b>.</p>
      <p style="color: #ff6b6b; margin-top: 10px;">Bàn đã được trả về trạng thái trống.</p>
      <p style="color: #8a7a6d; font-size: 0.9rem;">Vui lòng chọn lại bàn để tiếp tục.</p>
    `,
    icon: 'warning',
    confirmButtonText: 'Chọn bàn lại',
    confirmButtonColor: '#c8a27a',
    background: '#1a0e08',
    color: '#fff',
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 5000,
    timerProgressBar: true,
  }).then(() => navigate(ROUTES.TABLE_SELECT));
};

export function useReservation() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const expiredRef = useRef(false); // tránh gọi handleExpired nhiều lần

  /* ========== 1. Load từ localStorage ========== */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      Swal.fire({
        title: 'Chưa chọn bàn!',
        text: 'Vui lòng chọn bàn trước khi đặt món.',
        icon: 'warning',
        confirmButtonText: 'Chọn bàn ngay',
        confirmButtonColor: '#c8a27a',
        background: '#1a0e08',
        color: '#fff',
        allowOutsideClick: false,
      }).then(() => navigate(ROUTES.TABLE_SELECT));
      return;
    }

    try {
      const tableData = JSON.parse(stored);

      // Nếu chưa có expiresAt → tạo 5 phút
      if (!tableData.expiresAt) {
        tableData.expiresAt = Date.now() + RESERVATION_DURATION;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tableData));
      }

      setSelectedTable(tableData);

      const remaining = Math.max(
        0,
        Math.floor((tableData.expiresAt - Date.now()) / 1000),
      );
      setCountdown(remaining);

      if (remaining === 0 && !expiredRef.current) {
        expiredRef.current = true;
        showExpiredAlert(navigate);
      }
    } catch (err) {
      console.error('❌ Lỗi parse selectedTable:', err);
      localStorage.removeItem(STORAGE_KEY);
      navigate(ROUTES.TABLE_SELECT);
    }
  }, [navigate]);

  /* ========== 2. Countdown tick ========== */
  useEffect(() => {
    if (!selectedTable?.expiresAt) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((selectedTable.expiresAt - Date.now()) / 1000),
      );
      setCountdown(remaining);

      if (remaining === 0 && !expiredRef.current) {
        expiredRef.current = true;
        showExpiredAlert(navigate);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [selectedTable, navigate]);

  /* ========== 3. Lắng nghe server release ========== */
  useEffect(() => {
    const handleReleased = (data) => {
      const { tableNumber, reason } = data;
      console.log('📥 reservation-released:', data);

      if (
        selectedTable &&
        selectedTable.tableNumber === tableNumber &&
        reason !== 'user-cancelled' &&
        !expiredRef.current
      ) {
        expiredRef.current = true;
        showExpiredAlert(navigate);
      }
    };

    socket.on('table-reservation-released', handleReleased);
    return () => socket.off('table-reservation-released', handleReleased);
  }, [selectedTable, navigate]);

  /* ========== 4. Hủy bàn (user) ========== */
  const cancelReservation = useCallback(() => {
    Swal.fire({
      title: 'Hủy bàn?',
      text: 'Bạn có chắc muốn hủy bàn đã chọn?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Hủy bàn',
      cancelButtonText: 'Ở lại',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#1a0e08',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedTable) {
          socket.emit('release-reservation', {
            tableNumber: selectedTable.tableNumber,
          });
        }
        expiredRef.current = true; // đánh dấu để không hiện popup hết hạn
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('cart');
        navigate(ROUTES.TABLE_SELECT);
      }
    });
  }, [selectedTable, navigate]);

  const isUrgent = countdown > 0 && countdown <= 60;

  return {
    selectedTable,
    countdown,
    isUrgent,
    cancelReservation,
  };
}