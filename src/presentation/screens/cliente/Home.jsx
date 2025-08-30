import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/Button.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import AutoCard from '../../../shared/components/AutoCard.jsx';
import { obtenerAutosRecientesActivos } from '../../../insfrastructure/services/autoServicio.js';
import { ArrowRight, Star, Shield, Award, Phone } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [autosDestacados, setAutosDestacados] = useState([]);

  useEffect(() => {
    const obtenerAutos = async () => {
      try {
        const todosLosAutos = await obtenerAutosRecientesActivos(3);
        const sortedAutos = todosLosAutos.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
        setAutosDestacados(sortedAutos);
      } catch (error) {
        console.error("Error al cargar los autos:", error);
      }
    };
    obtenerAutos();
  }, []);

  const manejarWhatsApp = () => {
    const mensaje = encodeURIComponent('Hola, me interesa conocer más sobre sus autos premium.');
    window.open(`https://wa.me/+59176050318?text=${mensaje}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop')`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Encuentra Tu
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Auto Perfecto
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Explora nuestra exclusiva colección de vehículos premium con la mejor tecnología y diseño del mercado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/autos')}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
            >
              Explorar Colección
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={manejarWhatsApp}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-gray-900 transition-colors text-lg px-8 py-3"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contactar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Por Qué Elegir AutoConecta?</h2>
            <p className="text-xl text-gray-600">Experiencia premium en cada detalle</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">Todos nuestros vehículos pasan por una inspección rigurosa.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Garantía Extendida</h3>
              <p className="text-gray-600">Cobertura completa en todos nuestros vehículos.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Servicio VIP</h3>
              <p className="text-gray-600">Atención personalizada y experiencia de compra única para cada cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Vehículos Destacados</h2>
            <p className="text-xl text-gray-600">Descubre nuestra selección premium</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {autosDestacados.map((auto) => (
              <AutoCard key={auto.id} auto={auto} showDetailsButton={true} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => navigate('/autos')}
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Ver Todos los Vehículos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para tu siguiente aventura?</h2>
          <p className="text-xl mb-8 text-gray-200">Contacta con nuestros expertos y encuentra el auto de tus sueños.</p>
          
          <Button 
            onClick={manejarWhatsApp}
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 transition-colors text-lg px-8 py-3"
          >
            <Phone className="mr-2 h-5 w-5" />
            Hablar con un Experto
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <span className="text-xl font-bold">AutoConecta</span>
          </div>
          <p className="text-gray-600 mb-4">
            Tu destino para vehículos de lujo y experiencias premium.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <span>📞 +591 76050318</span>
            <span>📧 autoconecta@gmail.com</span>
            <span>📍 Santa Cruz, Bolivia</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
