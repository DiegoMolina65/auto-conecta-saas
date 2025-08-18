import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { obtenerUsuarioPorId } from '../../../../insfrastructure/services/usuarioServicio.js';
import { Spinner } from '../../../../shared/components/Spinner.jsx';
import { Alert, useAlert } from '../../../../shared/components/Alert.jsx';
import { useNavigate } from 'react-router-dom';

// Componentes de iconos SVG
const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CreditCardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EditIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function PerfilUsuarioScreen() {
  const [usuario, setUsuario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const { alerts, error: alertaError, success: alertaSuccess, cerrarAlert } = useAlert();
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      alertaSuccess('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      navigate("/login"); // Redirect to login page
    } catch (error) {
      alertaError('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await obtenerUsuarioPorId(user.uid);
          setUsuario(userData);
        } catch (err) {
          alertaError('Error de carga', 'No se pudo cargar la información del perfil. Inténtalo de nuevo más tarde.');
        } finally {
          setEstaCargando(false);
        }
      } else {
        setUsuario(null);
        setEstaCargando(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (estaCargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tertiary via-white to-tertiary">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600 animate-pulse">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tertiary via-white to-tertiary px-4">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-100 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfil no disponible</h3>
          <p className="text-gray-600 mb-6">No se pudo cargar el perfil del usuario o no ha iniciado sesión.</p>
          <button className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-red-700 transition-colors" style={{ backgroundColor: '#A11312' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-secondary/10 text-secondary border-secondary/20',
      manager: 'bg-edit/10 text-edit border-edit/20',
      user: 'bg-success/10 text-success border-success/20',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role.toLowerCase()] || colors.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      activo: 'bg-success/10 text-success border-success/20',
      inactivo: 'bg-secondary/10 text-secondary border-secondary/20',
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status.toLowerCase()] || colors.default;
  };

  const infoCards = [
    {
      id: 'email',
      icon: MailIcon,
      label: 'Correo Electrónico',
      value: usuario.correoElectronico,
      color: 'from-edit to-blue-500'
    },
    {
      id: 'carnet',
      icon: CreditCardIcon,
      label: 'Carnet de Identidad',
      value: usuario.carnetDeIdentidad || 'No especificado',
      color: 'from-secondary to-red-600'
    },
    {
      id: 'phone',
      icon: PhoneIcon,
      label: 'Número de Teléfono',
      value: usuario.numeroDeTelefono || 'No especificado',
      color: 'from-success to-green-600'
    },
    {
      id: 'status',
      icon: ShieldIcon,
      label: 'Estado de Usuario',
      value: usuario.estadoUsuario.charAt(0).toUpperCase() + usuario.estadoUsuario.slice(1),
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary via-white to-tertiary py-8 px-4">
      {/* Header con patrón de fondo */}
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-8 mb-8 shadow-2xl">
          {/* Patrón de fondo animado */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-4 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
            <div className="absolute -bottom-4 right-1/3 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar simplificado */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <UserIcon className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Información del usuario */}
            <div className="flex-1 text-center md:text-left text-gray-800 p-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {usuario.nombres} {usuario.apellidos}
              </h1>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getRoleColor(usuario.role)}`}>
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  {usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(usuario.estadoUsuario)}`}>
                  <ShieldIcon className="w-4 h-4 inline mr-2" />
                  {usuario.estadoUsuario.charAt(0).toUpperCase() + usuario.estadoUsuario.slice(1)}
                </span>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-red-700 transition-all duration-300 hover:scale-105"
                >
                  <LogoutIcon className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  hoveredCard === card.id ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradiente superior */}
                <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
                      <p className="text-lg font-semibold text-gray-800 break-words">{card.value}</p>
                    </div>
                  </div>
                  
                  {/* Barra de progreso decorativa */}
                  <div className="w-full bg-gray-100 rounded-full h-1 mb-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 delay-300`}
                      style={{ width: hoveredCard === card.id ? '100%' : '60%' }}
                    ></div>
                  </div>
                </div>

                {/* Efecto de brillo al hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Renderizar alerts con posición mejorada */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {alerts.map((alert, index) => (
          <Alert
            key={alert.id}
            tipo={alert.tipo}
            titulo={alert.titulo}
            mensaje={alert.mensaje}
            visible={alert.visible}
            onCerrar={() => cerrarAlert(alert.id)}
            accionBoton={alert.accionBoton}
            textoBoton={alert.textoBoton}
            autodismiss={alert.autodismiss}
            duracion={alert.duracion}
            style={{ 
              transform: `translateY(${index * 10}px)`,
              animation: 'slideInRight 0.3s ease-out'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}