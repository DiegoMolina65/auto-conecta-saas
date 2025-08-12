import React from "react";
import { Navigate } from "react-router-dom";

import Login from '../../presentation/screens/login-registro-usuarios/loginScreen.jsx'
import RegistroUsuarios from '../../presentation/screens/login-registro-usuarios/registroScreenUsuarios.jsx'
import RegistroVendedores from "../../presentation/screens/login-registro-usuarios/registroScreenVendedores.jsx";
import DashboardAdmin from '../../presentation/screens/dashboard-admin/dashboardScreen.jsx'
import NotFoundScreen from '../../presentation/screens/not-found/notFoundScreen.jsx'
import RegistroAuto from "../../presentation/screens/autos/registro-autos-vendedor/registroAutoScreen.jsx";
import AutosRegistradosPorVendedor from "../../presentation/screens/autos/autos-registros-por-vendedor/autosRegistradosPorVendedorScreen.jsx";
import EditarAuto from "../../presentation/screens/autos/editar-auto-vendedor/editarAutoScreen.jsx";

import MostrarUsuariosRoleUsuario from "../../presentation/screens/usuarios/role-usuario/mostrarUsuariosRoleUsuarioScreen.jsx";
import MostrarUsuariosRoleVendedor from "../../presentation/screens/usuarios/role-vendedor/mostrarUsuariosRoleVendedorScreen.jsx";
import EditarUsuario from "../../presentation/screens/usuarios/editar-usuario/editarUsuarioScreen.jsx";

export const appConfigRoutes = [
    // Ruta principal
    {
        path: "/",
        element: <Login/>
    },

    // Login y Registro
    {
        path: "/login",
        element: <Navigate to="/" />
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
        element: <DashboardAdmin/>
    },
    {
        path: "/usuarios-rol-usuario",
        element: <MostrarUsuariosRoleUsuario/>
    },
    {
        path: "/usuarios-rol-vendedor",
        element: <MostrarUsuariosRoleVendedor/>
    },
    {
        path: "/editar-usuario/:id",
        element: <EditarUsuario/>
    },
    {
        path: "/registro-auto",
        element: <RegistroAuto/>
    },
    {
        path: "/autos-registrados-por-vendedor",
        element: <AutosRegistradosPorVendedor/>
    },
    {
        path: "/editar-auto/:id",
        element: <EditarAuto/>
    },


    // Ruta para paginas no encontradas
    {
        path: "*",
        element: <NotFoundScreen/>
    }
]