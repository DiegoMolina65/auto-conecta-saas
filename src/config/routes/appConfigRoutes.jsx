import React from "react";
import { Navigate } from "react-router-dom";

import Login from '../../presentation/screens/login-registro-usuarios/loginScreen.jsx'
import RegistroUsuarios from '../../presentation/screens/login-registro-usuarios/registroScreenUsuarios.jsx'
import RegistroVendedores from "../../presentation/screens/login-registro-usuarios/registroScreenVendedores.jsx";
import DashboardAdmin from '../../presentation/screens/dashboard-admin/dashboardScreen.jsx'
import NotFoundScreen from '../../presentation/screens/not-found/notFoundScreen.jsx'
import RegistroAuto from "../../presentation/screens/autos/registro-autos-vendedor/registroAutoScreen.jsx";
import AutosRegistradosPorVendedorLogueado from "../../presentation/screens/autos/autos-registros-por-vendedor-logueado/autosRegistradosPorVendedorLogueadoScreen.jsx";
import EditarAuto from "../../presentation/screens/autos/editar-auto-vendedor/editarAutoScreen.jsx";
import RegistroAutoAdminScreen from "../../presentation/screens/autos/registro-autos-admin/registroAutoAdminScreen.jsx";

import MostrarUsuariosRoleUsuario from "../../presentation/screens/usuarios/role-usuario/mostrarUsuariosRoleUsuarioScreen.jsx";
import MostrarUsuariosRoleVendedor from "../../presentation/screens/usuarios/role-vendedor/mostrarUsuariosRoleVendedorScreen.jsx";
import MostrarTodosUsuariosRegistrados from "../../presentation/screens/usuarios/todos-usuarios-registrados/mostrarTodosUsuariosRegistradosScreen.jsx";
import EditarUsuario from "../../presentation/screens/usuarios/editar-usuario/editarUsuarioScreen.jsx";
import AutosRegistradosPorVendedor from "../../presentation/screens/autos/autos-registros-por-vendedor/autosRegistradosPorVendedor.jsx";
import PerfilUsuarioScreen from "../../presentation/screens/usuarios/perfil-usuario/perfilUsuarioScreen.jsx";
import TodosAutosRegistrados from "../../presentation/screens/autos/todos-autos-registrados/todosAutosRegistrados.jsx";
import DashboardHome from "../../presentation/screens/dashboard-admin/DashboardHome.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export const appConfigRoutes = [
    // Ruta principal
    {
        path: "/",
        element: <Login/>
    },

    // Login y Registro
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/registro-usuario",
        element: <RegistroUsuarios/>
    },
    {
        path: "/registro-vendedor",
        element: <RegistroVendedores/>
    },

    // Rutas para admin, vendedor
    {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardAdmin/></ProtectedRoute>,
        children: [
            {
                path: "",
                element: <DashboardHome />
            },
            {
                path: "todos-los-autos",
                element: <TodosAutosRegistrados/>
            },
            {
                path: "autos-registrados-por-vendedor-logueado",
                element: <AutosRegistradosPorVendedorLogueado/>
            },
            {
                path: "registro-auto",
                element: <RegistroAuto/>
            },
            {
                path: "registro-auto-admin",
                element: <RegistroAutoAdminScreen/>
            },
            {
                path: "editar-auto/:id",
                element: <EditarAuto/>
            },
            {
                path: "usuarios-rol-usuario",
                element: <MostrarUsuariosRoleUsuario/>
            },
            {
                path: "usuarios-rol-vendedor",
                element: <MostrarUsuariosRoleVendedor/>
            },
            {
                path: "todos-usuarios-registrados",
                element: <MostrarTodosUsuariosRegistrados/>
            },
            {
                path: "editar-usuario/:id",
                element: <EditarUsuario/>
            },
            {
                path: "autos-vendedor/:vendedorId",
                element: <AutosRegistradosPorVendedor/>
            },
            {
                path: "perfil",
                element: <PerfilUsuarioScreen/>
            },
            {
                path: "registro-usuario",
                element: <RegistroUsuarios/>
            },
            {
                path: "registro-vendedor",
                element: <RegistroVendedores/>
            },
        ]
    },
    
    // Ruta para paginas no encontradas
    {
        path: "*",
        element: <NotFoundScreen/>
    }
]