import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiExternalLink } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const defaultProjects = [
  {
    title: 'Robo Face Emotion Detection',
    description: 'AI-powered robotic face capable of detecting and displaying human emotions using DeepFace and OpenCV.',
    tech: ['Python', 'DeepFace', 'OpenCV', 'React'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2021/08/11/84687-587212049_large.mp4',
    link: '#',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    title: 'AI Voice Chatbot',
    description: 'Voice-enabled AI chatbot using speech recognition and text-to-speech technology.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Web Speech API'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2023/04/13/158766-817631558_large.mp4',
    link: 'https://friendlychatbot.vercel.app',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    title: 'Diet Telegram Bot',
    description: 'Telegram bot providing diet guidance and automated responses.',
    tech: ['Python', 'Telegram API'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2020/05/25/40131-426003290_large.mp4',
    link: '#',
    color: 'from-orange-600 to-red-600'
  },
  {
    title: 'Animated Website',
    description: 'Modern responsive animated website with premium UI interactions.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2022/11/22/139967-774026369_large.mp4',
    link: 'https://dfc-flax.vercel.app/',
    color: 'from-purple-600 to-pink-600'
  }
];

const Projects = () => {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects([...defaultProjects, ...data]);
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 500);
          }
        }
      } catch (err) {
        console.error('Failed to load projects, using defaults:', err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!projects.length) return;

    const timer = setTimeout(() => {
      const pinWrap = scrollContainerRef.current;
      const section = sectionRef.current;

      if (!pinWrap || !section) return;

      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      const ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const totalScrollWidth = pinWrap.scrollWidth;
          const viewportWidth = window.innerWidth;
          const scrollDistance = totalScrollWidth - viewportWidth;

          const tween = gsap.to(pinWrap, {
            x: () => -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${scrollDistance}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });

          ScrollTrigger.refresh();
        });
      });

      return () => {
        ctx.revert();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [projects]);

  return (
    <section id="projects" ref={sectionRef} className="min-h-screen md:h-screen bg-brand-black md:overflow-hidden relative">
      <div className="absolute top-10 left-6 md:left-12 z-10 mix-blend-difference">
        <h2 className="text-4xl md:text-6xl font-display font-black text-white">SELECTED <span className="text-outline">WORK</span></h2>
      </div>

      <div 
        ref={scrollContainerRef} 
        style={{ width: "max-content" }}
        className="flex flex-col md:flex-row items-center pt-32 md:pt-20 pb-20 md:pb-0 px-6 md:px-[5vw] gap-12 md:gap-24 md:h-full"
      >
        {projects.map((project, index) => (
          <div key={index} className="w-full md:w-[500px] lg:w-[600px] h-[50vh] md:h-[60vh] shrink-0 relative group perspective-[1000px]">
            <motion.div 
              className="w-full h-full rounded-3xl overflow-hidden relative preserve-3d"
              whileHover={{ scale: 1.02, rotateY: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Background Video */}
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              >
                <source 
                  src={
                    project.videoPlaceholder || 
                    "https://cdn.pixabay.com/video/2021/08/11/84687-587212049_large.mp4"
                  } 
                  type="video/mp4" 
                />
              </video>
              
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end transform translate-z-[50px]">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">{project.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base mb-6 max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {project.tech?.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-brand-red hover:text-white transition-colors duration-300">
                      <FiExternalLink className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
