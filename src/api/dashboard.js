import { api } from "./client";

export const getSummary = () => api.get("/analytics/summary");
export const getSegments = () => api.get("/analytics/segments");
export const getChurn = () => api.get("/analytics/churn-by-membership");
export const getDashboardDetails = () => api.get("/analytics/details");