import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedProgressBar = ({ 
  progress = 0, 
  height = 4, 
  color = 'blue',
  showPercentage = false,
  animated = true,
  className = ''
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500'
  };

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className={`w-full ${className}`}>
      <div 
        className={`w-full bg-gray-200 rounded-full overflow-hidden`}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className={`h-full ${colors[color]} transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0,
            ease: "easeOut"
          }}
        />
      </div>
      {showPercentage && (
        <motion.div
          className="text-right text-sm text-gray-600 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(displayProgress)}%
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedProgressBar;


