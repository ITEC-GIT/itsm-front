import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

const pageTransition = {
  initial: {
    x: "100%",    // Start from right
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  animate: {
    x: "0%",
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    x: "-100%",   // Exit to left
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.25,
      ease: "easeIn"
    }
  }
};
// const pageTransition = {
//   initial: { x: "80%", opacity: 0 },
//   animate: { x: "0%", opacity: 1 },
//   exit: { x: "-20%", opacity: 0 }, // Reduced exit distance for smoother exit
//   transition: {
//     type: "spring",
//     mass: 0.4,       // Lighter weight for fluidity
//     stiffness: 50,   // Softer bounce
//     damping: 30,     // Reduced oscillation
//     duration: 1.2,   // Slightly longer duration for smoothness
//     delay: 0.5       // Shorter delay for immediacy
//   },
// };

type AnimatedRouteWrapperProps = {
  children: ReactNode;
};

const AnimatedRouteWrapper: FC<AnimatedRouteWrapperProps> = ({ children }) => {
  return (
      <motion.div
          className="animated-wrapper"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
      >
        {children}
      </motion.div>
  );
};

export default AnimatedRouteWrapper;
