import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";


if (!window.socket) {
  window.socket = io(SOCKET_URL, {
    transports: ["websocket"],
  });
}

const socket = window.socket;
export default socket;



















// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:3001";

// // Tạo hoặc lấy sessionId từ localStorage
// const getOrCreateSessionId = () => {
//   let sessionId = localStorage.getItem('customer-session-id');
//   if (!sessionId) {
//     sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     localStorage.setItem('customer-session-id', sessionId);
//   }
//   return sessionId;
// };

// // Khởi tạo socket chỉ 1 lần
// if (!window.socket) {
//   const sessionId = getOrCreateSessionId();
  
//   window.socket = io(SOCKET_URL, {
//     transports: ["websocket"],
//     auth: {
//       sessionId: sessionId // Gửi session ID lên server
//     },
//     reconnection: true,        // Tự động reconnect
//     reconnectionDelay: 1000,   // Đợi 1s trước khi reconnect
//     reconnectionAttempts: 5    // Thử reconnect tối đa 5 lần
//   });

//   // Log khi connect thành công
//   window.socket.on('connect', () => {
//     console.log('✅ Đã kết nối Socket với ID:', window.socket.id);
//     console.log('📌 Session ID:', sessionId);
//   });

//   // Log khi reconnect
//   window.socket.on('reconnect', (attemptNumber) => {
//     console.log('♻️ Đã reconnect sau', attemptNumber, 'lần thử');
//   });

//   // Log khi disconnect
//   window.socket.on('disconnect', (reason) => {
//     console.log('🔴 Ngắt kết nối:', reason);
//     if (reason === 'io server disconnect') {
//       // Server chủ động disconnect, cần reconnect thủ công
//       window.socket.connect();
//     }
//   });
// }

// const socket = window.socket;
// export default socket;