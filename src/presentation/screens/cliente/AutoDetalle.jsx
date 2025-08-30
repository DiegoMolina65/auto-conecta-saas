import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivoAutoById as getAutoById } from '../../../insfrastructure/services/autoServicio.js';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card.jsx';
import { formatearPrecio, formatearKilometraje } from '../../../shared/helpers/formatHelpers.js';
import { 
  ArrowLeft, 
  Calendar, 
  Fuel, 
  Gauge, 
  Settings, 
  Phone, 
  CheckCircle,
  Heart
} from 'lucide-react';
import { authService } from '../../../insfrastructure/services/firebase_config.js';
import { obtenerUsuarioPorId, agregarAutoFavorito, eliminarAutoFavorito } from '../../../insfrastructure/services/usuarioServicio.js';
import { useAlert } from '../../../shared/components/Alert.jsx';

const AutoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalleAuto, setDetalleAuto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [imagenSeleccionadaIndex, setImagenSeleccionadaIndex] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const { exito, error, advertencia } = useAlert();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const datosAuto = await getAutoById(id);
        setDetalleAuto(datosAuto);

        const usuarioActual = authService.currentUser;
        if (usuarioActual) {
          const datosUsuario = await obtenerUsuarioPorId(usuarioActual.uid);
          setUsuario(datosUsuario);
          if (datosUsuario.favoritos && datosUsuario.favoritos.includes(id)) {
            setEsFavorito(true);
          }
        }
      } catch (err) {
        console.error("Error al obtener los detalles:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [id]);

  const manejarWhatsApp = () => {
    const mensaje = encodeURIComponent(`Hola, me interesa el ${detalleAuto.marca} ${detalleAuto.modelo} ${detalleAuto.ano}. ¿Podrían darme más información?`);
    window.open(`https://wa.me/59176050318?text=${mensaje}`, '_blank');
  };

  const manejarPruebaManejo = () => {
    navigate(`/reservar-prueba-manejo/${detalleAuto.id}`);
  };

  const manejarFavorito = async () => {
    if (!usuario) {
      advertencia('Debes iniciar sesión para agregar a favoritos.');
      navigate('/login');
      return;
    }

    try {
      if (esFavorito) {
        await eliminarAutoFavorito(usuario.uid, detalleAuto.id);
        setEsFavorito(false);
        exito('Eliminado de favoritos');
      } else {
        await agregarAutoFavorito(usuario.uid, detalleAuto.id);
        setEsFavorito(true);
        exito('Agregado a favoritos');
      }
    } catch (err) {
      error('Ocurrió un error al gestionar favoritos.');
      console.error(err);
    }
  };

  if (cargando) {
    return <Spinner fullScreen />;;
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
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/autos')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la búsqueda
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <div>
              {/* Main Image */}
              <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={detalleAuto.imagenes[imagenSeleccionadaIndex]} 
                  alt={`${detalleAuto.marca} ${detalleAuto.modelo}`}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-2">
                {detalleAuto.imagenes.map((imagen, indice) => (
                  <button
                    key={indice}
                    onClick={() => setImagenSeleccionadaIndex(indice)}
                    className={`rounded-lg overflow-hidden border-2 transition-colors ${
                      imagenSeleccionadaIndex === indice ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={imagen} 
                      alt={`${detalleAuto.marca} ${detalleAuto.modelo} ${indice + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{detalleAuto.version}</Badge>
                  <Badge>{detalleAuto.tipoCombustible}</Badge>
                  {detalleAuto.estadoPublicacion === 'activo' && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Disponible
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {detalleAuto.marca} {detalleAuto.modelo} {detalleAuto.ano}
                </h1>
                
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {formatearPrecio(detalleAuto.precio, detalleAuto.moneda)}
                </p>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {detalleAuto.descripcion}
                </p>
              </div>

              {/* Specifications */}
              <Card className="mb-6">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4">Especificaciones</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Año</p>
                        <p className="font-medium">{detalleAuto.ano}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Kilometraje</p>
                        <p className="font-medium">{formatearKilometraje(detalleAuto.kilometraje)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Combustible</p>
                        <p className="font-medium">{detalleAuto.tipoCombustible}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Transmisión</p>
                        <p className="font-medium capitalize">{detalleAuto.transmision}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Motor</p>
                    <p className="font-medium">{detalleAuto.motor}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="mb-6">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4">Características</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {detalleAuto.caracteristicas.map((caracteristica, indice) => (
                      <div key={indice} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{caracteristica}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={manejarPruebaManejo}
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg"
                  disabled={detalleAuto.estadoPublicacion !== 'activo'}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Reservar Prueba de Manejo
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={manejarWhatsApp}
                    variant="outline" 
                    size="lg"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={manejarFavorito}
                    variant={esFavorito ? "solid" : "outline"} 
                    size="lg"
                    className={esFavorito ? "bg-red-500 text-white hover:bg-red-600" : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${esFavorito ? "fill-current" : ""}`} />
                    {esFavorito ? 'En favoritos' : 'Favorito'}
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  <p>💎 Garantía premium incluida • 🚗 Financiamiento disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoDetalle;
