export class AutoEntidad {
  constructor({
    id,
    marca,
    modelo,
    version,
    ano,
    precio,
    moneda,
    kilometraje,
    colorExterior,
    colorInterior,
    tipoCombustible,
    transmision,
    motor,
    vin,
    condicion,
    descripcion,
    imagenes = [],
    caracteristicas = [],
    fechaPublicacion,
    estadoPublicacion,
    vendedorId
  }) {
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.version = version;
    this.ano = ano;
    this.precio = precio;
    this.moneda = moneda;
    this.kilometraje = kilometraje;
    this.colorExterior = colorExterior;
    this.colorInterior = colorInterior;
    this.tipoCombustible = tipoCombustible;
    this.transmision = transmision;
    this.motor = motor;
    this.vin = vin;
    this.condicion = condicion;
    this.descripcion = descripcion;
    this.imagenes = imagenes;
    this.caracteristicas = caracteristicas;
    this.fechaPublicacion = fechaPublicacion ? new Date(fechaPublicacion) : null;
    this.estadoPublicacion = estadoPublicacion;
    this.vendedorId = vendedorId;
  }

  toFirestore() {
    return {
      marca: this.marca,
      modelo: this.modelo,
      version: this.version,
      ano: this.ano,
      precio: this.precio,
      moneda: this.moneda,
      kilometraje: this.kilometraje,
      colorExterior: this.colorExterior,
      colorInterior: this.colorInterior,
      tipoCombustible: this.tipoCombustible,
      transmision: this.transmision,
      motor: this.motor,
      vin: this.vin,
      condicion: this.condicion,
      descripcion: this.descripcion,
      imagenes: this.imagenes,
      caracteristicas: this.caracteristicas,
      fechaPublicacion: this.fechaPublicacion ? this.fechaPublicacion.toISOString() : null,
      estadoPublicacion: "activo", // estado por defecto
      vendedorId: this.vendedorId
    };
  }
}
