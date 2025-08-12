import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const stats = [
    { title: "Total Autos", value: "248", icon: "🚗", color: "bg-blue-500", trend: "+12%" },
    { title: "Usuarios Activos", value: "156", icon: "👥", color: "bg-green-500", trend: "+8%" },
    { title: "Vendedores", value: "42", icon: "🤝", color: "bg-purple-500", trend: "+5%" },
    { title: "Ventas del Mes", value: "18", icon: "📊", color: "bg-orange-500", trend: "+23%" }
  ];

  const recentActivities = [
    { action: "Nuevo auto registrado", user: "Juan Pérez", time: "Hace 2 horas", icon: "🚗" },
    { action: "Usuario registrado", user: "María González", time: "Hace 3 horas", icon: "👤" },
    { action: "Auto vendido", user: "Carlos López", time: "Hace 5 horas", icon: "💰" },
    { action: "Vendedor aprobado", user: "Ana Martínez", time: "Hace 1 día", icon: "✅" }
  ];

  const quickActions = [
    { title: "Registrar Auto", icon: "➕", color: "bg-blue-500", action: () => navigate('/registro-auto') },
    { title: "Nuevo Usuario", icon: "👤", color: "bg-green-500", action: () => navigate('/registro-usuario') },
    { title: "Nuevo Vendedor", icon: "🤝", color: "bg-purple-500", action: () => navigate('/registro-vendedor') },
    { title: "Ver Reportes", icon: "📈", color: "bg-orange-500", action: () => console.log('Reportes') }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {/* Dashboard Home */}
          <button
            onClick={() => setOpenMenu(null)}
            className="w-full flex items-center py-3 px-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white transition-all duration-200 group"
          >
            <span className="text-xl mr-3">🏠</span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          {/* Autos Menu */}
          <div>
            <button
              onClick={() => toggleMenu('autos')}
              className="w-full flex justify-between items-center py-3 px-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🚗</span>
                {!sidebarCollapsed && <span>Gestión de Autos</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="transform transition-transform duration-200 group-hover:rotate-180">
                  {openMenu === 'autos' ? '▲' : '▼'}
                </span>
              )}
            </button>
            {openMenu === 'autos' && !sidebarCollapsed && (
              <div className="ml-4 mt-2 space-y-1 animate-fade-in">
                <button
                  onClick={() => navigate('/autos-registrados-por-vendedor')}
                  className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 border-l-2 border-transparent hover:border-blue-400"
                >
                  📋 Autos Registrados
                </button>
                <button
                  onClick={() => navigate('/registro-auto')}
                  className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 border-l-2 border-transparent hover:border-blue-400"
                >
                  ➕ Registrar Auto
                </button>
              </div>
            )}
          </div>

          {/* Usuarios Menu */}
          <div>
            <button
              onClick={() => toggleMenu('usuarios')}
              className="w-full flex justify-between items-center py-3 px-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">👥</span>
                {!sidebarCollapsed && <span>Gestión de Usuarios</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="transform transition-transform duration-200 group-hover:rotate-180">
                  {openMenu === 'usuarios' ? '▲' : '▼'}
                </span>
              )}
            </button>
            {openMenu === 'usuarios' && !sidebarCollapsed && (
              <div className="ml-4 mt-2 space-y-1 animate-fade-in">
                <button
                  onClick={() => navigate('/usuarios-rol-usuario')}
                  className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 border-l-2 border-transparent hover:border-purple-400"
                >
                  👤 Usuarios registrados
                </button>
                <button
                  onClick={() => navigate('/usuarios-rol-vendedor')}
                  className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 border-l-2 border-transparent hover:border-purple-400"
                >
                  🤝 Vendedores registrados
                </button>
                <button
                  onClick={() => navigate('/registro-usuario')}
                  className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 border-l-2 border-transparent hover:border-purple-400"
                >
                  ➕ Nuevo Usuario
                </button>
                <button
                  onClick={() => navigate('/registro-vendedor')}
                  className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 border-l-2 border-transparent hover:border-purple-400"
                >
                  ➕ Nuevo Vendedor
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-white font-medium">Admin User</p>
                <p className="text-gray-400 text-xs">Administrador</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
              <p className="text-gray-600 text-sm mt-1">Panel de control y gestión del sistema</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <span className="text-xl">🔔</span>
                </button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h2>
              <p className="text-blue-100">Gestiona eficientemente todos los aspectos de tu plataforma automotriz</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    <p className="text-green-500 text-sm font-medium mt-1">{stat.trend}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <span className="font-medium text-gray-700">{action.title}</span>
                      <span className="ml-auto text-gray-400 group-hover:text-gray-600">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <span>{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}