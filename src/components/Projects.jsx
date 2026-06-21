import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

/* ─── Single Project Card ─────────────────────────────────────────────────── */
const ProjectCard = ({ project, isMobile }) => {
  if (isMobile) {
    // MOBILE: fully revealed card, no hover required
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full relative rounded-3xl overflow-hidden"
        style={{ minHeight: '420px' }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source
            src={project.videoPlaceholder || 'https://cdn.pixabay.com/video/2021/08/11/84687-587212049_large.mp4'}
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Content — always visible */}
        <div className="relative z-10 p-6 flex flex-col justify-end h-full" style={{ minHeight: '420px' }}>
          <div className="mt-auto">
            <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tech?.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-black">
                <FiExternalLink className="text-lg" />
              </span>
              <span className="text-white text-xs font-bold uppercase tracking-widest">View Project</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // DESKTOP: hover-reveal card with GSAP horizontal scroll
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-[500px] lg:w-[600px] h-[60vh] shrink-0 relative group perspective-[1000px]"
    >
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
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
        >
          <source
            src={project.videoPlaceholder || 'https://cdn.pixabay.com/video/2021/08/11/84687-587212049_large.mp4'}
            type="video/mp4"
          />
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-12 flex flex-col justify-end">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-5xl font-display font-bold text-white mb-4 leading-tight">
              {project.title}
            </h3>
            <p className="text-gray-300 text-base mb-6 max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-brand-red hover:text-white transition-colors duration-300">
                <FiExternalLink className="text-xl" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </a>
  );
};

/* ─── Projects Section ────────────────────────────────────────────────────── */
const Projects = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [projects, setProjects] = useState(defaultProjects);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch MongoDB projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects([...defaultProjects, ...data]);
            setTimeout(() => ScrollTrigger.refresh(), 500);
          }
        }
      } catch (err) {
        console.error('Failed to load projects, using defaults:', err);
      }
    };
    fetchProjects();
  }, []);

  // GSAP horizontal scroll — desktop only
  useEffect(() => {
    if (!projects.length) return;

    const timer = setTimeout(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      ScrollTrigger.getAll().forEach(t => t.kill());

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 768px)', () => {
          const scrollDistance = track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -scrollDistance,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${scrollDistance}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          ScrollTrigger.refresh();
        });
      });

      return () => ctx.revert();
    }, 150);

    return () => clearTimeout(timer);
  }, [projects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-brand-black relative"
      style={{ minHeight: isMobile ? 'auto' : '100vh', overflow: isMobile ? 'visible' : 'hidden' }}
    >
      {/* Section heading */}
      <div className="absolute top-10 left-6 md:left-12 z-10 mix-blend-difference">
        <h2 className="text-4xl md:text-6xl font-display font-black text-white">
          SELECTED <span className="text-outline">WORK</span>
        </h2>
      </div>

      {/* ── MOBILE layout ── */}
      {isMobile && (
        <div className="pt-28 pb-16 px-4 flex flex-col gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} isMobile={true} />
          ))}
        </div>
      )}

      {/* ── DESKTOP layout ── */}
      {!isMobile && (
        <div
          ref={trackRef}
          style={{ width: 'max-content' }}
          className="flex flex-row items-center h-screen pt-20 px-[5vw] gap-24"
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} isMobile={false} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
