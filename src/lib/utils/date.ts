function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateParts(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function createLocalDate(value: string) {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? parseDateParts(value)
    : null;

  if (parsed) {
    return new Date(parsed.year, parsed.month - 1, parsed.day);
  }

  return new Date(value);
}

export function toDateOnly(value: Date | string) {
  if (typeof value === "string") {
    const parsed = parseDateParts(value);

    if (parsed) {
      return `${parsed.year}-${pad(parsed.month)}-${pad(parsed.day)}`;
    }

    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

export function getMonthKeyFromDateValue(value: string) {
  const parsed = parseDateParts(value);

  if (parsed) {
    return `${parsed.year}-${pad(parsed.month)}`;
  }

  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function getCurrentMonthKey(referenceDate = new Date()) {
  return `${referenceDate.getFullYear()}-${pad(referenceDate.getMonth() + 1)}`;
}

export function getMonthDate(monthKey: string, day: number) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return "";
  }

  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const normalizedDay = Math.min(day, lastDayOfMonth);

  return `${year}-${pad(month)}-${pad(normalizedDay)}`;
}
