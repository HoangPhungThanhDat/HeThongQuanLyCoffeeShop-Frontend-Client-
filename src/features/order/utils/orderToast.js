
import Swal from 'sweetalert2';
import 'animate.css';

const PALETTE = {
  success: { bg: '#f0fff4', border: '#22c55e', text: '#166534' },
  error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
};

export const showToast = (icon, title, message = '') => {
  const colors = PALETTE[icon] || PALETTE.info;

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    text: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: 'ot-toast' },
    showClass: { popup: 'animate__animated animate__slideInRight' },
    hideClass: { popup: 'animate__animated animate__slideOutRight' },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
      toast.style.backgroundColor = colors.bg;
      toast.style.color = colors.text;
      toast.style.borderLeft = `6px solid ${colors.border}`;
      toast.style.boxShadow = `0 4px 12px ${colors.border}40`;
    },
  });
};