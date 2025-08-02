import { Button } from "@/components/ui/button"
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Target, 
  Clock, 
  FileText, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Zap,
  BookOpen
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Smart Goal Setting',
      description: 'Set academic goals and get personalized study roadmaps'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Adaptive Scheduling',
      description: 'Flexible time management based on your learning speed'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'AI Note Generation',
      description: 'Upload materials and get intelligent study notes'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics'
    }
  ];

  const benefits = [
    'Personalized study plans tailored to your goals',
    'AI-powered content analysis and note generation',
    'Adaptive scheduling based on your learning pace',
    'Progress tracking and performance insights',
    'Mobile-friendly interface for studying anywhere'
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Study Planning
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight relative"
              >
                <motion.span
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-[length:200%_100%]"
                >
                  Transform Your
                </motion.span>
                <br />
                <span className="bg-gradient-to-r from-violet-500 to-primary bg-clip-text text-transparent">
                  {' '}Learning Journey
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                Create personalized study plans powered by AI. Upload your materials, 
                set your goals, and get intelligent insights to accelerate your learning 
                and achieve academic success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to={user ? "/planner" : "/login"}>
                  <Button size="lg">
                      {user ? 'Start Planning Now' : 'Get Started'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <Button size="lg" variant="outline" onClick={scrollToFeatures}>
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 shadow-2xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-8 h-8 border-2 border-white/30 rounded-full"
                />
                <div className="bg-card rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mr-3">
                      <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Study Plan Generated</h3>
                      <p className="text-sm text-muted-foreground">Complete DSA in 30 days</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {['Arrays & Strings', 'Linked Lists', 'Trees & Graphs'].map((topic, index) => (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center bg-muted/50 rounded-lg p-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-foreground">{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-card rounded-full p-3 shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Smarter Learning
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create effective study plans and accelerate your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 * index }}
                className="bg-card p-8 rounded-2xl shadow-lg flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Unlock Your Full Learning Potential
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our platform is designed to help you study smarter, not harder.
                Get the tools and insights you need to succeed.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                    <span className="text-lg text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              className="relative"
            >
              <div className="bg-muted/50 rounded-3xl p-8">
                <div className="bg-card rounded-2xl p-8 shadow-2xl relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-primary-foreground absolute -top-10 -left-10">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of students who are already learning smarter with our AI-powered study planner.
                  </p>
                  <Link to={user ? "/planner" : "/login"}>
                    <Button size="lg" className="w-full">
                      Get Started Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Loved by Students Worldwide
            </h2>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah L.', quote: "This tool transformed my study habits. I'm more organized and confident than ever!" },
              { name: 'Mike T.', quote: "The AI-generated notes are a lifesaver. It cuts my review time in half." },
              { name: 'Jessica P.', quote: "I finally feel in control of my learning. The adaptive plans are a game-changer." }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 * index }}
                className="bg-card p-8 rounded-2xl shadow-lg"
              >
                <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                <p className="font-semibold text-foreground text-right">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;