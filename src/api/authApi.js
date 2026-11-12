import api from "./axios";

// API Đăng nhập
export const loginApi = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

// API Đăng ký tài khoản mới
export const registerApi = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// API Đăng xuất
export const logoutApi = async () => {
  const response = await api.post("/logout");
  return response.data;
};
