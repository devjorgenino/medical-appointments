export type User = {
  id: number;
  email: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
  password?: string;
};

export type UseUsersReturn = {
  users: User[];
  newUser: {
    email: string;
    password: string;
    role_id: number;
    nombre: string;
    apellido: string;
    numero_telefono?: string;
    direccion?: string;
    sexo?: string;
  };
  editUser: User | null;
  setNewUser: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      role_id: number;
      nombre: string;
      apellido: string;
      numero_telefono?: string;
      direccion?: string;
      sexo?: string;
    }>
  >;
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUsers: () => Promise<void>;
  handleCreateOrUpdate: (e: React.FormEvent) => Promise<boolean>;
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
};
