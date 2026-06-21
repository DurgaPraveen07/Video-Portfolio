import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiPython, 
  SiOpencv, SiJavascript, SiGithub 
} from 'react-icons/si';

const About = () => {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    // GSAP ScrollTrigger for badge parallax
    gsap.fromTo(badgeRef.current,
      { y: 100, rotationZ: -5 },
      {
        y: -50,
        rotationZ: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative w-full min-h-screen bg-brand-red text-white py-32 overflow-hidden">
      
      {/* Torn Paper Divider (Top) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[calc(100%+1.3px)] h-[50px] md:h-[100px]">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#000000"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#000000"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#000000"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 md:gap-24 relative z-10 pt-20">
        
        {/* Left Column - Hanging Badge */}
        <div className="w-full lg:w-2/5 flex justify-center perspective-[1000px]">
          <div ref={badgeRef} className="relative">
            {/* Lanyard */}
            <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-4 h-[250px] bg-black shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] z-0 rounded-b-xl flex flex-col items-center">
               <div className="w-1 h-full bg-white/20"></div>
               <div className="absolute bottom-0 w-8 h-8 rounded-full border-4 border-black bg-gray-300 shadow-xl flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-black"></div>
               </div>
            </div>

            {/* Badge Card */}
            <motion.div 
              className="relative z-10 w-[300px] h-[450px] bg-white text-black rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border-4 border-black"
              whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Badge Header */}
              <div className="bg-black text-white py-4 text-center">
                <h3 className="font-display font-black text-2xl tracking-widest uppercase">ID CARD</h3>
              </div>

              {/* Photo Area */}
              <div className="flex-1 flex flex-col items-center pt-8 px-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-black mb-6 overflow-hidden shadow-inner">
                  <img src="/profile.png" alt="Durga Praveen" className="w-full h-full object-cover" />
                </div>
                
                <h2 className="font-display font-bold text-3xl mb-1 text-center">Durga Praveen</h2>
                <p className="text-brand-red font-bold uppercase tracking-wider text-sm mb-6 text-center">AI Engineer</p>

                <div className="w-full space-y-3 text-sm font-medium border-t-2 border-dashed border-gray-300 pt-4">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-1">
                    <span className="text-gray-500 text-xs">Degree</span>
                    <span className="font-bold text-right leading-tight">B.Tech CS</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-200 pb-1">
                    <span className="text-gray-500 text-xs">CGPA</span>
                    <span className="font-bold">8.81</span>
                  </div>
                  <div className="flex justify-between items-end pb-1">
                    <span className="text-gray-500 text-xs">Institute</span>
                    <span className="font-bold text-right text-[10px] leading-tight max-w-[120px]">Dhanekula Institute of Engineering & Technology</span>
                  </div>
                </div>
              </div>
              
              {/* Barcode bottom */}
              <div className="h-12 w-full bg-gray-100 flex items-center justify-center border-t-2 border-black">
                <div className="w-3/4 h-8 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(to right, black 0, black 2px, transparent 2px, transparent 4px, black 4px, black 5px, transparent 5px, transparent 8px, black 8px, black 12px, transparent 12px, transparent 14px)'}}></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className="w-full lg:w-3/5">
          <motion.h2 
            className="text-7xl md:text-9xl font-display font-black text-black mb-8 leading-none"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            HELLO!
          </motion.h2>

          <motion.p 
            className="text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl text-white/90"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I am a Computer Science student passionate about <span className="font-bold text-black bg-white px-2 py-0.5 rounded-md">Artificial Intelligence</span>, Computer Vision, Full Stack Development, and Generative AI. I enjoy building intelligent systems that solve real-world problems and creating visually stunning digital experiences.
          </motion.p>

          {/* Tech Stack Logos */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {[
              { Icon: SiReact, name: 'React' },
              { Icon: SiNodedotjs, name: 'Node.js' },
              { Icon: SiMongodb, name: 'MongoDB' },
              { Icon: SiPython, name: 'Python' },
              { Icon: SiOpencv, name: 'OpenCV' },
              { Icon: null, name: 'DeepFace' }, // DeepFace doesn't have a standard icon
              { Icon: SiJavascript, name: 'JavaScript' },
              { Icon: SiGithub, name: 'GitHub' },
            ].map((tech, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-center gap-2 group"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1), type: 'spring' }}
                whileHover={{ y: -10 }}
              >
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all">
                  {tech.Icon ? (
                    <tech.Icon className="text-3xl text-white group-hover:text-brand-red transition-colors" />
                  ) : (
                    <span className="font-bold text-white group-hover:text-brand-red">DF</span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Decorative Stars */}
      <motion.div 
        className="absolute top-20 right-20 text-black opacity-20 text-6xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        ✦
      </motion.div>
      <motion.div 
        className="absolute bottom-20 left-10 text-black opacity-20 text-8xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        ✦
      </motion.div>
    </section>
  );
};

export default About;
