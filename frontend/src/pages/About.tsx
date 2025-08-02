import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Code, 
  Database, 
  Brain, 
  Zap, 
  Globe,
  Send,
  ArrowRight,
  ExternalLink,
  Star,
  Award,
  Users,
  Rocket,
  User,
  Cloud
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Satyam's data
  const satyamTechnologies = [
    { name: 'Supabase', icon: <Database className="w-6 h-6" />, color: 'text-emerald-500' },
    { name: 'FastAPI', icon: <Code className="w-6 h-6" />, color: 'text-green-500' },
    { name: 'Gemini', icon: <Brain className="w-6 h-6" />, color: 'text-blue-500' },
    { name: 'Machine Learning', icon: <Brain className="w-6 h-6" />, color: 'text-blue-500' },
    { name: 'Deep Learning', icon: <Brain className="w-6 h-6" />, color: 'text-purple-500' },
    { name: 'AgoraRTC', icon: <Code className="w-6 h-6" />, color: 'text-purple-500' },
    { name: 'Django', icon: <Code className="w-6 h-6" />, color: 'text-green-600' },
    { name: 'HTML/CSS/JS', icon: <Code className="w-6 h-6" />, color: 'text-orange-500' },
    { name: 'Tailwind', icon: <Zap className="w-6 h-6" />, color: 'text-teal-500' },
    { name: 'Cursor', icon: <Code className="w-6 h-6" />, color: 'text-purple-500' },
  ];

  const satyamTools = [
    { name: 'VS Code', icon: <Code className="w-5 h-5" /> },
    { name: 'Cursor IDE', icon: <Code className="w-5 h-5" /> },
    { name: 'Netlify', icon: <Globe className="w-5 h-5" /> },
    { name: 'GitHub', icon: <Github className="w-5 h-5" /> },
  ];

  const satyamAiTools = [
    { name: 'Gemini', icon: <Brain className="w-5 h-5" /> },
    { name: 'Claude', icon: <Brain className="w-5 h-5" /> },
    { name: 'OpenAI', icon: <Brain className="w-5 h-5" /> },
    { name: 'Hugging Face', icon: <Brain className="w-5 h-5" /> },
    { name: 'LangChain', icon: <Brain className="w-5 h-5" /> },
    { name: 'Pandas', icon: <Brain className="w-5 h-5" /> },
  ];

  const satyamExperiences = [
    {
      title: 'Django Backend Intern',
      company: 'Doosra College',
      duration: '2024',
      description: 'Developed robust backend solutions using Django framework, gaining hands-on experience with real-world applications.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'AI-Powered Development',
      company: 'Personal Projects',
      duration: '2024',
      description: 'Built AI-driven applications using modern tools like Bolt for frontend and Cursor for backend development.',
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: 'Machine Learning Engineer',
      company: 'Personal Projects',
      duration: '2024',
      description: 'Developed ML models for natural language processing, computer vision, and predictive analytics using TensorFlow, PyTorch, and scikit-learn.',
      icon: <Brain className="w-6 h-6" />
    }
  ];

  const satyamProjects = [
    {
      name: 'Study AI',
      description: 'AI-powered study planner with smart note generation and personalized learning paths.',
      tech: ['React', 'FastAPI', 'Gemini', 'Supabase', 'NLP']
    },
    {
      name: 'FitBot',
      description: 'Intelligent fitness companion with AI-driven workout recommendations and progress tracking.',
      tech: ['React', 'AI Integration', 'Real-time Data', 'ML Models']
    },
    {
      name: 'DreamVault',
      description: 'Secure dream journaling app with AI-powered insights and dream analysis.',
      tech: ['React', 'Supabase', 'TypeScript', 'AI Integration']
    },
    {
      name: 'VidChat',
      description: 'Real-time video chat application with advanced communication features.',
      tech: ['AgoraRTC', 'Django', 'HTML', 'CSS', 'JavaScript']
    }
  ];

  // Priyanshu's data
  const priyanshuTechnologies = [
    { name: 'Machine Learning', icon: <Brain className="w-6 h-6" />, color: 'text-blue-500' },
    { name: 'Deep Learning', icon: <Brain className="w-6 h-6" />, color: 'text-purple-500' },
    { name: 'PyTorch', icon: <Brain className="w-6 h-6" />, color: 'text-red-500' },
    { name: 'NLP', icon: <Brain className="w-6 h-6" />, color: 'text-green-500' },
    { name: 'FastAPI', icon: <Code className="w-6 h-6" />, color: 'text-green-500' },
    { name: 'Supabase', icon: <Database className="w-6 h-6" />, color: 'text-emerald-500' },
    { name: 'TypeScript', icon: <Code className="w-6 h-6" />, color: 'text-blue-600' },
    { name: 'Django', icon: <Code className="w-6 h-6" />, color: 'text-green-600' },
    { name: 'Spring Boot', icon: <Code className="w-6 h-6" />, color: 'text-green-700' },
    { name: 'AWS', icon: <Cloud className="w-6 h-6" />, color: 'text-orange-500' },
    { name: 'Azure', icon: <Cloud className="w-6 h-6" />, color: 'text-blue-600' },
  ];

  const priyanshuTools = [
    { name: 'VS Code', icon: <Code className="w-5 h-5" /> },
    { name: 'PyCharm', icon: <Code className="w-5 h-5" /> },
    { name: 'IntelliJ IDEA', icon: <Code className="w-5 h-5" /> },
    { name: 'GitHub', icon: <Github className="w-5 h-5" /> },
  ];

  const priyanshuAiTools = [
    { name: 'PyTorch', icon: <Brain className="w-5 h-5" /> },
    { name: 'Hugging Face', icon: <Brain className="w-5 h-5" /> },
    { name: 'TensorFlow', icon: <Brain className="w-5 h-5" /> },
    { name: 'Scikit-learn', icon: <Brain className="w-5 h-5" /> },
    { name: 'NLTK', icon: <Brain className="w-5 h-5" /> },
    { name: 'SpaCy', icon: <Brain className="w-5 h-5" /> },
  ];

  const priyanshuExperiences = [
    {
      title: 'Machine Learning Engineer',
      company: 'Personal Projects',
      duration: '2024',
      description: 'Developed advanced ML models for computer vision and natural language processing using PyTorch and modern deep learning techniques.',
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: 'Full Stack Developer',
      company: 'Personal Projects',
      duration: '2024',
      description: 'Built scalable web applications using Django, Spring Boot, and modern frontend technologies with cloud deployment.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Cloud Solutions Architect',
      company: 'Personal Projects',
      duration: '2024',
      description: 'Designed and deployed cloud-native applications on AWS and Azure with containerization and microservices architecture.',
      icon: <Cloud className="w-6 h-6" />
    }
  ];

  const priyanshuProjects = [
    {
      name: 'Study AI',
      description: 'AI-powered study planner with smart note generation and personalized learning paths.',
      tech: ['React', 'FastAPI', 'Gemini', 'Supabase', 'NLP']
    },
    {
      name: 'DreamVault',
      description: 'Secure dream journaling app with AI-powered insights and dream analysis.',
      tech: ['React', 'Supabase', 'TypeScript', 'AI Integration']
    },
    {
      name: 'Food Vision Classifier',
      description: 'Advanced computer vision model for food classification using PyTorch and Hugging Face transformers.',
      tech: ['PyTorch', 'Hugging Face', 'FastAPI', 'TypeScript']
    },
    {
      name: 'Jaris Scheduler',
      description: 'Robust task scheduling system with distributed architecture and real-time processing capabilities.',
      tech: ['Spring Boot', 'RabbitMQ', 'Docker', 'React']
    }
  ];

  const renderProfile = (profile: 'satyam' | 'priyanshu') => {
    const isSatyam = profile === 'satyam';
    const technologies = isSatyam ? satyamTechnologies : priyanshuTechnologies;
    const tools = isSatyam ? satyamTools : priyanshuTools;
    const aiTools = isSatyam ? satyamAiTools : priyanshuAiTools;
    const experiences = isSatyam ? satyamExperiences : priyanshuExperiences;
    const projects = isSatyam ? satyamProjects : priyanshuProjects;
    const name = isSatyam ? 'Satyam Sakral' : 'Priyanshu Aggarwal';
    const title = isSatyam ? 'Full Stack AI-Powered Developer' : 'Machine Learning Engineer & Full Stack Developer';
    const description = isSatyam 
      ? 'I build smart, fast, and functional products with AI-first thinking and machine learning expertise.'
      : 'I specialize in machine learning, deep learning, and full-stack development with expertise in cloud technologies.';
    const aboutText = isSatyam 
      ? "I'm Satyam, an MCA student and full-stack dev with a passion for building AI-driven products. From Django intern experience at Doosra College to completing multiple live projects — Study AI, Fit Bot, and ML applications — I bring strong backend logic, AI integration, machine learning expertise, and real-world thinking to every app I build."
      : "I'm Priyanshu, a recent B.Tech graduate and passionate machine learning engineer and full-stack developer with expertise in deep learning, computer vision, and cloud technologies. From building advanced ML models to developing scalable web applications, I bring cutting-edge AI solutions and robust engineering practices to every project.";

    return (
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-full">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="relative py-16 px-8 bg-gradient-to-br from-deep-sky-blue via-blue-600 to-indigo-700"
        >
          <div className="text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {name}
              </h1>
              <h2 className="text-lg md:text-xl text-blue-100 mb-4">
                {title}
              </h2>
              <p className="text-sm md:text-base text-blue-200 max-w-md mx-auto leading-relaxed">
                {description}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* About Section */}
        <section className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                {aboutText}
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {aboutText}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-deep-sky-blue" />
                      Technologies
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {technologies.slice(0, 6).map((tech, index) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-300"
                        >
                          <span className={tech.color}>{tech.icon}</span>
                          <span className="text-xs font-medium text-slate-700">{tech.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-deep-sky-blue" />
                      AI & ML Tools
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {aiTools.slice(0, 4).map((tool, index) => (
                        <motion.div
                          key={tool.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-300"
                        >
                          <span className="text-purple-500">{tool.icon}</span>
                          <span className="text-xs font-medium text-slate-700">{tool.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>


                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-deep-sky-blue to-blue-600 rounded-2xl p-6 text-white">
                  <div className="text-center mb-6">
                    <Award className="w-12 h-12 mx-auto mb-3 text-white/80" />
                    <h3 className="text-xl font-bold mb-2">Projects</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                      >
                        <h4 className="text-base font-semibold mb-2">{project.name}</h4>
                        <p className="text-blue-100 text-xs mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Page Header */}
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
              About the Developers
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet the talented developers behind StudyAI - building the future of AI-powered learning
            </p>
          </motion.div>
        </div>
      </div>

      {/* Developers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Meet Our Developers
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-deep-sky-blue to-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Satyam's Profile */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-full"
            >
              {renderProfile('satyam')}
            </motion.div>

            {/* Priyanshu's Profile */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-full"
            >
              {renderProfile('priyanshu')}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-deep-sky-blue to-blue-600 mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
              Let's connect and build something amazing together!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Links */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Connect With Us</h3>
              
              <motion.a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-deep-sky-blue transition-colors">
                    GitHub
                  </h4>
                  <p className="text-slate-600 text-sm">Check out our projects</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 ml-auto group-hover:text-deep-sky-blue transition-colors" />
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-deep-sky-blue transition-colors">
                    LinkedIn
                  </h4>
                  <p className="text-slate-600 text-sm">Connect professionally</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 ml-auto group-hover:text-deep-sky-blue transition-colors" />
              </motion.a>

              <motion.a
                href="mailto:contact@example.com"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-deep-sky-blue rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-deep-sky-blue transition-colors">
                    Email
                  </h4>
                  <p className="text-slate-600 text-sm">contact@example.com</p>
                </div>
                <Send className="w-5 h-5 text-slate-400 ml-auto group-hover:text-deep-sky-blue transition-colors" />
              </motion.a>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Send a Message</h3>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-deep-sky-blue focus:border-transparent transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-deep-sky-blue focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-deep-sky-blue focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-deep-sky-blue to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Satyam Sakral & Priyanshu Aggarwal</h3>
            <p className="text-slate-300 mb-6">
              Full Stack AI-Powered Developers & ML Engineers
            </p>
            <div className="flex justify-center gap-6">
              <a href="https://github.com/yourusername" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/yourusername" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:contact@example.com" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-slate-400 text-sm">
                © 2024 Satyam Sakral & Priyanshu Aggarwal. Built with React, TypeScript, and Tailwind CSS.
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default About;