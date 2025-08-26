import React, { useState, useEffect } from "react";

export function Confirm({
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de que quieres continuar?",
  visible = false,
  onConfirmar,
  onCancelar,
  textoBtnConfirmar = "Confirmar",
  textoBtnCancelar = "Cancelar",
  tipo = "peligro",
  className = "",
  icono,
  mostrarCerrar = false, 
}) {
  const [mostrar, setMostrar] = useState(visible);

  useEffect(() => {
    setMostrar(visible);
  }, [visible]);

  useEffect(() => {
    const manejarEscape = (e) => {
      if (e.key === 'Escape' && mostrarCerrar) {
        manejarCancelar();
      }
    };

    if (mostrar) {
      document.addEventListener('keydown', manejarEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mostrar, mostrarCerrar]);

  const manejarConfirmar = () => {
    setMostrar(false);
    if (onConfirmar) onConfirmar();
  };

  const manejarCancelar = () => {
    setMostrar(false);
    if (onCancelar) onCancelar();
  };

  const manejarClickModal = (e) => {
    e.stopPropagation();
  };

  if (!mostrar) return null;

  const configuraciones = {
    peligro: {
      fondo: "bg-white border-secondary",
      icono: icono || "⚠️",
      iconoFondo: "bg-red-100 text-secondary",
      titulo: "text-primary",
      mensaje: "text-gray-700",
      btnConfirmar: "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 text-white",
      btnCancelar: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
      overlay: "bg-black bg-opacity-50"
    },
    advertencia: {
      fondo: "bg-white border-yellow-400",
      icono: icono || "⚠️",
      iconoFondo: "bg-yellow-100 text-yellow-600",
      titulo: "text-primary",
      mensaje: "text-gray-700",
      btnConfirmar: "bg-yellow-500 hover:bg-yellow-600 text-white",
      btnCancelar: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
      overlay: "bg-black bg-opacity-50"
    },
    informacion: {
      fondo: "bg-white border-blue-400",
      icono: icono || "ℹ️",
      iconoFondo: "bg-blue-100 text-blue-600",
      titulo: "text-primary",
      mensaje: "text-gray-700",
      btnConfirmar: "bg-blue-500 hover:bg-blue-600 text-white",
      btnCancelar: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
      overlay: "bg-black bg-opacity-50"
    }
  };

  const config = configuraciones[tipo];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${config.overlay}`}
      onClick={mostrarCerrar ? manejarCancelar : undefined}
    >
      <div 
        className={`w-full max-w-md transform transition-all duration-300 ease-in-out ${
          mostrar ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={manejarClickModal}
      >
        <div className={`rounded-xl border-2 bg-white shadow-2xl ${config.fondo} ${className}`}>
          {/* Header con icono y botón cerrar opcional */}
          <div className="flex items-start p-6 pb-4">
            {/* Icono */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${config.iconoFondo} mr-4`}>
              <span className="text-2xl">{config.icono}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold mb-2 ${config.titulo}`}>
                {titulo}
              </h3>
            </div>

            {/* Botón cerrar opcional */}
            {mostrarCerrar && (
              <button
                onClick={manejarCancelar}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            )}
          </div>

          {/* Contenido */}
          <div className="px-6 pb-6">
            <p className={`text-sm leading-relaxed ${config.mensaje}`}>
              {mensaje}
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0 sm:justify-end">
            <button
              onClick={manejarCancelar}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${config.btnCancelar}`}
            >
              {textoBtnCancelar}
            </button>
            <button
              onClick={manejarConfirmar}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${config.btnConfirmar}`}
            >
              {textoBtnConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para manejar confirmaciones de forma más fácil
export function useConfirm() {
  const [confirmData, setConfirmData] = useState(null);

  const mostrarConfirm = (opciones) => {
    return new Promise((resolve) => {
      setConfirmData({
        ...opciones,
        visible: true,
        onConfirmar: () => {
          setConfirmData(null);
          resolve(true);
        },
        onCancelar: () => {
          setConfirmData(null);
          resolve(false);
        }
      });
    });
  };

  const cerrarConfirm = () => {
    setConfirmData(null);
  };

  // Funciones de conveniencia
  const confirmarEliminacion = (elemento = "elemento") => {
    return mostrarConfirm({
      titulo: "Confirmar eliminación",
      mensaje: `¿Estás seguro de que quieres eliminar este ${elemento}? Esta acción no se puede deshacer.`,
      tipo: "peligro",
      textoBtnConfirmar: "Eliminar",
      textoBtnCancelar: "Cancelar",
      icono: "🗑️"
    });
  };

  const confirmarAccion = (titulo, mensaje, opciones = {}) => {
    return mostrarConfirm({
      titulo,
      mensaje,
      tipo: "advertencia",
      textoBtnConfirmar: "Confirmar",
      textoBtnCancelar: "Cancelar",
      ...opciones
    });
  };

  return {
    confirmData,
    mostrarConfirm,
    cerrarConfirm,
    confirmarEliminacion,
    confirmarAccion,
    // Componente para renderizar
    ConfirmComponent: confirmData ? <Confirm {...confirmData} /> : null
  };
}