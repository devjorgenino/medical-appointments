export type UserPatient = {
  id: number;
  email: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
  password?: string;
  fecha_nacimiento?: string;
};

export type UsePatientsReturn = {
  patients: UserPatient[];
  newPatient: {
    email: string;
    password: string;
    role_id: number;
    nombre: string;
    apellido: string;
    numero_telefono?: string;
    direccion?: string;
    sexo?: string;
    fecha_nacimiento?: string;
  };
  editPatient: UserPatient | null;
  setNewPatient: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      role_id: number;
      nombre: string;
      apellido: string;
      numero_telefono?: string;
      direccion?: string;
      sexo?: string;
      fecha_nacimiento?: string;
    }>
  >;
  setEditPatient: React.Dispatch<React.SetStateAction<UserPatient | null>>;
  fetchPatients: () => Promise<void>;
  handleCreateOrUpdate: (e: React.FormEvent) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  ConfirmDialog: () => React.JSX.Element;
};

export type UserData = {
  id?: number;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
  role_id: number;
  fecha_nacimiento?: string;
};
