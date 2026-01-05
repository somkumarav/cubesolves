export const formatTime = (ms: number) => {
  const seconds = Number(((ms % 100000) % 60000) / 1000)
    .toFixed(2)
    .padStart(5, "0");
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000) % 60;
  // 123410

  if (hours) {
    return `${hours}.${minutes}.${seconds}`;
  } else if (minutes) {
    return `${minutes}.${seconds}`;
  } else {
    return `${seconds}`;
  }
};
