import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Preloader = ({ setIsLoading }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 1.6s duration + pause
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <motion.div
      className="fixed inset-0 z-[100000] bg-brand-red flex items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="relative">
        {/* Dark transparent text behind */}
        <h1 className="font-display font-black text-6xl md:text-9xl text-black/20 absolute inset-0 flex items-center justify-center select-none">
          Praveen.
        </h1>
        
        {/* White text foreground clipping upwards */}
        <motion.h1
          className="font-display font-black text-6xl md:text-9xl text-white relative z-10 flex items-center justify-center select-none"
          initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' }}
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        >
          Praveen.
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default Preloader;
