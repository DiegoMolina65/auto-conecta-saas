import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../shared/components/Button.jsx";
import { Input } from "../../../shared/components/Input.jsx";
import { Alert, useAlert } from "../../../shared/components/Alert.jsx";

import { registrarUsuarioDesdeAdmin } from "../../../insfrastructure/services/autentificacionServicio.js";


export default function RegistroVendedores() {
  const navigate = useNavigate(); 
  const [datosFormulario, setDatosFormulario] = useState({
    nombres: "",
    apellidos: "",
    carnetDeIdentidad: "",
    numeroDeTelefono: "",
    correoElectronico: "",
    contrasena: "",
    estadoUsuario: "activo",
    role: "vendedor"
  });

  const [errores, setErrores] = useState({});
  const [estaCargando, setEstaCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const { exito, error } = useAlert();

  const manejarCambioInput = (campo) => (evento) => {
    setDatosFormulario((anterior) => ({
      ...anterior,
      [campo]: evento.target.value
    }));

    if (errores[campo]) {
      setErrores((anterior) => ({
        ...anterior,
        [campo]: ""
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.nombres.trim()) {
      nuevosErrores.nombres = "Los nombres son requeridos";
    }
    if (!datosFormulario.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son requeridos";
    }
    if(!datosFormulario.role.trim()){
      nuevosErrores.role = "El rol es requerido";
    }
    if (!datosFormulario.carnetDeIdentidad.trim()) {
      nuevosErrores.carnetDeIdentidad = "El carnet de identidad es requerido";
    }
    if (!datosFormulario.numeroDeTelefono.trim()) {
      nuevosErrores.numeroDeTelefono = "El número de teléfono es requerido";
    } else if (!/^\d{7,15}$/.test(datosFormulario.numeroDeTelefono)) {
      nuevosErrores.numeroDeTelefono =
        "El número de teléfono no es válido (solo números)";
    }
    if (!datosFormulario.correoElectronico.trim()) {
      nuevosErrores.correoElectronico = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(datosFormulario.correoElectronico)) {
      nuevosErrores.correoElectronico = "El correo electrónico no es válido";
    }
    if (!datosFormulario.contrasena) {
      nuevosErrores.contrasena = "La contraseña es requerida";
    } else if (datosFormulario.contrasena.length < 6) {
      nuevosErrores.contrasena =
        "La contraseña debe tener al menos 6 caracteres";
    }

    return nuevosErrores;
  };

  const manejarRegistro = async (evento) => {
    evento.preventDefault();

    const erroresFormulario = validarFormulario();
    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario);
      return;
    }

    setEstaCargando(true);

    try {
      const usuarioRegistrado = await registrarUsuarioDesdeAdmin(datosFormulario);

      exito("Registro exitoso", "La cuenta ha sido creada correctamente");

      // Redirigir al login después de un breve mensaje
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error(err);
      error("Error en el registro", "No se pudo crear la cuenta");
    } finally {
      setEstaCargando(false);
    }
  };

  const manejarIrLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-tertiary to-orange-100 px-4 py-8">

      <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-white to-orange-100 -z-10"></div>

      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-xl"></div>

      {/* Contenedor formulario optimizado */}
      <div className="relative max-w-4xl w-full mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm">

        <form onSubmit={manejarRegistro} className="flex flex-col">
          {/* Encabezado compacto */}
          <div className="text-center mb-6">
            <div className="w-50 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-2xl text-black font-bold">AutoConecta</span>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1">
              Crea cuenta de vendedor
            </h1>
            <p className="text-gray-600 text-sm">
              Regístra para comenzar a vender autos en AutoConecta
            </p>
          </div>

          {/* Formulario con distribución en filas */}
          <div className="space-y-4">
            {/* Primera fila: Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombres"
                placeholder="Ingrese sus nombres"
                valor={datosFormulario.nombres}
                onChange={manejarCambioInput("nombres")}
                error={errores.nombres}
                icon="🧑"
                size="md"
              />
              <Input
                label="Apellidos"
                placeholder="Ingrese sus apellidos"
                valor={datosFormulario.apellidos}
                onChange={manejarCambioInput("apellidos")}
                error={errores.apellidos}
                icon="🧑"
                size="md"
              />
            </div>

            {/* Segunda fila: CI y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Carnet de Identidad"
                placeholder="Ingrese su CI"
                valor={datosFormulario.carnetDeIdentidad}
                onChange={manejarCambioInput("carnetDeIdentidad")}
                error={errores.carnetDeIdentidad}
                icon="🪪"
                size="md"
              />
              <Input
                label="Número de Teléfono"
                placeholder="Ingrese su número"
                valor={datosFormulario.numeroDeTelefono}
                onChange={manejarCambioInput("numeroDeTelefono")}
                error={errores.numeroDeTelefono}
                icon="📱"
                size="md"
              />
            </div>

            {/* Tercera fila: Email */}
            <div className="w-full">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="Ingrese su correo electrónico"
                valor={datosFormulario.correoElectronico}
                onChange={manejarCambioInput("correoElectronico")}
                error={errores.correoElectronico}
                icon="📧"
                size="md"
              />
            </div>

            {/* Cuarta fila: Contraseña */}
            <div className="relative w-full">
              <Input
                label="Contraseña"
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Ingrese su contraseña (mínimo 6 caracteres)"
                valor={datosFormulario.contrasena}
                onChange={manejarCambioInput("contrasena")}
                error={errores.contrasena}
                icon="🔒"
                size="md"
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                {mostrarContrasena ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            
            

            {/* Quinta fila: Botón de registro */}
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                type="submit"
                disabled={estaCargando}
              >
                {estaCargando ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registrando...</span>
                  </div>
                ) : (
                  "Crear cuenta de vendedor"
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Texto del pie */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Al registrar una cuenta, aceptas nuestros Términos y Condiciones
        </p>
      </div>

      </div>
  );
}
