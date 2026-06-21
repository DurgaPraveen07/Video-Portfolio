import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiArrowRight } from 'react-icons/fi';

const roles = [
  'AI Engineer',
  'Full Stack Developer',
  'Computer Vision Developer',
  'Generative AI Builder'
];

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        videoRef.current.muted = false;
        setIsPlaying(true);
        setIsAudioEnabled(true);
      } else {
        if (!isAudioEnabled) {
          // If video is playing but muted (initial autoplay), unmute it
          videoRef.current.muted = false;
          setIsAudioEnabled(true);
        } else {
          // If video is playing and unmuted, pause it
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full bg-black z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full scale-105"
        >
          {/* Using the provided portfolio video */}
          <source src="/video portfolio.mp4" type="video/mp4" />
        </video>
        {/* Subtle cinematic overlay (15% opacity) as requested */}
        <div className="absolute inset-0 bg-black/15"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-start mt-20 md:mt-0">
        
        {/* Left Content */}
        <div className="w-full lg:w-2/3 flex flex-col items-start text-left drop-shadow-lg lg:-ml-4">
          <motion.p 
            className="text-brand-red text-lg md:text-xl font-bold tracking-wide mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            Hello, I'm
          </motion.p>
          
          <motion.h1 
            className="font-black text-[clamp(2rem,4vw,4.5rem)] max-w-[80%] leading-[0.9] tracking-tight mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.8 }}
          >
            Durga Praveen
          </motion.h1>

          <div className="h-16 md:h-24 overflow-hidden mb-6 w-full">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentRole}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-4xl md:text-6xl font-display font-bold text-outline uppercase whitespace-nowrap"
              >
                {roles[currentRole]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <motion.p 
            className="text-white text-base md:text-lg max-w-xl mb-10 leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.1, duration: 1 }}
          >
            I build AI-powered applications, computer vision systems, intelligent chatbots, and modern web experiences using React, Node.js, Python, DeepFace, OpenCV, and Generative AI technologies.
          </motion.p>

          <motion.div 
            className="flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.8 }}
          >
            <a href="#projects" className="group flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-brand-red transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              View Projects
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="px-8 py-4 bg-black/40 backdrop-blur-sm border border-white/30 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/20 transition-all duration-300">
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* Video Control Button */}
        <motion.div 
          className="absolute bottom-4 right-4 md:bottom-[40px] md:right-[30px] z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 1, ease: 'easeOut' }}
        >
          <div className="relative group cursor-pointer" onClick={togglePlay}>
            <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 animate-pulse ${isPlaying && isAudioEnabled ? 'bg-white opacity-20 group-hover:opacity-40' : 'bg-brand-red opacity-30 group-hover:opacity-60'}`}></div>
            <div className={`relative w-[50px] h-[50px] md:w-32 md:h-32 rounded-full glassmorphism flex flex-col items-center justify-center border transition-colors duration-300 ${isPlaying && isAudioEnabled ? 'border-white/50 group-hover:border-white' : 'border-white/20 group-hover:border-brand-red/50'}`}>
              {isPlaying && isAudioEnabled ? (
                <FiPause className="text-xl md:text-4xl text-white mb-0 md:mb-1 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <FiPlay className="text-xl md:text-4xl text-white ml-1 md:ml-2 mb-0 md:mb-1 group-hover:text-brand-red transition-colors duration-300" />
              )}
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/70 mt-2">
                {isPlaying && isAudioEnabled ? 'Pause' : 'Play Reel'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 rotate-90 origin-left ml-2 text-white">Scroll</span>
        <div className="w-[2px] h-16 bg-white/30 overflow-hidden rounded-full">
          <motion.div 
            className="w-full h-full bg-brand-red rounded-full"
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
