import axiosClient from "./axiosClient";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const productApi = {
  // ===== ADMIN: phân trang =====
  // params: { keyword, categoryId, page, size, sortBy, sortDir }
  getAll: (params) => axiosClient.get("/products", { params }),
  
  getById: (id) => axiosClient.get(`/products/${id}`),
  
  getByCategory: (categoryId) =>
    axiosClient.get(`/products/category/${categoryId}`),
  
  getNewest: () => axiosClient.get("/products/newest"),

  // ⭐ MENU: lấy TOÀN BỘ sản phẩm đang bán (không phân trang)
  getMenuProducts: () => axiosClient.get("/products/menu"),

  // Giảm tồn kho
  updateStock: (id, qty) => {
    return axiosClient.put(`/products/${id}/reduce-stock?qty=${qty}`);
  },

  // Lấy sản phẩm kèm khuyến mãi
  getWithPromotions: () => axiosClient.get("/products/with-promotions"),

  // ===== ADMIN: CRUD =====
  create: (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${BASE_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id, formData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${BASE_URL}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => axiosClient.delete(`/products/${id}`),

  // Upload ảnh riêng
  uploadImage: (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${BASE_URL}/products/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default productApi;