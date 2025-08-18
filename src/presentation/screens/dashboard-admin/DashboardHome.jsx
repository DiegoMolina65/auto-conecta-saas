import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerTodosLosAutos,
  obtenerAutosRecientes,
} from "../../../insfrastructure/services/autoServicio.js";
import {
  obtenerUsuariosPorRole,
  obtenerUsuariosRecientes,
} from "../../../insfrastructure/services/usuarioServicio.js";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      title: "Total autos registrados",
      value: "0",
      icon: "🚗",
      color: "bg-blue-500",
    },
    { title: "Usuarios", value: "0", icon: "👥", color: "bg-green-500" },
    { title: "Vendedores", value: "0", icon: "🤝", color: "bg-purple-500" },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStatsAndActivities = async () => {
      try {
        const [autos, usuarios, vendedores, autosRecientes, usuariosRecientes] =
          await Promise.all([
            obtenerTodosLosAutos(),
            obtenerUsuariosPorRole("usuario"),
            obtenerUsuariosPorRole("vendedor"),
            obtenerAutosRecientes(5),
            obtenerUsuariosRecientes(5),
          ]);

        setStats([
          {
            title: "Total autos registrados",
            value: autos.length,
            icon: "🚗",
            color: "bg-blue-500",
          },
          {
            title: "Usuarios",
            value: usuarios.length,
            icon: "👥",
            color: "bg-green-500",
          },
          {
            title: "Vendedores",
            value: vendedores.length,
            icon: "🤝",
            color: "bg-purple-500",
          },
        ]);

        const combinedActivities = [
          ...autosRecientes.map((auto) => ({
            action: "Nuevo auto registrado",
            user: `${auto.marca} ${auto.modelo}`,
            time:
              typeof auto.fechaPublicacion?.toDate === "function"
                ? auto.fechaPublicacion.toDate()
                : new Date(auto.fechaPublicacion),
            icon: "🚗",
          })),
          ...usuariosRecientes.map((user) => ({
            action: "Usuario registrado",
            user: `${user.nombres} ${user.apellidos}`,
            time:
              typeof user.creadoEn?.toDate === "function"
                ? user.creadoEn.toDate()
                : new Date(user.creadoEn),
            icon: "👤",
          })),
        ];

        combinedActivities.sort((a, b) => b.time - a.time);
        setRecentActivities(combinedActivities.slice(0, 5));
      } catch (error) {
        console.error("Error fetching stats and activities:", error);
      }
    };

    fetchStatsAndActivities();
  }, []);

  const quickActions = [
    {
      title: "Registrar Auto",
      icon: "➕",
      color: "bg-blue-500",
      action: () => navigate("/dashboard/registro-auto"),
    },
    {
      title: "Nuevo Usuario",
      icon: "👤",
      color: "bg-green-500",
      action: () => navigate("/dashboard/registro-usuario"),
    },
    {
      title: "Nuevo Vendedor",
      icon: "🤝",
      color: "bg-purple-500",
      action: () => navigate("/dashboard/registro-vendedor"),
    },
    {
      title: "Ver Reportes",
      icon: "📈",
      color: "bg-orange-500",
      action: () => console.log("Reportes"),
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">
            ¡Bienvenido al Panel de Administración!
          </h2>
          <p className="text-blue-100">
            Gestiona eficientemente todos los aspectos de tu plataforma
            automotriz
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}
              >
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
                >
                  <div
                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <span className="font-medium text-gray-700">
                    {action.title}
                  </span>
                  <span className="ml-auto text-gray-400 group-hover:text-gray-600">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <span>{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(activity.time, {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
