import React, { useEffect, useState, useMemo } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@components/ui/button";
import { getProfile, updateProfile } from "@services/profile";
import ChangePasswordForm from "./ChangePasswordForm";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { filterPhoneNumbers } from "@utils/validation";
import {
  useFormValidation,
  createProfileFormValidationConfig,
} from "@hooks/useFormValidation";

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  numero_telefono?: string;
  direccion?: string;
  sexo: "M" | "F";
}

const initialProfile: UserProfile = {
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan.perez@email.com",
  numero_telefono: "123456789",
  direccion: "Calle Falsa 123",
  sexo: "M",
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserProfile>(profile);

  // Configuración de validación para perfil
  const validationConfig = useMemo(() => createProfileFormValidationConfig(), []);

  // Hook de validación centralizado
  const { errors, touched, validateField, handleBlur, validateAll, resetValidation } =
    useFormValidation(validationConfig);

  // Handler para cambios en campos con validación en tiempo real
  const handleFieldChange = <K extends keyof UserProfile>(
    fieldName: K,
    value: UserProfile[K]
  ) => {
    const updatedForm: UserProfile = { ...form, [fieldName]: value };
    setForm(updatedForm);
    if (touched[fieldName as string]) {
      validateField(fieldName as string, updatedForm[fieldName], updatedForm);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm(profile);
    setEditMode(true);
    resetValidation();
  };

  const handleSave = async () => {
    if (!validateAll(form)) {
      return;
    }

    // Aquí iría la petición a la API para actualizar el perfil
    // await api.updateProfile(form)
    await updateProfile(form);
    setProfile(form);
    setEditMode(false);
    resetValidation();
  };

  // Aquí iría la petición a la API para obtener el perfil del usuario
  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      // Suponiendo que la respuesta tiene la estructura adecuada
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <section className="space-y-6">
      {/*className="flex flex-col items-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-100 py-8">*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/*className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mb-8">*/}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {/*className="text-3xl font-bold mb-6 text-blue-900 text-center tracking-tight" >*/}
          Mi Perfil
        </h2>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
        <Form
          className="space-y-4"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="nombre"
              label="Nombre"
              type="text"
              value={editMode ? form.nombre : profile.nombre}
              onChange={(e) => {
                handleFieldChange("nombre", e.target.value);
              }}
              onBlur={() => {
                handleBlur("nombre");
                validateField("nombre", form.nombre, form);
              }}
              placeholder="Ingrese su nombre"
              disabled={!editMode}
              className={editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}
              error={editMode ? errors.nombre : ""}
            />
            <FormField
              id="apellido"
              label="Apellido"
              type="text"
              value={editMode ? form.apellido : profile.apellido}
              onChange={(e) => {
                handleFieldChange("apellido", e.target.value);
              }}
              onBlur={() => {
                handleBlur("apellido");
                validateField("apellido", form.apellido, form);
              }}
              placeholder="Ingrese su apellido"
              disabled={!editMode}
              className={editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}
              error={editMode ? errors.apellido : ""}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={editMode ? form.email : profile.email}
              onChange={(e) => {
                handleFieldChange("email", e.target.value);
              }}
              onBlur={() => {
                handleBlur("email");
                validateField("email", form.email, form);
              }}
              placeholder="ejemplo@correo.com"
              disabled={!editMode}
              className={editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}
              error={editMode ? errors.email : ""}
            />
            <FormField
              id="numero_telefono"
              label="Número de teléfono"
              type="text"
              value={
                editMode
                  ? form.numero_telefono || ""
                  : profile.numero_telefono || ""
              }
              onChange={(e) => {
                const value = filterPhoneNumbers(e.target.value);
                handleFieldChange("numero_telefono", value);
              }}
              onBlur={() => {
                handleBlur("numero_telefono");
                validateField("numero_telefono", form.numero_telefono, form);
              }}
              placeholder="Ej: 1234567890"
              disabled={!editMode}
              className={editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}
              error={editMode ? errors.numero_telefono : ""}
            />
            {editMode ? (
              <FormField
                id="sexo"
                label="Sexo"
                type="radio"
                value={form.sexo}
                onChange={(e) => {
                  if (e.target.value === "M" || e.target.value === "F") {
                  handleFieldChange("sexo", e.target.value as UserProfile["sexo"]);
                  }
                }}
                onBlur={() => {
                  handleBlur("sexo");
                  validateField("sexo", form.sexo, form);
                }}
                options={[
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Femenino" },
                ]}
                required
                error={errors.sexo}
              />
            ) : (
              <FormField
                id="sexo"
                label="Sexo"
                type="text"
                value={profile.sexo === "M" ? "Masculino" : "Femenino"}
                disabled
                className="w-full rounded-lg border px-3 py-2 bg-gray-100 dark:bg-gray-600"
                onChange={() => {}}
              />
            )}
            <FormField
              id="direccion"
              label="Dirección"
              type="text"
              value={editMode ? form.direccion || "" : profile.direccion || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleFieldChange("direccion", value);
              }}
              onBlur={() => {
                handleBlur("direccion");
                validateField("direccion", form.direccion, form);
              }}
              placeholder="Ej: Calle Principal 123, Ciudad"
              disabled={!editMode}
              className={editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"}
              error={editMode ? errors.direccion : ""}
            />
          </div>
          <div className="flex justify-end space-x-2">
            {editMode && (
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center transition-colors border border-gray-300 dark:border-gray-600 rounded-lg justify-centertext-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  setEditMode(false);
                  setForm(profile);
                  resetValidation();
                }}
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            )}
            {editMode ? (
              <Button
                type="submit"
                className="flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Save className="w-4 h-4" /> Guardar
              </Button>
            ) : (
              <Button
                type="button"
                className="flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4" /> Editar
              </Button>
            )}
          </div>
        </Form>
      </div>
      {/* Formulario para cambiar contraseña */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cambiar Contraseña
          </h2>
        </div>
        <ChangePasswordForm />
      </div>
    </section>
  );
};

export default ProfilePage;
