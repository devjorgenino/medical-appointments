export type JwtPayload = {
  id: number;
  sub: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
  exp?: number;
};

export type User = {
  id: number;
  email: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
};
