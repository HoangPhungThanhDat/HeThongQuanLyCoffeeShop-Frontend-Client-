

/**
 * Format giây thành mm:ss
 */
export function formatCountdown(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  
  /**
   * Tính số giây còn lại
   */
  export function getRemainingSeconds(expiresAt) {
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  }
  
  /**
   * Đếm số bàn theo status
   */
  export function countTablesByStatus(tables) {
    let available = 0;
    let occupied = 0;
    let reserved = 0;
  
    for (const t of tables) {
      if (t.status === 'available') available++;
      else if (t.status === 'occupied') occupied++;
      else if (t.status === 'reserved') reserved++;
    }
  
    return { available, occupied, reserved };
  }
  
  /**
   * Nhóm bàn theo khu vực + filter
   */
  export function groupTablesByArea(tables, filter) {
    const filterFn = (t) => filter === 'all' || t.status === filter;
    const result = { window: [], middle: [], bottom: [] };
  
    for (const t of tables) {
      if (!filterFn(t)) continue;
      if (result[t.area]) result[t.area].push(t);
    }
  
    return result;
  }