export const calculateBMI = (weight: number, height: number) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
};
