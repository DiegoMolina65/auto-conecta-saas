import React, { useState, useEffect } from 'react';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Alert, useAlert } from '../../../shared/components/Alert.jsx';
import { authService } from '../../../insfrastructure/services/firebase_config.js';
import { obtenerUsuarioPorId } from '../../../insfrastructure/services/usuarioServicio.js';
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PerfilClienteScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const { error: mostrarError } = useAlert();
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const usuarioActual = authService.currentUser;
        if (usuarioActual) {
          const datosUsuario = await obtenerUsuarioPorId(usuarioActual.uid);
          setUsuario(datosUsuario);
        } else {
          mostrarError('Debes iniciar sesión para ver tu perfil.');
          navegar('/login');
        }
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        mostrarError('No se pudo cargar tu perfil. Inténtalo de nuevo.');
      } finally {
        setEstaCargando(false);
      }
    };

    cargarPerfil();
  }, [mostrarError, navegar]);

  if (estaCargando) {
    return <Spinner fullScreen />;
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="info" className="mt-8">
              <Info className="h-4 w-4" />
              <p>No se encontró información de perfil para el usuario actual.</p>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mi Perfil de Cliente</h1>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
                <User className="h-6 w-6" />
                {usuario.nombres} {usuario.apellidos}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-gray-500" />
                <span>Correo Electrónico: {usuario.correoElectronico}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="h-5 w-5 mr-3 text-gray-500" />
                <span>Teléfono: {usuario.numeroDeTelefono || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                <span>Fecha de Registro: {new Date(usuario.creadoEn?.toDate()).toLocaleDateString() || 'N/A'}</span>
              </div>
              {/* Puedes añadir más campos del perfil aquí si los tienes */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerfilClienteScreen;