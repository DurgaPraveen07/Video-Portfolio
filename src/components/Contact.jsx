import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill in all required fields (Name, Email, Phone, and Message).');
      return;
    }
    setStatus('submitting');
    setStatusMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus('success');
        setStatusMessage('Your message has been sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(data.message || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setStatusMessage('Failed to send message. Please check your connection.');
    }
  };

  return (
    <section id="contact" className="relative w-full min-h-screen bg-[#050505] text-white py-32 overflow-hidden flex items-center">
      
      {/* Floating Red Glows */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-red/20 rounded-full blur-[120px] pointer-events-none"
        animate={{ 
          x: [0, 50, 0, -50, 0],
          y: [0, -50, 50, 0, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[150px] pointer-events-none"
        animate={{ 
          x: [0, -50, 0, 50, 0],
          y: [0, 50, -50, 0, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col lg:flex-row gap-16">
        
        {/* Left Column - Heading & Socials */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <motion.h2 
            className="text-5xl md:text-7xl font-display font-black leading-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Let's Build <br/> Something <br/> <span className="text-brand-red">Amazing</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-400 text-lg mb-12 max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have an idea for a project or looking for an AI Engineer to join your team? I'm always open to discussing new opportunities.
          </motion.p>

          <div className="flex flex-wrap gap-4">
            {[
              { 
                icon: FaWhatsapp, 
                label: 'WhatsApp', 
                href: 'https://wa.me/916303363968?text=HI%20I%20want%20to%20you%20to%20build%20a%20customisable%20for%20me.', 
                color: 'hover:text-green-500 hover:border-green-500' 
              },
              { 
                icon: FaEnvelope, 
                label: 'Email', 
                href: 'mailto:durgapraveenthekakarot@gmail.com', 
                color: 'hover:text-red-500 hover:border-red-500' 
              },
              { 
                icon: FaLinkedin, 
                label: 'LinkedIn', 
                href: 'https://www.linkedin.com/in/chennuboyina-durga-praveen/', 
                color: 'hover:text-blue-500 hover:border-blue-500' 
              },
              { 
                icon: FaGithub, 
                label: 'GitHub', 
                href: 'https://github.com/DurgaPraveen07', 
                color: 'hover:text-white hover:border-white' 
              },
              { 
                icon: FaDownload, 
                label: 'Resume', 
                href: '/Durga%20praveen%20resume.pdf', 
                color: 'hover:text-yellow-500 hover:border-yellow-500',
                download: true 
              }
            ].map((social, i) => (
              <motion.a 
                key={i}
                href={social.href}
                download={social.download ? "Durga_Praveen_Resume.pdf" : undefined}
                target={social.href.startsWith('http') ? "_blank" : undefined}
                rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 glassmorphism text-sm font-bold uppercase tracking-wider text-gray-300 transition-all duration-300 ${social.color}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + (i * 0.1), type: 'spring' }}
                whileHover={{ y: -5 }}
              >
                <social.icon className="text-xl" />
                {social.label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <motion.div 
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="glassmorphism p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 blur-[50px] -z-10"></div>
            
            <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all resize-none"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full mt-4 bg-brand-red text-white font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-white hover:text-brand-red transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
              {statusMessage && (
                <div className={`text-sm text-center font-semibold mt-4 ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {statusMessage}
                </div>
              )}
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
