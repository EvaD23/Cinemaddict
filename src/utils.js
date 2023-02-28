
// функция добавляет форматирование для продолжительности фильма
function createDurationTemplate(minutes) {
  if (minutes < 60) {
    return `${minutes}M`;
  } else {
    const hours = Math.floor(minutes / 60);

    return `${hours}H ${minutes % 60}M`;
  }
}

export { createDurationTemplate};

