
import { API_URL } from '../constants';

const STORAGE_KEY = 'currentOrder';

/**
 * Đọc order từ localStorage
 */
export const readOrderFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.items || !Array.isArray(parsed.items)) parsed.items = [];
    if (!parsed.orderNumber) throw new Error('Thiếu mã đơn hàng');
    return parsed;
  } catch (err) {
    console.error('Parse order error:', err);
    return null;
  }
};

/**
 * Ghi order vào localStorage
 */
export const saveOrderToStorage = (order) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch (err) {
    console.warn('Save order error:', err);
  }
};

/**
 * Xóa order khỏi localStorage
 */
export const clearOrderStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Fetch order mới nhất từ server
 */
export const fetchLatestOrder = async (orderNumber) => {
  try {
    const res = await fetch(`${API_URL}/orders/${orderNumber}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fetch order error:', err);
    return null;
  }
};