
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../../shared/components/Button.jsx';
import { Alert, useAlert } from '../../../../shared/components/Alert.jsx';
import { useConfirm } from '../../../../shared/components/Confirm.jsx';
import { formatearPrecio, formatearKilometraje } from '../../../../shared/helpers/formatHelpers.js';
import { Spinner } from '../../../../shared/components/Spinner.jsx';
import Search from '../../../../shared/components/Search.jsx';

import { eliminarAuto, obtenerTodosLosAutos } from '../../../../insfrastructure/services/autoServicio.js';
import { obtenerUsuarioPorId } from '../../../../insfrastructure/services/usuarioServicio.js';

// Card para mostrar cada auto
const AutoCard = ({ auto, onEditar, onEliminar, vendedor }) => {
  const { marca, modelo, ano, precio, moneda, kilometraje, imagenes, estadoPublicacion, id, ciudad } = auto;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
      <div className="relative">
        <img 
          src={imagenes[0]} 
          alt={`${marca} ${modelo}`} 
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md ${estadoPublicacion === 'activo' ? 'bg-green-500' : 'bg-yellow-500'}`}>
          {estadoPublicacion.charAt(0).toUpperCase() + estadoPublicacion.slice(1)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary truncate">{marca} {modelo}</h3>
        <p className="text-sm text-gray-600">{ano}</p>
        <p className="text-sm text-gray-600">{ciudad}</p>
        {vendedor && <p className="text-sm text-gray-500 mt-1">Vendedor: {vendedor.nombres} {vendedor.apellidos}</p>}
        <div className="mt-2">
            <p className="text-xl font-semibold text-secondary">{formatearPrecio(precio, moneda)}</p>
            <p className="text-sm text-gray-500">{formatearKilometraje(kilometraje)}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between space-x-2">
          <Button variant="edit" size="sm" onClick={() => onEditar(id)}>Editar</Button>
          <Button variant="secondary" size="sm" onClick={() => onEliminar(id, marca, modelo)}>Eliminar</Button>
        </div>
      </div>
    </div>
  );
};

export default function TodosAutosRegistrados() {
  const [autos, setAutos] = useState([]);
  const [vendedores, setVendedores] = useState({});
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navigate = useNavigate();

  const { alerts, exito, error: alertaError, advertencia, informacion, cerrarAlert } = useAlert();
  const { ConfirmComponent, mostrarConfirm } = useConfirm();

  useEffect(() => {
    const fetchAutosYVendedores = async () => {
      try {
        setEstaCargando(true);
        const autosList = await obtenerTodosLosAutos();
        setAutos(autosList);

        const vendedoresIds = [...new Set(autosList.map(auto => auto.vendedorId))];
        const promesasVendedores = vendedoresIds.map(id => obtenerUsuarioPorId(id));
        const vendedoresList = await Promise.all(promesasVendedores);
        
        const vendedoresMap = vendedoresList.reduce((acc, vendedor) => {
          if (vendedor) {
            acc[vendedor.uid] = vendedor;
          }
          return acc;
        }, {});
        setVendedores(vendedoresMap);

        setError(null);
      } catch (err) {
        alertaError('Error de carga', 'No se pudieron cargar los vehículos. Inténtalo de nuevo más tarde.');
      } finally {
        setEstaCargando(false);
      }
    };
    fetchAutosYVendedores();
  }, []);

  const handleEditar = (id) => {
    navigate(`/dashboard/editar-auto/${id}`);
  };

  const handleEliminar = async (id, marca = '', modelo = '') => {
    const nombreAuto = marca && modelo ? `${marca} ${modelo}` : 'este auto';
    
    const confirmado = await mostrarConfirm({
      titulo: "Eliminar vehículo",
      mensaje: `¿Estás seguro de que quieres eliminar ${nombreAuto}? Esta acción no se puede deshacer.`,
      tipo: "peligro",
      textoBtnConfirmar: "Sí, eliminar",
      textoBtnCancelar: "Cancelar",
      icono: "🗑️"
    });

    if (!confirmado) return;

    try {
      await eliminarAuto(id);
      setAutos(prev => prev.filter(auto => auto.id !== id));
      exito(
        "Vehículo eliminado", 
        `${nombreAuto} fue eliminado correctamente.`
      );
    } catch (err) {
      alertaError(
        "Error al eliminar", 
        "Ocurrió un error al eliminar el vehículo. Por favor, intenta nuevamente."
      );
    }
  };

  const autosFiltrados = autos.filter(auto =>
    auto.marca.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    auto.modelo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    auto.ciudad.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const renderContent = () => {
    if (estaCargando) {
      return <Spinner />;
    }

    if (error) {
      return <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;
    }

    if (autosFiltrados.length === 0 && terminoBusqueda) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg mb-4">No se encontraron vehículos que coincidan con tu búsqueda.</p>
          <Button onClick={() => setTerminoBusqueda('')}>Limpiar búsqueda</Button>
        </div>
      );
    }

    if (autos.length === 0) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg mb-4">No hay autos registrados en el sistema.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {autosFiltrados.map(auto => (
          <AutoCard 
            key={auto.id} 
            auto={auto} 
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            vendedor={vendedores[auto.vendedorId]}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative flex justify-center bg-gradient-to-br from-tertiary via-white to-orange-100 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-white to-orange-100 -z-10"></div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Todos los autos registrados</h1>
            <p className="text-gray-500 mt-1">Listado de todos los autos publicados en el sistema.</p>
          </div>
        </div>

        <div className="mb-6">
          <Search 
            value={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por marca, modelo o ciudad..."
          />
        </div>

        {renderContent()}
      </div>

      <div className="fixed top-0 right-0 z-40 space-y-2 p-4">
        {alerts.map((alert, index) => (
          <Alert
            key={alert.id}
            tipo={alert.tipo}
            titulo={alert.titulo}
            mensaje={alert.mensaje}
            visible={alert.visible}
            onCerrar={() => cerrarAlert(alert.id)}
            accionBoton={alert.accionBoton}
            textoBoton={alert.textoBoton}
            autodismiss={alert.autodismiss}
            duracion={alert.duracion}
            style={{ transform: `translateY(${index * 10}px)` }}
          />
        ))}
      </div>

      {ConfirmComponent}
    </div>
  );
}
