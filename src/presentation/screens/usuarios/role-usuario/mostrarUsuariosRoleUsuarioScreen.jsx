import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuariosPorRole, eliminarUsuario } from '../../../../insfrastructure/services/usuarioServicio.js';
import { Spinner } from '../../../../shared/components/Spinner.jsx';
import { Button } from '../../../../shared/components/Button.jsx';
import { useConfirm } from '../../../../shared/components/Confirm.jsx';
import { useAlert, Alert } from '../../../../shared/components/Alert.jsx';
import Search from '../../../../shared/components/Search.jsx';
import UsuarioCard from '../../../../shared/components/UsuarioCard.jsx';

export default function MostrarUsuariosRoleUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navigate = useNavigate();

  // Hook para alertas
  const { alerts, exito, error: alertaError, cerrarAlert } = useAlert();

  // Hook para confirmaciones
  const { ConfirmComponent, mostrarConfirm } = useConfirm();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setEstaCargando(true);
        const usuariosData = await obtenerUsuariosPorRole('usuario');
        setUsuarios(usuariosData);
      } catch (error) {
        alertaError('Error de carga', 'No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.');
      } finally {
        setEstaCargando(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Función para editar un usuario
  const handleEditar = (id) => {
    navigate(`/dashboard/editar-usuario/${id}`);
  };

  // Función para eliminar un usuario
  const handleEliminar = async (id, nombres = '', apellidos = '') => {
    const nombreCompleto = nombres && apellidos ? `${nombres} ${apellidos}` : 'este usuario';
    
    const confirmado = await mostrarConfirm({
      titulo: "Eliminar Usuario",
      mensaje: `¿Estás seguro de que quieres eliminar a ${nombreCompleto}? Esta acción no se puede deshacer y el usuario será removido permanentemente del sistema.`,
      tipo: "peligro",
      textoBtnConfirmar: "Sí, eliminar",
      textoBtnCancelar: "Cancelar",
      icono: "🗑️"
    });

    if (!confirmado) return;

    try {
      await eliminarUsuario(id);
      setUsuarios(prev => prev.filter(user => user.id !== id));
      exito(
        "Usuario eliminado", 
        `${nombreCompleto} fue eliminado correctamente del sistema.`
      );
    } catch (err) {
      alertaError(
        "Error al eliminar", 
        "Ocurrió un error al eliminar el usuario. Por favor, intenta nuevamente."
      );
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombres.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    usuario.apellidos.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    usuario.correoElectronico.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const renderContent = () => {
    if (estaCargando) {
      return <Spinner />;
    }

    if (usuariosFiltrados.length === 0 && terminoBusqueda) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg mb-4">No se encontraron usuarios que coincidan con tu búsqueda.</p>
          <Button onClick={() => setTerminoBusqueda('')}>Limpiar búsqueda</Button>
        </div>
      );
    }

    if (usuarios.length === 0) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg mb-4">No hay usuarios registrados con rol de usuario.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {usuariosFiltrados.map(usuario => (
          <UsuarioCard 
            key={usuario.id} 
            usuario={usuario} 
            onEditar={handleEditar}
            onEliminar={handleEliminar}
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
            <h1 className="text-3xl font-bold text-primary">Usuarios registrados</h1>
            <p className="text-gray-500 mt-1">Administra los usuarios con rol de usuario en el sistema.</p>
          </div>
        </div>

        <div className="mb-6">
          <Search 
            value={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por nombre, apellido o correo electrónico..."
          />
        </div>

        {renderContent()}
      </div>

      {/* Renderizar alerts */}
      <div className="fixed top-0 right-0 z-40 space-y-2 p-4">
        {alerts?.map((alert, index) => (
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

      {/* Renderizar modal de confirmación */}
      {ConfirmComponent}
    </div>
  );
}