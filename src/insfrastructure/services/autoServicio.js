import { collection, addDoc } from "firebase/firestore";
import { databaseFirestore } from "./firebase_config.js";

// Función para crear un nuevo auto
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
