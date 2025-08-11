import React from "react";
import { Navigate } from "react-router-dom";

import Login from '../../presentation/screens/login-registro-usuarios/loginScreen.jsx'
import Registro from '../../presentation/screens/login-registro-usuarios/registroScreen.jsx'
import DashboardAdmin from '../../presentation/screens/dashboard-admin/dashboardScreen.jsx'
import NotFoundScreen from '../../presentation/screens/not-found/notFoundScreen.jsx'
import RegistroAuto from "../../presentation/screens/autos/registro-autos/registroAutoScreen.jsx";

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
        path: "/registro",
        element: <Registro/>
    },

    // Rutas para admin, vendedor
    {
        path: "/dashboard",
        element: <DashboardAdmin/>
    },
    {
        path: "/registro-auto",
        element: <RegistroAuto/>
    },


    // Ruta para paginas no encontradas
    {
        path: "*",
        element: <NotFoundScreen/>
    }
]