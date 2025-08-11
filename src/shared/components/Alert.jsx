import React, { useState, useEffect } from "react";

export function Alert({ 
  tipo = "informacion", 
  titulo, 
  mensaje, 
  visible = true, 
  autodismiss = false,
  duracion = 5000,
  onCerrar,
  className = "",
  icono,
  accionBoton,
  textoBoton = "Aceptar"
}) {
  const [mostrar, setMostrar] = useState(visible);

  useEffect(() => {
    if (autodismiss && mostrar) {
      const timer = setTimeout(() => {
        cerrarAlert();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [autodismiss, duracion, mostrar]);

  const cerrarAlert = () => {
    setMostrar(false);
    if (onCerrar) onCerrar();
  };

  if (!mostrar) return null;

  const configuraciones = {
    exito: {
      fondo: "bg-green-50 border-green-200",
      icono: icono || "✅",
      iconoFondo: "bg-green-100 text-green-600",
      titulo: "text-green-800",
      mensaje: "text-green-700",
      boton: "text-green-600 hover:bg-green-100",
      cerrar: "text-green-400 hover:text-green-600"
    },
    error: {
      fondo: "bg-red-50 border-red-200",
      icono: icono || "❌",
      iconoFondo: "bg-red-100 text-red-600",
      titulo: "text-red-800",
      mensaje: "text-red-700",
      boton: "text-red-600 hover:bg-red-100",
      cerrar: "text-red-400 hover:text-red-600"
    },
    advertencia: {
      fondo: "bg-yellow-50 border-yellow-200",
      icono: icono || "⚠️",
      iconoFondo: "bg-yellow-100 text-yellow-600",
      titulo: "text-yellow-800",
      mensaje: "text-yellow-700",
      boton: "text-yellow-600 hover:bg-yellow-100",
      cerrar: "text-yellow-400 hover:text-yellow-600"
    },
    informacion: {
      fondo: "bg-blue-50 border-blue-200",
      icono: icono || "ℹ️",
      iconoFondo: "bg-blue-100 text-blue-600",
      titulo: "text-blue-800",
      mensaje: "text-blue-700",
      boton: "text-blue-600 hover:bg-blue-100",
      cerrar: "text-blue-400 hover:text-blue-600"
    }
  };

  const config = configuraciones[tipo];

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-auto transform transition-all duration-300 ease-in-out ${mostrar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${config.fondo} ${className}`}>
        <div className="flex items-start">
          {/* Icono */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.iconoFondo} mr-3`}>
            <span className="text-lg">{config.icono}</span>
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            {titulo && (
              <h3 className={`text-sm font-semibold mb-1 ${config.titulo}`}>
                {titulo}
              </h3>
            )}
            <p className={`text-sm ${config.mensaje}`}>
              {mensaje}
            </p>

            {/* Botón de acción opcional */}
            {accionBoton && (
              <div className="mt-3">
                <button
                  onClick={accionBoton}
                  className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${config.boton}`}
                >
                  {textoBoton}
                </button>
              </div>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={cerrarAlert}
            className={`flex-shrink-0 ml-3 transition-colors ${config.cerrar}`}
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook para manejar alerts de forma más fácil
export function useAlert() {
  const [alerts, setAlerts] = useState([]);

  const mostrarAlert = (tipo, titulo, mensaje, opciones = {}) => {
    const id = Date.now() + Math.random();
    const nuevoAlert = {
      id,
      tipo,
      titulo,
      mensaje,
      visible: true,
      ...opciones
    };

    setAlerts(prev => [...prev, nuevoAlert]);

    // Auto-remove después de duración
    if (opciones.autodismiss !== false) {
      setTimeout(() => {
        cerrarAlert(id);
      }, opciones.duracion || 5000);
    }

    return id;
  };

  const cerrarAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const cerrarTodos = () => {
    setAlerts([]);
  };

  // Funciones de conveniencia
  const exito = (titulo, mensaje, opciones) => mostrarAlert('exito', titulo, mensaje, opciones);
  const error = (titulo, mensaje, opciones) => mostrarAlert('error', titulo, mensaje, opciones);
  const advertencia = (titulo, mensaje, opciones) => mostrarAlert('advertencia', titulo, mensaje, opciones);
  const informacion = (titulo, mensaje, opciones) => mostrarAlert('informacion', titulo, mensaje, opciones);

  return {
    alerts,
    mostrarAlert,
    cerrarAlert,
    cerrarTodos,
    exito,
    error,
    advertencia,
    informacion
  };
}
