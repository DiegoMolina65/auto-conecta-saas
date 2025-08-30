class ReservasPruebasManejoEntidad {
  constructor(id, idAuto, idUsuario, fecha, hora, estado, comentarios, nombreUsuario, correoElectronicoUsuario, telefonoUsuario, nombreAuto) {
    this.id = id;
    this.idAuto = idAuto;
    this.idUsuario = idUsuario;
    this.fecha = fecha;
    this.hora = hora;
    this.estado = estado || 'pendiente';
    this.comentarios = comentarios;
    this.nombreUsuario = nombreUsuario;
    this.correoElectronicoUsuario = correoElectronicoUsuario;
    this.telefonoUsuario = telefonoUsuario;
    this.nombreAuto = nombreAuto;
    this.fechaCreacion = new Date();
  }

  toFirestore() {
    return {
      idAuto: this.idAuto,
      idUsuario: this.idUsuario,
      fecha: this.fecha,
      hora: this.hora,
      estado: this.estado,
      comentarios: this.comentarios,
      nombreUsuario: this.nombreUsuario,
      correoElectronicoUsuario: this.correoElectronicoUsuario,
      telefonoUsuario: this.telefonoUsuario,
      nombreAuto: this.nombreAuto,
      fechaCreacion: this.fechaCreacion,
    };
  }
}

export default ReservasPruebasManejoEntidad;
