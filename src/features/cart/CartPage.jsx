// src/features/cart/CartPage.jsx
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

import { useCart } from './hooks/useCart';
import { useCheckout } from './hooks/useCheckout';
import { useViewOrderStatus } from './hooks/useViewOrderStatus';

import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';

import '@/assets/css/GioHang.css';

export default function CartPage() {
  const [orderNotes, setOrderNotes] = useState('');

  // ✅ Đồng bộ với hook useCart mới
  const {
    cart,
    totalPrice,        // ← đổi từ `total`
    isEmpty,
    updateQtyByIndex,  // ← đổi từ `updateQty`
    removeByIndex,     // ← đổi từ `removeItem`
    clearCart,
  } = useCart();

  // ✅ Checkout hook — truyền đúng tên field
  const { isProcessing, checkout } = useCheckout({
    cart,
    total: totalPrice,   // ← đổi từ `total`
    notes: orderNotes.trim(),
    onSuccess: () => {
      clearCart();
      setOrderNotes('');
    },
  });

  const { viewOrderStatus } = useViewOrderStatus();

  // ✅ Confirm trước khi xóa — dùng useCallback để tránh re-render
  const handleClearCart = useCallback(() => {
    if (isEmpty) {
      Swal.fire({
        title: 'Giỏ hàng trống!',
        text: 'Không có gì để xóa.',
        icon: 'info',
        confirmButtonColor: '#5c4033',
      });
      return;
    }

    Swal.fire({
      title: 'Xóa toàn bộ giỏ hàng?',
      text: 'Bạn chắc chắn muốn xóa hết các món đã chọn?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c4033',
      cancelButtonColor: '#a1887f',
      confirmButtonText: 'Có, xóa hết!',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        setOrderNotes('');
        Swal.fire({
          title: 'Đã xóa!',
          text: 'Giỏ hàng của bạn hiện trống.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }, [isEmpty, clearCart]);

  // ✅ Wrap handler để truyền đúng signature cho CartItem
  const handleQtyChange = useCallback(
    (index, newQty) => {
      updateQtyByIndex(index, newQty);
    },
    [updateQtyByIndex],
  );

  const handleRemove = useCallback(
    (index) => {
      removeByIndex(index);
    },
    [removeByIndex],
  );

  return (
    <div className="container py-5" style={{ marginTop: '100px' }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#fff' }}>
        🛒 Giỏ hàng của bạn
      </h2>

      <div className="row">
        {/* LEFT — DANH SÁCH MÓN */}
        <div className="col-lg-8 col-md-12">
          <div className="row gy-3">
            <AnimatePresence mode="popLayout">
              {isEmpty ? (
                <EmptyCart key="empty-cart" />
              ) : (
                cart.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — TỔNG KẾT */}
        <div className="col-lg-4 col-md-12 mt-4 mt-lg-0">
          <CartSummary
            total={totalPrice}
            notes={orderNotes}
            onNotesChange={setOrderNotes}
            onCheckout={checkout}
            onViewOrderStatus={viewOrderStatus}
            onClearCart={handleClearCart}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}