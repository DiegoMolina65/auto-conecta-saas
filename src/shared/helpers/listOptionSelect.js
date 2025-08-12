import { version } from "react";

// Monedas (ISO 4217)
export const opcionesMoneda = [
  { value: "USD", label: "Dólar estadounidense" },
  { value: "BOB", label: "Boliviano" },
  { value: "EUR", label: "Euro" },
  { value: "MXN", label: "Peso mexicano" },
  { value: "ARS", label: "Peso argentino" },
  { value: "BRL", label: "Real brasileño" },
  { value: "CLP", label: "Peso chileno" },
  { value: "COP", label: "Peso colombiano" },
  { value: "PEN", label: "Sol peruano" },
  { value: "GBP", label: "Libra esterlina" },
  { value: "JPY", label: "Yen japonés" },
  { value: "CNY", label: "Yuan chino" },
  { value: "CAD", label: "Dólar canadiense" },
  { value: "AUD", label: "Dólar australiano" },
  { value: "CHF", label: "Franco suizo" }
];

// Tipos de combustible
export const opcionesCombustible = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diesel", label: "Diésel" },
  { value: "Gas", label: "Gas (GLP/GNV)" },
  { value: "Hibrido", label: "Híbrido" },
  { value: "Electrico", label: "Eléctrico" },
  { value: "Etanol", label: "Etanol (E85)" },
  { value: "Hidrogeno", label: "Hidrógeno" },
  { value: "Biodiesel", label: "Biodiésel" },
  { value: "GasolinaPremium", label: "Gasolina Premium" },
  { value: "GasolinaRegular", label: "Gasolina Regular" }
];

// Tipos de transmisión
export const opcionesTransmision = [
  { value: "Manual", label: "Manual" },
  { value: "Automatica", label: "Automática" },
  { value: "CVT", label: "CVT (Transmisión Variable Continua)" },
  { value: "DCT", label: "Doble embrague (DCT)" },
  { value: "Secuencial", label: "Secuencial" },
  { value: "Automatizada", label: "Automatizada" },
  { value: "Tiptronic", label: "Tiptronic" },
  { value: "SMG", label: "Secuencial manual automatizada (SMG)" }
];

// Condición del vehículo
export const opcionesCondicion = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Usado", label: "Usado" },
  { value: "Seminuevo", label: "Seminuevo" },
  { value: "Restaurado", label: "Restaurado" },
  { value: "ParaReparar", label: "Para reparar" }
];

// Marca de vehículo (autos, camiones, motos)
export const opcionesMarca = [
  // Autos
  { value: "Toyota", label: "Toyota" },
  { value: "Honda", label: "Honda" },
  { value: "Ford", label: "Ford" },
  { value: "Chevrolet", label: "Chevrolet" },
  { value: "Nissan", label: "Nissan" },
  { value: "Volkswagen", label: "Volkswagen" },
  { value: "Hyundai", label: "Hyundai" },
  { value: "Kia", label: "Kia" },
  { value: "Mazda", label: "Mazda" },
  { value: "Subaru", label: "Subaru" },
  { value: "Peugeot", label: "Peugeot" },
  { value: "Renault", label: "Renault" },
  { value: "Fiat", label: "Fiat" },
  { value: "Chery", label: "Chery" },
  { value: "Geely", label: "Geely" },
  { value: "Mitsubishi", label: "Mitsubishi" },
  { value: "Suzuki", label: "Suzuki" },
  { value: "Seat", label: "Seat" },
  { value: "Opel", label: "Opel" },
  { value: "Lexus", label: "Lexus" },
  { value: "Volvo", label: "Volvo" },
  { value: "Jaguar", label: "Jaguar" },
  { value: "Land Rover", label: "Land Rover" },
  { value: "Mini", label: "Mini" },
  { value: "Tesla", label: "Tesla" },
  { value: "BYD", label: "BYD" },

  // Camiones y vehículos comerciales
  { value: "Mercedes-Benz Trucks", label: "Mercedes-Benz Trucks" },
  { value: "Volvo Trucks", label: "Volvo Trucks" },
  { value: "Scania", label: "Scania" },
  { value: "MAN", label: "MAN" },
  { value: "Iveco", label: "Iveco" },
  { value: "DAF", label: "DAF" },
  { value: "Hino", label: "Hino" },
  { value: "Isuzu", label: "Isuzu" },
  { value: "Freightliner", label: "Freightliner" },
  { value: "Kenworth", label: "Kenworth" },
  { value: "Peterbilt", label: "Peterbilt" },
  { value: "Mack", label: "Mack" },
  { value: "International", label: "International" },

  // Motos
  { value: "Harley-Davidson", label: "Harley-Davidson" },
  { value: "Yamaha", label: "Yamaha" },
  { value: "Kawasaki", label: "Kawasaki" },
  { value: "Ducati", label: "Ducati" },
  { value: "BMW Motorrad", label: "BMW Motorrad" },
  { value: "Suzuki Motos", label: "Suzuki Motos" },
  { value: "Honda Motos", label: "Honda Motos" },
  { value: "Triumph", label: "Triumph" },
  { value: "KTM", label: "KTM" },
  { value: "Royal Enfield", label: "Royal Enfield" },
  { value: "Hero", label: "Hero" }
];

// Modelos de vehículos por marca
export const opcionesModelo = [
  // Toyota
  { value: "Corolla", label: "Corolla", marca: "Toyota" },
  { value: "Camry", label: "Camry", marca: "Toyota" },
  { value: "Yaris", label: "Yaris", marca: "Toyota" },
  { value: "Hilux", label: "Hilux", marca: "Toyota" },
  { value: "4Runner", label: "4Runner", marca: "Toyota" },
  { value: "RAV4", label: "RAV4", marca: "Toyota" },
  { value: "Land Cruiser", label: "Land Cruiser", marca: "Toyota" },
  { value: "Tacoma", label: "Tacoma", marca: "Toyota" },
  { value: "Tundra", label: "Tundra", marca: "Toyota" },
  { value: "Fortuner", label: "Fortuner", marca: "Toyota" },

  // Honda
  { value: "Civic", label: "Civic", marca: "Honda" },
  { value: "Accord", label: "Accord", marca: "Honda" },
  { value: "Fit", label: "Fit", marca: "Honda" },
  { value: "HR-V", label: "HR-V", marca: "Honda" },
  { value: "CR-V", label: "CR-V", marca: "Honda" },
  { value: "Pilot", label: "Pilot", marca: "Honda" },
  { value: "Ridgeline", label: "Ridgeline", marca: "Honda" },

  // Ford
  { value: "Fiesta", label: "Fiesta", marca: "Ford" },
  { value: "Focus", label: "Focus", marca: "Ford" },
  { value: "Mustang", label: "Mustang", marca: "Ford" },
  { value: "Explorer", label: "Explorer", marca: "Ford" },
  { value: "Escape", label: "Escape", marca: "Ford" },
  { value: "F-150", label: "F-150", marca: "Ford" },
  { value: "Ranger", label: "Ranger", marca: "Ford" },
  { value: "Bronco", label: "Bronco", marca: "Ford" },

  // Chevrolet
  { value: "Spark", label: "Spark", marca: "Chevrolet" },
  { value: "Aveo", label: "Aveo", marca: "Chevrolet" },
  { value: "Cruze", label: "Cruze", marca: "Chevrolet" },
  { value: "Tracker", label: "Tracker", marca: "Chevrolet" },
  { value: "Trailblazer", label: "Trailblazer", marca: "Chevrolet" },
  { value: "Equinox", label: "Equinox", marca: "Chevrolet" },
  { value: "Colorado", label: "Colorado", marca: "Chevrolet" },
  { value: "Silverado", label: "Silverado", marca: "Chevrolet" },

  // Nissan
  { value: "March", label: "March", marca: "Nissan" },
  { value: "Versa", label: "Versa", marca: "Nissan" },
  { value: "Sentra", label: "Sentra", marca: "Nissan" },
  { value: "Altima", label: "Altima", marca: "Nissan" },
  { value: "X-Trail", label: "X-Trail", marca: "Nissan" },
  { value: "Murano", label: "Murano", marca: "Nissan" },
  { value: "Frontier", label: "Frontier", marca: "Nissan" },
  { value: "Patrol", label: "Patrol", marca: "Nissan" },

  // Volkswagen
  { value: "Golf", label: "Golf", marca: "Volkswagen" },
  { value: "Polo", label: "Polo", marca: "Volkswagen" },
  { value: "Jetta", label: "Jetta", marca: "Volkswagen" },
  { value: "Passat", label: "Passat", marca: "Volkswagen" },
  { value: "Tiguan", label: "Tiguan", marca: "Volkswagen" },
  { value: "Touareg", label: "Touareg", marca: "Volkswagen" },
  { value: "Amarok", label: "Amarok", marca: "Volkswagen" },

  // Hyundai
  { value: "Accent", label: "Accent", marca: "Hyundai" },
  { value: "Elantra", label: "Elantra", marca: "Hyundai" },
  { value: "Sonata", label: "Sonata", marca: "Hyundai" },
  { value: "Creta", label: "Creta", marca: "Hyundai" },
  { value: "Tucson", label: "Tucson", marca: "Hyundai" },
  { value: "Santa Fe", label: "Santa Fe", marca: "Hyundai" },
  { value: "Palisade", label: "Palisade", marca: "Hyundai" },

  // Kia
  { value: "Rio", label: "Rio", marca: "Kia" },
  { value: "Cerato", label: "Cerato", marca: "Kia" },
  { value: "Sportage", label: "Sportage", marca: "Kia" },
  { value: "Sorento", label: "Sorento", marca: "Kia" },
  { value: "Seltos", label: "Seltos", marca: "Kia" },
  { value: "Telluride", label: "Telluride", marca: "Kia" },

  // Mazda
  { value: "Mazda2", label: "Mazda2", marca: "Mazda" },
  { value: "Mazda3", label: "Mazda3", marca: "Mazda" },
  { value: "Mazda6", label: "Mazda6", marca: "Mazda" },
  { value: "CX-3", label: "CX-3", marca: "Mazda" },
  { value: "CX-5", label: "CX-5", marca: "Mazda" },
  { value: "CX-9", label: "CX-9", marca: "Mazda" },
  { value: "BT-50", label: "BT-50", marca: "Mazda" },
];

// Versiones de vehículos
export const opcionesVersion = [
  // Versiones generales
  { value: "Base", label: "Base" },
  { value: "Standard", label: "Standard" },
  { value: "Deluxe", label: "Deluxe" },
  { value: "Premium", label: "Premium" },
  { value: "Luxury", label: "Luxury" },
  { value: "Platinum", label: "Platinum" },
  { value: "Limited", label: "Limited" },
  { value: "Sport", label: "Sport" },
  { value: "Sport Plus", label: "Sport Plus" },
  { value: "Touring", label: "Touring" },
  { value: "Executive", label: "Executive" },
  { value: "Signature", label: "Signature" },
  { value: "Exclusive", label: "Exclusive" },
  { value: "Special Edition", label: "Special Edition" },

  // Versiones SUV y 4x4
  { value: "Off-Road", label: "Off-Road" },
  { value: "TRD Off-Road", label: "TRD Off-Road" },
  { value: "TRD Pro", label: "TRD Pro" },
  { value: "Trail", label: "Trail" },
  { value: "Overland", label: "Overland" },
  { value: "Adventure", label: "Adventure" },
  { value: "Wildtrak", label: "Wildtrak" },
  { value: "Raptor", label: "Raptor" },

  // Versiones sedanes y hatchbacks
  { value: "GT", label: "GT" },
  { value: "GT Line", label: "GT Line" },
  { value: "RS", label: "RS" },
  { value: "Type R", label: "Type R" },
  { value: "ST", label: "ST" },
  { value: "S", label: "S" },
  { value: "SE", label: "SE" },
  { value: "SEL", label: "SEL" },

  // Versiones pickups y camionetas
  { value: "Work Truck", label: "Work Truck" },
  { value: "High Country", label: "High Country" },
  { value: "Laramie", label: "Laramie" },
  { value: "Rebel", label: "Rebel" },
  { value: "Big Horn", label: "Big Horn" },
  { value: "Longhorn", label: "Longhorn" },
  { value: "Z71", label: "Z71" },
  { value: "Denali", label: "Denali" },

  // Versiones de motos
  { value: "Street", label: "Street" },
  { value: "Cruiser", label: "Cruiser" },
  { value: "Sportbike", label: "Sportbike" },
  { value: "Touring Bike", label: "Touring Bike" },
  { value: "Scrambler", label: "Scrambler" },
  { value: "Cafe Racer", label: "Cafe Racer" },
  { value: "Enduro", label: "Enduro" },
  { value: "Adventure Bike", label: "Adventure Bike" }
];

export const opcionesCiudadBolivia = [
  { value: "La Paz", label: "La Paz" },
  { value: "Santa Cruz", label: "Santa Cruz" },
  { value: "Cochabamba", label: "Cochabamba" },
  { value: "Sucre", label: "Sucre" },
  { value: "Oruro", label: "Oruro" },
  { value: "Potosí", label: "Potosí" },
  { value: "Tarija", label: "Tarija" },
  { value: "Beni", label: "Beni" },
  { value: "Pando", label: "Pando" },
  { value: "Chuquisaca", label: "Chuquisaca" }
];

const opcionesRoles = [
  { value: "vendedor", label: "Vendedor" },
  { value: "admin", label: "Administrador" },
  { value: "cliente", label: "Cliente" }
];




// Conjunto de listas de opciones para selectores en formularios
export const listasSelect = {
  moneda: opcionesMoneda,
  combustible: opcionesCombustible,
  transmision: opcionesTransmision,
  condicion: opcionesCondicion,
  marca: opcionesMarca,
  modelo: opcionesModelo,
  version: opcionesVersion,
  ciudad: opcionesCiudadBolivia,
  role: opcionesRoles
};
