export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: "Entregador" | "Cliente" | string;
  avatarUrl?: string;
};

export type Frete = {
  id: string;
  origem: string;
  destino: string;
  peso: number;
  descricao?: string;
  tipo?: string;
  dataColeta?: string; // ISO date
  status?: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  price?: number;
  createdAt?: string;
  updatedAt?: string;
  requesterId?: string;
  carrierId?: string | null;
};

export type Rating = {
  id: string;
  freteId: string;
  authorId: string;
  score: number; // 1-5
  comment?: string;
  createdAt?: string;
};
