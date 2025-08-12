export class UsuarioEntidad {
  constructor({
    uid,
    nombres,
    apellidos,
    carnetDeIdentidad,
    numeroDeTelefono,
    correoElectronico,
    role,
    estadoUsuario,
  }) {
    this.uid = uid || null;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.carnetDeIdentidad = carnetDeIdentidad;
    this.numeroDeTelefono = numeroDeTelefono;
    this.correoElectronico = correoElectronico;
    this.role = role;
    this.estadoUsuario = estadoUsuario;
  }

  toFirestore() {
    return {
      uid: this.uid,
      nombres: this.nombres,
      apellidos: this.apellidos,
      carnetDeIdentidad: this.carnetDeIdentidad,
      numeroDeTelefono: this.numeroDeTelefono,
      correoElectronico: this.correoElectronico,
      role: this.role,
      estadoUsuario: this.estadoUsuario,
      creadoEn: new Date(),
    };
  }
}
