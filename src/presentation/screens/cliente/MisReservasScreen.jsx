import React, { useState, useEffect } from 'react';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Alert, useAlert } from '../../../shared/components/Alert.jsx';
import { authService } from '../../../insfrastructure/services/firebase_config.js';
import { obtenerReservasPorUsuarioId } from '../../../insfrastructure/services/reservasServicio.js';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReservasCard from '../../../shared/components/ReservasCard.jsx';

const MisReservasScreen = () => {
  const [reservas, setReservas] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const { error: mostrarError } = useAlert();
  const navegar = useNavigate();

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const usuarioActual = authService.currentUser;
        if (usuarioActual) {
          const reservasUsuario = await obtenerReservasPorUsuarioId(usuarioActual.uid);
          const sortedReservas = reservasUsuario.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
          setReservas(sortedReservas);
        } else {
          mostrarError('Debes iniciar sesión para ver tus reservas.');
          navegar('/login');
        }
      } catch (err) {
        console.error("Error al cargar las reservas:", err);
        mostrarError('No se pudieron cargar tus reservas. Inténtalo de nuevo.');
      } finally {
        setEstaCargando(false);
      }
    };

    cargarReservas();
  }, [mostrarError, navegar]);

  const handleViewDetails = (idAuto) => {
    navegar(`/autos/${idAuto}`);
  };

  if (estaCargando) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mis Reservas de Prueba de Manejo</h1>

          {reservas.length === 0 ? (
            <Alert variant="info" className="mt-8">
              <Info className="h-4 w-4" />
              <p>No tienes reservas de prueba de manejo registradas aún.</p>
            </Alert>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {reservas.map((reserva) => (
                <ReservasCard 
                  key={reserva.id} 
                  reserva={reserva} 
                  showActions={false} 
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisReservasScreen;