import type React from "react";
import { Button } from "@components/ui/button"; // ← shadcn Button
import { Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ButtonsFormProps {
  edit: boolean;
  path: string;
}

const ButtonsForm: React.FC<ButtonsFormProps> = ({ edit, path }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center"
        onClick={() => navigate(path)}
      >
        <X className="w-4 h-4" />
        Cancelar
      </Button>

      {/* GUARDAR / ACTUALIZAR – mantiene el gradiente azul exacto de tu compañero */}
      <Button
        type="submit" // ← SOLO submit → FormLayout controla la navegación
        className="flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        {edit ? (
          <>
            <Edit className="w-4 h-4" />
            Actualizar
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Guardar
          </>
        )}
      </Button>
    </div>
  );
};

export default ButtonsForm;
