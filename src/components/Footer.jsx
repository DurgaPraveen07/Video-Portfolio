import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Footer = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);

  return (
    <footer ref={containerRef} className="relative w-full min-h-[50vh] bg-[#020202] text-white pt-20 pb-10 overflow-hidden flex flex-col justify-between">
      
      {/* Scroll Parallax Container */}
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-between">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="flex flex-col space-y-4">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Services</h4>
            <span className="text-gray-300 font-medium hover:text-brand-red transition-colors cursor-pointer">AI Development</span>
            <span className="text-gray-300 font-medium hover:text-brand-red transition-colors cursor-pointer">Computer Vision</span>
            <span className="text-gray-300 font-medium hover:text-brand-red transition-colors cursor-pointer">Web Development</span>
            <span className="text-gray-300 font-medium hover:text-brand-red transition-colors cursor-pointer">UI/UX Design</span>
            <span className="text-gray-300 font-medium hover:text-brand-red transition-colors cursor-pointer">Generative AI Solutions</span>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Experience</h4>
            <span className="text-gray-300 font-medium">Student Developer</span>
            <span className="text-gray-300 font-medium">AI Builder</span>
            <span className="text-gray-300 font-medium">Project Creator</span>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Availability</h4>
            <span className="text-gray-300 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Open For Freelance
            </span>
            <span className="text-gray-300 font-medium">Available Worldwide</span>
          </div>
        </div>

        {/* Center Branding */}
        <div className="w-full flex justify-center py-10 overflow-hidden select-none">
          <motion.h1 
            className="text-[15vw] leading-none font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20"
            initial={{ y: 200 }}
            whileInView={{ y: 0 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            PRAVEEN
          </motion.h1>
        </div>

        {/* Bottom Grid */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-400">
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Email</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>

          <div className="text-center md:text-right text-xs text-gray-500 flex flex-col space-y-1">
            <span>&copy; 2026 Durga Praveen</span>
            <span>Built with React, Tailwind CSS, GSAP, Framer Motion and AI.</span>
          </div>
          
        </div>

      </motion.div>
    </footer>
  );
};

export default Footer;
