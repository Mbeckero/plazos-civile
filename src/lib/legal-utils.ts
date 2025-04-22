
import { addDays, isWeekend, isWithinInterval, format } from "date-fns";
import { es } from "date-fns/locale";

// Lista de feriados legales en Chile para 2024 (se debe actualizar cada año)
// Fuente: https://www.feriados.cl
export const chileanHolidays2024 = [
  new Date(2024, 0, 1),  // Año nuevo
  new Date(2024, 3, 19), // Viernes Santo 
  new Date(2024, 3, 20), // Sábado Santo
  new Date(2024, 4, 1),  // Día del Trabajo
  new Date(2024, 4, 21), // Día de las Glorias Navales 
  new Date(2024, 5, 29), // San Pedro y San Pablo
  new Date(2024, 6, 16), // Día de la Virgen del Carmen
  new Date(2024, 7, 15), // Asunción de la Virgen
  new Date(2024, 8, 18), // Independencia Nacional
  new Date(2024, 8, 19), // Día de las Glorias del Ejército
  new Date(2024, 9, 12), // Encuentro de Dos Mundos
  new Date(2024, 9, 31), // Día de las Iglesias Evangélicas y Protestantes
  new Date(2024, 10, 1), // Día de Todos los Santos
  new Date(2024, 11, 8), // Inmaculada Concepción
  new Date(2024, 11, 25), // Navidad
];

// Verificar si una fecha es un día hábil judicial (lunes a sábado, excluyendo feriados)
export const isJudicialBusinessDay = (date: Date): boolean => {
  // En Chile, el día domingo no es día hábil judicial
  if (date.getDay() === 0) return false;
  
  // Verificar si es un feriado legal
  for (const holiday of chileanHolidays2024) {
    if (
      date.getDate() === holiday.getDate() &&
      date.getMonth() === holiday.getMonth() &&
      date.getFullYear() === holiday.getFullYear()
    ) {
      return false;
    }
  }
  
  return true;
};

// Función para calcular fechas agregando días hábiles judiciales
export const addJudicialBusinessDays = (date: Date, days: number): Date => {
  let currentDate = new Date(date);
  let daysToAdd = days;
  
  while (daysToAdd > 0) {
    currentDate = addDays(currentDate, 1);
    if (isJudicialBusinessDay(currentDate)) {
      daysToAdd--;
    }
  }
  
  return currentDate;
};

// Tipos de plazos legales según el Código de Procedimiento Civil chileno
export const legalDeadlineTypes = [
  {
    id: "contestacion",
    name: "Contestación de Demanda",
    days: 18,
    type: "habiles",
    description: "Plazo para presentar la contestación de la demanda",
    legalReference: "Artículo 258 del Código de Procedimiento Civil"
  },
  {
    id: "apelacion",
    name: "Apelación",
    days: 5,
    type: "habiles",
    description: "Plazo para presentar recurso de apelación",
    legalReference: "Artículo 189 del Código de Procedimiento Civil"
  },
  {
    id: "oposicion",
    name: "Oposición a Ejecución",
    days: 4,
    type: "habiles",
    description: "Plazo para oponerse al procedimiento ejecutivo",
    legalReference: "Artículo 471 del Código de Procedimiento Civil"
  },
  {
    id: "reposicion",
    name: "Reposición",
    days: 3,
    type: "habiles",
    description: "Plazo para presentar recurso de reposición",
    legalReference: "Artículo 181 del Código de Procedimiento Civil"
  },
  {
    id: "conciliacion",
    name: "Audiencia de Conciliación",
    days: 5,
    type: "habiles",
    description: "Plazo para audiencia de conciliación",
    legalReference: "Artículo 263 del Código de Procedimiento Civil"
  },
  {
    id: "casacion",
    name: "Recurso de Casación",
    days: 15,
    type: "habiles",
    description: "Plazo para presentar recurso de casación",
    legalReference: "Artículo 770 del Código de Procedimiento Civil"
  },
  {
    id: "abandono",
    name: "Abandono del Procedimiento",
    days: 6,
    type: "meses",
    description: "Plazo para declarar el abandono del procedimiento",
    legalReference: "Artículo 152 del Código de Procedimiento Civil"
  }
];

// Función para calcular la fecha límite según el tipo de plazo
export const calculateLegalDeadline = (typeId: string, notificationDate: Date): Date => {
  const type = legalDeadlineTypes.find(t => t.id === typeId);
  if (!type) {
    throw new Error("Tipo de gestión no encontrado");
  }
  
  if (type.type === "habiles") {
    return addJudicialBusinessDays(notificationDate, type.days);
  } else if (type.type === "meses") {
    // Para plazos en meses, simplemente añadimos los meses sin considerar días hábiles
    const result = new Date(notificationDate);
    result.setMonth(result.getMonth() + type.days);
    return result;
  } else {
    // Para días corridos
    return addDays(notificationDate, type.days);
  }
};
