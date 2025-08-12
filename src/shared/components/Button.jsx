import React from "react";

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

  const variants = {
    primary: "bg-primary text-white hover:bg-gray-700 focus:ring-gray-300 shadow-lg hover:shadow-xl",
    secondary: "bg-secondary text-white hover:bg-red-700 focus:ring-red-300 shadow-lg hover:shadow-xl", // Rojo para cancelar/rechazar
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-gray-300",
    ghost: "text-primary hover:bg-gray-100 focus:ring-gray-300",
    tertiary: "bg-tertiary text-primary hover:bg-orange-100 focus:ring-orange-300 border border-orange-200",
    success: "bg-success text-white hover:bg-green-700 focus:ring-green-300 shadow-lg hover:shadow-xl", // Verde para guardar/confirmar
    edit: "bg-edit text-white hover:bg-blue-700 focus:ring-blue-300 shadow-lg hover:shadow-xl", // Azul para editar
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 h-12 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}