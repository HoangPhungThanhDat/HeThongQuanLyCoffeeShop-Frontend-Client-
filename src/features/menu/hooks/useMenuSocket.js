
import { useState, useEffect } from 'react';
import socket from '@/lib/socket';

/**
 * Lắng nghe sự kiện "self-adding-to-cart" để hiện badge "Đang thêm"
 */
export function useAddingStatus() {
  const [addingStatus, setAddingStatus] = useState({});

  useEffect(() => {
    const handler = (data) => {
      setAddingStatus((prev) => ({ ...prev, [data.productId]: true }));

      setTimeout(() => {
        setAddingStatus((prev) => {
          const next = { ...prev };
          delete next[data.productId];
          return next;
        });
      }, 2000);
    };

    socket.on('self-adding-to-cart', handler);
    return () => socket.off('self-adding-to-cart', handler);
  }, []);

  return addingStatus;
}