import type React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; // Agregar esta línea
  children: React.ReactNode;
  style?: React.CSSProperties; // Agregar esta línea para permitir estilos en línea
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  className = "",
  onClick,
  disabled = false, // Agregar esta línea
  children,
  style,
}) => (
  <button
    type={type}
    className={`${
      type === "submit" ? "w-full" : "w-auto"
    }  px-4 py-2 rounded-md font-medium text-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      disabled
        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
        : className
    }`}
    onClick={disabled ? undefined : onClick} // Prevenir clicks cuando está disabled
    disabled={disabled} // Agregar esta línea
    style={style} // Agregar esta línea
  >
    {children}
  </button>
);

export default Button;
