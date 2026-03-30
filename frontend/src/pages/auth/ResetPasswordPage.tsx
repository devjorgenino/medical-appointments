import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { Button } from "@components/ui/button";
import { toast } from "@lib/toast";
import { resetPasswordWithToken } from "@services/auth";
import { Activity, Eye, EyeOff, Save } from "lucide-react";
import ThemeToggle from "@components/atoms/ThemeToggle";
import { isAxiosError } from "axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Token no encontrado en la URL");
    if (password !== confirm) return setError("Las contrasenas no coinciden");
    if (password.length < 8) return setError("Minimo 8 caracteres");

    setLoading(true);
    try {
      await resetPasswordWithToken(token, password);
      toast.success("Contrasena cambiada con exito!");
      navigate("/login");
    } catch (err: unknown) {
      let message = "Token invalido o expirado";
      if (isAxiosError(err)) {
        message = err.response?.data?.detail || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <p className="text-red-600 dark:text-red-400 text-lg">Enlace invalido o token faltante</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-transparent dark:border-gray-700/50 transition-colors duration-300">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MedicalApp</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Establecer nueva contrasena</p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FormField
              id="password"
              label="Nueva Contrasena"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 8 caracteres"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 dark:text-gray-500 right-3 top-9 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {!showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <FormField
              id="confirm"
              label="Confirmar Contrasena"
              type={showPasswordConfirm ? "text" : "password"}
              value={confirm}
              placeholder="Minimo 8 caracteres, igual que la anterior"
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute text-gray-400 dark:text-gray-500 right-3 top-9 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {!showPasswordConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
