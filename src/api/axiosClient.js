import axios from "axios";

// ✅ Tạo instance axios chung
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor để tự động đính kèm token (chỉ cho API cần thiết)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Danh sách các endpoint PUBLIC (không cần token)
    const publicEndpoints = [
      "/products",
      "/tables",
      "/products/category",
      "/categories",
      "/products/newest",
    ];

    // Kiểm tra xem URL hiện tại có thuộc public API không
    const isPublic = publicEndpoints.some((endpoint) =>
      config.url.startsWith(endpoint)
    );

    // Nếu không phải public và có token thì thêm Authorization header
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor xử lý lỗi response (ví dụ: 401, 403)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("⚠️ Token không hợp lệ hoặc hết hạn. Hãy đăng nhập lại.");
        // Có thể điều hướng người dùng về trang login nếu cần
        // window.location.href = "/login";
      }

      if (status === 403) {
        console.warn("🚫 Bạn không có quyền truy cập API này.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
