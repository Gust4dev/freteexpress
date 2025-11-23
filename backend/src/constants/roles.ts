export const Roles = {
  CLIENT: 'client',
  DRIVER: 'driver',
  ADMIN: 'admin',
  TESTER: 'tester'
} as const;

export type Role = typeof Roles[keyof typeof Roles];
