import { motion } from 'framer-motion';

const ShimmerEffect = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  rounded = true 
}) => {
  return (
    <div
      className={`relative overflow-hidden ${rounded ? 'rounded' : ''} bg-gray-200 ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default ShimmerEffect;


