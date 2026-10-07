

/**
 * Hiệu ứng ảnh bay từ sản phẩm → giỏ hàng
 * @param {string} imgSrc - URL ảnh sản phẩm
 * @param {HTMLElement} startElement - Element bắt đầu (thẻ img sản phẩm)
 * @param {string} [soundUrl] - URL âm thanh (mặc định /sounds/cart-add.wav)
 */
export const flyToCart = (imgSrc, startElement, soundUrl = '/sounds/cart-add.wav') => {
    if (!imgSrc || !startElement) return;
  
    // Tìm icon giỏ hàng trong header
    const cartButton = document.querySelector('[data-cart-icon]');
    if (!cartButton) return;
  
    // Tạo ảnh bay
    const flyingImg = document.createElement('img');
    flyingImg.src = imgSrc;
    flyingImg.className = 'flying-img';
  
    const startRect = startElement.getBoundingClientRect();
    const endRect = cartButton.getBoundingClientRect();
  
    // Vị trí ban đầu (tại sản phẩm)
    flyingImg.style.left = `${startRect.left + startRect.width / 2 - 40}px`;
    flyingImg.style.top = `${startRect.top + startRect.height / 2 - 40}px`;
    flyingImg.style.opacity = '1';
    flyingImg.style.transform = 'rotate(0deg) scale(1)';
  
    document.body.appendChild(flyingImg);
    flyingImg.style.boxShadow = '0 0 20px 5px #c8a27a';
  
    // Bay đến giỏ hàng
    requestAnimationFrame(() => {
      setTimeout(() => {
        flyingImg.style.left = `${endRect.left + endRect.width / 2 - 40}px`;
        flyingImg.style.top = `${endRect.top + endRect.height / 2 - 40}px`;
        flyingImg.style.transform = 'scale(0.2) rotate(360deg)';
        flyingImg.style.opacity = '0.5';
  
        // Rung giỏ hàng
        cartButton.style.transition = 'transform 0.3s';
        cartButton.style.transform = 'scale(1.15)';
        setTimeout(() => {
          cartButton.style.transform = 'scale(1)';
        }, 300);
      }, 50);
    });
  
    // Cleanup
    setTimeout(() => {
      if (flyingImg.parentNode) {
        document.body.removeChild(flyingImg);
      }
    }, 1000);
  
    // Phát âm thanh
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(() => {});
    } catch {
      /* noop */
    }
  };