const CLOUD_NAME = "doq0haupr";
const UPLOAD_PRESET = "imagenesautos";

export async function subirImagenCloudinary(archivo) {
  const formData = new FormData();
  formData.append("file", archivo);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const respuesta = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!respuesta.ok) {
      throw new Error("Error subiendo la imagen a Cloudinary");
    }

    const data = await respuesta.json();
    return data.secure_url; 
  } catch (error) {
    console.error("Error en Cloudinary upload:", error);
    throw error;
  }
}

/**
 * Sube varias imágenes y retorna un array con URLs.
 * @param {FileList | File[]} archivos - Archivos a subir.
 * @returns {Promise<string[]>} URLs de imágenes subidas.
 */
export async function subirVariasImagenes(archivos) {
  const urls = [];
  for (const archivo of archivos) {
    const url = await subirImagenCloudinary(archivo);
    urls.push(url);
  }
  return urls;
}
