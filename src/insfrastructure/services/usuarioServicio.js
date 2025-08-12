import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { databaseFirestore } from "./firebase_config.js";

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

export async function obtenerUsuarioPorId(uid) {
  const usuarioRef = doc(databaseFirestore, "usuarios", uid);
  const usuarioSnap = await getDoc(usuarioRef);
  if (usuarioSnap.exists()) {
    return { id: usuarioSnap.id, ...usuarioSnap.data() };
  } else {
    return null;
  }
}

export async function eliminarUsuario(uid) {
  const usuarioRef = doc(databaseFirestore, "usuarios", uid);
  await deleteDoc(usuarioRef);
}

export async function actualizarUsuario(uid, data) {
  const usuarioRef = doc(databaseFirestore, "usuarios", uid);
  await updateDoc(usuarioRef, data);
}
