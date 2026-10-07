import axiosClient from "./axiosClient";

const billApi = {
  // Lấy danh sách bill items
  getAll: () => axiosClient.get("/bills"),

  // Lấy chi tiết một bill item
  getById: (id) => axiosClient.get(`/bills/${id}`),

  // Thêm bill item mới
  create: (data) => axiosClient.post("/bills", data),

  // Cập nhật bill item
  update: (id, data) => axiosClient.put(`/bills/${id}`, data),

  // Xóa bill item
  delete: (id) => axiosClient.delete(`/bills/${id}`),
};

export default billApi;