import { Shield } from "lucide-react";

export const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          Acceso Restringido
        </h3>
        <p className="text-gray-600">
          Se requiere rol de administrador para acceder a esta sección.
        </p>
      </div>
    </div>
  );
};
