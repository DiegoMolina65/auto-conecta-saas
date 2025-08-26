import React, { useState, useEffect } from 'react';
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
import { useAlert } from '../../../shared/components/Alert.jsx';
import { formatearPrecio } from '../../../shared/helpers/formatHelpers.js';
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

const ReservarPruebasManejo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exito, error } = useAlert();
  const [enviando, setEnviando] = useState(false);
  const [detalleAuto, setDetalleAuto] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaPreferida: '',
    horaPreferida: '',
    mensaje: ''
  });

  useEffect(() => {
    const obtenerDetalleAuto = async () => {
      try {
        const datosAuto = await getAutoById(id);
        setDetalleAuto(datosAuto);
      } catch (error) {
        console.error("Error al obtener los detalles del auto:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalleAuto();
  }, [id]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!datosFormulario.nombre || !datosFormulario.email || !datosFormulario.telefono || !datosFormulario.fechaPreferida || !datosFormulario.horaPreferida) {
      error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setEnviando(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    exito('¡Reserva enviada exitosamente! Te contactaremos pronto para confirmar.');
    
    // Send WhatsApp message with reservation details
    const mensaje = encodeURIComponent(
      `🚗 Nueva reserva de prueba de manejo:\n\n` +
      `Vehículo: ${detalleAuto.marca} ${detalleAuto.modelo} ${detalleAuto.ano}\n` +
      `Cliente: ${datosFormulario.nombre}\n` +
      `Email: ${datosFormulario.email}\n` +
      `Teléfono: ${datosFormulario.telefono}\n` +
      `Fecha preferida: ${datosFormulario.fechaPreferida}\n` +
      `Hora preferida: ${datosFormulario.horaPreferida}\n` +
      `Mensaje: ${datosFormulario.mensaje || 'Sin mensaje adicional'}`
    );
    
    window.open(`https://wa.me/59112345678?text=${mensaje}`, '_blank');
    
    setEnviando(false);
    navigate(`/autos/${detalleAuto.id}`);
  };

  // Get today's date for min date
  const hoy = new Date().toISOString().split('T')[0];

  // Available time slots
  const horariosDisponibles = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  if (cargando) {
    return <Spinner fullScreen />;
  }

  if (!detalleAuto) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Vehículo no encontrado</h2>
            <Button onClick={() => navigate('/autos')}> 
              Volver a la búsqueda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate(`/autos/${detalleAuto.id}`)}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al vehículo
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Car Summary */}
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

            {/* Reservation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Datos de Reserva
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Completa el formulario y te contactaremos para confirmar tu cita.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={manejarEnvio} className="space-y-6">
                  {/* Personal Information */}
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
                      <Label htmlFor="email" className="text-sm font-medium">
                        Correo Electrónico *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={datosFormulario.email}
                          onChange={manejarCambioInput}
                          placeholder="tu@email.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="telefono" className="text-sm font-medium">
                        Teléfono *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          required
                          value={datosFormulario.telefono}
                          onChange={manejarCambioInput}
                          placeholder="+591 12345678"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaPreferida" className="text-sm font-medium">
                        Fecha Preferida *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="fechaPreferida"
                          name="fechaPreferida"
                          type="date"
                          required
                          min={hoy}
                          value={datosFormulario.fechaPreferida}
                          onChange={manejarCambioInput}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="horaPreferida" className="text-sm font-medium">
                        Hora Preferida *
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                          id="horaPreferida"
                          name="horaPreferida"
                          required
                          value={datosFormulario.horaPreferida}
                          onChange={manejarCambioInput}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar hora</option>
                          {horariosDisponibles.map(hora => (
                            <option key={hora} value={hora}>{hora}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={enviando}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {enviando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando reserva...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Confirmar Reserva
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Al enviar esta reserva, aceptas que te contactemos para confirmar los detalles de tu prueba de manejo.
                  </p>
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
