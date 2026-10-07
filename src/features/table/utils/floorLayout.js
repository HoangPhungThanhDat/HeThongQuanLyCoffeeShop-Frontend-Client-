
import { TABLE_AREA } from '../constants';

const WINDOW_SHAPES = [
  { shape: 'round', seats: 2 },
  { shape: 'round', seats: 4 },
  { shape: 'round', seats: 2 },
  { shape: 'square', seats: 4 },
];

const MIDDLE_SHAPES = [
  { shape: 'square', seats: 4 },
  { shape: 'rect', seats: 6 },
  { shape: 'square', seats: 4 },
  { shape: 'rect', seats: 8 },
];

const BOTTOM_SHAPES = [
  { shape: 'round', seats: 2 },
  { shape: 'square', seats: 4 },
  { shape: 'round', seats: 4 },
  { shape: 'square', seats: 6 },
];

/**
 * Sinh layout bàn theo số lượng
 */
export function generateFloorLayout(totalTables) {
  if (!totalTables || totalTables <= 0) return [];

  const windowCount = Math.ceil(totalTables * 0.4);
  const middleCount = Math.ceil(totalTables * 0.3);
  const bottomCount = totalTables - windowCount - middleCount;

  const layout = [];
  let number = 1;

  for (let i = 0; i < windowCount; i++) {
    layout.push({
      number: number++,
      ...WINDOW_SHAPES[i % WINDOW_SHAPES.length],
      area: TABLE_AREA.WINDOW,
    });
  }
  for (let i = 0; i < middleCount; i++) {
    layout.push({
      number: number++,
      ...MIDDLE_SHAPES[i % MIDDLE_SHAPES.length],
      area: TABLE_AREA.MIDDLE,
    });
  }
  for (let i = 0; i < bottomCount; i++) {
    layout.push({
      number: number++,
      ...BOTTOM_SHAPES[i % BOTTOM_SHAPES.length],
      area: TABLE_AREA.BOTTOM,
    });
  }

  return layout;
}

/**
 * Merge layout với data từ API
 */
export function mergeTablesWithAPI(layout, tablesData) {
  const apiMap = new Map();
  tablesData.forEach((t) => {
    const num = t.number || t.tableNumber;
    if (num) apiMap.set(num, t);
  });

  return layout.map((config) => {
    const apiTable = apiMap.get(config.number);
    return {
      ...config,
      seats: apiTable?.capacity || apiTable?.seats || config.seats,
      id: apiTable?.id,
      status: normalizeStatus(apiTable?.status),
    };
  });
}

/**
 * Normalize status từ API
 */
export function normalizeStatus(status) {
  if (!status) return 'available';
  const s = String(status).toUpperCase();
  if (s === 'FREE') return 'available';
  if (s === 'OCCUPIED') return 'occupied';
  if (s === 'RESERVED') return 'reserved';
  return 'available';
}