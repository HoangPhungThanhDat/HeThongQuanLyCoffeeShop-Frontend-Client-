// src/features/order/constants.js
import {
    CheckCircle,
    Coffee,
    Package,
    ChefHat,
    Check,
  } from 'lucide-react';
  
  export const TIMELINE_STEPS = [
    {
      id: 1,
      label: 'Đã nhận',
      icon: CheckCircle,
      desc: 'Đơn hàng đã được tiếp nhận',
      usesOrderTime: true,
    },
    {
      id: 2,
      label: 'Đang pha chế',
      icon: Coffee,
      desc: 'Barista đang chuẩn bị đồ uống của bạn',
    },
    {
      id: 3,
      label: 'Sẵn sàng',
      icon: Package,
      desc: 'Đơn hàng đã hoàn thành, chờ phục vụ',
    },
    {
      id: 4,
      label: 'Đang phục vụ',
      icon: ChefHat,
      desc: 'Nhân viên đang mang đến bàn của bạn',
    },
    {
      id: 5,
      label: 'Hoàn thành',
      icon: Check,
      desc: 'Đơn hàng đã giao thành công',
    },
  ];
  
  export const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8080/api';