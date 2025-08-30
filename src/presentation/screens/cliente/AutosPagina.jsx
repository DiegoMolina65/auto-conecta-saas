import React, { useState, useMemo, useEffect } from 'react';
import { NavBar } from '../../../shared/components/NavBar.jsx';
import AutoCard from '../../../shared/components/AutoCard.jsx';
import { obtenerTodosLosAutosActivos as obtenerTodosLosAutos } from '../../../insfrastructure/services/autoServicio.js';
import { Button } from '../../../shared/components/Button.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Select } from '../../../shared/components/Select.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';
import { Search, Filter, X } from 'lucide-react';

const AutosPagina = () => {
  const [autos, setAutos] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('all');
  const [tipoCombustibleSeleccionado, setTipoCombustibleSeleccionado] = useState('all');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('all');
  const [rangoPrecio, setRangoPrecio] = useState('all');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    const obtenerAutos = async () => {
      try {
        const todosLosAutos = await obtenerTodosLosAutos();
        const sortedAutos = todosLosAutos.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
        setAutos(sortedAutos);
      } catch (error) {
        console.error("Error al obtener los autos:", error);
      }
    };
    obtenerAutos();
  }, []);

  const marcas = [...new Set(autos.map(auto => auto.marca))];
  const categorias = [...new Set(autos.map(auto => auto.version))];
  const tiposCombustible = [...new Set(autos.map(auto => auto.tipoCombustible))];

  const autosFiltrados = useMemo(() => {
    return autos.filter(auto => {
      const coincideBusqueda = auto.marca.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                           auto.modelo.toLowerCase().includes(terminoBusqueda.toLowerCase());
      
      const coincideCategoria = categoriaSeleccionada === 'all' || auto.version === categoriaSeleccionada;
      const coincideTipoCombustible = tipoCombustibleSeleccionado === 'all' || auto.tipoCombustible === tipoCombustibleSeleccionado;
      const coincideMarca = marcaSeleccionada === 'all' || auto.marca === marcaSeleccionada;
      
      let coincidePrecio = true;
      if (rangoPrecio !== 'all') {
        const precio = auto.precio;
        switch (rangoPrecio) {
          case 'under-70k':
            coincidePrecio = precio < 70000;
            break;
          case '70k-100k':
            coincidePrecio = precio >= 70000 && precio < 100000;
            break;
          case '100k-150k':
            coincidePrecio = precio >= 100000 && precio < 150000;
            break;
          case 'over-150k':
            coincidePrecio = precio >= 150000;
            break;
        }
      }
      
      return coincideBusqueda && coincideCategoria && coincideTipoCombustible && coincideMarca && coincidePrecio;
    });
  }, [terminoBusqueda, categoriaSeleccionada, tipoCombustibleSeleccionado, marcaSeleccionada, rangoPrecio, autos]);

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setCategoriaSeleccionada('all');
    setTipoCombustibleSeleccionado('all');
    setMarcaSeleccionada('all');
    setRangoPrecio('all');
  };

  const cantidadFiltrosActivos = [
    categoriaSeleccionada !== 'all',
    tipoCombustibleSeleccionado !== 'all',
    marcaSeleccionada !== 'all',
    rangoPrecio !== 'all',
    terminoBusqueda !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explora Nuestros
              <span className="text-blue-600">
                {" "}Vehículos Premium
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Encuentra el auto perfecto para ti con nuestros filtros avanzados
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por marca o modelo..."
                  valor={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="lg:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {cantidadFiltrosActivos > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cantidadFiltrosActivos}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filters */}
            {mostrarFiltros && (
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <Select value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                    <option value="all">Todas las marcas</option>
                    {marcas.map(marca => (
                      <option key={marca} value={marca}>{marca}</option>
                    ))}
                  </Select>

                  <Select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)}>
                    <option value="all">Todos los tipos</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </Select>

                  <Select value={tipoCombustibleSeleccionado} onChange={e => setTipoCombustibleSeleccionado(e.target.value)}>
                    <option value="all">Todos</option>
                    {tiposCombustible.map(combustible => (
                      <option key={combustible} value={combustible}>
                        {combustible}
                      </option>
                    ))}
                  </Select>

                  <Select value={rangoPrecio} onChange={e => setRangoPrecio(e.target.value)}>
                    <option value="all">Todos los precios</option>
                    <option value="under-70k">Menos de $70,000</option>
                    <option value="70k-100k">$70,000 - $100,000</option>
                    <option value="100k-150k">$100,000 - $150,000</option>
                    <option value="over-150k">Más de $150,000</option>
                  </Select>
                </div>
                
                {cantidadFiltrosActivos > 0 && (
                  <Button variant="outline" onClick={limpiarFiltros} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando {autosFiltrados.length} de {autos.length} vehículos
            </p>
          </div>

          {/* Cars Grid */}
          {autosFiltrados.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {autosFiltrados.map((auto) => (
                <AutoCard key={auto.id} auto={auto} showDetailsButton={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold mb-2">No se encontraron vehículos</h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <Button onClick={limpiarFiltros} variant="outline">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutosPagina;