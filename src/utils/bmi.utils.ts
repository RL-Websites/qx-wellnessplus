export function calculateBMI(weightInPounds: number, heightInFeet: number, heightInInches: number): number {
  const totalHeightInInches = heightInFeet * 12 + heightInInches;
  if (totalHeightInInches === 0) return 0;
  const bmi = (weightInPounds / totalHeightInInches ** 2) * 703;
  return Math.round(bmi * 10) / 10;
}
