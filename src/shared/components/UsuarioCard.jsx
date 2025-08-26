import React from 'react';
import { Button } from './Button.jsx';
import perfilImage from '../../assets/imgperfil.png';

const UsuarioCard = ({ usuario, onEditar, onEliminar, onVerAutos }) => {
  const { nombres, apellidos, correoElectronico, carnetDeIdentidad, numeroDeTelefono, role, estadoUsuario, id } = usuario;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
          <img 
            src={perfilImage} 
            alt={`${nombres} ${apellidos}`} 
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md ${estadoUsuario === 'activo' ? 'bg-green-500' : 'bg-red-500'}`}>
          {estadoUsuario.charAt(0).toUpperCase() + estadoUsuario.slice(1)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary truncate">{nombres} {apellidos}</h3>
        <p className="text-sm text-gray-600">{role}</p>
        <p className="text-sm text-gray-600">{correoElectronico}</p>
        <div className="mt-2">
            <p className="text-sm text-gray-500">CI: {carnetDeIdentidad}</p>
            <p className="text-sm text-gray-500">Tel: {numeroDeTelefono}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between space-x-2">
          <Button variant="edit" size="sm" onClick={() => onEditar(id)}>Editar</Button>
          <Button variant="secondary" size="sm" onClick={() => onEliminar(id, nombres, apellidos)}>Eliminar</Button>
          {onVerAutos && <Button variant="primary" size="sm" onClick={() => onVerAutos(id)}>Ver Autos</Button>}
        </div>
      </div>
    </div>
  );
};

export default UsuarioCard;