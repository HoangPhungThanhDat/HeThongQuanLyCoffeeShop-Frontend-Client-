import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: () => axiosClient.get("/categories"),
};

export default categoryApi;
