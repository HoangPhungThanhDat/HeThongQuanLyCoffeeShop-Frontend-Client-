

export const HOLD_DURATION_MS = 5 * 60 * 1000; // 5 phút
export const URGENT_THRESHOLD_SEC = 60; // 60 giây cuối → urgent

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
};

export const TABLE_AREA = {
  WINDOW: 'window',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
};

export const FILTER = {
  ALL: 'all',
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
};

export const SOCKET_EVENTS = {
  // Emit
  GET_HOLDS: 'get-table-holds',
  SELECTING: 'table-selecting',
  RESERVE: 'reserve-table',
  // Listen
  BEING_SELECTED: 'table-being-selected',
  RESERVED: 'table-reserved',
  RELEASED: 'table-released',
  RESERVATION_RELEASED: 'table-reservation-released',
  MY_OLD_TABLE_RELEASED: 'my-old-table-released',
  SELECT_REJECTED: 'table-select-rejected',
  SELECT_CONFIRMED: 'table-select-confirmed',
  HOLDS_SNAPSHOT: 'table-holds-snapshot',
};