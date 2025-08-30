import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAutoById } from '../../../insfrastructure/services/autoServicio.js';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Label } from '../../../shared/components/Label.jsx';
import { Textarea } from '../../../shared/components/Textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';
import { Alert, useAlert } from '../../../shared/components/Alert.jsx';
import { formatearPrecio } from '../../../shared/helpers/formatHelpers.js';
import { ArrowLeft, Calendar, User, Mail, Phone, MessageSquare, CheckCircle, Info } from 'lucide-react';
import { authService } from '../../../insfrastructure/services/firebase_config.js';
import { obtenerUsuarioPorId } from '../../../insfrastructure/services/usuarioServicio.js';
import { crearReservaPruebaManejo, obtenerReservasPorAutoYFecha } from '../../../insfrastructure/services/reservasServicio.js';
import ReservasPruebasManejoEntidad from '../../../domain/entities/ReservasPruebasManejoEntidad.js';

const ReservarPruebasManejo = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const { exito, error: mostrarError, advertencia } = useAlert();
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [detalleAuto, setDetalleAuto] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [usuarioHaIniciadoSesion, setUsuarioHaIniciadoSesion] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    correoElectronico: '',
    numeroDeTelefono: '',
    fechaPreferida: '',
    horaPreferida: '',
    mensaje: ''
  });

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        const datosAuto = await getAutoById(id);
        if (!datosAuto) {
          mostrarError('Vehículo no encontrado.');
          navegar('/autos');
          return;
        }
        setDetalleAuto(datosAuto);

        const usuarioActual = authService.currentUser;
        if (usuarioActual) {
          setUsuarioHaIniciadoSesion(true);
          const datosUsuario = await obtenerUsuarioPorId(usuarioActual.uid);
          setUsuario(datosUsuario);
          setDatosFormulario(prev => ({
            ...prev,
            nombre: `${datosUsuario.nombres} ${datosUsuario.apellidos}`,
            correoElectronico: datosUsuario.correoElectronico,
            numeroDeTelefono: datosUsuario.numeroDeTelefono || ''
          }));
        } else {
          setUsuarioHaIniciadoSesion(false);
          advertencia('Necesitas iniciar sesión para realizar una reserva.');
        }
      } catch (err) {
        console.error("Error al obtener datos iniciales:", err);
        mostrarError('No se pudieron cargar los datos necesarios. Inténtalo de nuevo.');
      } finally {
        setEstaCargando(false);
      }
    };

    obtenerDatosIniciales();
  }, [id, navegar, mostrarError, advertencia]);

  useEffect(() => {
    const obtenerHorarios = async () => {
      if (datosFormulario.fechaPreferida && detalleAuto?.id) {
        try {
          const reservas = await obtenerReservasPorAutoYFecha(detalleAuto.id, datosFormulario.fechaPreferida);
          setHorariosOcupados(reservas.map(r => r.hora));
        } catch (err) {
          console.error("Error al obtener horarios disponibles:", err);
          mostrarError('No se pudieron verificar los horarios. Inténtalo de nuevo.');
        }
      }
    };
    obtenerHorarios();
  }, [datosFormulario.fechaPreferida, detalleAuto?.id, mostrarError]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const horariosBase = useMemo(() => [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ], []);

  const horariosDisponibles = useMemo(() => {
    if (!datosFormulario.fechaPreferida) return [];

    const ahora = new Date();
    const fechaSeleccionada = new Date(`${datosFormulario.fechaPreferida}T00:00:00`);
    const esHoy = fechaSeleccionada.toDateString() === ahora.toDateString();

    return horariosBase.filter(hora => {
      if (horariosOcupados.includes(hora)) {
        return false;
      }
      if (esHoy) {
        const [horas, minutos] = hora.split(':').map(Number);
        if (horas < ahora.getHours() || (horas === ahora.getHours() && minutos <= ahora.getMinutes())) {
          return false;
        }
      }
      return true;
    });
  }, [datosFormulario.fechaPreferida, horariosOcupados, horariosBase]);

  const validarFormulario = () => {
    const { nombre, correoElectronico, numeroDeTelefono, fechaPreferida, horaPreferida } = datosFormulario;
    if (!nombre.trim()) {
      mostrarError('El nombre es obligatorio.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico)) {
      mostrarError('Por favor, introduce un correo electrónico válido.');
      return false;
    }
    if (!/^\+?[0-9\s-]{7,}$/.test(numeroDeTelefono)) {
      mostrarError('Por favor, introduce un número de teléfono válido.');
      return false;
    }
    if (!fechaPreferida) {
      mostrarError('La fecha de la reserva es obligatoria.');
      return false;
    }
    if (new Date(fechaPreferida) < new Date(new Date().setHours(0, 0, 0, 0))) {
        mostrarError('La fecha de la reserva no puede ser en el pasado.');
        return false;
    }
    if (!horaPreferida) {
      mostrarError('La hora de la reserva es obligatoria.');
      return false;
    }
    return true;
  };


  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();

    if (!usuarioHaIniciadoSesion) {
      mostrarError('Debes iniciar sesión para poder reservar.');
      navegar('/login');
      return;
    }

    if (!validarFormulario()) return;

    if (horariosOcupados.includes(datosFormulario.horaPreferida)) {
        mostrarError('La hora seleccionada ya no está disponible. Por favor, elige otra.');
        return;
    }

    setEstaEnviando(true);
    try {
      const nuevaReserva = new ReservasPruebasManejoEntidad(
        null, 
        detalleAuto.id,
        usuario.uid,
        datosFormulario.fechaPreferida,
        datosFormulario.horaPreferida,
        'activo',
        datosFormulario.mensaje,
        datosFormulario.nombre,
        datosFormulario.correoElectronico,
        datosFormulario.numeroDeTelefono,
        `${detalleAuto.marca} ${detalleAuto.modelo} ${detalleAuto.ano}`
      );

      await crearReservaPruebaManejo(nuevaReserva);
      exito('¡Reserva enviada exitosamente! Te contactaremos pronto para confirmar.');
      setTimeout(() => navegar(`/autos/${detalleAuto.id}`), 2000);
    } catch (err) {
      console.error("Error al crear la reserva:", err);
      mostrarError('Hubo un problema al enviar tu reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setEstaEnviando(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  if (estaCargando) return <Spinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="outline" onClick={() => navegar(-1)} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Reservar Prueba de Manejo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={detalleAuto.imagenes[0]} 
                      alt={`${detalleAuto.marca} ${detalleAuto.modelo}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Disponible
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {detalleAuto.marca} {detalleAuto.modelo} {detalleAuto.ano}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      {formatearPrecio(detalleAuto.precio, detalleAuto.moneda)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {detalleAuto.descripcion}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Motor</p>
                      <p className="font-medium">{detalleAuto.motor}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Transmisión</p>
                      <p className="font-medium">{detalleAuto.transmision}</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📋 Qué incluye la prueba:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>✓ Duración: 30-45 minutos</li>
                      <li>✓ Acompañamiento de especialista</li>
                      <li>✓ Ruta urbana y carretera</li>
                      <li>✓ Explicación de características</li>
                      <li>✓ Sin compromiso de compra</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Datos de Reserva
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Completa el formulario para agendar tu prueba de manejo.
                </p>
              </CardHeader>
              <CardContent>
                {!usuarioHaIniciadoSesion && (
                  <Alert variant="warning" className="mb-6">
                    <Info className="h-4 w-4" />
                    <p>Debes <a href="/login" className="font-bold underline">iniciar sesión</a> o <a href="/registro" className="font-bold underline">registrarte</a> para poder reservar.</p>
                  </Alert>
                )}
                <form onSubmit={manejarEnvioFormulario} className="space-y-6">
                  <fieldset disabled={!usuarioHaIniciadoSesion || estaEnviando} className="space-y-6">
                    <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre" className="text-sm font-medium">
                        Nombre Completo *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          required
                          value={datosFormulario.nombre}
                          onChange={manejarCambioInput}
                          placeholder="Tu nombre completo"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="correoElectronico" className="text-sm font-medium">
                        Correo Electrónico *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="correoElectronico"
                          name="correoElectronico"
                          type="email"
                          required
                          value={datosFormulario.correoElectronico}
                          onChange={manejarCambioInput}
                          placeholder="tu@email.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="numeroDeTelefono" className="text-sm font-medium">
                        Teléfono *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="numeroDeTelefono"
                          name="numeroDeTelefono"
                          type="tel"
                          required
                          value={datosFormulario.numeroDeTelefono}
                          onChange={manejarCambioInput}
                          placeholder="+591 76050318"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fechaPreferida">Fecha Preferida *</Label>
                        <Input id="fechaPreferida" name="fechaPreferida" type="date" required min={hoy} value={datosFormulario.fechaPreferida} onChange={manejarCambioInput} />
                      </div>
                      <div>
                        <Label htmlFor="horaPreferida">Hora Preferida *</Label>
                        <select id="horaPreferida" name="horaPreferida" required value={datosFormulario.horaPreferida} onChange={manejarCambioInput} disabled={!datosFormulario.fechaPreferida || horariosDisponibles.length === 0} className="w-full p-2 border rounded-md bg-white">
                          <option value="">Seleccionar hora</option>
                          {horariosDisponibles.map(hora => (
                            <option key={hora} value={hora}>{hora}</option>
                          ))}
                          {datosFormulario.fechaPreferida && horariosDisponibles.length === 0 && (
                            <option disabled>No hay horarios disponibles</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                    <Label htmlFor="mensaje" className="text-sm font-medium">
                      Mensaje Adicional
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        value={datosFormulario.mensaje}
                        onChange={manejarCambioInput}
                        placeholder="¿Hay algo específico que te gustaría probar o preguntar sobre este vehículo?"
                        className="pl-10 min-h-[80px]"
                      />
                    </div>
                  </div>
                  </fieldset>
                  <Button type="submit" size="lg" disabled={!usuarioHaIniciadoSesion || estaEnviando} className="w-full">
                    {estaEnviando ? <Spinner size="sm" /> : 'Confirmar Reserva'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservarPruebasManejo;
