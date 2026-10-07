
import { useState, useEffect } from 'react';
import { getRemainingSeconds } from '../utils/statusHelpers';

/**
 * Đếm ngược từ expiresAt
 * @param {number|null} expiresAt - timestamp hết hạn (ms)
 * @returns {number} số giây còn lại
 */
export function useCountdown(expiresAt) {
  const [countdown, setCountdown] = useState(() =>
    expiresAt ? getRemainingSeconds(expiresAt) : 0,
  );

  useEffect(() => {
    if (!expiresAt) {
      setCountdown(0);
      return;
    }

    // Update ngay lập tức
    setCountdown(getRemainingSeconds(expiresAt));

    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(expiresAt);
      setCountdown(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return countdown;
}