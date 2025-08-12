import React, { useState, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/components/Button.jsx";
import { Input } from "../../../../shared/components/Input.jsx";
import { Select } from "../../../../shared/components/Select.jsx";
import { Alert, useAlert } from "../../../../shared/components/Alert.jsx";
import { listasSelect } from "../../../../shared/helpers/listOptionSelect.js";
import { Spinner } from "../../../../shared/components/Spinner.jsx";

import { AutoEntidad } from "../../../../domain/entities/AutoEntidad.js";
import { crearAuto } from "../../../../insfrastructure/services/autoServicio.js";
import { subirVariasImagenes } from "../../../../insfrastructure/services/cloudinary-imagenes/CloudinaryService.js";

export default function RegistroAuto() {
  const navigate = useNavigate();
  const { alerts, exito, error, cerrarAlert } = useAlert();

  const [datosFormulario, setDatosFormulario] = useState({
    marca: "",
    modelo: "",
    version: "",
    ano: "",
    precio: "",
    moneda: "USD",
    kilometraje: "",
    colorExterior: "",
    colorInterior: "",
    tipoCombustible: "Gasolina",
    transmision: "Manual",
    motor: "",
    vin: "",
    condicion: "Usado",
    descripcion: "",
    ciudad: "",
    caracteristicas: [],
    imagenes: [],
  });

  const [errores, setErrores] = useState({});
  const [estaCargando, setEstaCargando] = useState(false);
  const [caracteristicaTemp, setCaracteristicaTemp] = useState("");
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);

  // Filtrar modelos basándose en la marca seleccionada
  const modelosFiltrados = useMemo(() => {
    if (!datosFormulario.marca) {
      return [];
    }
    return listasSelect.modelo.filter(
      (modelo) => modelo.marca === datosFormulario.marca
    );
  }, [datosFormulario.marca]);

  const manejarCambioInput = (campo) => (eventoOrOpcion) => {
    let valor = "";

    // Si es un objeto con .value
    if (
      eventoOrOpcion &&
      typeof eventoOrOpcion === "object" &&
      "value" in eventoOrOpcion
    ) {
      valor = eventoOrOpcion.value ?? "";
    }
    // Si es un evento de input
    else if (
      eventoOrOpcion &&
      eventoOrOpcion.target &&
      "value" in eventoOrOpcion.target
    ) {
      valor = eventoOrOpcion.target.value;
    } else {
      valor = "";
    }

    setDatosFormulario((anterior) => {
      const nuevoDatos = {
        ...anterior,
        [campo]: valor,
      };

      // Si se cambia la marca, resetear el modelo
      if (campo === "marca") {
        nuevoDatos.modelo = "";
      }

      return nuevoDatos;
    });

    if (errores[campo]) {
      setErrores((anterior) => ({
        ...anterior,
        [campo]: "",
      }));
    }
  };

  const manejarCambioImagenes = (evento) => {
    const archivosSeleccionados = Array.from(evento.target.files);

    // Verificar si al agregar estas imágenes se supera el límite
    const totalImagenes =
      imagenesSeleccionadas.length + archivosSeleccionados.length;
    if (totalImagenes > 5) {
      error(
        "Límite de imágenes",
        `Solo puedes tener máximo 5 imágenes. Ya tienes ${
          imagenesSeleccionadas.length
        }, puedes agregar ${5 - imagenesSeleccionadas.length} más.`
      );
      // Limpiar el input
      evento.target.value = "";
      return;
    }

    // Validar tipos de archivo
    const tiposPermitidos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const archivosValidos = archivosSeleccionados.filter((archivo) =>
      tiposPermitidos.includes(archivo.type)
    );

    if (archivosValidos.length !== archivosSeleccionados.length) {
      error(
        "Formato inválido",
        "Solo se permiten imágenes en formato JPG, PNG o WebP"
      );
      evento.target.value = "";
      return;
    }

    // Validar tamaño (máximo 5MB por imagen)
    const archivosConTamanoValido = archivosValidos.filter(
      (archivo) => archivo.size <= 5 * 1024 * 1024 // 5MB
    );

    if (archivosConTamanoValido.length !== archivosValidos.length) {
      error("Archivo muy grande", "Cada imagen debe pesar menos de 5MB");
      evento.target.value = "";
      return;
    }

    // Agregar las nuevas imágenes a las existentes (no reemplazar)
    setImagenesSeleccionadas((anterior) => [
      ...anterior,
      ...archivosConTamanoValido,
    ]);

    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente si es necesario
    evento.target.value = "";
  };

  const eliminarImagen = (index) => {
    setImagenesSeleccionadas((anterior) =>
      anterior.filter((_, i) => i !== index)
    );
  };

  const agregarCaracteristica = () => {
    const valor = caracteristicaTemp.trim();
    if (valor && !datosFormulario.caracteristicas.includes(valor)) {
      setDatosFormulario((anterior) => ({
        ...anterior,
        caracteristicas: [...anterior.caracteristicas, valor],
      }));
      setCaracteristicaTemp("");
    }
  };

  const eliminarCaracteristica = (index) => {
    setDatosFormulario((anterior) => ({
      ...anterior,
      caracteristicas: anterior.caracteristicas.filter((_, i) => i !== index),
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!datosFormulario.marca.trim())
      nuevosErrores.marca = "La marca es requerida";
    if (!datosFormulario.modelo.trim())
      nuevosErrores.modelo = "El modelo es requerido";
    if (!datosFormulario.ano) nuevosErrores.ano = "El año es requerido";
    else if (
      datosFormulario.ano < 1900 ||
      datosFormulario.ano > new Date().getFullYear() + 1
    )
      nuevosErrores.ano = "El año no es válido";
    if (!datosFormulario.precio)
      nuevosErrores.precio = "El precio es requerido";
    else if (datosFormulario.precio <= 0)
      nuevosErrores.precio = "El precio debe ser mayor a 0";
    if (!datosFormulario.kilometraje)
      nuevosErrores.kilometraje = "El kilometraje es requerido";
    else if (datosFormulario.kilometraje < 0)
      nuevosErrores.kilometraje = "El kilometraje no puede ser negativo";
    if (!datosFormulario.colorExterior.trim())
      nuevosErrores.colorExterior = "El color exterior es requerido";
    if (!datosFormulario.motor.trim())
      nuevosErrores.motor = "La información del motor es requerida";

    return nuevosErrores;
  };

  const manejarRegistro = async (evento) => {
    evento.preventDefault();

    const erroresFormulario = validarFormulario();
    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario);
      return;
    }

    setEstaCargando(true);

    try {
      const auth = getAuth();
      const usuarioLogueado = auth.currentUser;
      if (!usuarioLogueado) {
        error(
          "No estás autenticado",
          "Por favor inicia sesión para registrar un vehículo"
        );
        setEstaCargando(false);
        return;
      }

      datosFormulario.vendedorId = usuarioLogueado.uid;

      // Subir imágenes a Cloudinary usando servicio externo
      let urlsImagenes = [];
      if (imagenesSeleccionadas.length > 0) {
        urlsImagenes = await subirVariasImagenes(imagenesSeleccionadas);
      }

      // Crear la entidad Auto con URLs de imágenes
      const nuevoAuto = new AutoEntidad({
        ...datosFormulario,
        ano: parseInt(datosFormulario.ano),
        precio: parseFloat(datosFormulario.precio),
        kilometraje: parseInt(datosFormulario.kilometraje),
        imagenes: urlsImagenes,
        fechaPublicacion: new Date(),
      });

      await crearAuto(nuevoAuto);

      exito("Auto registrado", "El vehículo ha sido publicado exitosamente");
      // Resetear formulario y estados
      setDatosFormulario({
        marca: "",
        modelo: "",
        version: "",
        ano: "",
        precio: "",
        moneda: "USD",
        kilometraje: "",
        colorExterior: "",
        colorInterior: "",
        tipoCombustible: "Gasolina",
        transmision: "Manual",
        motor: "",
        vin: "",
        condicion: "Usado",
        descripcion: "",
        ciudad: "",
        caracteristicas: [],
        imagenes: [],
      });

      setErrores({});
      setCaracteristicaTemp("");
      setImagenesSeleccionadas([]);

      setTimeout(() => {
        //TODO: Cambiar a donde va redirigir después de registrar
        navigate("/registro-auto");
      }, 1500);
    } catch (err) {
      console.error(err);
      error("Error al registrar", "No se pudo registrar el vehículo");
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary to-orange-100 px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-white to-orange-100"></div>

      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-xl"></div>

      <div className="relative max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-white text-white p-6 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Registrar Vehículo</h1>
              <p className="text-gray-300 text-sm">
                Publica tu auto en AutoConecta
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={manejarRegistro} className="p-8">
          {/* Información Básica */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                1
              </span>
              Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Marca
                </label>
                <Select
                  value={datosFormulario.marca}
                  onChange={manejarCambioInput("marca")}
                  options={listasSelect.marca}
                  placeholder="Selecciona una marca"
                  variant="primary"
                  size="md"
                  error={errores.marca}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Modelo
                </label>
                <Select
                  value={datosFormulario.modelo}
                  onChange={manejarCambioInput("modelo")}
                  options={modelosFiltrados}
                  placeholder={
                    datosFormulario.marca
                      ? "Selecciona un modelo"
                      : "Primero selecciona una marca"
                  }
                  variant="primary"
                  size="md"
                  error={errores.modelo}
                  disabled={!datosFormulario.marca}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Versión
                </label>
                <Select
                  value={datosFormulario.version}
                  onChange={manejarCambioInput("version")}
                  options={listasSelect.version}
                  placeholder="Selecciona una versión"
                  variant="primary"
                  size="md"
                  error={errores.version}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Ciudad
                </label>
                <Select
                  value={datosFormulario.ciudad}
                  onChange={manejarCambioInput("ciudad")}
                  options={listasSelect.ciudad}
                  placeholder="Selecciona una ciudad"
                  variant="primary"
                  size="md"
                  error={errores.ciudad}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Input
                label="Año"
                type="number"
                placeholder="2020"
                valor={datosFormulario.ano}
                onChange={manejarCambioInput("ano")}
                error={errores.ano}
                icon="📅"
                size="md"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              <Input
                label="Precio"
                type="number"
                placeholder="15000"
                valor={datosFormulario.precio}
                onChange={manejarCambioInput("precio")}
                error={errores.precio}
                icon="💰"
                size="md"
                min="0"
                step="0.01"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <Select
                  value={datosFormulario.moneda}
                  onChange={manejarCambioInput("moneda")}
                  options={listasSelect.moneda}
                  placeholder="Selecciona una moneda"
                  variant="primary"
                  size="md"
                />
              </div>
              <Input
                label="Kilometraje"
                type="number"
                placeholder="50000"
                valor={datosFormulario.kilometraje}
                onChange={manejarCambioInput("kilometraje")}
                error={errores.kilometraje}
                icon="🛣️"
                size="md"
                min="0"
              />
            </div>
          </div>

          {/* Características Físicas */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                2
              </span>
              Características Físicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Color Exterior"
                placeholder="Blanco, Negro, etc."
                valor={datosFormulario.colorExterior}
                onChange={manejarCambioInput("colorExterior")}
                error={errores.colorExterior}
                icon="🎨"
                size="md"
              />
              <Input
                label="Color Interior"
                placeholder="Gris, Beige, etc."
                valor={datosFormulario.colorInterior}
                onChange={manejarCambioInput("colorInterior")}
                error={errores.colorInterior}
                icon="🪑"
                size="md"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Combustible
                </label>
                <Select
                  value={datosFormulario.tipoCombustible}
                  onChange={manejarCambioInput("tipoCombustible")}
                  options={listasSelect.combustible}
                  placeholder="Selecciona una moneda"
                  variant="primary"
                  size="md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmisión
                </label>
                <Select
                  value={datosFormulario.transmision}
                  onChange={manejarCambioInput("transmision")}
                  options={listasSelect.transmision}
                  placeholder="Selecciona una transmisión"
                  variant="primary"
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                3
              </span>
              Detalles Técnicos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Motor"
                placeholder="1.8L 4 cilindros"
                valor={datosFormulario.motor}
                onChange={manejarCambioInput("motor")}
                error={errores.motor}
                icon="⚙️"
                size="md"
              />
              <Input
                label="VIN (Opcional)"
                placeholder="Número de identificación"
                valor={datosFormulario.vin}
                onChange={manejarCambioInput("vin")}
                error={errores.vin}
                icon="🔢"
                size="md"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condición
                </label>
                <Select
                  value={datosFormulario.condicion}
                  onChange={manejarCambioInput("condicion")}
                  options={listasSelect.condicion}
                  placeholder="Selecciona una condición"
                  variant="primary"
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Descripción y Características */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                4
              </span>
              Descripción y Características
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={datosFormulario.descripcion}
                  onChange={manejarCambioInput("descripcion")}
                  placeholder="Describe tu vehículo, mantenimiento, estado general, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Características Adicionales
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={caracteristicaTemp}
                    onChange={(e) => setCaracteristicaTemp(e.target.value)}
                    placeholder="Aire acondicionado, GPS, etc."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), agregarCaracteristica())
                    }
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={agregarCaracteristica}
                    disabled={!caracteristicaTemp.trim()}
                  >
                    Agregar
                  </Button>
                </div>

                {datosFormulario.caracteristicas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {datosFormulario.caracteristicas.map(
                      (caracteristica, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-tertiary text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {caracteristica}
                          <button
                            type="button"
                            onClick={() => eliminarCaracteristica(index)}
                            className="ml-2 text-secondary hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subir imágenes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                5
              </span>
              Imágenes ({imagenesSeleccionadas.length}/5)
            </h2>

            <div className="space-y-4">
              {imagenesSeleccionadas.length < 5 && (
                <>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={manejarCambioImagenes}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-secondary file:text-primary
                               hover:file:bg-secondary/80
                               cursor-pointer"
                  />

                  <p className="text-sm text-gray-500">
                    {imagenesSeleccionadas.length === 0
                      ? "Puedes seleccionar hasta 5 imágenes. Formatos: JPG, PNG, WebP. Máximo 5MB por imagen."
                      : `Puedes agregar ${
                          5 - imagenesSeleccionadas.length
                        } imágenes más. Formatos: JPG, PNG, WebP. Máximo 5MB por imagen.`}
                  </p>
                </>
              )}

              {imagenesSeleccionadas.length === 5 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    ✅ Has alcanzado el límite de 5 imágenes. Si deseas cambiar
                    alguna, elimínala primero.
                  </p>
                </div>
              )}

              {imagenesSeleccionadas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Imágenes seleccionadas:
                    </h3>
                    {imagenesSeleccionadas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setImagenesSeleccionadas([])}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar todas
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagenesSeleccionadas.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="w-full h-24 border border-gray-300 rounded overflow-hidden">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Vista previa ${idx + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarImagen(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                        <p
                          className="text-xs text-gray-500 mt-1 truncate"
                          title={img.name}
                        >
                          {img.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={estaCargando}
            >
              {estaCargando ? (
                <Spinner />
              ) : (
                "Publicar vehículo"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Renderizar alerts - Corregido siguiendo el patrón de Login */}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
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
    </div>
  );
}
