import { motion } from 'framer-motion';

const AnimatedSkeleton = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  variant = 'text',
  count = 1,
  rounded = true
}) => {
  const variants = {
    text: 'h-4',
    title: 'h-6',
    subtitle: 'h-4',
    avatar: 'w-10 h-10 rounded-full',
    image: 'h-48',
    button: 'h-10',
    card: 'h-32'
  };

  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      className={`bg-gray-200 ${variants[variant]} ${
        rounded ? 'rounded' : ''
      } ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.1
      }}
    />
  ));

  if (count === 1) {
    return skeletonItems[0];
  }

  return (
    <div className="space-y-2">
      {skeletonItems}
    </div>
  );
};

export default AnimatedSkeleton;


