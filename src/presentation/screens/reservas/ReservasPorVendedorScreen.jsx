import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerReservasPorVendedorId, eliminarReserva } from '../../../insfrastructure/services/reservasServicio.js';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { useConfirm } from '../../../shared/components/Confirm.jsx';
import { useAlert, Alert } from '../../../shared/components/Alert.jsx';
import Search from '../../../shared/components/Search.jsx';
import ReservasCard from '../../../shared/components/ReservasCard.jsx';
import { PlusCircle, Info } from 'lucide-react';
import { getAuth } from "firebase/auth";

export default function ReservasPorVendedorScreen() {
  const [reservas, setReservas] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const { alerts, exito, error: alertaError, cerrarAlert } = useAlert();
  const { ConfirmComponent, mostrarConfirm } = useConfirm();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setEstaCargando(true);
        const user = auth.currentUser;
        if (user) {
          const reservasData = await obtenerReservasPorVendedorId(user.uid);
          const sortedReservas = reservasData.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
          setReservas(sortedReservas);
        } else {
          alertaError('Acceso denegado', 'Debes iniciar sesión como vendedor para ver tus reservas.');
          navigate('/login');
        }
      } catch (error) {
        alertaError('Error de carga', 'No se pudieron cargar tus reservas. Inténtalo de nuevo más tarde.');
      } finally {
        setEstaCargando(false);
      }
    };

    fetchReservas();
  }, [auth, navigate, alertaError]);

  const handleEditar = (id) => {
    navigate(`/dashboard/reservas/vendedor/editar/${id}`);
  };

  const handleEliminar = async (id, nombreUsuario = '', nombreAuto = '') => {
    const nombreReserva = nombreUsuario && nombreAuto ? `la reserva de ${nombreUsuario} para el auto ${nombreAuto}` : 'esta reserva';
    
    const confirmado = await mostrarConfirm({
      titulo: "Eliminar Reserva",
      mensaje: `¿Estás seguro de que quieres eliminar ${nombreReserva}? Esta acción no se puede deshacer.`, 
      tipo: "peligro",
      textoBtnConfirmar: "Sí, eliminar",
      textoBtnCancelar: "Cancelar",
      icono: "🗑️"
    });

    if (!confirmado) return;

    try {
      await eliminarReserva(id);
      setReservas(prev => prev.filter(reserva => reserva.id !== id));
      exito("Reserva eliminada", `${nombreReserva} fue eliminada correctamente.`);
    } catch (err) {
      alertaError("Error al eliminar", "Ocurrió un error al eliminar la reserva. Por favor, intenta nuevamente.");
    }
  };

  const handleReprogramar = (id) => {
    navigate(`/dashboard/reservas/vendedor/reprogramar/${id}`);
  };

  const reservasFiltradas = reservas.filter(reserva =>
    reserva.nombreUsuario.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    reserva.nombreAuto.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    reserva.estado.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const renderContent = () => {
    if (estaCargando) {
      return <Spinner />;
    }

    if (reservasFiltradas.length === 0 && terminoBusqueda) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg mb-4">No se encontraron reservas que coincidan con tu búsqueda.</p>
          <Button onClick={() => setTerminoBusqueda('')}>Limpiar búsqueda</Button>
        </div>
      );
    }

    if (reservas.length === 0) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg mb-4">No hay reservas registradas para tus autos.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reservasFiltradas.map(reserva => (
          <ReservasCard 
            key={reserva.id} 
            reserva={reserva} 
            onEdit={handleEditar}
            onDelete={handleEliminar}
            onReschedule={handleReprogramar}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative flex justify-center bg-gradient-to-br from-tertiary via-white to-orange-100 px-4">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Mis Reservas de Autos</h1>
            <p className="text-gray-500 mt-1">Gestiona las reservas de pruebas de manejo para tus autos.</p>
          </div>
          <Button onClick={() => navigate('/dashboard/reservas/crear')} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nueva Reserva
          </Button>
        </div>

        <div className="mb-6">
          <Search 
            value={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por cliente, auto o estado..."
          />
        </div>

        {renderContent()}
      </div>

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

      {ConfirmComponent}
    </div>
  );
}
