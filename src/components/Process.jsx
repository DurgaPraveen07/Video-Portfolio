import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  { title: 'Research', desc: 'Understanding requirements and planning the architecture.' },
  { title: 'Design', desc: 'Crafting premium UI/UX and visual experiences.' },
  { title: 'Develop', desc: 'Building scalable and robust full-stack solutions.' },
  { title: 'AI Integrate', desc: 'Implementing intelligent models and computer vision.' },
  { title: 'Deploy', desc: 'Publishing to production with CI/CD pipelines.' },
  { title: 'Scale', desc: 'Optimizing performance for global audiences.' },
];

const Process = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      }
    });

    dotsRef.current.forEach((dot, i) => {
      gsap.to(dot, {
        backgroundColor: '#FF2A2A',
        boxShadow: '0 0 20px rgba(255,42,42,0.8)',
        scale: 1.5,
        scrollTrigger: {
          trigger: dot,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
          toggleClass: 'active',
        }
      });
    });

  }, []);

  return (
    <section id="process" ref={containerRef} className="w-full bg-white text-black py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-brand-red font-bold uppercase tracking-widest text-xs mb-6 border border-gray-200">
            How I Build Products
          </span>
          <motion.h2 
            className="text-5xl md:text-7xl font-display font-black"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            From Idea To <span className="text-brand-red">Intelligent Product</span>
          </motion.h2>
        </div>

        <div className="relative w-full max-w-3xl mx-auto py-20">
          {/* S-Curve SVG Timeline */}
          <div className="absolute top-0 bottom-0 left-[50px] md:left-1/2 md:-translate-x-1/2 w-4 md:w-full h-full pointer-events-none z-0">
             <svg className="hidden md:block w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
                <path 
                  ref={pathRef}
                  d="M50,0 C50,100 10,150 10,250 C10,350 90,400 90,500 C90,600 10,650 10,750 C10,850 50,900 50,1000" 
                  fill="none" 
                  stroke="#FF2A2A" 
                  strokeWidth="2"
                  className="transition-all"
                />
                <path 
                  d="M50,0 C50,100 10,150 10,250 C10,350 90,400 90,500 C90,600 10,650 10,750 C10,850 50,900 50,1000" 
                  fill="none" 
                  stroke="#f3f4f6" 
                  strokeWidth="2"
                  className="opacity-50"
                  style={{ zIndex: -1 }}
                />
             </svg>
             {/* Mobile straight line */}
             <div className="block md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-200">
               <div className="w-full bg-brand-red" style={{ height: '0%' }}></div> {/* Need to animate this height for mobile if needed, keeping simple for now */}
             </div>
          </div>

          <div className="relative z-10 flex flex-col space-y-24 md:space-y-0">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center w-full ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} relative md:h-[160px]`}
              >
                {/* Mobile Dot */}
                <div 
                  className="absolute left-[50px] md:hidden w-6 h-6 rounded-full bg-gray-300 border-4 border-white -translate-x-1/2 z-20"
                ></div>

                <motion.div 
                  className={`w-full md:w-[40%] pl-24 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-3xl font-display font-bold mb-2 text-black">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>

                {/* Desktop Dot */}
                <div 
                  ref={el => dotsRef.current[index] = el}
                  className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300 border-4 border-white z-20 transition-all duration-300"
                  style={{ 
                    transform: index === 0 ? 'translate(-50%, -50%)' :
                               index === 1 ? 'translate(calc(-50% - 40px), -50%)' :
                               index === 2 ? 'translate(calc(-50% + 40px), -50%)' :
                               index === 3 ? 'translate(calc(-50% - 40px), -50%)' :
                               index === 4 ? 'translate(calc(-50% + 40px), -50%)' :
                               'translate(-50%, -50%)'
                  }} // Rough alignment to match S-curve path
                ></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Process;
