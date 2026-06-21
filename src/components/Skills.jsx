import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS'],
    color: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'MongoDB'],
    color: 'from-green-500 to-emerald-400'
  },
  {
    title: 'AI & ML',
    skills: ['Python', 'OpenCV', 'DeepFace', 'Machine Learning', 'Generative AI'],
    color: 'from-brand-red to-orange-500'
  },
  {
    title: 'Tools',
    skills: ['Git', 'GitHub', 'Vercel'],
    color: 'from-purple-500 to-pink-500'
  }
];

const SkillCard = ({ category, index }) => {
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      className="relative group perspective-[1000px] w-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <motion.div 
        className="w-full h-full p-[1px] rounded-3xl bg-gradient-to-br from-white/20 to-white/0 shadow-2xl relative preserve-3d"
        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl -z-10"
             style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} 
             className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl -z-10 bg-gradient-to-br ${category.color}`}
        ></div>
        
        <div className="bg-[#0a0a0a] w-full h-full rounded-[23px] p-8 glassmorphism border border-white/5 group-hover:border-white/10 transition-colors">
          <h3 className="text-2xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r text-white">
            <span className={`bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
              {category.title}
            </span>
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {category.skills.map((skill, i) => (
              <span 
                key={skill}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Skills = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="skills" ref={containerRef} className="relative w-full min-h-screen bg-brand-black py-32 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-20 text-center">
          <motion.h2 
            className="text-6xl md:text-8xl font-display font-black text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            SKILLS & <span className="text-outline">EXPERTISE</span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A comprehensive toolkit that enables me to build end-to-end applications, from intelligent AI models to visually stunning user interfaces.
          </motion.p>
        </div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Skills;
