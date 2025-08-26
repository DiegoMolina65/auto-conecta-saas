import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button.jsx';
import { formatearPrecio, formatearKilometraje } from '../helpers/formatHelpers.js';

const AutoCard = ({ auto, onEditar, onEliminar, vendedor, showDetailsButton }) => {
  const navigate = useNavigate();
  const { marca, modelo, ano, precio, moneda, kilometraje, imagenes, estadoPublicacion, id, ciudad } = auto;
 
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100 max-w-sm">
      {/* Imagen del auto */}
      <div className="relative">
        <img
          src={imagenes[0]}
          alt={`${marca} ${modelo}`}
          className="w-full h-48 object-cover"
        />
        {/* Tags superiores - lado izquierdo */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 max-w-[calc(100%-6rem)]">
          <span className="bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded truncate w-fit">
            {auto.version}
          </span>
          <span className="bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded truncate w-fit">
            {auto.tipoCombustible}
          </span>
        </div>
       
        {/* Estado de publicación - siempre en la esquina superior derecha */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md whitespace-nowrap ${
          estadoPublicacion === 'activo' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {estadoPublicacion.charAt(0).toUpperCase() + estadoPublicacion.slice(1)}
        </span>
      </div>
      
      {/* Contenido */}
      <div className="p-5">
        {/* Título principal */}
        <h3 className="text-2xl font-bold text-blue-600 mb-1">
          {marca} {modelo}
        </h3>
       
        {/* Precio */}
        <p className="text-2xl font-bold text-black mb-4">
          {formatearPrecio(precio, moneda)}
        </p>
        
        {/* Información del vehículo */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📅</span>
            <span>{ano}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">⚙️</span>
            <span>335 HP</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">🏃‍♂️</span>
            <span>{formatearKilometraje(kilometraje)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📍</span>
            <span>{ciudad}</span>
          </div>
        </div>
        
        {/* Información del vendedor */}
        {vendedor && (
          <p className="text-sm text-gray-500 mb-4">
            Vendedor: {vendedor.nombres} {vendedor.apellidos}
          </p>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-between space-x-2">
          {showDetailsButton ? (
            <Button variant="primary" size="md" className="w-full" onClick={() => navigate(`/autos/${id}`)}>
              Ver Detalles
            </Button>
          ) : (
            <>
              <Button variant="edit" size="sm" onClick={() => onEditar(id)}>
                Editar
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onEliminar(id, marca, modelo)}>
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoCard;
