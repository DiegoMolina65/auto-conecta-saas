import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../shared/components/Button.jsx";
import { Input } from "../../../shared/components/Input.jsx";
import { Alert, useAlert } from "../../../shared/components/Alert.jsx";

import { iniciarSesion } from "../../../insfrastructure/services/autentificacionServicio.js";

export default function Login() {
  const navigate = useNavigate(); 
  const [datosFormulario, setDatosFormulario] = useState({
    correo: "",
    contrasena: ""
  });
  
  const [errores, setErrores] = useState({});
  const [estaCargando, setEstaCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  
  // Hook de alerts
  const { alerts, exito, error, advertencia, informacion, cerrarAlert } = useAlert();

  const manejarCambioInput = (campo) => (evento) => {
    setDatosFormulario(anterior => ({
      ...anterior,
      [campo]: evento.target.value
    }));
    
    if (errores[campo]) {
      setErrores(anterior => ({
        ...anterior,
        [campo]: ""
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!datosFormulario.correo) {
      nuevosErrores.correo = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(datosFormulario.correo)) {
      nuevosErrores.correo = "El correo electrónico no es válido";
    }
    
    if (!datosFormulario.contrasena) {
      nuevosErrores.contrasena = "La contraseña es requerida";
    } else if (datosFormulario.contrasena.length < 6) {
      nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }
    
    return nuevosErrores;
  };

  const manejarLogin = async (evento) => {
    evento.preventDefault();

    const erroresFormulario = validarFormulario();
    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario);
      return;
    }

    setEstaCargando(true);

    try {
      // Función para iniciar sesión
      const usuario = await iniciarSesion({
        correoElectronico: datosFormulario.correo,
        contrasena: datosFormulario.contrasena,
      });

      exito("Login exitoso", `Bienvenido, ${usuario.displayName || usuario.email}`);

      // Redirigir al dashboard
      navigate("/registro-auto"); 

    } catch (err) {
      error("Error de autenticación", err.message || "No se pudo iniciar sesión");
    } finally {
      setEstaCargando(false);
    }
  };


  const manejarRecuperarContrasena = () => {
    // Lógica para recuperar contraseña
    informacion("Funcionalidad no implementada", "Próximamente podrás recuperar tu contraseña");
  }

  const manejarRegistro = () => {
    // Redirigir a la pantalla de registro
    navigate("/registro");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tertiary to-orange-100 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-white to-orange-100"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-xl"></div>
      
      <div className="relative max-w-md w-full">
        {/* Tarjeta principal */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="w-50 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl text-black">AutoConecta</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-600">
              Ingresa a tu cuenta de AutoConecta
            </p>
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="Ingrese su correo"
              valor={datosFormulario.correo}
              onChange={manejarCambioInput('correo')}
              error={errores.correo}
              icon="📧"
              size="lg"
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                valor={datosFormulario.contrasena}
                onChange={manejarCambioInput('contrasena')}
                error={errores.contrasena}
                icon="🔒"
                size="lg"
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {mostrarContrasena ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Enlace olvidar contraseña */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-secondary hover:text-red-900 font-medium transition-colors"
                onClick={manejarRecuperarContrasena}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de login */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={manejarLogin}
              disabled={estaCargando}
            >
              {estaCargando ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </div>

          {/* Enlace de registro */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                className="font-semibold text-secondary hover:text-red-900 transition-colors"
                onClick={manejarRegistro}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        {/* Texto del pie */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Al iniciar sesión, aceptas nuestros términos y condiciones
        </p>
      </div>

      {/* Renderizar alerts */}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
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
            style={{ transform: `translateY(${index * 10}px)` }}
          />
        ))}
      </div>
    </div>
  );
}