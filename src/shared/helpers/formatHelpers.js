/**
 * Formatea un número como moneda según la configuración de Bolivia.
 * @param {number} precio - El valor numérico del precio.
 * @param {string} moneda - Código ISO de la moneda (por ejemplo, "BOB", "USD").
 * @returns {string} Precio formateado como moneda.
 */

export function formatearPrecio(precio, moneda) {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency: moneda }).format(precio);
}

/**
 * Formatea un número como kilometraje con separadores de miles y " km" al final.
 * @param {number} kilometraje - Valor numérico del kilometraje.
 * @returns {string} Kilometraje formateado (ejemplo: "12.345 km").
 */

export function formatearKilometraje(kilometraje) {
  return `${kilometraje.toLocaleString('es-BO')} km`;
}
