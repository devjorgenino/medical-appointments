// src/pages/auth/ForgotPasswordPage.tsx
import React, { useState } from "react";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Send } from "lucide-react";
import { toast } from "@lib/toast";
import ThemeToggle from "@components/atoms/ThemeToggle";
import { isAxiosError } from "axios";

import { requestPasswordReset } from "@services/auth";

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<{ email: string }>({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset(formData.email);

      toast.success(
        "Revisa tu correo! Te hemos enviado el enlace de recuperacion"
      );
      navigate("/login");
    } catch (err: unknown) {
      let message = "No pudimos enviar el correo de recuperacion. Intenta nuevamente.";
      if (isAxiosError(err)) {
        message = err.response?.data?.detail || message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-transparent dark:border-gray-700/50 transition-colors duration-300">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">MedicalApp</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Olvidaste tu contrasena?</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <FormField
            id="email"
            label="Correo Electronico"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="ejemplo@correo.com"
            required
          />

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Enviando..." : "Recuperar contrasena"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Ya tienes cuenta? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              Iniciar sesion
            </button>
          </div>
        </Form>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Soporte: support@medicalapp.com</p>
          <p>&copy; 2025 MedicalApp. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
