export type Role = {
  id: string;
  label: string;
};

export const ROLE_OPTIONS: Role[] = [
  { id: "1", label: "Admin" },
  { id: "2", label: "Paciente" },
  { id: "3", label: "Médico" },
];
