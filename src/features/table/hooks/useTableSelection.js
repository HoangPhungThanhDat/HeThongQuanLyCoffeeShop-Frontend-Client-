
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import socket from '@/lib/socket';
import { ROUTES } from '@/constants/routes';
import { HOLD_DURATION_MS, SOCKET_EVENTS } from '../constants';
import { showTableAlert, showSuccessAlert } from '../utils/tableAlert';

export function useTableSelection({ tables, heldTables, reservedTables, myHeldTable }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  /* ---------- Chọn bàn ---------- */
  const selectTable = useCallback(
    (number, status) => {
      // Bàn không available
      if (status !== 'available') {
        showTableAlert(
          'Bàn không khả dụng',
          'Bàn này đã được đặt hoặc đang sử dụng.',
          'info',
        );
        return;
      }

      // Bàn đã reserve bởi người khác
      const reserved = reservedTables[number];
      if (reserved && !reserved.isMine) {
        showTableAlert(
          'Bàn đã được đặt',
          `<p>Bàn <b>${number}</b> đã được xác nhận bởi <b>${reserved.userName}</b>.</p>`,
          'warning',
        );
        return;
      }

      // Bàn đang được giữ bởi người khác
      const held = heldTables[number];
      if (held && !held.isMine) {
        showTableAlert(
          'Bàn đang được giữ',
          `<p>Bàn <b>${number}</b> đang được giữ bởi <b>${held.userName}</b>.</p>`,
          'warning',
        );
        return;
      }

      // Đã chọn chính bàn mình đang giữ
      if (myHeldTable === number) return;

      // Emit chọn bàn
      socket.emit(SOCKET_EVENTS.SELECTING, {
        tableNumber: number,
        userName: 'Khách',
      });

      setSelectedTable(number);
    },
    [heldTables, reservedTables, myHeldTable],
  );

  /* ---------- Xác nhận bàn ---------- */
  const confirmTable = useCallback(async () => {
    if (!selectedTable) {
      showTableAlert(
        'Chưa chọn bàn!',
        'Vui lòng chọn bàn trước khi tiếp tục.',
        'warning',
      );
      return;
    }

    const selectedTableData = tables.find((t) => t.number === selectedTable);
    if (!selectedTableData) return;

    // Emit reserve
    socket.emit(SOCKET_EVENTS.RESERVE, {
      tableNumber: selectedTable,
      userName: 'Khách',
    });

    // Lưu localStorage
    const expiresAt = Date.now() + HOLD_DURATION_MS;
    localStorage.setItem(
      'selectedTable',
      JSON.stringify({
        id: selectedTableData.id,
        tableNumber: selectedTableData.number,
        seats: selectedTableData.seats,
        time: new Date().toISOString(),
        expiresAt,
      }),
    );

    await showSuccessAlert(
      'Chọn bàn thành công! ☕',
      `
        <p style="font-size: 1.1rem;"><b>Bàn số:</b> ${selectedTable}</p>
        <p style="color: #8a7a6d;">Sức chứa: ${selectedTableData.seats} người</p>
        <p style="color: #ffb300; font-size: 0.9rem; margin-top: 10px;">
          ⏰ Bạn có <b>5 phút</b> để chọn món
        </p>
      `,
    );

    navigate(ROUTES.MENU_ORDER);
  }, [selectedTable, tables, navigate]);

  /* ---------- Set selected (dùng cho socket confirm) ---------- */
  const syncSelectedFromHold = useCallback((tableNumber) => {
    setSelectedTable(tableNumber);
  }, []);

  return {
    selectedTable,
    setSelectedTable,
    syncSelectedFromHold,
    selectTable,
    confirmTable,
  };
}