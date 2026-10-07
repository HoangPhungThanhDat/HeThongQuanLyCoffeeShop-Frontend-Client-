// src/features/menu/hooks/useAddToCart.js
import { useCallback } from 'react';

import socket from '@/lib/socket';
import { flyToCart } from '../utils/flyingImage';

const CART_KEY = 'cart';

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

// ⭐ Chuẩn hóa ảnh — URL Cloudinary đầy đủ, không ghép prefix
const getProductImageUrl = (product) => {
  return (
    product.imageUrl ||
    product.image ||
    product.imageURL ||
    '/icons/iconcoffee.png'
  );
};

const calcFinalPrice = (product) => {
  const hasPromo = product.promotions?.length > 0;
  if (!hasPromo) return product.price;
  return product.price * (1 - product.promotions[0].discountPercentage / 100);
};

export function useAddToCart() {
  const addToCart = useCallback((product, event) => {
    const cart = readCart();
    const hasPromo = product.promotions?.length > 0;
    const finalPrice = calcFinalPrice(product);

    // ⭐ Lấy URL ảnh đúng (URL Cloudinary đầy đủ)
    const imageUrl = getProductImageUrl(product);

    // Cập nhật giỏ
    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      cart[index].qty += 1;
      // ⭐ Bổ sung ảnh nếu item cũ thiếu
      if (!cart[index].image || !cart[index].imageUrl) {
        cart[index].image = imageUrl;
        cart[index].imageUrl = imageUrl;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: finalPrice,
        originalPrice: product.price,
        discountPercentage: hasPromo
          ? product.promotions[0].discountPercentage
          : 0,
        qty: 1,
        image: imageUrl,      // ⭐ URL Cloudinary
        imageUrl: imageUrl,   // ⭐ Cho CartItem đọc
      });
    }
    writeCart(cart);

    // ⭐ Hiệu ứng bay — dùng URL Cloudinary trực tiếp
    const card = event?.target?.closest('.mop-card');
    const imgElement = card?.querySelector('img');
    if (imgElement && imageUrl && imageUrl !== '/icons/iconcoffee.png') {
      flyToCart(imageUrl, imgElement);
    }

    // Feedback nút
    const button = event?.target?.closest('.mop-add-btn');
    if (button) {
      const originalHtml = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check-circle-fill"></i> Đã thêm!';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.disabled = false;
      }, 1500);
    }

    // Thông báo socket
    socket.emit('adding-to-cart', {
      productId: product.id,
      productName: product.name,
    });
  }, []);

  return { addToCart };
}