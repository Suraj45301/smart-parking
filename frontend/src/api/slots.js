import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "/api/slots";

const api = axios.create({ baseURL: BASE_URL });

export const getAllSlots = () => api.get("/");
export const addSlot = (data) => api.post("/", data);
export const parkVehicle = (data) => api.post("/park", data);
export const removeVehicle = (id) => api.put(`/${id}/remove`);
export const deleteSlot = (id) => api.delete(`/${id}`);
