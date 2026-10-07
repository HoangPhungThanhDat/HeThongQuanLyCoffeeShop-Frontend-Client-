
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import socket from '@/lib/socket';
import { ROUTES } from '@/constants/routes';
import { API_URL } from '../constants';
import { getStatusIndex, getStatusLabel } from '../utils/statusHelpers';
import { showToast } from '../utils/orderToast';
import { clearOrderStorage, saveOrderToStorage } from '../services/orderTrackingService';

/**
 * @param {Object} params
 * @param {Object} params.orderDetails - Đơn hàng hiện tại
 * @param {Function} params.setOrderDetails
 * @param {Function} params.setCurrentStatus
 * @param {Function} params.setIsCallingStaff
 * @param {Function} params.bumpRefreshKey
 */
export function useOrderSocket({
  orderDetails,
  setOrderDetails,
  setCurrentStatus,
  setIsCallingStaff,
  bumpRefreshKey,
}) {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  /* ============ UPDATE HELPERS ============ */
  const updateOrder = useCallback(
    (updater) => {
      setOrderDetails((prev) => {
        const next = updater(prev);
        saveOrderToStorage(next);
        return next;
      });
    },
    [setOrderDetails],
  );

  /* ============ ITEMS ADDED HANDLER ============ */
  const normalizeAddedItems = useCallback((data) => {
    if (Array.isArray(data.addedItems) && data.addedItems.length > 0) {
      return data.addedItems.map((item) => ({
        id: item.productId || item.id,
        productId: item.productId || item.id,
        name: item.name || 'Món mới',
        image: item.image || 'https://via.placeholder.com/50?text=?',
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));
    }

    if (Array.isArray(data.updatedItems) && data.updatedItems.length > 0) {
      return data.updatedItems.map((item) => {
        if (item.product) {
          return {
            id: item.product.id,
            productId: item.product.id,
            name: item.product.name || 'Sản phẩm',
            image: item.product.imageUrl
              ? `${API_URL}/products/image/${item.product.imageUrl}`
              : 'https://via.placeholder.com/50?text=?',
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal || item.price * item.quantity,
          };
        }
        return {
          id: item.productId || item.id,
          productId: item.productId || item.id,
          name: item.name || 'Sản phẩm',
          image: item.image || 'https://via.placeholder.com/50?text=?',
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal || item.price * item.quantity,
        };
      });
    }

    return null;
  }, []);

  /* ============ SOCKET LISTENERS ============ */
  useEffect(() => {
    if (!orderDetails?.orderNumber) return;

    /* --- Kết nối --- */
    const checkConnection = () => {
      if (socket.connected) setIsConnected(true);
      else {
        setIsConnected(false);
        socket.connect();
      }
    };
    checkConnection();

    socket.emit('join-order-tracking', {
      orderId: orderDetails.orderNumber,
      userType: 'customer',
    });

    /* --- Order status update --- */
    const handleOrderStatusUpdate = (data) => {
      const isMatching =
        data.orderId == orderDetails.orderNumber ||
        String(data.orderId) === String(orderDetails.orderNumber);

      if (!isMatching) return;

      setCurrentStatus(getStatusIndex(data.status));
      updateOrder((prev) => ({
        ...prev,
        status: data.status,
        paymentMethod: data.paymentMethod || prev.paymentMethod,
      }));
      showToast('success', '🔔 Cập nhật đơn hàng', getStatusLabel(data.status));
    };

    /* --- Items added --- */
    const handleItemsAdded = (data) => {
      const isMatching =
        String(data.orderId) === String(orderDetails.orderNumber);
      if (!isMatching) return;

      const newItems = normalizeAddedItems(data);

      updateOrder((prev) => {
        const finalItems = newItems
          ? Array.isArray(data.addedItems) && data.addedItems.length > 0
            ? [...(prev.items || []), ...newItems]
            : newItems
          : prev.items || [];

        return {
          ...prev,
          items: finalItems,
          total: data.newTotal !== undefined ? data.newTotal : prev.total,
        };
      });

      bumpRefreshKey();
      showToast(
        'success',
        'Đã thêm món!',
        `Tổng mới: ${(data.newTotal || 0).toLocaleString()}₫`,
      );
    };

    /* --- Order cancelled --- */
    const handleOrderCancelled = (data) => {
      if (String(data.orderId) !== String(orderDetails.orderNumber)) return;

      updateOrder((prev) => ({ ...prev, status: 'CANCELLED' }));
      setCurrentStatus(0);

      Swal.fire({
        icon: 'warning',
        title: 'Đơn hàng đã bị hủy',
        text: data.reason || 'Đơn hàng của bạn đã được hủy bởi nhân viên',
        confirmButtonText: 'Về trang chủ',
        confirmButtonColor: '#8b5e3c',
      }).then(() => {
        clearOrderStorage();
        navigate(ROUTES.HOME);
      });
    };

    /* --- Staff acknowledged --- */
    const handleStaffAcknowledged = (data) => {
      if (data.tableNumber !== orderDetails.tableNumber) return;

      setIsCallingStaff(false);
      Swal.fire({
        icon: 'success',
        title: 'Nhân viên đã nhận!',
        html: `
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">👨‍🍳</div>
            <p style="font-size: 16px; font-weight: 700; color: #00a843; margin-bottom: 8px;">
              ${data.staffName || 'Nhân viên'} đang đến hỗ trợ bạn!
            </p>
            <p style="color: #6b5b4d; font-size: 13px;">
              ${data.message || 'Vui lòng chờ trong giây lát'}
            </p>
          </div>
        `,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    };

    /* --- Call staff success --- */
    const handleCallStaffSuccess = (data) => {
      if (data.success && data.tableNumber === orderDetails.tableNumber) {
        showToast(
          'success',
          'Đã gọi nhân viên!',
          'Vui lòng chờ nhân viên đến hỗ trợ',
        );
      }
    };

    /* --- Payment success --- */
    const handlePaymentSuccess = (data) => {
      if (String(data.orderId) !== String(orderDetails.orderNumber)) return;

      updateOrder((prev) => ({
        ...prev,
        status: 'PAID',
        paymentMethod:
          data.paymentMethod || prev.paymentMethod || 'Đã thanh toán',
        paidAt: new Date().toISOString(),
      }));
      setCurrentStatus(5);
      showToast(
        'success',
        '💳 Thanh toán thành công!',
        `${data.paymentMethod || ''} - ${data.amount?.toLocaleString() || ''}₫`,
      );
    };

    /* --- Connect / Disconnect --- */
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => {
      setIsConnected(false);
      showToast('warning', 'Mất kết nối', 'Đang thử kết nối lại...');
    };
    const handleReconnect = () => {
      setIsConnected(true);
      showToast('success', 'Đã kết nối lại', '');
      socket.emit('join-order-tracking', {
        orderId: orderDetails.orderNumber,
        userType: 'customer',
      });
    };

    /* --- Đăng ký --- */
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('order-status-updated', handleOrderStatusUpdate);
    socket.on('items-added-to-order', handleItemsAdded);
    socket.on('order-cancelled', handleOrderCancelled);
    socket.on('staff-acknowledged', handleStaffAcknowledged);
    socket.on('call-staff-success', handleCallStaffSuccess);
    socket.on('payment-notification', handlePaymentSuccess);

    /* --- Cleanup --- */
    return () => {
      socket.emit('leave-order-tracking', { orderId: orderDetails.orderNumber });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      socket.off('order-status-updated', handleOrderStatusUpdate);
      socket.off('items-added-to-order', handleItemsAdded);
      socket.off('order-cancelled', handleOrderCancelled);
      socket.off('staff-acknowledged', handleStaffAcknowledged);
      socket.off('call-staff-success', handleCallStaffSuccess);
      socket.off('payment-notification', handlePaymentSuccess);
    };
  }, [
    orderDetails?.orderNumber,
    orderDetails?.tableNumber,
    navigate,
    setCurrentStatus,
    setIsCallingStaff,
    updateOrder,
    normalizeAddedItems,
    bumpRefreshKey,
  ]);

  return { isConnected };
}