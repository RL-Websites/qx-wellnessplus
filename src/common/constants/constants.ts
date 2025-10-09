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
