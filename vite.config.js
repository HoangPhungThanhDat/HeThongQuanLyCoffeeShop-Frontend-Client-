import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,

    // ✅ Cho phép Cloudflare Tunnel truy cập
    // (Fix lỗi "Blocked request. This host is not allowed")
    allowedHosts: true,

    // ✅ Cho phép truy cập từ máy khác trong cùng mạng LAN (nếu cần)
    // host: '0.0.0.0',  // Bỏ comment nếu muốn test từ điện thoại
  },
});