import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc, orderBy, limit } from "firebase/firestore";
import { databaseFirestore } from "./firebase_config.js";


// Obtener usuario por role
export async function obtenerUsuariosPorRole(role) {
  const usuariosRef = collection(databaseFirestore, "usuarios");
  const q = query(usuariosRef, where("role", "==", role));
  const querySnapshot = await getDocs(q);
  const usuarios = [];
  querySnapshot.forEach((doc) => {
    usuarios.push({ id: doc.id, ...doc.data() });
  });
  return usuarios;
}

// Obtener un usuario por ID
export async function obtenerUsuarioPorId(uid) {
  const usuarioRef = doc(databaseFirestore, "usuarios", uid);
  const usuarioSnap = await getDoc(usuarioRef);
  if (usuarioSnap.exists()) {
    return { id: usuarioSnap.id, ...usuarioSnap.data() };
  } else {
    return null;
  }
}

// Eliminar un usuario
export async function eliminarUsuario(uid) {
  const usuarioRef = doc(databaseFirestore, "usuarios", uid);
  await deleteDoc(usuarioRef);
}

// Actualizar un usuario
export async function actualizarUsuario(uid, data) {
  const usuarioRef = doc(databaseFirestore, "usuarios", uid);
  await updateDoc(usuarioRef, data);
}

// Obtener todos los usuarios
export async function obtenerTodosLosUsuarios() {
  const usuariosRef = collection(databaseFirestore, "usuarios");
  const querySnapshot = await getDocs(usuariosRef);
  const usuarios = [];
  querySnapshot.forEach((doc) => {
    usuarios.push({ id: doc.id, ...doc.data() });
  });
  return usuarios;
}

// Obtener usuarios recientes
export async function obtenerUsuariosRecientes(limite = 5) {
    try {
        const usuariosCollection = collection(databaseFirestore, 'usuarios');
        const q = query(usuariosCollection, orderBy('creadoEn', 'desc'), limit(limite));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error obteniendo usuarios recientes:", error);
        throw error;
    }
}
