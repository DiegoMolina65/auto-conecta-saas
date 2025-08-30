import React, { useState, useEffect, createContext, useContext, useCallback } from "react";

const AlertContext = createContext();

export function Alert({ 
  tipo = "informacion", 
  mensaje,
  onCerrar,
}) {

  const configuraciones = {
    exito: { fondo: "bg-green-50 border-green-200 text-green-700", icono: "✅" },
    error: { fondo: "bg-red-50 border-red-200 text-red-700", icono: "❌" },
    advertencia: { fondo: "bg-yellow-50 border-yellow-200 text-yellow-700", icono: "⚠️" },
    informacion: { fondo: "bg-blue-50 border-blue-200 text-blue-700", icono: "ℹ️" }
  };

  const config = configuraciones[tipo];

  return (
    <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${config.fondo} flex items-start`}>
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3">
            <span className="text-lg">{config.icono}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm">{mensaje}</p>
        </div>
        <button onClick={onCerrar} className="ml-3 text-xl leading-none">&times;</button>
    </div>
  );
}

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const mostrarAlert = useCallback((tipo, mensaje, duracion = 5000) => {
        const id = Date.now() + Math.random();
        setAlerts(prev => [...prev, { id, tipo, mensaje }]);

        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, duracion);
    }, []);

    const exito = useCallback((mensaje, duracion) => mostrarAlert('exito', mensaje, duracion), [mostrarAlert]);
    const error = useCallback((mensaje, duracion) => mostrarAlert('error', mensaje, duracion), [mostrarAlert]);
    const advertencia = useCallback((mensaje, duracion) => mostrarAlert('advertencia', mensaje, duracion), [mostrarAlert]);
    const informacion = useCallback((mensaje, duracion) => mostrarAlert('informacion', mensaje, duracion), [mostrarAlert]);

    const cerrarAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ exito, error, advertencia, informacion }}>
            {children}
            <div className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-2">
                {alerts.map(alert => (
                    <Alert 
                        key={alert.id} 
                        tipo={alert.tipo} 
                        mensaje={alert.mensaje} 
                        onCerrar={() => cerrarAlert(alert.id)}
                    />
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert debe ser usado dentro de un AlertProvider');
    }
    return context;
};
