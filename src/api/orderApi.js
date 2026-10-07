import axiosClient from "./axiosClient";

const OrderAPI = {
  // Lấy danh sách orders
  getAll: () => axiosClient.get("/orders"),

  // Lấy chi tiết một order
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // Thêm order mới
  create: (data) => axiosClient.post("/orders", data),

  // Cập nhật order
  update: (id, data) => axiosClient.put(`/orders/${id}`, data),

  // Xóa order
  delete: (id) => axiosClient.delete(`/orders/${id}`),
};

export default OrderAPI;