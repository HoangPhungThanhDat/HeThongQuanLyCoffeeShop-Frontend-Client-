
import Swal from 'sweetalert2';

const COMMON = {
  confirmButtonColor: '#c8a27a',
  background: '#1a0e08',
  color: '#fff',
};

export const showTableAlert = (title, html, icon = 'info') => {
  return Swal.fire({
    title,
    html,
    icon,
    confirmButtonText: 'Đã hiểu',
    ...COMMON,
  });
};

export const showErrorAlert = (text = 'Không thể tải danh sách bàn.') => {
  return Swal.fire({
    title: 'Lỗi!',
    text,
    icon: 'error',
    ...COMMON,
  });
};

export const showSuccessAlert = (title, html) => {
  return Swal.fire({
    title,
    html,
    icon: 'success',
    confirmButtonText: 'Chọn món 🍰',
    confirmButtonColor: '#5c4033',
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showRejectedAlert = (tableNumber, heldBy, remainingSec) => {
  return Swal.fire({
    title: 'Bàn đang được giữ',
    html: `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🔒</div>
        <p style="font-size: 1rem;">Bàn <b>${tableNumber}</b> đang được giữ bởi <b>${heldBy}</b>.</p>
        <p style="color: #c8a27a; font-size: 0.85rem; margin-top: 8px;">
          Còn <b>${formatCountdownLocal(remainingSec)}</b> trước khi hết hạn
        </p>
      </div>
    `,
    icon: 'warning',
    confirmButtonText: 'Chọn bàn khác',
    ...COMMON,
  });
};

/* Helper inline */
function formatCountdownLocal(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}