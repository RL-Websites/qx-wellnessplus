export const getBaseWebRadios = (primaryGoal: string | undefined, option: string) => ({
  root: "relative w-full",
  radio: "hidden",
  inner: "hidden",
  labelWrapper: "w-full",
  label: `
    block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
    ${primaryGoal === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
  `,
});
