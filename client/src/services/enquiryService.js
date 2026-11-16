import api from "./api";
export const submitEnquiry = async (data) =>
  (await api.post("/enquiries", data)).data;
export const getEnquiries = async () => (await api.get("/enquiries")).data;
export const updateEnquiry = async (id, status) =>
  (await api.patch(`/enquiries/${id}`, { status })).data;
export const deleteEnquiry = async (id) =>
  (await api.delete(`/enquiries/${id}`)).data;
