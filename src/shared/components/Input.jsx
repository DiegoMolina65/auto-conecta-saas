import React from "react";

export function Input({ 
  valor, 
  placeholder, 
  onChange, 
  label,
  error,
  icon,
  type = "text",
  size = "md",
  className = "",
  ...props 
}) {
  const baseClasses = "w-full rounded-lg border transition-all duration-300 ease-in-out focus:outline-none focus:ring-4";
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg"
  };
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" 
    : "border-gray-300 focus:border-primary focus:ring-gray-200 bg-white hover:border-gray-400";
  
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          type={type}
          value={valor}
          placeholder={placeholder}
          onChange={onChange}
          className={`${baseClasses} ${sizes[size]} ${stateClasses} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
