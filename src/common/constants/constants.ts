export const dataPageSizes: number[] = [10, 20, 30, 40, 50];
export const animationDelay = 750; // in ms

export const getAnimationClass = (
  element: "title" | "content" | "btns",
  isExiting: boolean,
  isBackExiting: boolean,
  direction?: "forward" | "backward" // Optional, if you want to handle direction-based animations later
): string => {
  if (isExiting) {
    return `animate-${element}-exit`;
  }

  if (isBackExiting) {
    return `animate-${element}-exit-back`;
  }

  if (direction === "forward") {
    return `animate-${element}-enter-right`;
  }

  return `animate-${element}-enter-left`;
};

export const getHomePageAnimationClass = (element: "thank-you-text" | "wellness-text" | "btns", isExiting: boolean): string => {
  if (isExiting) {
    return `${element}-exit`;
  }
  return element; // ✅ Returns base class with enter animation
};
// export const canonicalize = (raw: string) => {
//   const s = (raw || "").toLowerCase();
//   if (s.includes("hair growth")) return "Hair Growth";
//   if (s.includes("sexual health")) return "Sexual Health";
//   if (s.includes("peptides")) return "Peptides";
//   if (s.includes("weight loss")) return "Weight Loss";
//   if (s.includes("testosterone")) return "Testosterone";
//   // fallback to original but trimmed/capitalized if you want
//   return raw;
// };
