import React, { useState, useEffect, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../shared/components/Button.jsx";
import { Input } from "../../../../shared/components/Input.jsx";
import { Select } from "../../../../shared/components/Select.jsx";
import { Alert, useAlert } from "../../../../shared/components/Alert.jsx";
import { listasSelect } from "../../../../shared/helpers/listOptionSelect.js";
import { Spinner } from "../../../../shared/components/Spinner.jsx";

import { AutoEntidad } from "../../../../domain/entities/AutoEntidad.js";
import {
  getAutoById,
  editarAuto,
} from "../../../../insfrastructure/services/autoServicio.js";
import { subirVariasImagenes } from "../../../../insfrastructure/services/cloudinary-imagenes/CloudinaryService.js";

export default function EditarAutoScreen() {
  const navigate = useNavigate();
  const { id: autoId } = useParams();
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
    estadoPublicacion: "activo",
  });

  const [errores, setErrores] = useState({});
  const [estaCargando, setEstaCargando] = useState(false);
  const [caracteristicaTemp, setCaracteristicaTemp] = useState("");
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

  useEffect(() => {
    const fetchAuto = async () => {
      setEstaCargando(true);
      try {
        const auto = await getAutoById(autoId);
        if (auto) {
          setDatosFormulario({
            ...auto,
            ano: auto.ano.toString(),
            precio: auto.precio.toString(),
            kilometraje: auto.kilometraje.toString(),
          });
          setImagenesExistentes(auto.imagenes || []);
        } else {
          error("Error", "No se encontró el auto para editar.");
          navigate("/dashboard/autos-registrados-por-vendedor-logueado");
        }
      } catch (err) {
        console.error(err);
        error("Error", "No se pudo cargar la información del auto.");
      } finally {
        setEstaCargando(false);
      }
    };
    fetchAuto();
  }, [autoId, navigate]);

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

    if (
      eventoOrOpcion &&
      typeof eventoOrOpcion === "object" &&
      "value" in eventoOrOpcion
    ) {
      valor = eventoOrOpcion.value ?? "";
    } else if (
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
    const totalImagenes =
      imagenesExistentes.length +
      imagenesSeleccionadas.length +
      archivosSeleccionados.length;
    if (totalImagenes > 5) {
      error(
        "Límite de imágenes",
        `Solo puedes tener máximo 5 imágenes. Ya tienes ${
          imagenesExistentes.length + imagenesSeleccionadas.length
        }, puedes agregar ${
          5 - (imagenesExistentes.length + imagenesSeleccionadas.length)
        } más.`
      );
      evento.target.value = "";
      return;
    }

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

    const archivosConTamanoValido = archivosValidos.filter(
      (archivo) => archivo.size <= 5 * 1024 * 1024 // 5MB
    );

    if (archivosConTamanoValido.length !== archivosValidos.length) {
      error("Archivo muy grande", "Cada imagen debe pesar menos de 5MB");
      evento.target.value = "";
      return;
    }

    setImagenesSeleccionadas((anterior) => [
      ...anterior,
      ...archivosConTamanoValido,
    ]);
    evento.target.value = "";
  };

  const eliminarImagenNueva = (index) => {
    setImagenesSeleccionadas((anterior) =>
      anterior.filter((_, i) => i !== index)
    );
  };

  const eliminarImagenExistente = (index) => {
    setImagenesExistentes((anterior) => anterior.filter((_, i) => i !== index));
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

  const manejarActualizacion = async (evento) => {
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
          "Por favor inicia sesión para editar un vehículo"
        );
        setEstaCargando(false);
        return;
      }

      let urlsImagenesNuevas = [];
      if (imagenesSeleccionadas.length > 0) {
        urlsImagenesNuevas = await subirVariasImagenes(imagenesSeleccionadas);
      }

      const imagenesFinales = [...imagenesExistentes, ...urlsImagenesNuevas];

      const datosParaActualizar = new AutoEntidad({
        ...datosFormulario,
        ano: parseInt(datosFormulario.ano),
        precio: parseFloat(datosFormulario.precio),
        kilometraje: parseInt(datosFormulario.kilometraje),
        imagenes: imagenesFinales,
        // No sobrescribir vendedorId, ya viene en datosFormulario
        // vendedorId: usuarioLogueado.uid,
      }).toFirestore();

      await editarAuto(autoId, datosParaActualizar);

      exito("Auto actualizado", "El vehículo ha sido actualizado exitosamente");

      setTimeout(() => {
        navigate("/dashboard/autos-registrados-por-vendedor-logueado");
      }, 1500);
    } catch (err) {
      console.error(err);
      error("Error al actualizar", "No se pudo actualizar el vehículo");
    } finally {
      setEstaCargando(false);
    }
  };

  if (estaCargando && !datosFormulario.marca) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary to-orange-100 px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-white to-orange-100 -z-10"></div>

      <div className="absolute top-20 left-10 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-xl"></div>

      <div className="relative max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-800 to-white text-white p-6 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-2xl">✏️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Editar auto</h1>
              <p className="text-gray-300 text-sm">
                Actualiza la información de tu auto
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={manejarActualizacion} className="p-8">
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

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                5
              </span>
              Imágenes (
              {imagenesExistentes.length + imagenesSeleccionadas.length}/5)
            </h2>

            <div className="space-y-4">
              {imagenesExistentes.length + imagenesSeleccionadas.length < 5 && (
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
                    Puedes agregar{" "}
                    {5 -
                      (imagenesExistentes.length +
                        imagenesSeleccionadas.length)}{" "}
                    imágenes más. Formatos: JPG, PNG, WebP. Máximo 5MB por
                    imagen.
                  </p>
                </>
              )}

              {imagenesExistentes.length + imagenesSeleccionadas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Imágenes actuales:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagenesExistentes.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <div className="w-full h-24 border border-gray-300 rounded overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={`Imagen existente ${idx + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarImagenExistente(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                          onClick={() => eliminarImagenNueva(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm mr-3">
                6
              </span>
              Configuración de Publicación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de la Publicación
                </label>
                <Select
                  value={datosFormulario.estadoPublicacion || ""}
                  onChange={manejarCambioInput("estadoPublicacion")}
                  options={[
                    { value: "activo", label: "Activo" },
                    { value: "inactivo", label: "Inactivo" },
                  ]}
                  placeholder="Selecciona el estado"
                  variant="primary"
                  size="md"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              size="lg"
              className="flex-1"
              disabled={estaCargando}
            >
              {estaCargando ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                "Actualizar auto"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {alerts.map((alert, index) => (
          <Alert
            key={alert.id}
            tipo={alert.tipo}
            titulo={alert.titulo}
            mensaje={alert.mensaje}
            visible={alert.visible}
            onCerrar={() => cerrarAlert(alert.id)}
            autodismiss={alert.autodismiss}
            duracion={alert.duracion}
            style={{ transform: `translateY(${index * 10}px)` }}
          />
        ))}
      </div>
    </div>
  );
}