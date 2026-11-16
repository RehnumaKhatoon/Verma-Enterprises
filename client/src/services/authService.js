import api from "./api";
export async function login(email, password) {
  const result = (await api.post("/auth/login", { email, password })).data;
  localStorage.setItem("aqua_admin_token", result.token);
  return result.admin;
}
export function logout() {
  localStorage.removeItem("aqua_admin_token");
}
