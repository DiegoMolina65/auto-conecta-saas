import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { databaseFirestore } from "./firebase_config.js";
import { getAutoById, obtenerAutosPorVendedorId } from "./autoServicio.js";
import { obtenerUsuarioPorId } from "./usuarioServicio.js";

async function enriquecerReserva(reservaDoc) {
  const reservaData = reservaDoc.data();
  let nombreUsuario = 'Usuario no encontrado';
  let nombreAuto = 'Auto no encontrado';

  if (reservaData.idUsuario) {
    const usuario = await obtenerUsuarioPorId(reservaData.idUsuario);
    if (usuario) {
      nombreUsuario = `${usuario.nombres} ${usuario.apellidos}`;
    }
  }

  if (reservaData.idAuto) {
    const auto = await getAutoById(reservaData.idAuto);
    if (auto) {
      nombreAuto = `${auto.marca} ${auto.modelo}`;
    }
  }

  return {
    id: reservaDoc.id,
    ...reservaData,
    nombreUsuario,
    nombreAuto,
  };
}


export async function crearReservaPruebaManejo(reservaEntidad) {
  try {
    const coleccionReservas = collection(databaseFirestore, "reservasPruebasManejo");
    const docRef = await addDoc(coleccionReservas, reservaEntidad.toFirestore());
    return docRef.id;
  } catch (error) {
    console.error("Error creando la reserva de prueba de manejo en Firestore:", error);
    throw error;
  }
}

export async function obtenerReservasPorAutoYFecha(idAuto, fecha) {
  try {
    const coleccionReservas = collection(databaseFirestore, "reservasPruebasManejo");
    const q = query(
      coleccionReservas,
      where("idAuto", "==", idAuto),
      where("fecha", "==", fecha)
    );
    const querySnapshot = await getDocs(q);
    
    const reservasEnriquecidas = await Promise.all(querySnapshot.docs.map(enriquecerReserva));
    return reservasEnriquecidas;

  } catch (error) {
    console.error("Error obteniendo las reservas por auto y fecha:", error);
    throw error;
  }
}

export async function obtenerReservasPorUsuarioId(idUsuario) {
  try {
    const coleccionReservas = collection(databaseFirestore, "reservasPruebasManejo");
    const q = query(
      coleccionReservas,
      where("idUsuario", "==", idUsuario)
    );
    const querySnapshot = await getDocs(q);
    const reservasEnriquecidas = await Promise.all(querySnapshot.docs.map(enriquecerReserva));
    return reservasEnriquecidas;
  } catch (error) {
    console.error("Error obteniendo las reservas por ID de usuario:", error);
    throw error;
  }
}

export async function obtenerTodasLasReservas() {
  try {
    const coleccionReservas = collection(databaseFirestore, "reservasPruebasManejo");
    const querySnapshot = await getDocs(coleccionReservas);
    const reservasEnriquecidas = await Promise.all(querySnapshot.docs.map(enriquecerReserva));
    return reservasEnriquecidas;
  } catch (error) {
    console.error("Error obteniendo todas las reservas:", error);
    throw error;
  }
}

export async function obtenerReservaPorId(id) {
  try {
    const reservaRef = doc(databaseFirestore, "reservasPruebasManejo", id);
    const reservaSnap = await getDoc(reservaRef);
    if (reservaSnap.exists()) {
      return await enriquecerReserva(reservaSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo reserva por ID:", error);
    throw error;
  }
}

export async function actualizarReserva(id, data) {
  try {
    const reservaRef = doc(databaseFirestore, "reservasPruebasManejo", id);
    await updateDoc(reservaRef, data);
  } catch (error) {
    console.error("Error actualizando la reserva:", error);
    throw error;
  }
}

export async function eliminarReserva(id) {
  try {
    const reservaRef = doc(databaseFirestore, "reservasPruebasManejo", id);
    await deleteDoc(reservaRef);
  } catch (error) {
    console.error("Error eliminando la reserva:", error);
    throw error;
  }
}

export async function obtenerReservasPorVendedorId(idVendedor) {
  try {
    const autosVendedor = await obtenerAutosPorVendedorId(idVendedor);
    const idsAutos = autosVendedor.map(auto => auto.id);

    if (idsAutos.length === 0) {
      return [];
    }

    const coleccionReservas = collection(databaseFirestore, "reservasPruebasManejo");
    const q = query(
      coleccionReservas,
      where("idAuto", "in", idsAutos)
    );
    const querySnapshot = await getDocs(q);
    const reservasEnriquecidas = await Promise.all(querySnapshot.docs.map(enriquecerReserva));
    return reservasEnriquecidas;
  } catch (error) {
    console.error("Error obteniendo reservas por ID de vendedor:", error);
    throw error;
  }
}