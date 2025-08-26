import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/Button.jsx';
import { Car, Menu, X, Phone, User } from 'lucide-react';

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, me interesa conocer más sobre sus autos disponibles.');
    window.open(`https://wa.me/59112345678?text=${message}`, '_blank');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => handleNavigation('/')}
          >
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              AutoConecta
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('/')}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavigation('/autos')}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Explorar Autos
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contacto
              </Button>
              <Button
                onClick={() => handleNavigation('/login')}
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 py-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-1 px-4 pb-4 border-b border-gray-100">
                <button
                  onClick={() => handleNavigation('/')}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Inicio
                </button>
                <button
                  onClick={() => handleNavigation('/autos')}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Explorar Autos
                </button>
              </div>

              {/* Mobile Action Buttons */}
              <div className="px-4 pt-4 space-y-3">
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contacto WhatsApp
                </Button>
                <Button
                  onClick={() => handleNavigation('/login')}
                  variant="primary"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Demo component to show the improved navbar
export default function ImprovedNavBarDemo() {
  // Mock navigate function for demo
  const mockNavigate = (path) => {
    console.log(`Mock navigation to: ${path}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo navbar with mock functions */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => mockNavigate('/')}
            >
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">
                AutoConecta
              </span>
            </div>

            {/* Desktop Navigation - Shows the improved structure */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm">
                  Inicio
                </button>
                <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm">
                  Explorar Autos
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-sm font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-lg flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contacto
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all rounded-lg flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 hover:text-blue-600 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}