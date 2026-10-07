
import { useState, useEffect, useCallback } from 'react';
import socket from '@/lib/socket';
import { SOCKET_EVENTS } from '../constants';
import { showRejectedAlert } from '../utils/tableAlert';

/**
 * Quản lý holds/reserved tables qua socket
 */
export function useTableHolds(mySocketId) {
  const [heldTables, setHeldTables] = useState({});
  const [reservedTables, setReservedTables] = useState({});
  const [myHeldTable, setMyHeldTable] = useState(null);

  /* ============ SOCKET LISTENERS ============ */
  useEffect(() => {
    if (!mySocketId) return;

    /* ---------- Bàn đang được chọn (hold) ---------- */
    const handleBeingSelected = (data) => {
      const { tableNumber, userName, expiresAt, socketId } = data;
      const isMine = socketId === mySocketId;

      setHeldTables((prev) => ({
        ...prev,
        [tableNumber]: { userName, expiresAt, socketId, isMine },
      }));

      // Xóa khỏi reserved
      setReservedTables((prev) => {
        const next = { ...prev };
        delete next[tableNumber];
        return next;
      });

      if (isMine) setMyHeldTable(tableNumber);
    };

    /* ---------- Bàn được reserve (5 phút) ---------- */
    const handleTableReserved = (data) => {
      const { tableNumber, userName, expiresAt, socketId } = data;
      const isMine = socketId === mySocketId;

      setReservedTables((prev) => ({
        ...prev,
        [tableNumber]: {
          userName,
          expiresAt,
          socketId,
          isMine,
          isReserved: true,
        },
      }));

      setHeldTables((prev) => {
        const next = { ...prev };
        delete next[tableNumber];
        return next;
      });
    };

    /* ---------- Bàn được release ---------- */
    const handleReleased = (data) => {
      const { tableNumber, previousSocketId } = data;

      setHeldTables((prev) => {
        const next = { ...prev };
        delete next[tableNumber];
        return next;
      });

      if (previousSocketId === mySocketId) {
        setMyHeldTable((prevMyTable) =>
          prevMyTable === tableNumber ? null : prevMyTable,
        );
      }
    };

    /* ---------- Reservation được release ---------- */
    const handleReservationReleased = (data) => {
      const { tableNumber } = data;

      setReservedTables((prev) => {
        const next = { ...prev };
        delete next[tableNumber];
        return next;
      });

      setHeldTables((prev) => {
        const next = { ...prev };
        delete next[tableNumber];
        return next;
      });
    };

    /* ---------- Bàn cũ được release (khi đổi bàn) ---------- */
    const handleMyOldTableReleased = (data) => {
      const { oldTableNumber } = data;
      setHeldTables((prev) => {
        const next = { ...prev };
        delete next[oldTableNumber];
        return next;
      });
    };

    /* ---------- Bị từ chối ---------- */
    const handleRejected = (data) => {
      const { tableNumber, heldBy, expiresAt } = data;
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000),
      );
      showRejectedAlert(tableNumber, heldBy, remaining);
    };

    /* ---------- Xác nhận chọn bàn ---------- */
    const handleConfirmed = (data) => {
      const { tableNumber } = data;
      setMyHeldTable(tableNumber);
    };

    /* ---------- Snapshot ban đầu ---------- */
    const handleSnapshot = (data) => {
      const { holds = [], reservations: resList = [] } = data;

      const holdsMap = {};
      let myTable = null;

      holds.forEach((hold) => {
        const isMine = hold.socketId === mySocketId;
        holdsMap[hold.tableNumber] = {
          userName: hold.userName,
          expiresAt: hold.expiresAt,
          socketId: hold.socketId,
          isMine,
        };
        if (isMine) myTable = hold.tableNumber;
      });

      const resMap = {};
      resList.forEach((res) => {
        resMap[res.tableNumber] = {
          userName: res.userName,
          expiresAt: res.expiresAt,
          socketId: res.socketId,
          isMine: res.socketId === mySocketId,
          isReserved: true,
        };
      });

      setHeldTables(holdsMap);
      setReservedTables(resMap);
      if (myTable) setMyHeldTable(myTable);
    };

    /* ---------- Đăng ký ---------- */
    socket.on(SOCKET_EVENTS.BEING_SELECTED, handleBeingSelected);
    socket.on(SOCKET_EVENTS.RESERVED, handleTableReserved);
    socket.on(SOCKET_EVENTS.RELEASED, handleReleased);
    socket.on(SOCKET_EVENTS.RESERVATION_RELEASED, handleReservationReleased);
    socket.on(SOCKET_EVENTS.MY_OLD_TABLE_RELEASED, handleMyOldTableReleased);
    socket.on(SOCKET_EVENTS.SELECT_REJECTED, handleRejected);
    socket.on(SOCKET_EVENTS.SELECT_CONFIRMED, handleConfirmed);
    socket.on(SOCKET_EVENTS.HOLDS_SNAPSHOT, handleSnapshot);

    return () => {
      socket.off(SOCKET_EVENTS.BEING_SELECTED, handleBeingSelected);
      socket.off(SOCKET_EVENTS.RESERVED, handleTableReserved);
      socket.off(SOCKET_EVENTS.RELEASED, handleReleased);
      socket.off(SOCKET_EVENTS.RESERVATION_RELEASED, handleReservationReleased);
      socket.off(SOCKET_EVENTS.MY_OLD_TABLE_RELEASED, handleMyOldTableReleased);
      socket.off(SOCKET_EVENTS.SELECT_REJECTED, handleRejected);
      socket.off(SOCKET_EVENTS.SELECT_CONFIRMED, handleConfirmed);
      socket.off(SOCKET_EVENTS.HOLDS_SNAPSHOT, handleSnapshot);
    };
  }, [mySocketId]);

  /* ============ HELPERS ============ */
  const getHoldInfo = useCallback(
    (tableNumber) => {
      return reservedTables[tableNumber] || heldTables[tableNumber];
    },
    [heldTables, reservedTables],
  );

  return {
    heldTables,
    reservedTables,
    myHeldTable,
    getHoldInfo,
  };
}