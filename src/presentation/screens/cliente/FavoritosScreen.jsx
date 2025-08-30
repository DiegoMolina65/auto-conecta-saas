import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../insfrastructure/services/firebase_config.js';
import { obtenerUsuarioPorId } from '../../../insfrastructure/services/usuarioServicio.js';
import { obtenerAutosActivosPorIds as obtenerAutosPorIds } from '../../../insfrastructure/services/autoServicio.js';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import AutoCard  from '../../../shared/components/AutoCard.jsx';
import { Alert } from '../../../shared/components/Alert.jsx';
import { Button } from '../../../shared/components/Button.jsx';

const FavoritosScreen = () => {
  const [autosFavoritos, setAutosFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoritos = async () => {
      const usuarioActual = authService.currentUser;
      if (!usuarioActual) {
        setError('Debes iniciar sesión para ver tus favoritos.');
        setCargando(false);
        return;
      }

      try {
        const datosUsuario = await obtenerUsuarioPorId(usuarioActual.uid);
        if (datosUsuario && datosUsuario.favoritos && datosUsuario.favoritos.length > 0) {
          const autos = await obtenerAutosPorIds(datosUsuario.favoritos);
          setAutosFavoritos(autos);
        } else {
          setAutosFavoritos([]);
        }
      } catch (err) {
        setError('No se pudieron cargar los autos favoritos.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    fetchFavoritos();
  }, []);

  if (cargando) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Mis Autos Favoritos</h1>
        {error && <Alert tipo="error" mensaje={error} />}
        {!cargando && autosFavoritos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Aún no tienes autos guardados en tus favoritos.</p>
            <Button onClick={() => navigate('/autos')}>Explorar Autos</Button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {autosFavoritos.map(auto => (
            <AutoCard key={auto.id} auto={auto} showDetailsButton={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritosScreen;
