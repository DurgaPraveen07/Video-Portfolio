import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const defaultCertifications = [
  'Frontend Web Development',
  'Artificial Intelligence Workshop',
  'Quantum Computing',
  'Python Essentials 1',
  'Python Essentials 2',
  'C Programming',
  'C++ Programming'
];

const Certifications = () => {
  const [certs, setCerts] = useState(defaultCertifications);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const response = await fetch('/api/certificates');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCerts(data);
          }
        }
      } catch (err) {
        console.error('Failed to load certificates, using defaults:', err);
      }
    };
    fetchCerts();
  }, []);
  return (
    <section id="experience" className="w-full bg-brand-black py-32 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <motion.h2 
            className="text-5xl md:text-7xl font-display font-black text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            CERTIFICATIONS
          </motion.h2>
          <motion.p
            className="text-gray-400 mt-4 md:mt-0 text-sm md:text-base max-w-sm text-right hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Continuous learning and mastery of new technologies to stay at the cutting edge.
          </motion.p>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-8 md:pl-16 py-10 space-y-12">
          {certs.map((cert, index) => {
            const title = typeof cert === 'string' ? cert : cert.title;
            const pdfUrl = typeof cert === 'string' ? null : cert.pdfUrl;

            return (
              <motion.div 
                key={index}
                className="relative group perspective-[1000px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] md:-left-[73px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-black border-2 border-white/30 group-hover:border-brand-red group-hover:bg-brand-red transition-colors duration-300 z-10 shadow-[0_0_10px_rgba(255,42,42,0)] group-hover:shadow-[0_0_15px_rgba(255,42,42,0.8)]"></div>
                
                {/* Line connector */}
                <div className="absolute -left-[41px] md:-left-[73px] top-1/2 -translate-y-1/2 w-8 md:w-16 h-[1px] bg-white/10 group-hover:bg-brand-red/50 transition-colors duration-300"></div>

                <motion.div 
                  className={`glassmorphism p-6 md:p-8 rounded-2xl relative preserve-3d group-hover:bg-white/10 transition-colors duration-300 overflow-hidden ${pdfUrl ? 'cursor-pointer' : ''}`}
                  whileHover={{ scale: 1.02, x: 10 }}
                  onClick={() => {
                    if (pdfUrl) {
                      if (pdfUrl.startsWith('data:application/pdf')) {
                        try {
                          const base64Parts = pdfUrl.split(',');
                          const base64Data = base64Parts[1];
                          const decoded = atob(base64Data);
                          const array = new Uint8Array(decoded.length);
                          for (let i = 0; i < decoded.length; i++) {
                            array[i] = decoded.charCodeAt(i);
                          }
                          const blob = new Blob([array], { type: 'application/pdf' });
                          const blobUrl = URL.createObjectURL(blob);
                          window.open(blobUrl, '_blank');
                        } catch (err) {
                          console.error('Failed to open PDF blob:', err);
                          window.open(pdfUrl, '_blank');
                        }
                      } else {
                        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
                      }
                    }
                  }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-red/0 to-brand-red/0 group-hover:from-brand-red/10 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

                  <div className="flex items-center justify-between relative z-10">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">{title}</h3>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-red transform group-hover:rotate-45 transition-transform duration-300">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
