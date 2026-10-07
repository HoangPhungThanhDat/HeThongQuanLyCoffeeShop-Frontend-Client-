// src/features/order/utils/statusHelpers.js

export const STATUS_INDEX_MAP = {
    PENDING: 1,
    CONFIRMED: 2,
    PREPARING: 2,
    READY: 3,
    SERVED: 4,
    SERVING: 4,
    PAID: 5,
    COMPLETED: 5,
    CANCELLED: 0,
  };
  
  export const STATUS_LABEL_MAP = {
    PENDING: 'Đang chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PREPARING: 'Đang chuẩn bị',
    READY: 'Sẵn sàng',
    SERVED: 'Đã phục vụ',
    SERVING: 'Đang phục vụ',
    PAID: 'Đã thanh toán',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  };
  
  export const getStatusIndex = (status) => STATUS_INDEX_MAP[status] || 1;
  
  export const getStatusLabel = (status) => STATUS_LABEL_MAP[status] || status;
  
  export const isPaidStatus = (status) =>
    status === 'PAID' || status === 'COMPLETED';
  
  export const isCancelled = (status) => status === 'CANCELLED';