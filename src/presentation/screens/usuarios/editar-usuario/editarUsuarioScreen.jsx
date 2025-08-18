import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerUsuarioPorId, actualizarUsuario } from '../../../../insfrastructure/services/usuarioServicio.js';
import { Spinner } from '../../../../shared/components/Spinner.jsx';
import { Input } from '../../../../shared/components/Input.jsx';
import { Button } from '../../../../shared/components/Button.jsx';
import { useAlert, Alert } from '../../../../shared/components/Alert.jsx';
import { Select } from '../../../../shared/components/Select.jsx';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts, exito, error: alertaError, cerrarAlert } = useAlert();

  const [usuario, setUsuario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [datosFormulario, setDatosFormulario] = useState({
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    carnetDeIdentidad: '',
    numeroDeTelefono: '',
    estadoUsuario: 'activo',
    role: ''
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setEstaCargando(true);
        const usuarioData = await obtenerUsuarioPorId(id);
        if (usuarioData) {
          setUsuario(usuarioData);
          setDatosFormulario(usuarioData);
        } else {
          alertaError('Error', 'Usuario no encontrado.');
          navigate(-1); 
        }
      } catch (error) {
        alertaError('Error de carga', 'No se pudo cargar la información del usuario. Inténtalo de nuevo más tarde.');
      } finally {
        setEstaCargando(false);
      }
    };

    fetchUsuario();
  }, [id, navigate]);

  const manejarCambioInput = (campo) => (eventoOrOpcion) => {
    let valor = "";

    if (
      eventoOrOpcion &&
      typeof eventoOrOpcion === "object" &&
      "value" in eventoOrOpcion
    ) {
      valor = eventoOrOpcion.value ?? "";
    } else if (
      eventoOrOpcion &&
      eventoOrOpcion.target &&
      "value" in eventoOrOpcion.target
    ) {
      valor = eventoOrOpcion.target.value;
    } else {
      valor = "";
    }

    setDatosFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
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
    if (!datosFormulario.nombres.trim()) 
      nuevosErrores.nombres = "El nombre es requerido";
    if (!datosFormulario.apellidos.trim()) 
      nuevosErrores.apellidos = "El apellido es requerido";
    if (!datosFormulario.carnetDeIdentidad.trim()) 
      nuevosErrores.carnetDeIdentidad = "El carnet de identidad es requerido";
    if (!datosFormulario.numeroDeTelefono.trim()) {
      nuevosErrores.numeroDeTelefono = "El número de teléfono es requerido";
    } else if (!/^\d{7,15}$/.test(datosFormulario.numeroDeTelefono)) {
      nuevosErrores.numeroDeTelefono = "El número de teléfono debe tener entre 7 y 15 dígitos";
    }
    return nuevosErrores;
  };

  const manejarActualizacion = async (evento) => {
    evento.preventDefault();

    const erroresFormulario = validarFormulario();
    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario);
      return;
    }

    setEstaCargando(true);

    try {
      await actualizarUsuario(id, datosFormulario);
      exito("Usuario actualizado", "La información del usuario ha sido actualizada exitosamente");

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error(error);
      alertaError("Error al actualizar", "No se pudo actualizar la información del usuario");
    } finally {
      setEstaCargando(false);
    }
  };

  if (estaCargando && !datosFormulario.nombres) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary to-orange-100 px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-white to-orange-100 -z-10"></div>

      <div className="absolute top-20 left-10 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-xl"></div>

      <div className="relative max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-800 to-white text-white p-6 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Editar Usuario</h1>
              <p className="text-gray-300 text-sm">
                Actualiza la información del usuario en el sistema
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={manejarActualizacion} className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                1
              </span>
              Información Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombres"
                placeholder="Ingresa los nombres"
                valor={datosFormulario.nombres || ''}
                onChange={manejarCambioInput('nombres')}
                error={errores.nombres}
                icon="👤"
                size="md"
              />
              <Input
                label="Apellidos"
                placeholder="Ingresa los apellidos"
                valor={datosFormulario.apellidos || ''}
                onChange={manejarCambioInput('apellidos')}
                error={errores.apellidos}
                icon="👤"
                size="md"
              />
            </div>

            <div className="mt-4">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                valor={datosFormulario.correoElectronico || ''}
                onChange={manejarCambioInput('correoElectronico')}
                disabled
                icon="📧"
                size="md"
              />
              <p className="text-xs text-gray-500 mt-1">
                El correo electrónico no puede ser modificado
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                2
              </span>
              Información de Contacto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Carnet de Identidad"
                placeholder="Número de CI"
                valor={datosFormulario.carnetDeIdentidad || ''}
                onChange={manejarCambioInput('carnetDeIdentidad')}
                error={errores.carnetDeIdentidad}
                icon="🪪"
                size="md"
              />
              <Input
                label="Número de Teléfono"
                type="tel"
                placeholder="70123456"
                valor={datosFormulario.numeroDeTelefono || ''}
                onChange={manejarCambioInput('numeroDeTelefono')}
                error={errores.numeroDeTelefono}
                icon="📱"
                size="md"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                3
              </span>
              Configuración de Cuenta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado del Usuario
                </label>
                <Select
                  value={datosFormulario.estadoUsuario || ''}
                  onChange={manejarCambioInput('estadoUsuario')}
                  options={[
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
                  ]}
                  placeholder="Selecciona el estado"
                  variant="primary"
                  size="md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol del Usuario
                </label>
                <Input
                  placeholder="Rol asignado"
                  valor={datosFormulario.role || ''}
                  onChange={manejarCambioInput('role')}
                  disabled
                  icon="🔐"
                  size="md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El rol del usuario no puede ser modificado desde aquí
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
              className="flex-1"
              disabled={estaCargando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              size="lg"
              className="flex-1"
              disabled={estaCargando}
            >
              {estaCargando ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                "Actualizar Usuario"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {alerts.map((alert, index) => (
          <Alert
            key={alert.id}
            tipo={alert.tipo}
            titulo={alert.titulo}
            mensaje={alert.mensaje}
            visible={alert.visible}
            onCerrar={() => cerrarAlert(alert.id)}
            autodismiss={alert.autodismiss}
            duracion={alert.duracion}
            style={{ transform: `translateY(${index * 10}px)` }}
          />
        ))}
      </div>
    </div>
  );
}