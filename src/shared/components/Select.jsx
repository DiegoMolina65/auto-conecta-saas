import React, { useState, useRef, useEffect } from "react";

export function Select({
  value,
  onChange,
  options = [],
  placeholder = "Selecciona una opción",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  searchable = true,
  required = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filtrar y ordenar opciones
  const filteredOptions = options
    .filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  // Obtener label actual para mostrar
  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enfocar input de búsqueda al abrir
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Cambiar selección y cerrar dropdown
  const handleSelect = (option) => {
    // Simular evento de cambio para compatibilidad
    const event = {
      target: {
        value: option.value,
        name: props.name || ''
      }
    };
    onChange(event);
    setIsOpen(false);
    setSearch("");
  };

  // Manejar teclas para navegación
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearch("");
    } else if (event.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    }
  };

  // Estilos base
  const baseClasses = "w-full text-left rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variantes de estilo
  const variants = {
    primary: "border border-gray-300 bg-white focus:ring-secondary focus:border-transparent hover:border-gray-400",
    secondary: "border border-secondary bg-white focus:ring-secondary focus:border-secondary hover:border-red-600",
    outline: "border-2 border-primary bg-white focus:ring-primary focus:border-primary hover:border-gray-800",
    ghost: "border border-gray-200 bg-gray-50 focus:ring-gray-300 focus:border-gray-300 hover:border-gray-300",
    tertiary: "border border-orange-200 bg-tertiary focus:ring-orange-300 focus:border-orange-300 hover:border-orange-300"
  };

  // Tamaños
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 h-12 text-base",
    lg: "px-4 py-3 text-lg",
    xl: "px-5 py-4 text-xl"
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {/* Control visible */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} flex justify-between items-center`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...props}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-hidden">
          {/* Buscador */}
          {searchable && (
            <div className="sticky top-0 bg-white border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary rounded-t-lg"
              />
            </div>
          )}

          {/* Opciones */}
          <ul className="max-h-48 overflow-auto" role="listbox">
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-gray-500 italic" role="option">
                {search ? "No se encontraron opciones" : "Sin opciones disponibles"}
              </li>
            )}
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`cursor-pointer px-3 py-2 transition-colors duration-200 ${
                  option.value === value
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500 font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                role="option"
                aria-selected={option.value === value}
              >
                <div className="flex justify-between items-center">
                  <span>{option.label}</span>
                  {option.value === value && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Campo oculto para formularios */}
      <input
        type="hidden"
        name={props.name}
        value={value || ""}
        required={required}
      />
    </div>
  );
}