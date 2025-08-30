import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card.jsx';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';
import { User, Car, Calendar, Clock, MessageSquare, Edit, Trash2, Repeat, MapPin, Phone, Eye } from 'lucide-react';

const ReservasCard = ({ reserva, onEdit, onDelete, onReschedule, onViewDetails, showActions = true }) => {
  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      pendiente: { 
        variant: "warning", 
        text: "Pendiente",
        className: "bg-amber-100 text-amber-800 border-amber-200"
      },
      confirmada: { 
        variant: "success", 
        text: "Confirmada",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200"
      },
      rechazada: { 
        variant: "destructive", 
        text: "Rechazada",
        className: "bg-red-100 text-red-800 border-red-200"
      },
      reprogramada: { 
        variant: "info", 
        text: "Reprogramada",
        className: "bg-blue-100 text-blue-800 border-blue-200"
      },
      completada: { 
        variant: "secondary", 
        text: "Completada",
        className: "bg-gray-100 text-gray-800 border-gray-200"
      }
    };
    
    const config = badgeConfig[estado] || badgeConfig.pendiente;
    return (
      <Badge 
        variant={config.variant} 
        className={`${config.className} font-medium px-3 py-1 text-xs rounded-full`}
      >
        {config.text}
      </Badge>
    );
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "border-l-amber-400",
      confirmada: "border-l-emerald-400",
      rechazada: "border-l-red-400",
      reprogramada: "border-l-blue-400",
      completada: "border-l-gray-400"
    };
    return colors[estado] || colors.pendiente;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const formatHora = (hora) => {
    if (!hora) return 'N/A';
    try {
      return new Date(`2000-01-01 ${hora}`).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return hora;
    }
  };

  return (
    <Card className={`group relative overflow-hidden bg-white border-l-4 ${getEstadoColor(reserva.estado)} shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      {/* Header con gradiente sutil */}
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-3">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
          <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
            <Car className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="truncate font-medium" title={reserva.nombreAuto}>
              {reserva.nombreAuto || 'Auto Desconocido'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal text-gray-500">
                ID: {reserva.id?.slice(-6) || 'N/A'}
              </span>
              {getEstadoBadge(reserva.estado)}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-4 px-4 pb-4">
        {/* Información del cliente */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center text-gray-700">
            <div className="p-1.5 bg-green-100 rounded-full mr-3">
              <User className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-medium text-sm">
                {reserva.nombreCliente || reserva.nombreUsuario || 'Cliente N/A'}
              </span>
              {reserva.emailCliente && (
                <span className="text-xs text-gray-500 truncate">
                  {reserva.emailCliente}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 rounded-lg p-2.5">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500 font-medium">Fecha</span>
                <span className="text-sm font-semibold truncate">
                  {formatFecha(reserva.fecha)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-2.5">
            <div className="flex items-center text-gray-700">
              <Clock className="h-4 w-4 mr-2 text-purple-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500 font-medium">Hora</span>
                <span className="text-sm font-semibold">
                  {formatHora(reserva.hora)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comentarios si existen */}
        {reserva.comentarios && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start text-gray-700">
              <MessageSquare className="h-4 w-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-xs font-medium text-yellow-700 mb-1">Comentarios:</span>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {reserva.comentarios}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional si está disponible */}
        {(reserva.ubicacion || reserva.telefono) && (
          <div className="border-t pt-3 space-y-2">
            {reserva.ubicacion && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <span className="truncate">{reserva.ubicacion}</span>
              </div>
            )}
            {reserva.telefono && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <span>{reserva.telefono}</span>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        {(showActions || onViewDetails) && (
          <div className="border-t pt-3 -mx-1">
            <div className="flex gap-2 flex-wrap">
              {showActions && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(reserva.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors text-xs py-2"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Editar</span>
                </Button>
              )}
              {showActions && onReschedule && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule(reserva.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors text-xs py-2"
                >
                  <Repeat className="h-3.5 w-3.5" />
                  <span>Reprogramar</span>
                </Button>
              )}
              {showActions && onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(reserva.id, reserva.nombreCliente || reserva.nombreUsuario, reserva.nombreAuto)}
                  className="flex-1 flex items-center justify-center gap-1.5 hover:bg-red-600 transition-colors text-xs py-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Eliminar</span>
                </Button>
              )}
               {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(reserva.idAuto)}
                  className="flex-1 flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-colors text-xs py-2"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Ver Auto</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Indicador visual de prioridad o urgencia */}
        {reserva.urgente && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservasCard;