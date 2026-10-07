import axiosClient from "./axiosClient";

const TableAPI = {
  // Lấy danh sách tables
  getAll: () => axiosClient.get("/tables"),

  // Lấy chi tiết một table
  getById: (id) => axiosClient.get(`/tables/${id}`),
  updateStatus: (id, newStatus) => {
    return axiosClient.put(`/tables/${id}`, { status: newStatus });
  },
};

export default TableAPI;
