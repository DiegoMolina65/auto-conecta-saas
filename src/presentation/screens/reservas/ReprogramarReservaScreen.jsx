import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Label } from '../../../shared/components/Label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card.jsx';
import { useAlert } from '../../../shared/components/Alert.jsx';
import { obtenerReservaPorId, actualizarReserva } from '../../../insfrastructure/services/reservasServicio.js';
import { Calendar, Clock } from 'lucide-react';

export default function ReprogramarReservaScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exito, error: mostrarError } = useAlert();
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [estaCargandoDatos, setEstaCargandoDatos] = useState(true);
  const [reserva, setReserva] = useState(null);

  const [datosFormulario, setDatosFormulario] = useState({
    fecha: '',
    hora: '',
  });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const reservaData = await obtenerReservaPorId(id);

        if (!reservaData) {
          mostrarError('Reserva no encontrada.');
          navigate('/dashboard/reservas/vendedor');
          return;
        }

        setReserva(reservaData);
        setDatosFormulario({
          fecha: reservaData.fecha || '',
          hora: reservaData.hora || '',
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
    const { fecha, hora } = datosFormulario;
    if (!fecha) {
      mostrarError('La nueva fecha es obligatoria.');
      return false;
    }
    if (!hora) {
      mostrarError('La nueva hora es obligatoria.');
      return false;
    }
    return true;
  };

  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setEstaEnviando(true);
    try {
      const datosActualizados = {
        fecha: datosFormulario.fecha,
        hora: datosFormulario.hora,
        estado: 'reprogramada', // Actualizar el estado a reprogramada
      };

      await actualizarReserva(id, datosActualizados);
      exito('Reserva reprogramada exitosamente!');
      navigate('/dashboard/reservas/vendedor');
    } catch (err) {
      console.error("Error al reprogramar la reserva:", err);
      mostrarError('Hubo un problema al reprogramar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setEstaEnviando(false);
    }
  };

  if (estaCargandoDatos) {
    return <Spinner fullScreen />;
  }

  if (!reserva) {
    return null; // O un mensaje de error si la reserva no se encontró
  }

  return (
    <div className="min-h-screen relative flex justify-center bg-gradient-to-br from-tertiary via-white to-orange-100 px-4">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Reprogramar Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-gray-700">
              <p><strong>Cliente:</strong> {reserva.nombreUsuario}</p>
              <p><strong>Auto:</strong> {reserva.nombreAuto}</p>
              <p><strong>Fecha Original:</strong> {reserva.fecha} a las {reserva.hora}</p>
            </div>
            <form onSubmit={manejarEnvioFormulario} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Nueva Fecha *</Label>
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
                  <Label htmlFor="hora">Nueva Hora *</Label>
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

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={estaEnviando}>
                  {estaEnviando ? <Spinner size="sm" /> : 'Reprogramar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
