import React, { useState } from "react";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import Button from "@components/atoms/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Activity } from "lucide-react";

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<{
    email: string;
  }>({
    email: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/forgot-password", {
        email: formData.email,
      });
      navigate("/login");
    } catch (error: any) {
      setError(
        "Error al enviar el correo de recuperación de contraseña. Intenta de nuevo."
      );
      console.error(
        "Error al enviar el correo de recuperación de contraseña:",
        error.response?.data?.detail || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MedicalApp</h1>
          <p className="mt-2 text-gray-600">Olvidó su contraseña</p>
        </div>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <FormField
            id="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <div className="mt-6 space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isLoading ? "Recuperando..." : "Recuperar Contraseña"}
            </Button>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <span className="ml-2 text-sm text-gray-600">
                Ya tienes una cuenta?
              </span>
              <button
                type="button"
                className="p-0 ml-1 text-sm text-blue-600 bg-transparent border-none cursor-pointer hover:text-blue-700 hover:underline"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </Form>
        <footer className="mt-6 text-sm text-center text-gray-500">
          <p>Soporte: support@medicalapp.com</p>
          <p>&copy; 2025 Medical App, Inc. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
