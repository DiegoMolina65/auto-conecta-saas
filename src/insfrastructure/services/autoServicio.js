import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { databaseFirestore } from "./firebase_config.js";

// Crear un nuevo auto
export async function crearAuto(autoEntidad) {
  try {
    const coleccionAutos = collection(databaseFirestore, "autos");
    const docRef = await addDoc(coleccionAutos, autoEntidad.toFirestore());
    return docRef.id;
  } catch (error) {
    console.error("Error creando auto en Firestore:", error);
    throw error;
  }
}

// Obtener un auto por su ID
export async function getAutoById(idAuto) {
  try {
    const autoRef = doc(databaseFirestore, "autos", idAuto);
    const docSnap = await getDoc(autoRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error obteniendo auto con ID ${idAuto}:`, error);
    throw error;
  }
}

// Editar un auto existente
export async function editarAuto(idAuto, datosActualizados) {
  try {
    const autoRef = doc(databaseFirestore, "autos", idAuto);
    await updateDoc(autoRef, datosActualizados);
    console.log(`Auto con ID ${idAuto} actualizado correctamente.`);
  } catch (error) {
    console.error(`Error actualizando auto con ID ${idAuto}:`, error);
    throw error;
  }
}

// Eliminar un auto
export async function eliminarAuto(idAuto) {
  try {
    const autoRef = doc(databaseFirestore, "autos", idAuto);
    await deleteDoc(autoRef);
    console.log(`Auto con ID ${idAuto} eliminado correctamente.`);
  } catch (error) {
    console.error(`Error eliminando auto con ID ${idAuto}:`, error);
    throw error;
  }
}
