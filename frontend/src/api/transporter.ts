import api from "./apiClient";

export type TransporterPayload = {
  rntrc?: string;
  vehicle?: {
    type?: string;
    plate?: string;
    model?: string;
  };
};

export async function createOrUpdateTransporter(payload: TransporterPayload) {
  const res = await api.post("/transporters", payload);
  return res.data;
}

export async function getMyTransporterProfile() {
  const res = await api.get("/transporters/me"); // Assumindo que teremos essa rota
  return res.data;
}
