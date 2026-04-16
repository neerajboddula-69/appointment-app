export function formatDateLabel(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

export function getMonthDays(anchor) {
  const date = new Date(`${anchor}T00:00:00`);
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];

  for (let day = 1; day <= last.getDate(); day += 1) {
    const current = new Date(year, month, day);
    days.push(current.toISOString().split("T")[0]);
  }

  return {
    monthLabel: first.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    days
  };
}
