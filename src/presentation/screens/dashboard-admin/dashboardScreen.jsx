import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { obtenerUsuarioPorId } from "../../../insfrastructure/services/usuarioServicio.js";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usuarioData = await obtenerUsuarioPorId(user.uid);
        setUsuario(usuarioData);
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigation = (path) => {
    navigate(path);
  }

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
            onClick={() => handleNavigation("/dashboard")}
            className="w-full flex items-center py-3 px-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white transition-all duration-200 group"
          >
            <span className="text-xl mr-3">🏠</span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          {/* Autos Menu */}
          <div>
            <button
              onClick={() => toggleMenu("autos")}
              className="w-full flex justify-between items-center py-3 px-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🚗</span>
                {!sidebarCollapsed && <span>Gestión de Autos</span>}
              </div>
              {!sidebarCollapsed && (
                <span
                  className={`transform transition-transform duration-200 ${
                    openMenu === "autos" ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              )}
            </button>
            {openMenu === "autos" && !sidebarCollapsed && (
              <div className="ml-4 mt-2 space-y-2 pl-2 border-l-2 border-gray-700">
                {/* Sección Administración */}
                {usuario && usuario.role === "admin" && (
                  <div>
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Administración
                    </h3>
                    <button
                      onClick={() => handleNavigation("todos-los-autos")}
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Ver todos los autos
                    </button>
                    <button
                      onClick={() =>
                        handleNavigation("registro-auto-admin")
                      }
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Registrar auto para vendedor
                    </button>
                  </div>
                )}

                {/* Sección Vendedor */}
                <div>
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vendedor
                  </h3>
                  <button
                    onClick={() => handleNavigation("registro-auto")}
                    className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                  >
                    Registrar un nuevo auto
                  </button>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "autos-registrados-por-vendedor-logueado"
                      )
                    }
                    className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                  >
                    Mis autos publicados
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Usuarios Menu */}
          {usuario && usuario.role === "admin" && (
            <div>
              <button
                onClick={() => toggleMenu("usuarios")}
                className="w-full flex justify-between items-center py-3 px-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 hover:text-white transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">👥</span>
                  {!sidebarCollapsed && <span>Gestión de Usuarios</span>}
                </div>
                {!sidebarCollapsed && (
                  <span
                    className={`transform transition-transform duration-200 ${
                      openMenu === "usuarios" ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                )}
              </button>
              {openMenu === "usuarios" && !sidebarCollapsed && (
                <div className="ml-4 mt-2 space-y-2 pl-2 border-l-2 border-gray-700">
                  <div>
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Administración
                    </h3>
                    <button
                      onClick={() =>
                        handleNavigation("usuarios-rol-usuario")
                      }
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Role Usuarios
                    </button>
                    <button
                      onClick={() =>
                        handleNavigation("usuarios-rol-vendedor")
                      }
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Role Vendedores
                    </button>
                    <button
                      onClick={() =>
                        handleNavigation("todos-usuarios-registrados")
                      }
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Ver todos los usuarios
                    </button>
                    <button
                      onClick={() => handleNavigation("registro-usuario")}
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Registrar nuevo usuario
                    </button>
                    <button
                      onClick={() => handleNavigation("registro-vendedor")}
                      className="w-full text-left py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
                    >
                      Registrar nuevo vendedor
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => handleNavigation('perfil')} className="w-full">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{usuario ? usuario.nombres[0] : 'A'}</span>
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Admin User'}</p>
                    <p className="text-gray-400 text-xs">{usuario ? usuario.role : 'Administrador'}</p>
                  </div>
                )}
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}