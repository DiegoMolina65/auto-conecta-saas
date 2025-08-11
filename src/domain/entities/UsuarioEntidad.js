export class UsuarioEntidad {
  constructor({
    uid,
    nombres,
    apellidos,
    carnetDeIdentidad,
    numeroDeTelefono,
    correoElectronico,
  }) {
    this.uid = uid || null;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.carnetDeIdentidad = carnetDeIdentidad;
    this.numeroDeTelefono = numeroDeTelefono;
    this.correoElectronico = correoElectronico;
  }

  toFirestore() {
    return {
      uid: this.uid,
      nombres: this.nombres,
      apellidos: this.apellidos,
      carnetDeIdentidad: this.carnetDeIdentidad,
      numeroDeTelefono: this.numeroDeTelefono,
      correoElectronico: this.correoElectronico,
      role: "usuario", // Role por defecto
      creadoEn: new Date(),
    };
  }
}
