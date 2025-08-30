import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Label } from '../../../shared/components/Label.jsx';
import { Textarea } from '../../../shared/components/Textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card.jsx';
import { useAlert } from '../../../shared/components/Alert.jsx';
import { crearReservaPruebaManejo } from '../../../insfrastructure/services/reservasServicio.js';
import { obtenerTodosLosUsuarios } from '../../../insfrastructure/services/usuarioServicio.js';
import { obtenerTodosLosAutos } from '../../../insfrastructure/services/autoServicio.js';
import ReservasPruebasManejoEntidad from '../../../domain/entities/ReservasPruebasManejoEntidad.js';
import { User, Car, Calendar, Clock, MessageSquare, CheckCircle, AlertTriangle, ArrowLeft, Plus } from 'lucide-react';

export default function CrearReservaScreen() {
  const navigate = useNavigate();
  const { exito, error: mostrarError } = useAlert();
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [estaCargandoDatos, setEstaCargandoDatos] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [autos, setAutos] = useState([]);
  const [pasoActual, setPasoActual] = useState(1);

  const [datosFormulario, setDatosFormulario] = useState({
    idUsuario: '',
    idAuto: '',
    fecha: '',
    hora: '',
    estado: 'pendiente',
    comentarios: '',
  });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [usuariosData, autosData] = await Promise.all([
          obtenerTodosLosUsuarios(),
          obtenerTodosLosAutos()
        ]);
        setUsuarios(usuariosData);
        setAutos(autosData);
      } catch (err) {
        console.error("Error al cargar usuarios o autos:", err);
        mostrarError('No se pudieron cargar los datos necesarios para crear la reserva.');
      } finally {
        setEstaCargandoDatos(false);
      }
    };
    cargarDatosIniciales();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    const { idUsuario, idAuto, fecha, hora } = datosFormulario;
    if (!idUsuario) {
      mostrarError('Debe seleccionar un usuario.');
      return false;
    }
    if (!idAuto) {
      mostrarError('Debe seleccionar un auto.');
      return false;
    }
    if (!fecha) {
      mostrarError('La fecha de la reserva es obligatoria.');
      return false;
    }
    if (!hora) {
      mostrarError('La hora de la reserva es obligatoria.');
      return false;
    }
    return true;
  };

  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setEstaEnviando(true);
    try {
      const usuarioSeleccionado = usuarios.find(u => u.id === datosFormulario.idUsuario);
      const autoSeleccionado = autos.find(a => a.id === datosFormulario.idAuto);

      if (!usuarioSeleccionado || !autoSeleccionado) {
        mostrarError('Usuario o auto seleccionado no válido.');
        setEstaEnviando(false);
        return;
      }

      const nuevaReserva = new ReservasPruebasManejoEntidad(
        null, 
        datosFormulario.idAuto,
        datosFormulario.idUsuario,
        datosFormulario.fecha,
        datosFormulario.hora,
        datosFormulario.estado,
        datosFormulario.comentarios,
        `${usuarioSeleccionado.nombres} ${usuarioSeleccionado.apellidos}`,
        usuarioSeleccionado.correoElectronico,
        usuarioSeleccionado.numeroDeTelefono || '',
        `${autoSeleccionado.marca} ${autoSeleccionado.modelo} ${autoSeleccionado.ano}`
      );

      await crearReservaPruebaManejo(nuevaReserva);
      exito('Reserva creada exitosamente!');
      navigate('/dashboard/reservas/todas');
    } catch (err) {
      console.error("Error al crear la reserva:", err);
      mostrarError('Hubo un problema al crear la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setEstaEnviando(false);
    }
  };

  const getEstadoBadgeColor = (estado) => {
    const colors = {
      pendiente: "bg-amber-100 text-amber-800 border-amber-200",
      confirmada: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rechazada: "bg-red-100 text-red-800 border-red-200",
      reprogramada: "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[estado] || colors.pendiente;
  };

  const usuarioSeleccionado = usuarios.find(u => u.id === datosFormulario.idUsuario);
  const autoSeleccionado = autos.find(a => a.id === datosFormulario.idAuto);

  if (estaCargandoDatos) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">  
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                Crear Nueva Reserva
              </h1>
              <p className="text-gray-600 mt-1">
                Complete el formulario para programar una nueva prueba de manejo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4 bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              pasoActual >= 1 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'
            }`}>
              {pasoActual > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Selección</span>
          </div>
          <div className={`h-1 w-16 rounded ${pasoActual >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              pasoActual >= 2 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'
            }`}>
              {pasoActual > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Programación</span>
          </div>
          <div className={`h-1 w-16 rounded ${pasoActual >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              pasoActual >= 3 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Confirmación</span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {pasoActual === 1 && "Seleccionar Usuario y Vehículo"}
            {pasoActual === 2 && "Programar Fecha y Hora"}
            {pasoActual === 3 && "Detalles Finales"}
          </CardTitle>
        </div>
        
        <CardContent className="p-6">
          <form onSubmit={manejarEnvioFormulario} className="space-y-6">
            {/* Paso 1: Selección */}
            {pasoActual === 1 && (
              <div className="space-y-6">
                {/* Usuario Selection */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <Label htmlFor="idUsuario" className="text-lg font-semibold text-gray-800">
                      Cliente *
                    </Label>
                  </div>
                  <select
                    id="idUsuario"
                    name="idUsuario"
                    value={datosFormulario.idUsuario}
                    onChange={manejarCambioInput}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Seleccionar cliente para la prueba</option>
                    {usuarios.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nombres} {user.apellidos} • {user.correoElectronico}
                      </option>
                    ))}
                  </select>
                  {usuarioSeleccionado && (
                    <div className="mt-3 p-3 bg-white rounded border border-green-200">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ {usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}
                      </p>
                      <p className="text-xs text-gray-600">{usuarioSeleccionado.correoElectronico}</p>
                    </div>
                  )}
                </div>

                {/* Auto Selection */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-purple-100 rounded-full mr-3">
                      <Car className="h-5 w-5 text-purple-600" />
                    </div>
                    <Label htmlFor="idAuto" className="text-lg font-semibold text-gray-800">
                      Vehículo *
                    </Label>
                  </div>
                  <select
                    id="idAuto"
                    name="idAuto"
                    value={datosFormulario.idAuto}
                    onChange={manejarCambioInput}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Seleccionar vehículo para la prueba</option>
                    {autos.map(auto => (
                      <option key={auto.id} value={auto.id}>
                        {auto.marca} {auto.modelo} {auto.ano} • {auto.colorExterior}
                      </option>
                    ))}
                  </select>
                  {autoSeleccionado && (
                    <div className="mt-3 p-3 bg-white rounded border border-green-200">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ {autoSeleccionado.marca} {autoSeleccionado.modelo} {autoSeleccionado.ano}
                      </p>
                      <p className="text-xs text-gray-600">Color: {autoSeleccionado.colorExterior}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setPasoActual(2)}
                    disabled={!datosFormulario.idUsuario || !datosFormulario.idAuto}
                    className="px-6 py-2"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 2: Programación */}
            {pasoActual === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      <Label htmlFor="fecha" className="text-lg font-semibold text-gray-800">
                        Fecha *
                      </Label>
                    </div>
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={datosFormulario.fecha}
                      onChange={manejarCambioInput}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 text-purple-600 mr-3" />
                      <Label htmlFor="hora" className="text-lg font-semibold text-gray-800">
                        Hora *
                      </Label>
                    </div>
                    <Input
                      id="hora"
                      name="hora"
                      type="time"
                      value={datosFormulario.hora}
                      onChange={manejarCambioInput}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setPasoActual(1)}>
                    Anterior
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setPasoActual(3)}
                    disabled={!datosFormulario.fecha || !datosFormulario.hora}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 3: Detalles Finales */}
            {pasoActual === 3 && (
              <div className="space-y-6">
                {/* Estado */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <Label htmlFor="estado" className="text-lg font-semibold text-gray-800 mb-4 block">
                    Estado de la Reserva
                  </Label>
                  <select
                    id="estado"
                    name="estado"
                    value={datosFormulario.estado}
                    onChange={manejarCambioInput}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="rechazada">Rechazada</option>
                    <option value="reprogramada">Reprogramada</option>
                  </select>
                  <div className="mt-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getEstadoBadgeColor(datosFormulario.estado)}`}>
                      {datosFormulario.estado.charAt(0).toUpperCase() + datosFormulario.estado.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Comentarios */}
                <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-5 w-5 text-yellow-600 mr-3" />
                    <Label htmlFor="comentarios" className="text-lg font-semibold text-gray-800">
                      Comentarios Adicionales
                    </Label>
                  </div>
                  <Textarea
                    id="comentarios"
                    name="comentarios"
                    value={datosFormulario.comentarios}
                    onChange={manejarCambioInput}
                    placeholder="Agregue cualquier información adicional sobre la reserva..."
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Resumen */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Resumen de la Reserva
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Cliente:</span>
                      <p className="text-gray-900">{usuarioSeleccionado?.nombres} {usuarioSeleccionado?.apellidos}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Vehículo:</span>
                      <p className="text-gray-900">{autoSeleccionado?.marca} {autoSeleccionado?.modelo} {autoSeleccionado?.ano}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fecha:</span>
                      <p className="text-gray-900">{datosFormulario.fecha}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Hora:</span>
                      <p className="text-gray-900">{datosFormulario.hora}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setPasoActual(2)}>
                    Anterior
                  </Button>
                  <Button type="submit" disabled={estaEnviando} className="px-8">
                    {estaEnviando ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Creando...
                      </>
                    ) : (
                      'Crear Reserva'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}