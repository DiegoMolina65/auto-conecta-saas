import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { authService, databaseFirestore } from "./firebase_config.js";
import { UsuarioEntidad } from "../../domain/entities/UsuarioEntidad.js"

// Función para registrar un nuevo usuario
export async function registrarUsuario(datos) {
  const { correoElectronico, contrasena, ...restoDatos } = datos;

  // Crear usuario en Auth
  const credenciales = await createUserWithEmailAndPassword(
    authService,
    correoElectronico,
    contrasena
  );

  // Actualizar perfil con nombre completo
  await updateProfile(credenciales.user, {
    displayName: `${restoDatos.nombres} ${restoDatos.apellidos}`,
  });

  // Crear entidad de dominio
  const usuario = new UsuarioEntidad({
    uid: credenciales.user.uid,
    correoElectronico,
    ...restoDatos
  });

  // Guardar en Firestore
  await setDoc(doc(databaseFirestore, "usuarios", usuario.uid), usuario.toFirestore());

  return usuario;
}

// Función para iniciar sesión
export async function iniciarSesion(datos) {
  const { correoElectronico, contrasena } = datos;

  // Iniciar sesión con Firebase Auth
  const credenciales = await signInWithEmailAndPassword(
    authService,
    correoElectronico,
    contrasena,
  );

  // Obtener datos del usuario desde Firestore
  const usuarioRef = doc(databaseFirestore, "usuarios", credenciales.user.uid);
  const usuarioSnap = await getDoc(usuarioRef);

  if (!usuarioSnap.exists()) {
    throw new Error("Datos de usuario no encontrados en Firestore.");
  }

  const usuarioData = usuarioSnap.data();

  // Verificar el estado del usuario
  if (usuarioData.estadoUsuario === "inactivo") {
    throw new Error("Tu cuenta está inactiva. Por favor, contacta al soporte.");
  }

  return credenciales.user;
}
