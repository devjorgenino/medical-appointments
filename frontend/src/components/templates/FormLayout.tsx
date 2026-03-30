import type React from "react";
import { Eye, EyeOff } from "lucide-react";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import { ROLE_OPTIONS, Role } from "@src/types/roles";
import { filterPhoneNumbers } from "@utils/validation";
import {
  useFormValidation,
  createUserFormValidationConfig,
} from "@hooks/useFormValidation";

interface PageProps {
  user: { id: number; role_id: number; email: string };
  newData: any;
  editData: any | null; // null = creación
  setNewData: (data: any) => void;
  setEditData: (data: any) => void;
  handleCreateOrUpdate: (e: React.FormEvent) => Promise<boolean>;
  redirectPath?: string;
  children?: React.ReactNode;
}

const FormLayout: React.FC<PageProps> = ({
  user,
  newData,
  editData,
  setNewData,
  setEditData,
  handleCreateOrUpdate,
  redirectPath,
  children,
}) => {
  const location = useLocation();
  const infoUser = location.state?.infoUser;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Detectamos creación vs edición
  const isCreation = !editData?.id;

  // Configuración de validación basada en si es creación o edición
  const validationConfig = useMemo(
    () => createUserFormValidationConfig(isCreation),
    [isCreation]
  );

  // Hook de validación centralizado
  const { errors, touched, validateField, handleBlur, validateAll } =
    useFormValidation(validationConfig);

  // Cargar datos cuando venimos de edición
  useEffect(() => {
    if (infoUser) {
      setNewData(infoUser);
      setEditData(infoUser);
    }
  }, [infoUser, setNewData, setEditData]);

  // Autorización
  if (
    ![1, 3].includes(Number(user.role_id)) &&
    (editData?.id ?? 0) !== user.id
  ) {
    return <NotAuthorized />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(newData)) {
      return;
    }

    const success = await handleCreateOrUpdate(e);
    if (success && redirectPath) {
      navigate(redirectPath);
    }
  };

  // Handler para cambios en campos con validación en tiempo real
  const handleFieldChange = (fieldName: string, value: any) => {
    const updatedData = { ...newData, [fieldName]: value };
    setNewData(updatedData);
    if (touched[fieldName]) {
      validateField(fieldName, value, updatedData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
        <Form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* EMAIL */}
            <FormField
              id="email"
              label="Correo electrónico"
              type="email"
              value={newData.email || ""}
              onChange={(e) => {
                handleFieldChange("email", e.target.value);
              }}
              onBlur={() => {
                handleBlur("email");
                validateField("email", newData.email, newData);
              }}
              placeholder="ejemplo@correo.com"
              required
              error={errors.email}
            />

            {/* PASSWORD + OJO */}
            <div className="relative">
              <FormField
                id="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={newData.password || ""}
                onChange={(e) => {
                  handleFieldChange("password", e.target.value);
                }}
                onBlur={() => {
                  handleBlur("password");
                  validateField("password", newData.password, newData);
                }}
                placeholder={
                  isCreation
                    ? "Mínimo 8 caracteres (obligatorio)"
                    : "Dejar vacío para mantener la actual"
                }
                required={isCreation}
                className="pr-12"
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* NOMBRE Y APELLIDO */}
            <FormField
              id="nombre"
              label="Nombre"
              value={newData.nombre || ""}
              onChange={(e) => {
                handleFieldChange("nombre", e.target.value);
              }}
              onBlur={() => {
                handleBlur("nombre");
                validateField("nombre", newData.nombre, newData);
              }}
              required
              error={errors.nombre}
            />
            <FormField
              id="apellido"
              label="Apellido"
              value={newData.apellido || ""}
              onChange={(e) => {
                handleFieldChange("apellido", e.target.value);
              }}
              onBlur={() => {
                handleBlur("apellido");
                validateField("apellido", newData.apellido, newData);
              }}
              required
              error={errors.apellido}
            />

            {/* TELÉFONO Y DIRECCIÓN */}
            <FormField
              id="numero_telefono"
              label="Número de teléfono"
              value={newData.numero_telefono || ""}
              onChange={(e) => {
                const value = filterPhoneNumbers(e.target.value) || undefined;
                handleFieldChange("numero_telefono", value);
              }}
              onBlur={() => {
                handleBlur("numero_telefono");
                validateField("numero_telefono", newData.numero_telefono, newData);
              }}
              error={errors.numero_telefono}
            />
            <FormField
              id="direccion"
              label="Dirección"
              value={newData.direccion || ""}
              onChange={(e) => {
                const value = e.target.value || undefined;
                handleFieldChange("direccion", value);
              }}
              onBlur={() => {
                handleBlur("direccion");
                validateField("direccion", newData.direccion, newData);
              }}
              error={errors.direccion}
            />

            {/* SEXO */}
            <FormField
              id="sexo"
              label="Sexo"
              type="radio"
              value={newData.sexo || ""}
              options={[
                { value: "M", label: "Masculino" },
                { value: "F", label: "Femenino" },
              ]}
              onChange={(e) => {
                handleFieldChange("sexo", e.target.value || undefined);
              }}
              onBlur={() => {
                handleBlur("sexo");
                validateField("sexo", newData.sexo, newData);
              }}
              required
              error={errors.sexo}
            />

            {/* ROL – solo admin */}
            {user.role_id === 1 && (
              <FormField
                id="role_id"
                label="Rol"
                type="select"
                value={newData.role_id?.toString() ?? "3"}
                onChange={(e) => {
                  handleFieldChange("role_id", Number(e.target.value));
                }}
                onBlur={() => {
                  handleBlur("role_id");
                  validateField("role_id", newData.role_id, newData);
                }}
                options={ROLE_OPTIONS.map((r) => ({
                  value: r.id.toString(),
                  label: r.label,
                }))}
                required
                error={errors.role_id}
                disabled={!!editData?.id}
              />
            )}

            {/* ESPECIALIDAD – solo médicos */}
            {newData.role_id === 3 && (
              <FormField
                id="especialidad"
                label="Especialidad"
                value={newData.especialidad || ""}
                onChange={(e) => {
                  const value = e.target.value || undefined;
                  handleFieldChange("especialidad", value);
                }}
                onBlur={() => {
                  handleBlur("especialidad");
                  validateField("especialidad", newData.especialidad, newData);
                }}
                placeholder="Cardiología, Pediatría, etc."
                required={isCreation}
                error={errors.especialidad}
              />
            )}

            {/* FECHA NACIMIENTO – solo pacientes */}
            {newData.role_id === 2 && (
              <FormField
                id="fecha_nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                value={newData.fecha_nacimiento || ""}
                onChange={(e) => {
                  const value = e.target.value || undefined;
                  handleFieldChange("fecha_nacimiento", value);
                }}
                onBlur={() => {
                  handleBlur("fecha_nacimiento");
                  validateField("fecha_nacimiento", newData.fecha_nacimiento, newData);
                }}
                error={errors.fecha_nacimiento}
              />
            )}
          </div>

          {children}
        </Form>
      </div>
    </div>
  );
};

export default FormLayout;
