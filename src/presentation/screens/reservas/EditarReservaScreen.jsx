import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Label } from '../../../shared/components/Label.jsx';
import { Textarea } from '../../../shared/components/Textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card.jsx';
import { useAlert } from '../../../shared/components/Alert.jsx';
import { obtenerReservaPorId, actualizarReserva } from '../../../insfrastructure/services/reservasServicio.js';
import { obtenerTodosLosUsuarios } from '../../../insfrastructure/services/usuarioServicio.js';
import { obtenerTodosLosAutos } from '../../../insfrastructure/services/autoServicio.js';
import { User, Car, Calendar, Clock, MessageSquare } from 'lucide-react';

export default function EditarReservaScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exito, error: mostrarError } = useAlert();
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [estaCargandoDatos, setEstaCargandoDatos] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [autos, setAutos] = useState([]);

  const [datosFormulario, setDatosFormulario] = useState({
    idUsuario: '',
    idAuto: '',
    fecha: '',
    hora: '',
    estado: '',
    comentarios: '',
    nombreCliente: '',
    correoElectronicoCliente: '',
    telefonoCliente: '',
    nombreAuto: '',
  });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [reservaData, usuariosData, autosData] = await Promise.all([
          obtenerReservaPorId(id),
          obtenerTodosLosUsuarios(),
          obtenerTodosLosAutos()
        ]);

        if (!reservaData) {
          mostrarError('Reserva no encontrada.');
          navigate('/dashboard/reservas/todas');
          return;
        }

        setUsuarios(usuariosData);
        setAutos(autosData);
        setDatosFormulario({
          idUsuario: reservaData.idUsuario || '',
          idAuto: reservaData.idAuto || '',
          fecha: reservaData.fecha || '',
          hora: reservaData.hora || '',
          estado: reservaData.estado || '',
          comentarios: reservaData.comentarios || '',
          nombreCliente: reservaData.nombreUsuario || '',
          correoElectronicoCliente: reservaData.correoElectronicoUsuario || '',
          telefonoCliente: reservaData.telefonoUsuario || '',
          nombreAuto: reservaData.nombreAuto || '',
        });
      } catch (err) {
        console.error("Error al cargar datos iniciales de la reserva:", err);
        mostrarError('No se pudieron cargar los datos de la reserva. Inténtalo de nuevo.');
      } finally {
        setEstaCargandoDatos(false);
      }
    };
    cargarDatosIniciales();
  }, [id, navigate, mostrarError]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    const { idUsuario, idAuto, fecha, hora, estado } = datosFormulario;
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
    if (!estado) {
      mostrarError('El estado de la reserva es obligatorio.');
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

      const datosActualizados = {
        idAuto: datosFormulario.idAuto,
        idUsuario: datosFormulario.idUsuario,
        fecha: datosFormulario.fecha,
        hora: datosFormulario.hora,
        estado: datosFormulario.estado,
        comentarios: datosFormulario.comentarios,
        nombreUsuario: `${usuarioSeleccionado.nombres} ${usuarioSeleccionado.apellidos}`,
        correoElectronicoUsuario: usuarioSeleccionado.correoElectronico,
        telefonoUsuario: usuarioSeleccionado.numeroDeTelefono || '',
        nombreAuto: `${autoSeleccionado.marca} ${autoSeleccionado.modelo} ${autoSeleccionado.ano}`,
      };

      await actualizarReserva(id, datosActualizados);
      exito('Reserva actualizada exitosamente!');
      navigate('/dashboard/reservas/todas');
    } catch (err) {
      console.error("Error al actualizar la reserva:", err);
      mostrarError('Hubo un problema al actualizar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setEstaEnviando(false);
    }
  };

  if (estaCargandoDatos) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="min-h-screen relative flex justify-center bg-gradient-to-br from-tertiary via-white to-orange-100 px-4">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Editar Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={manejarEnvioFormulario} className="space-y-6">
              <div>
                <Label htmlFor="idUsuario">Seleccionar Usuario *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="idUsuario"
                    name="idUsuario"
                    value={datosFormulario.idUsuario}
                    onChange={manejarCambioInput}
                    className="w-full p-2 border rounded-md bg-white pl-10"
                  >
                    <option value="">-- Seleccionar Usuario --</option>
                    {usuarios.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nombres} {user.apellidos} ({user.correoElectronico})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="idAuto">Seleccionar Auto *</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="idAuto"
                    name="idAuto"
                    value={datosFormulario.idAuto}
                    onChange={manejarCambioInput}
                    className="w-full p-2 border rounded-md bg-white pl-10"
                  >
                    <option value="">-- Seleccionar Auto --</option>
                    {autos.map(auto => (
                      <option key={auto.id} value={auto.id}>
                        {auto.marca} {auto.modelo} ({auto.ano})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha de Reserva *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={datosFormulario.fecha}
                      onChange={manejarCambioInput}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hora">Hora de Reserva *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="hora"
                      name="hora"
                      type="time"
                      value={datosFormulario.hora}
                      onChange={manejarCambioInput}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  name="estado"
                  value={datosFormulario.estado}
                  onChange={manejarCambioInput}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="reprogramada">Reprogramada</option>
                </select>
              </div>

              <div>
                <Label htmlFor="comentarios">Comentarios</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="comentarios"
                    name="comentarios"
                    value={datosFormulario.comentarios}
                    onChange={manejarCambioInput}
                    placeholder="Comentarios adicionales sobre la reserva..."
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={estaEnviando}>
                  {estaEnviando ? <Spinner size="sm" /> : 'Actualizar Reserva'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
