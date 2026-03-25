export const isoToBrDate = (isoDate) => {
  if (!isoDate || !isoDate.includes("-")) return isoDate || "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

export const brToApiDate = (brDate) => {
  if (!brDate || !brDate.includes("/")) return "";
  const [day, month, year] = brDate.split("/");
  return `${year}-${month}-${day}`;
};

export const getTodayBrDate = () => {
  const todayIso = new Date().toISOString().slice(0, 10);
  return isoToBrDate(todayIso);
};

export const normalizeBrDateInput = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
};

export const isValidBrDate = (value) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
