import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimatedCard = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  direction = 'up',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const directionVariants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: -20, opacity: 0 },
    right: { x: 20, opacity: 0 },
    scale: { scale: 0.9, opacity: 0 }
  };

  const hoverVariants = {
    scale: hover ? 1.02 : 1,
    y: hover ? -2 : 0,
    transition: { duration: 0.2 }
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ y: 0, x: 0, scale: 1, opacity: 1 }}
      whileHover={hover ? hoverVariants : {}}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      
      {/* Hover overlay effect */}
      {hover && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default AnimatedCard;


