const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function formatDateWithWeekday(date: Date) {
  const dayIndex = Number(date.getDay());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  const dateString = `${WEEKDAYS[dayIndex]}, ${year}/${month}/${day}`;
  return dateString;
}

export { formatDateWithWeekday };