export const Roles = {
  CLIENT: 'client',
  DRIVER: 'driver',
  ADMIN: 'admin'
} as const;

export type Role = typeof Roles[keyof typeof Roles];
