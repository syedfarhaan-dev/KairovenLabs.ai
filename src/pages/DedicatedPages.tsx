import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ArrowLeft, 
  Check, 
  Cpu, 
  Terminal, 
  Calendar, 
  Sparkles, 
  Clock, 
  FileText, 
  Layers, 
  Hash, 
  Search,
  ChevronRight,
  User,
  Mail,
  X,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  Lightbulb,
  Compass,
  Code
} from 'lucide-react';
import FuturisticBackground from '../components/FuturisticBackground';
import { projectsData, eventsData } from '../data';

interface StudentHubProps {
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  isGeneratingArchitecture: boolean;
  generationOutput: string | null;
  generateArchitecture: () => void;
  onNavigateHome: (section: string) => void;
}

export function StudentHubPage({
  customPrompt,
  setCustomPrompt,
  isGeneratingArchitecture,
  generationOutput,
  generateArchitecture,
  onNavigateHome
}: StudentHubProps) {
  const encouragingQuotes = [
    {
      quote: "The future belongs to those who learn more skills and combine them in creative ways.",
      author: "Robert Greene",
      role: "Mastery Pathway"
    },
    {
      quote: "Do not wait for leaders. Be your own architect, design your own sandboxes, and ship code daily.",
      author: "KairovenLabs Sponsorship Ethos",
      role: "Hackathon Spirit"
    },
    {
      quote: "Code is not just logic instructions; it is the raw, active substrate out of which we sculpt high-growth futures.",
      author: "Lead KairovenLabs Architect",
      role: "Engineering Catalyst"
    },
    {
      quote: "The best way to predict the future is to invent it. Stop consuming tech paradigms, start establishing them.",
      author: "Alan Kay",
      role: "Pioneering Node"
    },
    {
      quote: "Every great developer began with a failing compiler and an uncompromised willingness to try again. Build with us.",
      author: "Community Mentor Circle",
      role: "Academic Launchpad"
    }
  ];

  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIdx((p) => (p + 1) % encouragingQuotes.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-28 px-6 lg:px-16 relative overflow-hidden bg-[#030303] min-h-screen"
    >
      <FuturisticBackground primaryColor="brand-purple" secondaryColor="brand-cyan" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={() => onNavigateHome('home')}
            className="flex items-center gap-2 text-xs font-mono tracking-wider text-gray-500 hover:text-brand-purple transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>HOME</span>
          </button>
          <span className="text-gray-700 font-mono text-xs">/</span>
          <span className="text-xs font-mono text-brand-purple tracking-widest uppercase">TALENT & MENTORSHIP WORKSPACE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          
          {/* Left Column: Mission Description */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/5 text-brand-purple text-[10px] font-mono tracking-widest uppercase self-start">
              <Trophy className="w-3 h-3 text-brand-purple" />
              <span>Next Gen Support Hub</span>
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Empowering the Engineering Mindset
            </h1>
            
            <p className="text-gray-450 text-sm md:text-base leading-relaxed">
              Academic institutions lay down solid mathematical theory, but actual commercial industries value live application delivery, real integration schemas, and secure database parameters. 
            </p>

            <p className="text-gray-450 text-sm md:text-base leading-relaxed">
              Our Student Hub bridges this exact knowledge chasm. Through curated targeted hackathons, comprehensive code audits, open mentor circles, and project-building sandboxes, we launch student careers.
            </p>

            <div className="flex flex-col gap-3 mt-4">
              {[
                { title: 'Sponsorship Tracks', desc: 'Sponsorship pathways designed specifically to fund open-source student MVPs.' },
                { title: 'Technical Mentorship', desc: 'One-on-one code strategy walkthroughs with verified lead architects.' },
                { title: 'Hackathon Priority', desc: 'Secure early sandbox entry for technical events sponsored with high-speed cloud credits.' },
                { title: 'Industry Sandbox', desc: 'Interactive developer tools designed to model prototype database schemas in seconds.' }
              ].map((value, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-wide mb-1">{value.title}</h4>
                    <p className="text-gray-550 text-xs leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateHome('contact')}
              className="mt-4 px-6 py-3 bg-white text-black text-xs font-semibold tracking-wider rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group cursor-pointer self-start"
            >
              Become a Student Partner / Representative
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right Column: Animated Image and Encouraging Quotes */}
          <div className="lg:col-span-7 flex flex-col gap-8 relative">
            <div className="absolute top-0 right-10 w-[120px] h-[2px] bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent" />
            
            {/* Image Section (Animated with floating and glow accent) */}
            <motion.div 
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group bg-black/40 p-1"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-75" />
              
              {/* Glow backdrop decorator */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#a855f7]/15 via-[#22d3ee]/10 to-[#6366f1]/15 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 rounded-2xl" />
              
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
                alt="KairovenLabs Student Innovation Hub"
                className="w-full h-[260px] md:h-[320px] object-cover rounded-xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-brand-cyan/30 bg-black/70 text-brand-cyan text-[10px] font-mono tracking-widest uppercase self-start backdrop-blur-md font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                  <span>Cognitive Innovation Sandbox</span>
                </div>
                <h4 className="text-white text-base md:text-xl font-bold tracking-tight font-display drop-shadow">
                  A Hub Built for Boundless Academic Creation
                </h4>
              </div>
            </motion.div>

            {/* Encouraging Quotes Carousel Section */}
            <div className="bg-[#020202] border border-white/5 rounded-2xl p-6 md:p-8 relative min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xl">
              
              {/* Subtle background quotes sign watermark */}
              <div className="absolute -top-6 -right-2 text-white/[0.015] text-[12rem] font-serif select-none pointer-events-none line-height-none">
                “
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Builder Mindset Guidance</span>
                </div>

                <div className="min-h-[90px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeQuoteIdx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col gap-3.5"
                    >
                      <p className="text-gray-300 text-xs md:text-sm font-medium leading-relaxed italic pr-6 font-sans">
                        "{encouragingQuotes[activeQuoteIdx].quote}"
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-white">
                          — {encouragingQuotes[activeQuoteIdx].author}
                        </span>
                        <span className="text-[9px] font-mono text-brand-purple uppercase px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/15">
                          {encouragingQuotes[activeQuoteIdx].role}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Indicator & Triggers */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 relative z-10">
                <div className="flex gap-2">
                  {encouragingQuotes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveQuoteIdx(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        activeQuoteIdx === idx 
                          ? 'bg-brand-cyan w-4' 
                          : 'bg-white/10 hover:bg-white/25'
                      }`}
                      aria-label={`Go to quote ${idx + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => onNavigateHome('contact')}
                  className="text-[10px] font-mono tracking-widest text-brand-cyan hover:text-white uppercase flex items-center gap-1 transition-colors cursor-pointer group"
                >
                  <span>Secure Your Node</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}

interface IndustryConnectProps {
  onNavigateHome: (section: string) => void;
}

export function IndustryConnectPage({ onNavigateHome }: IndustryConnectProps) {
  const initiatives = [
    {
      title: "Industry-Academia Collaboration",
      icon: Globe,
      color: "brand-cyan",
      description: "Bridging the gap between academic research and business applications to co-develop synergistic workflows.",
      metric: "12+ Partner Institutions",
      badge: "Partnerships"
    },
    {
      title: "Mentorship Opportunities",
      icon: Users,
      color: "brand-purple",
      description: "Direct guidance from seasoned technology directors, AI developers, and startup founders on a weekly cadence.",
      metric: "40+ Active Mentors",
      badge: "Guidance"
    },
    {
      title: "Internship & Career Pathways",
      icon: Briefcase,
      color: "brand-indigo",
      description: "Fast-track internship pipelines and direct career placements in modern engineering teams and SaaS ventures.",
      metric: "94% Placement Success",
      badge: "Careers"
    },
    {
      title: "Startup & Founder Networking",
      icon: Sparkles,
      color: "brand-cyan",
      description: "Connect with angel investors, active founders, and local tech community organizers to pitch products and MVPs.",
      metric: "Monthly Scrimmages",
      badge: "Networking"
    },
    {
      title: "Real-World Problem Solving",
      icon: Cpu,
      color: "brand-purple",
      description: "Tackle real business challenges and production integration bottlenecks using modern AI agents and systems.",
      metric: "$50K+ Tech Pilots Funded",
      badge: "R&D Lab"
    },
    {
      title: "Technical Community Building",
      icon: Terminal,
      color: "brand-indigo",
      description: "Participate in collaborative code slams, system architectural reviews, and local developer meetups.",
      metric: "1,200+ Developers",
      badge: "Community"
    },
    {
      title: "Strategic Partnerships",
      icon: Layers,
      color: "brand-cyan",
      description: "Sponsor alliances with premier tech platforms, securing credits, APIs, and specialized operational sandboxes.",
      metric: "Premium Tech Credits",
      badge: "Strategic"
    },
    {
      title: "Future Workforce Development",
      icon: Trophy,
      color: "brand-purple",
      description: "Fostering deep expertises in deployment, API design, and production operations for graduate readiness.",
      metric: "Top Tier Readiness",
      badge: "Talent Prep"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-28 px-6 lg:px-16 relative overflow-hidden bg-[#030303] min-h-screen"
    >
      <FuturisticBackground primaryColor="brand-cyan" secondaryColor="brand-indigo" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={() => onNavigateHome('home')}
            className="flex items-center gap-2 text-xs font-mono tracking-wider text-gray-500 hover:text-brand-cyan transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>HOME</span>
          </button>
          <span className="text-gray-700 font-mono text-xs">/</span>
          <span className="text-xs font-mono text-brand-cyan tracking-widest uppercase">INDUSTRY CONNECT GATEWAY</span>
        </div>

        {/* Header Block */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono text-brand-cyan tracking-widest uppercase block mb-2 font-semibold">ECOSYSTEM HUB</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
            Where Future Talent Meets Real-World Opportunity
          </h1>
          <p className="text-gray-440 text-xs md:text-sm mt-3.5 leading-relaxed font-sans">
            Industry Connect exists to bridge the gap between academic potential and industry expectations by creating meaningful relationships between students, professionals, organizations, startups, and innovators.
          </p>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiatives.map((item, index) => {
            const IconComponent = item.icon;
            const hoverBorder = item.color === 'brand-cyan' ? 'hover:border-brand-cyan/30' : item.color === 'brand-purple' ? 'hover:border-brand-purple/30' : 'hover:border-brand-indigo/30';
            const hoverGlow = item.color === 'brand-cyan' ? 'group-hover:text-brand-cyan' : item.color === 'brand-purple' ? 'group-hover:text-brand-purple' : 'group-hover:text-brand-indigo';

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative bg-[#020202] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${hoverBorder} min-h-[320px] overflow-hidden`}
              >
                {/* Visual hover border glow line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Top: Header & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-white/20 transition-all">
                      <IconComponent className="w-4 h-4 text-gray-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-mono text-[9px] font-semibold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 text-gray-300 tracking-wider uppercase">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h3 className={`font-display text-base font-semibold text-white tracking-wide mb-2 transition-colors ${hoverGlow}`}>
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Card Bottom: Metric Footer */}
                <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-semibold">Impact Metric</span>
                  <span className="text-[11px] font-mono font-bold text-brand-cyan tracking-wide">{item.metric}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}

interface InnovationProgramsProps {
  onNavigateHome: (section: string) => void;
}

export function InnovationProgramsPage({ onNavigateHome }: InnovationProgramsProps) {
  const programs = [
    {
      title: "Innovation Challenges",
      icon: Trophy,
      color: "brand-purple",
      description: "High-intensity hackfests and tech challenges built to pressure-test agentic behaviors and automation pipelines.",
      metric: "$15K+ Active Prize Pools",
      badge: "Challenges"
    },
    {
      title: "Research Initiatives",
      icon: Cpu,
      color: "brand-indigo",
      description: "Structured research cycles investigating complex reasoning, agent safety models, and lexical vector databases.",
      metric: "6 Active Projects",
      badge: "Research"
    },
    {
      title: "Product Incubation",
      icon: Layers,
      color: "brand-cyan",
      description: "Translating experimental code and MVPs into scalable SaaS web products with cloud credits and advisory.",
      metric: "4 Web Apps Launched",
      badge: "Incubation"
    },
    {
      title: "Startup Exploration",
      icon: Lightbulb,
      color: "brand-purple",
      description: "A fast-track roadmap providing sandbox domains, infrastructure, and team structuring advisory for startups.",
      metric: "Growth Sandboxes",
      badge: "Startup Path"
    },
    {
      title: "Open Source Contributions",
      icon: Code,
      color: "brand-indigo",
      description: "Sponsored pipelines supporting collaborative contributions to core tooling, libraries, and open-source models.",
      metric: "120+ Commits Accepted",
      badge: "Open Source"
    },
    {
      title: "AI & Emerging Tech Programs",
      icon: Terminal,
      color: "brand-cyan",
      description: "Expert workshops on edge hosting models, localized fine-tuning, and sophisticated semantic caching layers.",
      metric: "Bi-Weekly Lab Sessions",
      badge: "Emerging Tech"
    },
    {
      title: "Leadership Development",
      icon: Compass,
      color: "brand-purple",
      description: "Training tracks designed to build outstanding lead architects, project managers, and tech community spokespeople.",
      metric: "Active Student Leads",
      badge: "Leadership"
    },
    {
      title: "Future Builder Programs",
      icon: GraduationCap,
      color: "brand-indigo",
      description: "Ongoing material hosting, specialized mentors, and deep infrastructure support for highly promising student builders.",
      metric: "100% Funded Sandboxes",
      badge: "Sponsorships"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-28 px-6 lg:px-16 relative overflow-hidden bg-[#030303] min-h-screen"
    >
      <FuturisticBackground primaryColor="brand-purple" secondaryColor="brand-indigo" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={() => onNavigateHome('home')}
            className="flex items-center gap-2 text-xs font-mono tracking-wider text-gray-500 hover:text-brand-purple transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>HOME</span>
          </button>
          <span className="text-gray-700 font-mono text-xs">/</span>
          <span className="text-xs font-mono text-brand-purple tracking-widest uppercase">LAB INITIATIVES MATRIX</span>
        </div>

        {/* Header Block */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono text-brand-purple tracking-widest uppercase block mb-2 font-semibold">INNOVATION LAB</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
            Transforming Ideas Into Innovation
          </h1>
          <p className="text-gray-440 text-xs md:text-sm mt-3.5 leading-relaxed font-sans">
            Innovation Programs are designed to empower ambitious builders with the resources, mentorship, opportunities, and ecosystem required to transform ideas into impactful solutions.
          </p>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((item, index) => {
            const IconComponent = item.icon;
            const hoverBorder = item.color === 'brand-cyan' ? 'hover:border-brand-cyan/30' : item.color === 'brand-purple' ? 'hover:border-brand-purple/30' : 'hover:border-brand-indigo/30';
            const hoverGlow = item.color === 'brand-cyan' ? 'group-hover:text-brand-cyan' : item.color === 'brand-purple' ? 'group-hover:text-brand-purple' : 'group-hover:text-brand-indigo';

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative bg-[#020202] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${hoverBorder} min-h-[320px] overflow-hidden`}
              >
                {/* Visual hover border glow line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Top: Header & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-white/20 transition-all">
                      <IconComponent className="w-4 h-4 text-gray-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-mono text-[9px] font-semibold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 text-gray-300 tracking-wider uppercase">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h3 className={`font-display text-base font-semibold text-white tracking-wide mb-2 transition-colors ${hoverGlow}`}>
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Card Bottom: Metric Footer */}
                <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-semibold">Impact Metric</span>
                  <span className="text-[11px] font-mono font-bold text-brand-purple tracking-wide">{item.metric}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}

interface EventsProps {
  registeredEvents: string[];
  registerForEvent: (id: string) => void;
  onNavigateHome: (section: string) => void;
}

export function EventsPage({
  registeredEvents,
  registerForEvent,
  onNavigateHome
}: EventsProps) {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState('');
  const [notifyName, setNotifyName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyName.trim() && notifyEmail.trim()) {
      setNotifySubmitted(true);
    }
  };

  const openNotifyModal = (eventTitle: string) => {
    setSelectedEventName(eventTitle);
    setNotifyName('');
    setNotifyEmail('');
    setNotifySubmitted(false);
    setIsNotifyModalOpen(true);
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'Upcoming':
        return 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]';
      case 'Planned':
        return 'text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]';
      case 'Coming Soon':
        return 'text-brand-purple bg-brand-purple/10 border-brand-purple/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
      default:
        return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-28 px-6 lg:px-16 relative overflow-hidden bg-[#030303] min-h-screen"
    >
      <FuturisticBackground primaryColor="brand-cyan" secondaryColor="brand-purple" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={() => onNavigateHome('home')}
            className="flex items-center gap-2 text-xs font-mono tracking-wider text-gray-500 hover:text-brand-purple transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>HOME</span>
          </button>
          <span className="text-gray-700 font-mono text-xs">/</span>
          <span className="text-xs font-mono text-brand-purple tracking-widest uppercase">UPCOMING COMMUNITY CHRONOLOGY</span>
        </div>

        {/* Content Header Block */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono text-brand-purple tracking-widest uppercase block mb-2">Community Timeline</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
            Upcoming Events & Innovation Programs
          </h1>
          <p className="text-gray-450 text-xs md:text-sm mt-3.5 leading-relaxed">
            We’re building a collaborative ecosystem of hackathons, workshops, AI innovation programs, and student-focused tech events. Stay connected for upcoming opportunities.
          </p>
        </div>

        {/* Futuristic Notice Banner */}
        <div className="max-w-3xl mb-12 p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 flex items-center gap-3 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse shrink-0" />
          <p className="text-xs text-brand-cyan/90 font-mono tracking-wide leading-relaxed">
            Our innovation events and hackathon ecosystem will be launching soon. Stay connected to explore upcoming opportunities.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-white/10 pl-6 ml-1 md:ml-4 flex flex-col gap-8">
          {eventsData.map((ev, i) => {
            return (
              <div key={ev.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-[9px] h-[9px] rounded-full bg-[#030303] border-2 border-brand-purple/70 group-hover:border-white transition-colors z-10" />
                <div className="absolute -left-[45px] top-[-8px] w-8 h-8 rounded-full bg-brand-purple/5 blur-[8px] pointer-events-none group-hover:bg-brand-purple/10 transition-colors" />

                <div className="bg-[#020202] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                  <div className="max-w-2xl flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2.5">
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${getBadgeStyles(ev.type)}`}>
                        {ev.type}
                      </span>
                    </div>
                    
                    <h3 className="font-display text-lg font-semibold text-white tracking-wide mb-2 group-hover:text-brand-purple transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-sans">
                      {ev.description}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0 self-start md:self-auto w-full md:w-auto">
                    <button
                      onClick={() => openNotifyModal(ev.title)}
                      className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] active:scale-98 w-full sm:w-auto text-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Notify Me
                    </button>
                    
                    <button
                      onClick={() => onNavigateHome('contact')}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 w-full sm:w-auto text-nowrap"
                    >
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Cyberpunk Modal Popup Form */}
      <AnimatePresence>
        {isNotifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with elegant blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifyModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-sm bg-[#080808]/90 border border-white/15 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden"
            >
              {/* Decorative side glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 blur-[50px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/10 blur-[50px] pointer-events-none rounded-full" />

              {/* Close Button */}
              <button 
                onClick={() => setIsNotifyModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!notifySubmitted ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-brand-cyan uppercase tracking-widest">Notification Setup</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white tracking-tight mb-2">
                    {selectedEventName}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-6">
                    Get notified about upcoming hackathons, workshops, and innovation programs. Enter your details to get instant alert updates.
                  </p>

                  <form onSubmit={handleNotifySubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1.5 font-semibold">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                          type="text" 
                          required
                          value={notifyName}
                          onChange={(e) => setNotifyName(e.target.value)}
                          placeholder="Commander Alex"
                          className="w-full bg-[#030303] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1.5 font-semibold">Your Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                          type="email" 
                          required
                          value={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.value)}
                          placeholder="alex@labs.ai"
                          className="w-full bg-[#030303] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black py-3 rounded-xl font-semibold text-xs tracking-wider transition-all duration-300 mt-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-98 cursor-pointer"
                    >
                      ACTIVATE NOTIFICATIONS
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-6"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    <Check className="w-6 h-6 text-brand-cyan" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-white tracking-tight mb-2">
                    System Alert Activated
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-mono text-center">
                    Agent <span className="text-brand-cyan font-bold">{notifyName}</span> added to the list. Updates for <span className="text-brand-purple">{selectedEventName}</span> are now directed to <span className="text-white underline">{notifyEmail}</span>.
                  </p>

                  <button 
                    onClick={() => setIsNotifyModalOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer"
                  >
                    CLOSE WINDOW
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
