import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedStepProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
}

const AnimatedStep = ({ children, direction = "right" }: AnimatedStepProps) => {
  const variants = {
    enter: {
      opacity: 0,
      x: direction === "right" ? 30 : direction === "left" ? -30 : 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    },
    center: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: direction === "right" ? -30 : direction === "left" ? 30 : 0,
      y: direction === "up" ? -20 : direction === "down" ? 20 : 0,
    },
  };

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedStep;
