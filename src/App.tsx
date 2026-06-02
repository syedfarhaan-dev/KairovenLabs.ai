import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FuturisticBackground from './components/FuturisticBackground';
import {
  Cpu,
  Terminal,
  MessageSquare,
  Laptop,
  Shield,
  Trophy,
  Calendar,
  Users,
  Sparkles,
  Play,
  X,
  Check,
  Menu,
  ArrowRight,
  ChevronRight,
  Send,
  Code2,
  Database,
  Search,
  BookOpen,
  Eye,
  Settings,
  AlertCircle,
  ChevronDown,
  Linkedin,
  Github,
  Mail
} from 'lucide-react';
import { servicesData, projectsData, eventsData, Service, Project } from './data';
import { StudentHubPage, IndustryConnectPage, InnovationProgramsPage, EventsPage } from './pages/DedicatedPages';
import { AdminLeadsPage } from './pages/AdminLeadsPage';

export default function App() {
  // Navigation active tab
  const [currentPage, setCurrentPage] = useState<'home' | 'student-hub' | 'industry-connect' | 'events' | 'innovation-programs' | 'admin-leads'>('home');
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  // Notice Toast for Our Team / Blogs placeholder clicks
  const [noticeToast, setNoticeToast] = useState<string | null>(null);

  // Dropdown refs for click-outside closure
  const featuresRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Interactive UI features
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [contactSubject, setContactSubject] = useState('AI Automation Workflows');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Lead capture state managers
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactErrors, setContactErrors] = useState<string[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: any = null;
    const initTurnstile = () => {
      if (turnstileRef.current && (window as any).turnstile) {
        try {
          widgetId = (window as any).turnstile.render(turnstileRef.current, {
            sitekey: (import.meta as any).env.TURNSTILE_SITE_KEY || (import.meta as any).env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
            callback: (token: string) => {
              setTurnstileToken(token);
            },
            theme: 'dark'
          });
        } catch (e) {
          console.error("Turnstile rendering failure", e);
        }
      }
    };

    if ((window as any).turnstile) {
      initTurnstile();
    } else {
      const interval = setInterval(() => {
        if ((window as any).turnstile) {
          initTurnstile();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetId && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetId);
        } catch (e) { }
      }
    };
  }, [currentPage]);

  // Student Portal Interactive States
  const [customPrompt, setCustomPrompt] = useState('Build a healthcare AI assistant');
  const [generationOutput, setGenerationOutput] = useState<string | null>(null);
  const [isGeneratingArchitecture, setIsGeneratingArchitecture] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  // Demo Terminal simulator states
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  // Handle outside-clicks on dropdowns to close them cleanly
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesDropdownOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear noticeToast after a delay
  useEffect(() => {
    if (noticeToast) {
      const timer = setTimeout(() => {
        setNoticeToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [noticeToast]);

  // Trigger smooth scroll when user navigates
  const handleNavClick = (tabName: string, elementId: string) => {
    setMobileMenuOpen(false);
    setFeaturesDropdownOpen(false);
    setProductsDropdownOpen(false);

    // Check if navigating to a dedicated subpage
    if (elementId === 'student-hub' || elementId === 'industry-connect' || elementId === 'events' || elementId === 'innovation-programs') {
      setCurrentPage(elementId as any);
      setActiveTab('Innovation Hub');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (currentPage !== 'home') {
      setCurrentPage('home');
      setActiveTab(tabName);
      setTimeout(() => {
        if (elementId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const element = document.getElementById(elementId);
        if (element) {
          const topOffset = 85;
          const elementRectTop = element.getBoundingClientRect().top;
          const offsetPosition = elementRectTop + window.pageYOffset - topOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    } else {
      setActiveTab(tabName);
      if (elementId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(elementId);
      if (element) {
        const topOffset = 85; // height of sticking navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - topOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Specific helper for selection inside products dropdown
  const handleProductSelectByServiceIndex = (idx: number) => {
    setProductsDropdownOpen(false);
    setFeaturesDropdownOpen(false);
    setMobileMenuOpen(false);
    setSelectedService(servicesData[idx]);

    if (currentPage !== 'home') {
      setCurrentPage('home');
      setActiveTab('Services');
      setTimeout(() => {
        const element = document.getElementById('services');
        if (element) {
          const topOffset = 85;
          const elementRectTop = element.getBoundingClientRect().top;
          const offsetPosition = elementRectTop + window.pageYOffset - topOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    } else {
      setActiveTab('Services');
      const element = document.getElementById('services');
      if (element) {
        const topOffset = 85;
        const elementRectTop = element.getBoundingClientRect().top;
        const offsetPosition = elementRectTop + window.pageYOffset - topOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Scroll active tab detection
  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;

      const sections = [
        { name: 'Home', id: 'home' },
        { name: 'About', id: 'about' },
        { name: 'Services', id: 'services' },
        { name: 'Our Team', id: 'team' },
        { name: 'Blogs', id: 'blogs' },
        { name: 'Contact', id: 'contact' },
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Run dynamic AI script builder mockup
  const generateArchitecture = () => {
    if (!customPrompt.trim()) return;
    setIsGeneratingArchitecture(true);
    setGenerationOutput('Querying LLM for schema blueprint...');

    setTimeout(() => {
      setGenerationOutput((prev) => prev + '\n\n[1/4] Establishing cognitive context...\nLoaded models: Gemini-2.5-Flash + Agentic Router');
    }, 600);

    setTimeout(() => {
      setGenerationOutput((prev) => prev + '\n\n[2/4] Drafting modular schemas...\n- Created Firestore model structure: collections/users, collections/queries\n- Established real-time socket events');
    }, 1200);

    setTimeout(() => {
      setGenerationOutput((prev) => prev + '\n\n[3/4] Structuring components...\n- Initialized React frontend views\n- Attached Framer Motion page controls\n- Embedded security rule templates');
    }, 1900);

    setTimeout(() => {
      setGenerationOutput(
        `🚀 SUCCESFULLY GENERATED MODULAR SCHEMAS FOR:\n"${customPrompt.toUpperCase()}"\n\n` +
        `-----------------------------------------\n` +
        `├─ 🗄️ Firestore Collections:\n` +
        `│  ├─ /sessions (UUID key-values, user tracking)\n` +
        `│  └─ /analysis_runs (structured RAG chunks, metadata)\n` +
        `├─ 🖥️ React Components Created:\n` +
        `│  ├─ /src/components/AgenticConsole.tsx\n` +
        `│  └─ /src/hooks/useAgentSocket.ts\n` +
        `└─ 🔒 Security Rules:\n` +
        `   └─ allow read, write: if request.auth != null;\n\n` +
        `🔥 Prototype matches system specs.`
      );
      setIsGeneratingArchitecture(false);
    }, 2800);
  };

  // Run simulation inside the demo terminal modal
  const startDemoTerminal = () => {
    if (terminalStatus === 'running') return;
    setTerminalStatus('running');
    setTerminalProgress(0);
    setTerminalLogs([]);

    const logs = [
      '⚡ [0.0s] Booting KairovenLabs Core Engine...',
      '📡 [0.4s] Registering Gemini-2.5 multi-agent channels...',
      '🔍 [0.9s] Scanning ports & verifying server container limits...',
      '🛠️ [1.3s] Compiling client asset pipeline (Vite v6.2)...',
      '📦 [1.8s] Resolving project dependencies (React 19, Motion, WebSockets)...',
      '🧠 [2.3s] Instantiating AI orchestration agent with cognitive focus...',
      '🧪 [2.9s] Deploying live web solution and generating Cloud Run paths...',
      '🔒 [3.4s] Hardening security boundaries & database schema rules...',
      '✨ [4.0s] Sandbox successfully constructed! System operational at 100% capacity.'
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[logIndex]]);
        setTerminalProgress(Math.floor(((logIndex + 1) / logs.length) * 100));
        logIndex++;
      } else {
        clearInterval(interval);
        setTerminalStatus('completed');
      }
    }, 850);
  };

  // Icon selector component
  const renderIcon = (iconName: string, className = "w-6 h-6 text-brand-cyan") => {
    switch (iconName) {
      case 'Cpu': return <Cpu className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // Event signup execution
  const registerForEvent = (eventId: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
    }
  };

  // Contact submit callback
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactErrors([]);

    // Client-side validation checks
    const errors: string[] = [];
    if (!contactName.trim() || contactName.trim().length < 2) {
      errors.push("Full Name is required (minimum 2 characters).");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail.trim() || !emailRegex.test(contactEmail)) {
      errors.push("A valid Email Address is required.");
    }
    if (!contactMessage.trim() || contactMessage.trim().length < 10) {
      errors.push("Project Details must be at least 10 characters long.");
    }

    if (errors.length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: contactName,
          email: contactEmail,
          service: contactSubject,
          project_details: contactMessage,
          turnstile_token: turnstileToken,
          source_page: "KairovenLabs.ai Landing Page"
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setContactFormSubmitted(true);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setTurnstileToken('');
        // Reset turnstile widget if window.turnstile exists
        if ((window as any).turnstile) {
          try {
            (window as any).turnstile.reset();
          } catch (e) { }
        }
      } else {
        setContactErrors(data.errors || [data.error] || ["Failed to log server submission."]);
      }
    } catch (err) {
      console.error("Lead submission connection failure:", err);
      setContactErrors(["Connection timed out or network error. Please try again."]);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen z-0">

      {/* BACKGROUND GRAPHICS: CINEMATIC GLOWING GRADIENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z--1">
        {/* Ambient Dark Canvas */}
        <div className="absolute inset-0 bg-[#020202]" />

        {/* Purple Glowing Fluid Wave */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-purple/10 blur-[140px] mix-blend-screen"
        />

        {/* Blue/Cyan Flowing Stream */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -25, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[10%] right-[-5%] w-[55vw] h-[55vw] rounded-full bg-brand-cyan/10 blur-[150px] mix-blend-screen"
        />

        {/* Center Futuristic Light Streak */}
        <div className="absolute top-[30%] left-[25%] right-[25%] h-[2px] bg-gradient-to-r from-transparent via-brand-indigo/30 to-transparent blur-[4px]" />
        <div className="absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent blur-[2px]" />

        {/* Delicate grid overlays overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
      </div>

      {/* GLASSMORPHISM NAVBAR */}
      <nav id="navbar" className="sticky top-0 left-0 right-0 h-20 border-b border-transparent bg-transparent z-50 flex items-center justify-between px-6 lg:px-16 transition-all duration-300">

        {/* Left Side: Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('Home', 'home')}>
          {/* Futuristic Kairoven Labs Vector Premium Logo */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Kairoven Labs"
              className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
            /> 
          </div>
          <span className="font-display font-semibold tracking-wider text-white text-lg group-hover:text-brand-cyan transition-colors duration-300">
            KairovenLabs<span className="text-brand-cyan font-light text-sm font-mono tracking-widest ml-1 bg-brand-cyan/10 px-1.5 py-0.5 rounded-md">.ai</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-4 bg-white/[0.03] backdrop-blur-lg rounded-full px-5 py-2 border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">

          {/* Menu Item: Home */}
          <button
            onClick={() => handleNavClick('Home', 'home')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'Home' && currentPage === 'home'
              ? 'text-white bg-white/[0.08] shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
          >
            Home
          </button>

          {/* Menu Item: About */}
          <button
            onClick={() => handleNavClick('About', 'about')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'About' && currentPage === 'home'
              ? 'text-white bg-white/[0.08] shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
          >
            About
          </button>

          {/* Menu Item: Innovation Hub Dropdown with Down Arrow */}
          <div
            ref={featuresRef}
            className="relative"
            onMouseEnter={() => setFeaturesDropdownOpen(true)}
            onMouseLeave={() => setFeaturesDropdownOpen(false)}
          >
            <button
              onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 outline-none cursor-pointer ${(activeTab === 'Innovation Hub' || currentPage === 'student-hub' || currentPage === 'industry-connect' || currentPage === 'events' || currentPage === 'innovation-programs')
                ? 'text-white bg-white/[0.08] shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
            >
              <span>Innovation Hub</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-gray-500 ${(featuresDropdownOpen || currentPage === 'student-hub' || currentPage === 'industry-connect' || currentPage === 'events' || currentPage === 'innovation-programs') ? 'rotate-180 text-brand-cyan' : ''}`} />
            </button>

            <AnimatePresence>
              {featuresDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-56 bg-[#060608]/96 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.7),0_0_15px_rgba(139,92,246,0.1)] z-50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/10 via-transparent to-brand-purple/15 pointer-events-none opacity-40 animate-pulse" />
                  <div className="relative z-10 flex flex-col gap-1">
                    {[
                      { name: 'Student Hub', id: 'student-hub', desc: 'Collaborative student workspace' },
                      { name: 'Events & Workshops', id: 'events', desc: 'Industry-focused hackfests' },
                      { name: 'Industry Connect', id: 'industry-connect', desc: 'Academic & industry pathways' },
                      { name: 'Innovation Programs', id: 'innovation-programs', desc: 'Structured research & incubation' }
                    ].map((feature) => (
                      <button
                        key={feature.name}
                        onClick={() => handleNavClick('Innovation Hub', feature.id)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group flex flex-col gap-0.5 border border-transparent hover:border-white/5 active:bg-white/5 cursor-pointer"
                      >
                        <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center justify-between">
                          <span>{feature.name}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        </span>
                        <span className="text-[10px] text-gray-500 group-hover:text-gray-400 font-mono tracking-tight transition-colors">{feature.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Item: Services Dropdown with Down Arrow */}
          <div
            ref={productsRef}
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <button
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 outline-none cursor-pointer ${activeTab === 'Services' && currentPage === 'home'
                ? 'text-white bg-white/[0.08] shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
            >
              <span>Services</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-gray-500 ${productsDropdownOpen ? 'rotate-180 text-brand-purple' : ''}`} />
            </button>

            <AnimatePresence>
              {productsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-72 bg-[#060608]/96 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-[0_10px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(34,211,238,0.1)] z-50 overflow-hidden animate-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-transparent to-brand-cyan/15 pointer-events-none opacity-40" />
                  <div className="relative z-10 grid grid-cols-1 gap-1">
                    {[
                      { name: 'AI Automation Workflows', idx: 0, icon: Cpu },
                      { name: 'Agentic AI Systems', idx: 1, icon: Terminal },
                      { name: 'AI Chatbots', idx: 2, icon: MessageSquare },
                      { name: 'Website Development', idx: 3, icon: Laptop },
                      { name: 'SaaS Development', idx: 4, icon: Shield },
                      { name: 'Custom AI Solutions', idx: 5, icon: Sparkles }
                    ].map((prod) => {
                      const Icon = prod.icon;
                      return (
                        <button
                          key={prod.name}
                          onClick={() => handleProductSelectByServiceIndex(prod.idx)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group flex items-center gap-3 border border-transparent hover:border-white/5 active:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center justify-center p-2 rounded-lg bg-white/[0.02] group-hover:bg-brand-purple/15 border border-white/5 group-hover:border-brand-purple/30 text-gray-400 group-hover:text-brand-purple transition-all shadow-[0_0_15px_rgba(139,92,246,0)] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                              {prod.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Item: Our Team */}
          <button
            onClick={() => handleNavClick('Our Team', 'team')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'Our Team' && currentPage === 'home'
              ? 'text-white bg-white/[0.08] shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
          >
            Our Team
          </button>

          {/* Menu Item: Blogs */}
          <button
            onClick={() => handleNavClick('Blogs', 'blogs')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'Blogs' && currentPage === 'home'
              ? 'text-white bg-white/[0.08] shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
          >
            Blogs
          </button>

          {/* Menu Item: Contact */}
          <button
            onClick={() => handleNavClick('Contact', 'contact')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'Contact' && currentPage === 'home'
              ? 'text-white bg-white/[0.08] shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
          >
            Contact
          </button>

        </div>

        {/* Right Side: Get Started actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleNavClick('Contact', 'contact')}
            className="px-5 py-2 rounded-full text-xs font-semibold text-white tracking-wide border border-white/10 hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all duration-300 cursor-pointer text-center relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-indigo/10 to-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            Get Started
          </button>
        </div>

        {/* Mobile menu hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Responsive Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-[#040404]/96 border-b border-white/15 p-6 flex flex-col gap-4 z-40 backdrop-blur-3xl md:hidden overflow-y-auto max-h-[calc(100vh-80px)]"
            >
              <div className="flex flex-col gap-1">
                {/* Home */}
                <button
                  onClick={() => handleNavClick('Home', 'home')}
                  className={`w-full py-3 px-4 rounded-lg text-left text-sm font-medium transition-all ${activeTab === 'Home' && currentPage === 'home'
                    ? 'bg-white/10 text-brand-cyan border-l-2 border-brand-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Home
                </button>

                {/* About mobile option */}
                <button
                  onClick={() => handleNavClick('About', 'about')}
                  className={`w-full py-3 px-4 rounded-lg text-left text-sm font-medium transition-all border-t border-white/5 mt-2 ${activeTab === 'About' && currentPage === 'home'
                    ? 'bg-white/10 text-brand-cyan border-l-2 border-brand-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  About
                </button>

                {/* Innovation Hub Accordian section */}
                <div className="flex flex-col">
                  <div className="w-full py-2 px-4 flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-widest border-t border-white/5 mt-2">
                    <span>Innovation Hub</span>
                  </div>
                  {[
                    { name: 'Student Hub', id: 'student-hub' },
                    { name: 'Events & Workshops', id: 'events' },
                    { name: 'Industry Connect', id: 'industry-connect' },
                    { name: 'Innovation Programs', id: 'innovation-programs' }
                  ].map((feat) => (
                    <button
                      key={feat.name}
                      onClick={() => handleNavClick('Innovation Hub', feat.id)}
                      className={`w-full py-2.5 pl-8 pr-4 rounded-lg text-left text-xs font-semibold transition-all ${currentPage === feat.id
                        ? 'text-brand-cyan bg-white/5 border-l-2 border-brand-cyan pl-6'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {feat.name}
                    </button>
                  ))}
                </div>

                {/* Services List section */}
                <div className="flex flex-col">
                  <div className="w-full py-2 px-4 flex items-center justify-between text-gray-500 font-mono text-[9px] uppercase tracking-widest border-t border-white/5 mt-2">
                    <span>Services</span>
                  </div>
                  {[
                    { name: 'AI Automation Workflows', idx: 0 },
                    { name: 'Agentic AI Systems', idx: 1 },
                    { name: 'AI Chatbots', idx: 2 },
                    { name: 'Website Development', idx: 3 },
                    { name: 'SaaS Development', idx: 4 },
                    { name: 'Custom AI Solutions', idx: 5 }
                  ].map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => handleProductSelectByServiceIndex(prod.idx)}
                      className="w-full py-2.5 pl-8 pr-4 rounded-lg text-left text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>

                {/* Our Team and Blogs mobile option */}
                <button
                  onClick={() => handleNavClick('Our Team', 'team')}
                  className={`w-full py-3 px-4 rounded-lg text-left text-sm font-medium transition-all border-t border-white/5 mt-2 ${activeTab === 'Our Team' && currentPage === 'home'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Our Team
                </button>

                <button
                  onClick={() => handleNavClick('Blogs', 'blogs')}
                  className={`w-full py-3 px-4 rounded-lg text-left text-sm font-medium transition-all border-t border-white/5 mt-2 ${activeTab === 'Blogs' && currentPage === 'home'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Blogs
                </button>

                {/* Contact mobile option */}
                <button
                  onClick={() => handleNavClick('Contact', 'contact')}
                  className={`w-full py-3 px-4 rounded-lg text-left text-sm font-medium transition-all border-t border-white/5 mt-2 ${activeTab === 'Contact' && currentPage === 'home'
                    ? 'bg-white/10 text-brand-cyan border-l-2 border-brand-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Contact
                </button>
              </div>

              <div className="h-[1px] bg-white/5 my-2" />
              <button
                onClick={() => handleNavClick('Contact', 'contact')}
                className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-semibold text-xs tracking-wider rounded-lg text-center shadow-lg shadow-white/5"
              >
                GET STARTED
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* FLOATING NOTICE TOAST FOR OUR TEAM / BLOGS VISUAL PREVIEWS */}
      <AnimatePresence>
        {noticeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 max-w-sm bg-black/90 backdrop-blur-2xl border border-white/15 p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_15px_rgba(34,211,238,0.15)] z-[100] flex items-start gap-3"
          >
            <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan font-bold">KairovenLabs.ai Node Network</span>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{noticeToast}</p>
            </div>
            <button
              onClick={() => setNoticeToast(null)}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE HERO SECTION */}
      {currentPage === 'home' && (
        <section id="home" className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 lg:px-16 text-center pt-16 pb-20 overflow-hidden">

          {/* Background video loop spanning the full hero section */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              src="https://res.cloudinary.com/ds2bkzogz/video/upload/v1779879002/mp__1_hymjli.mp4"
              className="w-full h-full object-cover opacity-60 mix-blend-screen select-none pointer-events-none"
            />
          </div>

          {/* Upper Glow Circle behind text layout */}
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-indigo/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-10">

            {/* Small Top Text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-[10px] md:text-xs font-mono tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
              <span>AI-POWERED INNOVATION & DEVELOPMENT PLATFORM</span>
            </motion.div>

            {/* Main Hero Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-3xl"
            >
              Building Intelligent AI Solutions{' '}
              <span className="block mt-1 bg-gradient-to-r from-white via-brand-cyan to-brand-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                for Modern Businesses
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-2xl px-2 mt-2"
            >
              We develop AI automation workflows, Agentic AI systems, AI chatbots, SaaS platforms, and scalable digital solutions designed to accelerate business growth and innovation.
            </motion.p>

            {/* Primary & Secondary Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto"
            >
              {/* Primary Action Button */}
              <button
                id="cta-explore"
                onClick={() => handleNavClick('Services', 'services')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-wider text-black bg-white hover:bg-slate-200 transition-all duration-300 shadow-xl hover:shadow-white/10 active:scale-98 cursor-pointer relative group flex items-center justify-center gap-2"
              >
                Explore Services
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Action Button */}
              <button
                id="cta-student-hub"
                onClick={() => handleNavClick('Innovation Hub', 'student-hub')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-wider text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-brand-purple/50 transition-all duration-300 shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
              >
                Join Student Hub
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform group-hover:text-white" />
              </button>
            </motion.div>

            {/* Bottom Small Text: Watch Demo */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={() => setDemoModalOpen(true)}
              className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-gray-300 hover:text-brand-cyan uppercase transition-all mt-10 p-2 cursor-pointer outline-none focus:outline-none"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white shadow-inner group-hover:scale-110 transition-transform">
                <Play className="w-2.5 h-2.5 text-brand-cyan fill-brand-cyan ml-0.5" />
              </span>
              Watch Platform Demo
            </motion.button>

          </div>

          {/* Floating Tags Section situated gracefully below the buttons */}
          <div className="w-full max-w-4xl mx-auto mt-20 relative z-10">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <span className="relative z-10 px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-[#555] bg-[#020202]">Core Ecosystem Focus</span>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 mt-8 px-4">
              {[
                { text: 'AI Automation', icon: Cpu, glow: 'hover:border-brand-cyan/40 hover:text-brand-cyan' },
                { text: 'Agentic AI', icon: Terminal, glow: 'hover:border-brand-purple/40 hover:text-brand-purple' },
                { text: 'AI Chatbots', icon: MessageSquare, glow: 'hover:border-brand-indigo/40 hover:text-brand-indigo' },
                { text: 'Web Development', icon: Laptop, glow: 'hover:border-brand-cyan/40 hover:text-brand-cyan' },
                { text: 'SaaS Solutions', icon: Shield, glow: 'hover:border-brand-purple/40 hover:text-brand-purple' },
                { text: 'Hackathon Support', icon: Trophy, glow: 'hover:border-brand-indigo/40 hover:text-brand-indigo' }
              ].map((tag, i) => (
                <motion.div
                  key={tag.text}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (i * 0.08) }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`py-3 px-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-gray-400 text-xs font-medium tracking-wide flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${tag.glow}`}
                >
                  <tag.icon className="w-4 h-4 opacity-70" />
                  <span>{tag.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BRAND NEW DEDICATED ABOUT SECTION AT THE CORNERSTONE OF THE HOME SCREEN */}
      {currentPage === 'home' && (
        <section id="about" className="relative py-28 px-6 lg:px-16 bg-[#020202] border-t border-white/5 overflow-hidden">
          <FuturisticBackground primaryColor="brand-indigo" secondaryColor="brand-purple" />

          <div className="max-w-7xl mx-auto relative z-10">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left Side: About Company Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 flex flex-col gap-6"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-indigo/30 bg-brand-indigo/5 text-brand-indigo text-[10px] font-mono tracking-widest uppercase self-start">
                  <Sparkles className="w-3 h-3 text-brand-indigo animate-pulse" />
                  <span>MEET KAIROVENLABS.AI</span>
                </div>

                <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                  Bridging Business Intelligence With Technical Talent
                </h2>

                <p className="text-gray-450 text-sm md:text-base leading-relaxed">
                  Kairoven Labs is an AI automation and technology solutions company dedicated to helping businesses build intelligent, scalable, and production-ready digital systems. We specialize in AI automation, agentic AI solutions, SaaS platforms, web applications, and custom software engineered to solve real-world challenges and accelerate growth.
                </p>

                <p className="text-gray-450 text-sm md:text-base leading-relaxed">
                  Beyond technology, we are committed to empowering the next generation of innovators. Through mentorship, industry-driven events, collaborative programs, and community initiatives, we bridge the gap between academia and industry, creating an ecosystem where businesses thrive and future builders gain the opportunities, skills, and exposure needed to shape tomorrow.
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">KairovenLabs Node: v1.4</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse animate-duration-1000" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Secure Cognitive Host</span>
                </div>
              </motion.div>

              {/* Right Side: Vision and Mission Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Vision Card */}
                <motion.div
                  initial={{ opacity: 0, y: 45 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="group relative bg-[#040404] border border-white/5 rounded-2xl p-8 hover:border-brand-purple/20 transition-colors flex flex-col justify-between min-h-[320px] overflow-hidden"
                >
                  {/* Glowing glow effect on card */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-brand-purple/40 transition-all duration-300">
                      <Trophy className="w-5 h-5 text-brand-purple" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-xl tracking-wide mb-4">
                      Our Vision
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      To create a future where intelligent technology, innovation, and engineering talent work together to solve real-world challenges and unlock opportunities for businesses and builders worldwide
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Strategic Focus</span>
                    <span className="text-xs font-mono text-brand-purple">Global Scalability</span>
                  </div>
                </motion.div>

                {/* Mission Card */}
                <motion.div
                  initial={{ opacity: 0, y: 45 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="group relative bg-[#040404] border border-white/5 rounded-2xl p-8 hover:border-brand-cyan/20 transition-colors flex flex-col justify-between min-h-[320px] overflow-hidden"
                >
                  {/* Glowing glow effect on card */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#22d3ee]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-brand-cyan/40 transition-all duration-300">
                      <Cpu className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-xl tracking-wide mb-4">
                      Our Mission
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      To build production-ready AI solutions, automation systems, SaaS platforms, and digital experiences that help organizations grow, while fostering the next generation of innovators through mentorship, collaboration, and industry-driven opportunities.
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Operational Target</span>
                    <span className="text-xs font-mono text-brand-cyan">Cognitive Delivery</span>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* CORE SERVICES SECTION */}
      {currentPage === 'home' && (
        <section id="services" className="relative py-28 px-6 lg:px-16 bg-[#030303] border-t border-white/5 overflow-hidden">
          <FuturisticBackground primaryColor="brand-cyan" secondaryColor="brand-indigo" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <span className="text-xs font-mono text-brand-cyan tracking-widest uppercase block mb-3">Enterprise Capabilites</span>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
                  Our AI Engineering & Support Services
                </h2>
              </div>
              <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                We engineer specialized digital infrastructure. From custom LLM automation chains to high-speed startup web tools, our workflows convert manual time back to capital focus.
              </p>
            </div>

            {/* Grid of 6 services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.map((service, idx) => (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedService(service)}
                  className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[280px]"
                >
                  {/* Glowing border effects on hover */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-brand-cyan/40 transition-all duration-300">
                      {renderIcon(service.iconName, "w-5 h-5 text-brand-cyan group-hover:text-white transition-colors")}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white tracking-wide mb-3 group-hover:text-brand-cyan transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan tracking-widest uppercase">
                    <span>Explore Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DEDICATED FEATURE PAGES CONDITIONAL RENDERING */}
      {currentPage === 'student-hub' && (
        <StudentHubPage
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          isGeneratingArchitecture={isGeneratingArchitecture}
          generationOutput={generationOutput}
          generateArchitecture={generateArchitecture}
          onNavigateHome={(sectionId) => handleNavClick('Home', sectionId)}
        />
      )}
      {currentPage === 'industry-connect' && (
        <IndustryConnectPage
          onNavigateHome={(sectionId) => handleNavClick('Home', sectionId)}
        />
      )}
      {currentPage === 'innovation-programs' && (
        <InnovationProgramsPage
          onNavigateHome={(sectionId) => handleNavClick('Home', sectionId)}
        />
      )}
      {currentPage === 'events' && (
        <EventsPage
          registeredEvents={registeredEvents}
          registerForEvent={registerForEvent}
          onNavigateHome={(sectionId) => handleNavClick('Home', sectionId)}
        />
      )}
      {currentPage === 'admin-leads' && (
        <AdminLeadsPage
          onNavigateHome={(sectionId) => handleNavClick('Home', sectionId)}
        />
      )}

      {/* PORTFOLIO ABOUT & VALUES SECTION */}
      {currentPage === 'home' && (
        <section id="values" className="relative py-28 px-6 lg:px-16 bg-[#030303] border-t border-white/5 overflow-hidden">
          <FuturisticBackground primaryColor="brand-indigo" secondaryColor="brand-cyan" intensity="low" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-mono text-brand-cyan tracking-widest uppercase block mb-3">About Core Ecosystem</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
                A Future-First Mindset
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4">
                We operate at the high-velocity interface. We design production-grade autonomous automation assets for scaling business houses, and sponsor structural mentorship structures for young student minds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                {
                  title: 'Cognitive Velocity',
                  desc: 'Deploy Agentic AI systems capable of executing weeks of routine workflows in real minutes with multi-LLM networks.',
                  indicator: '98% automation rate',
                  bdr: 'border-brand-purple/15 hover:border-brand-purple/40'
                },
                {
                  title: 'Secure Guardrails',
                  desc: 'Every project layout contains isolated secure sandboxing, certified Firebase permission structures and encrypted parameters.',
                  indicator: 'SOC2 compliant blueprint',
                  bdr: 'border-brand-cyan/15 hover:border-brand-cyan/40'
                },
                {
                  title: 'Student Uplift Strategy',
                  desc: 'We feed 40% of open-source profit pools directly into sponsoring student AI Hackathons and real equipment gear sets.',
                  indicator: '+15 students trained',
                  bdr: 'border-brand-indigo/15 hover:border-brand-indigo/40'
                }
              ].map((value, idx) => (
                <div
                  key={idx}
                  className={`p-8 bg-[#020202] border rounded-2xl flex flex-col justify-between min-h-[250px] transition-all duration-300 ${value.bdr}`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-gray-300 flex items-center justify-center mx-auto mb-5">
                      0{idx + 1}
                    </div>
                    <h3 className="font-display font-semibold text-white text-lg tracking-wide mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                      {value.desc}
                    </p>
                  </div>
                  <div className="font-mono text-[10px] uppercase text-brand-cyan tracking-widest bg-white/[0.01] py-1.5 px-3 rounded-full border border-white/5 select-none inline-block self-center">
                    {value.indicator}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OUR TEAM SECTION */}
      {currentPage === 'home' && (
        <section id="team" className="relative py-28 px-6 lg:px-16 bg-[#020202] border-t border-white/5 overflow-hidden">
          <FuturisticBackground primaryColor="brand-purple" secondaryColor="brand-cyan" />

          {/* Subtle light blobs behind cards */}
          <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/5 text-brand-purple text-[10px] font-mono tracking-widest uppercase mb-4"
              >
                <Users className="w-3.5 h-3.5 text-brand-purple animate-pulse" />
                <span>MEET OUR EXPERTS</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
              >
                Meet the Team Behind the Innovation
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-2xl"
              >
                A passionate team building AI-powered solutions, automation systems, and innovation ecosystems for businesses and engineering students.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-24 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-purple rounded-full mt-6"
              />
            </div>

            {/* Top Row: Founders / Leadership with larger highlight cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              {[
                {
                  name: "Syed Farhaan",
                  role: "Founder & CEO",
                  desc: "Leading AI innovation and building scalable futuristic solutions.",
                  image: "/team/farhan.jpeg",
                  linkedin: "https://www.linkedin.com/in/syed-farhaan-245739259/",
                  github: "https://github.com/syedfarhaan-dev",
                  email: "farhaansyed34@gmail.com",
                  glowColor: "from-brand-purple/20 via-brand-indigo/10 to-transparent",
                  accentGlow: "rgba(168, 85, 247, 0.45)",
                  borderColor: "border-brand-purple/20 group-hover:border-brand-purple/50",
                  tagColor: "bg-brand-purple/10 border-brand-purple/25 text-brand-purple",
                  label: "FOUNDER"
                },
                {
                  name: "Boini Vamshi",
                  role: "Co-Founder & COO",
                  desc: "Managing operations and driving strategic execution.",
                  image: "/team/vamshi.jpeg",
                  linkedin: "https://www.linkedin.com/in/vamshi-boini-a9b4b0215/",
                  github: "https://github.com/vamshi-boini",
                  email: "boini.vamshi01@gmail.com ",
                  glowColor: "from-brand-cyan/20 via-brand-indigo/10 to-transparent",
                  accentGlow: "rgba(34, 211, 238, 0.45)",
                  borderColor: "border-brand-cyan/20 group-hover:border-brand-cyan/50",
                  tagColor: "bg-brand-cyan/10 border-brand-cyan/25 text-brand-cyan",
                  label: "CO-FOUNDER"
                },
                {
                  name:"Shamanth M",
                  role:"CTO",
                  desc:"Leading AI innovation and building scalable futuristic solutions.",
                  image:"/team/shamanth.png",
                  linkedin:"https://www.linkedin.com/in/shamanth-m-05537b264/",
                  github:"https://github.com/Shamanthking",
                  email:"shamanth2626@gmail.com",
                  glowColor:"from-brand-purple/20 via-brand-indigo/10 to-transparent",
                  accentGlow:"rgba(168, 85, 247, 0.45)",
                  borderColor:"border-brand-purple/20 group-hover:border-brand-purple/50",
                  tagColor:"bg-brand-purple/10 border-brand-purple/25 text-brand-purple",
                  label:"CO-FOUNDER"
                }
              ].map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.15,
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 2.5
                    }
                  }}
                  className="group relative bg-[#040404]/80 border rounded-2xl p-8 md:p-10 backdrop-blur-md overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.08)] flex flex-col justify-between"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Subtle vector background overlay in cards */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

                  {/* Top line glowing aura */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Outer gradient background glow */}
                  <div className={`absolute -right-20 -top-20 w-44 h-44 rounded-full bg-gradient-to-br ${member.glowColor} blur-[60px] opacity-40 group-hover:opacity-70 transition-all duration-500`} />

                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
                    {/* Larger profile picture with rotating soft aura border & glow */}
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-brand-cyan via-brand-indigo to-brand-purple opacity-40 blur-[4px] group-hover:opacity-100 group-hover:blur-[8px] transition-all duration-500" />
                      <div className="absolute inset-0 rounded-full bg-[#020202] z-0" />
                      <img
                        src={member.image}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover relative z-10 border border-white/10 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="text-center sm:text-left flex flex-col gap-2">
                      <span className={`self-center sm:self-start text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md border ${member.tagColor}`}>
                        {member.label}
                      </span>
                      <h3 className="font-display font-bold text-xl md:text-2xl text-white tracking-wide group-hover:text-brand-cyan transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-brand-cyan/80 text-xs font-mono font-medium tracking-wider uppercase">
                        {member.role}
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs">
                        {member.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 relative z-10">
                    <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase">Secure Node Link</span>
                    <div className="flex items-center gap-3">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-cyan/40 hover:bg-brand-cyan/5 transition-all duration-300 group-hover:scale-105"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all duration-300 group-hover:scale-105"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-indigo/40 hover:bg-brand-indigo/5 transition-all duration-300 group-hover:scale-105"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* Bottom Grid: Remaining Core Team Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Likhitha M",
                  role: "Head of Marketing & Media Relations",
                  desc: "Building brand presence and managing media growth.",
                  image: "/team/likhitha.jpeg",
                  linkedin: "https://www.linkedin.com/in/likhitha-m-06031532b/",
                  github: "https://github.com/likhitham78",
                  email: "likhitham749@gmail.com",
                  glowColor: "from-brand-purple/10 to-transparent",
                  borderColor: "hover:border-brand-purple/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)]",
                  brandHover: "group-hover:text-brand-purple"
                },
                {
                  name: "Naga Teja",
                  role: "Business Strategy Lead",
                  desc: "Designing growth-focused business strategies.",
                  image: "/team/Teja.jpeg",
                  linkedin: "https://www.linkedin.com/in/goli-nagateja-reddy-b35579378/",
                  github: "https://github.com/TejaReddiee07",
                  email: "nagatejareddygoli@gmail.com",
                  glowColor: "from-brand-indigo/10 to-transparent",
                  borderColor: "hover:border-brand-indigo/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]",
                  brandHover: "group-hover:text-brand-indigo"
                },
                {
                  name: "Yashwanth",
                  role: "Growth Strategist",
                  desc: "Driving growth initiatives and expanding community reach.",
                  image: "/team/yashwanth.jpeg",
                  linkedin: "https://www.linkedin.com/in/yashwanth-y-s-2171882ab",
                  github: "https://github.com/yashugowda544-bit",
                  email: "yashugowda544@gmail.com",
                  glowColor: "from-brand-cyan/10 to-transparent",
                  borderColor: "hover:border-brand-cyan/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]",
                  brandHover: "group-hover:text-brand-cyan"
                },
                {
                  name: "Darpan",
                  role: "Partnerships & Tech Strategist",
                  desc: "Building strategic collaborations and technology partnerships.",
                  image: "/team/Darpan.jpeg",
                  linkedin: "https://www.linkedin.com/in/darpan-dhande-7339991b3/",
                  github: "https://github.com/DarpanDhande",
                  email: "Darpanddhande2005@gmail.com",
                  glowColor: "from-brand-purple/10 to-transparent",
                  borderColor: "hover:border-brand-purple/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)]",
                  brandHover: "group-hover:text-brand-purple"
                }
              ].map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`group relative bg-[#040404]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm overflow-hidden flex flex-col justify-between min-h-[360px] transition-all duration-300 ${member.borderColor}`}
                >
                  {/* Corner glowing blur background */}
                  <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br ${member.glowColor} blur-[40px] opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />

                  {/* Subtle scanning horizontal line on hover */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Rounded portrait image with futuristic ring accent */}
                    <div className="relative w-16 h-16 mb-5 shrink-0 mx-auto">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-cyan/40 via-brand-indigo/40 to-brand-purple/40 opacity-0 group-hover:opacity-100 blur-[3px] transition-all duration-500" />
                      <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10 group-hover:border-transparent transition-colors z-0" />
                      <img
                        src={member.image}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-full object-cover relative z-10"
                      />
                    </div>

                    <div className="text-center flex flex-col gap-1.5 mb-4">
                      <h4 className={`font-display font-semibold text-white tracking-wide text-md ${member.brandHover} transition-colors duration-300`}>
                        {member.name}
                      </h4>
                      <p className="text-brand-cyan/70 text-[10px] font-mono tracking-widest uppercase">
                        {member.role}
                      </p>
                      <p className="text-gray-400 text-xs leading-relaxed mt-2 line-clamp-3">
                        {member.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    {/* Social links row */}
                    <div className="h-[1px] bg-white/5 w-full my-4" />
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7.5 h-7.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-cyan/40 hover:bg-brand-cyan/5 transition-all duration-300"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7.5 h-7.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all duration-300"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="w-7.5 h-7.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-indigo/40 hover:bg-brand-indigo/5 transition-all duration-300"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* BLOGS SECTION */}
      {currentPage === 'home' && (
        <section id="blogs" className="relative py-28 px-6 lg:px-16 bg-[#030303] border-t border-white/5 overflow-hidden">
          <FuturisticBackground primaryColor="brand-cyan" secondaryColor="brand-purple" />

          {/* Subtle light blobs behind blog cards */}
          <div className="absolute top-[30%] right-[15%] w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-[10px] font-mono tracking-widest uppercase mb-4"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                <span>WEEKLY INTELLIGENCE FEEDS</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
              >
                Latest Insights & Innovations
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-2xl"
              >
                Exploring AI, automation, startups, engineering innovation, and the future of technology.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-24 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-purple rounded-full mt-6"
              />
            </div>

            {/* Blogs Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 1,
                  title: "How AI Automation Is Transforming Modern Businesses",
                  category: "AI Automation",
                  desc: "Discover how intelligent automation workflows are helping businesses improve efficiency, productivity, and scalability.",
                  image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600&h=400",
                  date: "May 24, 2026",
                  readTime: "5 min read",
                  author: "Farhaan Syed",
                  glowColor: "from-brand-cyan/20 to-transparent",
                  borderColor: "hover:border-brand-cyan/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.06)]",
                  bgBadge: "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan"
                },
                {
                  id: 2,
                  title: "What Is Agentic AI and Why It Matters",
                  category: "Agentic AI",
                  desc: "Explore the future of autonomous AI systems and how Agentic AI is changing the way digital solutions operate.",
                  image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600&h=400",
                  date: "May 18, 2026",
                  readTime: "7 min read",
                  author: "KairovenLabs.ai Team",
                  glowColor: "from-brand-purple/20 to-transparent",
                  borderColor: "hover:border-brand-purple/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.06)]",
                  bgBadge: "bg-brand-purple/10 border-brand-purple/20 text-brand-purple"
                },
                {
                  id: 3,
                  title: "Top AI Project Ideas for Engineering Students",
                  category: "Student Innovation",
                  desc: "Creative AI and software project ideas to help engineering students build impactful real-world solutions.",
                  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600&h=400",
                  date: "May 12, 2026",
                  readTime: "4 min read",
                  author: "Academic Launchpad",
                  glowColor: "from-brand-indigo/20 to-transparent",
                  borderColor: "hover:border-brand-indigo/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]",
                  bgBadge: "bg-brand-indigo/10 border-brand-indigo/20 text-brand-indigo"
                },
                {
                  id: 4,
                  title: "How Hackathons Build Future Innovators",
                  category: "Hackathons & Community",
                  desc: "Learn how hackathons help students improve collaboration, innovation, technical skills, and startup thinking.",
                  image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600&h=400",
                  date: "May 06, 2026",
                  readTime: "6 min read",
                  author: "Vamshi Boini",
                  glowColor: "from-brand-cyan/20 to-transparent",
                  borderColor: "hover:border-brand-cyan/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.06)]",
                  bgBadge: "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan"
                }
              ].map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`group relative bg-[#040404]/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-[440px] transition-all duration-300 ${blog.borderColor}`}
                >
                  {/* Glowing background highlights */}
                  <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br ${blog.glowColor} blur-[40px] opacity-35 group-hover:opacity-60 transition-opacity duration-500`} />

                  {/* Hover line indicators */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Thumbnail Image */}
                  <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[#020202]/20 z-10 transition-opacity duration-300 group-hover:bg-transparent" />
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md border ${blog.bgBadge} backdrop-blur-md`}>
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 relative z-10 w-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 text-left">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>

                      <h4 className="font-display font-semibold text-white text-md text-left tracking-normal group-hover:text-brand-cyan transition-colors duration-300 leading-snug line-clamp-2">
                        {blog.title}
                      </h4>

                      <p className="text-gray-400 text-xs text-left leading-relaxed line-clamp-3">
                        {blog.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500">BY {blog.author.toUpperCase()}</span>

                      <button
                        onClick={() => setSelectedBlogPost(blog)}
                        className="text-xs font-mono font-semibold tracking-wider text-brand-cyan hover:text-white flex items-center gap-1 transition-all cursor-pointer group/btn"
                      >
                        <span>READ MORE</span>
                        <ChevronRight className="w-3.5 h-3.5 text-brand-cyan group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* CONTACT & CONSULTATION FORM SECTION */}
      {currentPage === 'home' && (
        <section id="contact" className="relative py-28 px-6 lg:px-16 bg-[#040404] border-t border-white/5 overflow-hidden">
          <FuturisticBackground primaryColor="brand-cyan" secondaryColor="brand-indigo" />
          <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-[#030303]/40 to-transparent pointer-events-none z-0" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left information pillar */}
              <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
                <span className="text-xs font-mono text-brand-cyan tracking-widest uppercase block">Initiate Contact</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  Let's Architect Your AI Ecosystem
                </h2>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  Whether you are a startup looking to deploy automated marketing workflows, or an engineering club leader planning your next hackathon, reach out today.
                </p>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <span className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Direct Contact Email</span>
                    <span className="text-xs font-semibold text-brand-cyan font-mono hover:underline cursor-pointer">kairovenlabs@gmail.com</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <span className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Operational Hours</span>
                    <span className="text-xs text-white font-mono">09:00 - 18:00 (UTC +5:30)</span>
                  </div>
                </div>
              </div>

              {/* Right Form Console */}
              <div className="lg:col-span-8 bg-[#020202] border border-white/5 rounded-2xl p-6 md:p-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />

                {contactFormSubmitted ? (
                  <div className="text-center py-12 flex flex-col items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-14 h-14 rounded-full bg-brand-cyan/10 border border-brand-cyan flex items-center justify-center text-brand-cyan mb-2">
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white tracking-wide">Secure Transmission Registered</h3>
                    <p className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                      Your message has been successfully sent. Our team will contact you shortly.
                    </p>
                    <button
                      onClick={() => setContactFormSubmitted(false)}
                      className="mt-6 text-xs text-brand-cyan font-mono uppercase tracking-widest hover:underline cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">

                    {contactErrors.length > 0 && (
                      <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex flex-col gap-1.5 animate-[fadeIn_0.3s_ease-out]">
                        {contactErrors.map((err, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="user-name" className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Name</label>
                        <input
                          id="user-name"
                          type="text"
                          required
                          disabled={contactSubmitting}
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan tracking-wide disabled:opacity-55"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="user-email" className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Email Address</label>
                        <input
                          id="user-email"
                          type="email"
                          required
                          disabled={contactSubmitting}
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan tracking-wide disabled:opacity-55"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="user-service" className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Service Required</label>
                      <div className="relative">
                        <select
                          id="user-service"
                          required
                          disabled={contactSubmitting}
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan tracking-wide appearance-none cursor-pointer pr-10 disabled:opacity-55"
                        >
                          <option value="AI Automation Workflows" className="bg-[#050505] text-white">AI Automation Workflows</option>
                          <option value="Agentic AI Systems" className="bg-[#050505] text-white">Agentic AI Systems</option>
                          <option value="AI Chatbots" className="bg-[#050505] text-white">AI Chatbots</option>
                          <option value="Website Development" className="bg-[#050505] text-white">Website Development</option>
                          <option value="SaaS Development" className="bg-[#050505] text-white">SaaS Development</option>
                          <option value="Custom AI Solutions" className="bg-[#050505] text-white">Custom AI Solutions</option>
                          <option value="Student Hub Collaboration" className="bg-[#050505] text-white">Student Hub Collaboration</option>
                          <option value="Events & Workshops" className="bg-[#050505] text-white">Events & Workshops</option>
                          <option value="Industry Connect" className="bg-[#050505] text-white">Industry Connect</option>
                          <option value="Innovation Programs" className="bg-[#050505] text-white">Innovation Programs</option>
                          <option value="General Inquiry" className="bg-[#050505] text-white">General Inquiry</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="user-msg" className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Project Details</label>
                      <textarea
                        id="user-msg"
                        rows={4}
                        required
                        disabled={contactSubmitting}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Tell us about your project, requirements, goals, challenges, or any specific details you'd like to discuss..."
                        className="bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan tracking-wide resize-none disabled:opacity-55"
                      />
                    </div>

                    {/* TURNSTILE PROTECT CONTAINER */}
                    <div className="flex justify-center my-1 select-none">
                      <div ref={turnstileRef} id="contact-turnstile"></div>
                    </div>

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5 disabled:opacity-50"
                    >
                      <span>{contactSubmitting ? 'Sending Request...' : 'Start the Conversation'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-[9px] font-mono text-gray-500 text-center uppercase tracking-wider">
                      Powered by KairovenLabs.ai security rules / Standard GDPR client encryption keys.
                    </p>
                  </form>
                )}

              </div>

            </div>
          </div>
        </section>
      )}

      {/* COMPLIANT MINIMAL FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-16 bg-[#020202] text-center z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-brand-cyan/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,1)]" />
            </div>
            <span className="font-display font-semibold text-xs tracking-widest text-white">
              KAIROVENLABS.AI SYSTEM
            </span>
          </div>

          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider">
            © 2026 KAIROVENLABS CO. All rights reserved. Built for Businesses & Engineering development.
          </p>

          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('About', 'about')}>Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('Contact', 'contact')}>Terms</span>
            <span>•</span>
            <span className="hover:text-brand-cyan cursor-pointer transition-colors" onClick={() => setCurrentPage('admin-leads')}>Admin Portal</span>
          </div>
        </div>
      </footer>

      {/* STATEFUL MODALS & SLIDE-OVERS */}

      {/* 1. Watch Demo Cinematic Terminal Simulation Modal */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Modal Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setDemoModalOpen(false);
                setTerminalStatus('idle');
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#030303] border border-white/10 rounded-2xl shadow-2xl shadow-brand-cyan/10 overflow-hidden z-10"
            >
              {/* Header bar styled like terminal browser */}
              <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <span className="font-mono text-xs text-gray-400 tracking-wider">KAIROVENLABS AGENT DEMO SANDBOX</span>
                </div>

                <button
                  onClick={() => {
                    setDemoModalOpen(false);
                    setTerminalStatus('idle');
                  }}
                  className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Terminal Video Content Area */}
              <div className="p-6 flex flex-col gap-6">

                {/* Visual simulator state indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-brand-cyan" />
                    <span className="text-xs text-white font-mono uppercase tracking-wider font-semibold">
                      {terminalStatus === 'idle' ? 'Ready to Simulate' : terminalStatus === 'running' ? 'Simulating agent pipeline...' : 'Simulation Success'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    VITE COMPACT CONTAINER RUNTIME
                  </span>
                </div>

                {/* Animated progress bar */}
                <div className="relative h-6 rounded-lg bg-black border border-white/5 overflow-hidden flex items-center justify-between px-3">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-brand-indigo/35 via-brand-cyan/35 to-transparent transition-all duration-300 pointer-events-none"
                    style={{ width: `${terminalProgress}%` }}
                  />
                  <span className="text-[10px] font-mono text-gray-300 relative z-10 font-bold uppercase tracking-widest">
                    Process State Progress
                  </span>
                  <span className="text-[10px] font-mono text-brand-cyan relative z-10 font-bold">
                    {terminalProgress}%
                  </span>
                </div>

                {/* Blinking log entries terminal frame */}
                <div className="bg-black rounded-lg border border-white/5 p-4 font-mono text-[10px] sm:text-[11px] leading-relaxed text-gray-300 min-h-[180px] flex flex-col justify-between overflow-y-auto">

                  {terminalLogs.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {terminalLogs.map((log, index) => (
                        <div key={index} className="flex items-start gap-2">
                          {log && typeof log === 'string' && log.startsWith('✨') ? (
                            <span className="text-brand-cyan">{log}</span>
                          ) : log && typeof log === 'string' && log.startsWith('⚡') ? (
                            <span className="text-brand-purple">{log}</span>
                          ) : (
                            <span>{log || ''}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6 text-gray-500">
                      <Play className="w-8 h-8 opacity-30 text-brand-cyan mb-2" />
                      <p>Press the trigger button below to command the KairovenLabs orchestration sandbox & observe compiler chains live.</p>
                    </div>
                  )}

                  {terminalStatus === 'running' && (
                    <div className="flex items-center gap-1.5 self-start text-brand-cyan mt-3 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                      <span>Processing telemetry packets...</span>
                    </div>
                  )}
                </div>

                {/* Trigger controls */}
                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    onClick={() => {
                      setDemoModalOpen(false);
                      setTerminalStatus('idle');
                    }}
                    className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startDemoTerminal}
                    disabled={terminalStatus === 'running'}
                    className="px-6 py-2.5 bg-brand-cyan text-black hover:bg-brand-cyan/80 disabled:opacity-50 text-xs font-semibold tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-brand-cyan/15"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    {terminalStatus === 'idle' ? 'START AUTOMATED DEMO' : terminalStatus === 'running' ? 'COMPILING RUNTIME...' : 'SIMULATE AGAIN'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Detailed Service Blueprint Slide-Over Drawer */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex justify-end">

            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide over Drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-[#030303] border-l border-white/10 h-full shadow-2xl overflow-y-auto flex flex-col justify-between z-10"
            >
              <div>

                {/* Header inside drawer */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999]">BLUEPRINT ACCESS ENGINE</span>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Core descriptive details */}
                <div className="p-8 flex flex-col gap-6">

                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {renderIcon(selectedService.iconName, "w-6 h-6 text-brand-cyan")}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-2">
                      {selectedService.title}
                    </h3>
                    <span className="text-[10px] font-mono text-brand-cyan tracking-widest uppercase bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/25">
                      Operational Workflow Pack
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed border-b border-white/5 pb-6">
                    {selectedService.description}
                  </p>

                  {/* Blueprint Features list */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Core Features & Architecture Included</span>
                    <div className="flex flex-col gap-2.5">
                      {selectedService.features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                          <span className="text-brand-cyan">
                            <Check className="w-4 h-4" />
                          </span>
                          <span className="text-gray-200 text-xs md:text-sm font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sandbox status memo */}
                  <div className="mt-4 p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/15 text-gray-300 text-xs leading-relaxed flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Automated Template Deployment</strong>
                      <span>All patterns are integrated directly with KairovenLabs SDK. When custom solutions deploy, rules are published safely to secure clusters automatically.</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action actions inside drawer footer */}
              <div className="p-6 border-t border-white/5 bg-black/60 flex items-center justify-end gap-3.5">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    handleNavClick('Contact', 'contact');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-semibold tracking-wider hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  REQUEST BLUEPRINT SETUP
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Detailed Blog Article Slide-Over Drawer */}
      <AnimatePresence>
        {selectedBlogPost && (
          <div className="fixed inset-0 z-50 flex justify-end">

            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlogPost(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Slide over Drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 26, stiffness: 180 }}
              className="relative w-full max-w-2xl bg-[#030303] border-l border-white/10 h-full shadow-2xl overflow-y-auto flex flex-col justify-between z-10"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black sticky top-0 z-20 backdrop-blur-md bg-black/95">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cyan">KAIROVENLABS INSIGHTS ENGINE - V1.4</span>
                  </div>
                  <button
                    onClick={() => setSelectedBlogPost(null)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Hero Banner image inside article view */}
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/30 to-transparent z-10" />
                  <img
                    src={selectedBlogPost.image}
                    alt={selectedBlogPost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-8 right-8 z-25">
                    <span className="inline-block text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md border bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan mb-3">
                      {selectedBlogPost.category}
                    </span>
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight drop-shadow leading-tight text-left">
                      {selectedBlogPost.title}
                    </h3>
                  </div>
                </div>

                {/* Core content text container */}
                <div className="p-8 md:p-10 flex flex-col gap-6">

                  {/* Meta stats banner */}
                  <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-white/5 text-xs text-gray-400 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-[10px]">
                        {selectedBlogPost.author[0]}
                      </div>
                      <span className="text-left">Author: <strong className="text-white">{selectedBlogPost.author}</strong></span>
                    </div>
                    <div>
                      <span>Date: <strong className="text-white">{selectedBlogPost.date}</strong></span>
                    </div>
                    <div>
                      <span>Reading Time: <strong className="text-brand-cyan">{selectedBlogPost.readTime}</strong></span>
                    </div>
                  </div>

                  {/* Body textual content parsed beautifully with custom styling */}
                  <div className="prose prose-invert text-gray-300 text-sm md:text-base leading-relaxed flex flex-col gap-5 pt-2 text-left">
                    {selectedBlogPost.id === 1 && (
                      <>
                        <h4 className="text-white font-sans font-bold text-lg leading-snug mt-2 text-left">
                          Industry Shifts and Autonomous Workflows
                        </h4>
                        <p className="text-left">
                          In the current hyper-competitive business ecosystem, the integration of artificial intelligence into daily operational pipelines has shifted from a luxury to an existential necessity. Standard rule-based legacy automations are being actively replaced by smart cognitive workflows capable of decision-making, adaptive reasoning, and deep natural language understanding.
                        </p>

                        <div className="p-5 my-3 rounded-2xl bg-[#010101] border border-white/5 relative overflow-hidden">
                          <div className="absolute top-0 right-10 w-[80px] h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />
                          <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 text-left">Core Areas of Cognitive Transformation:</h5>
                          <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-400 font-sans text-left">
                            <li><strong>Intelligent Document Processing (IDP):</strong> Reading unstructured agreements, financial ledger sheets, and user telemetry in fractions of a second.</li>
                            <li><strong>Customer Support Core Nodes:</strong> Offloading standard incoming email queries to contextual system-agent loops, saving team bandwidth.</li>
                            <li><strong>Automated Content Orchestration:</strong> Autonomously parsing product logs to compile market insights, brand newsletters, and performance metrics.</li>
                          </ul>
                        </div>

                        <h4 className="text-white font-sans font-bold text-lg leading-snug mt-2 text-left">
                          Implementing inside KairovenLabs Sandbox
                        </h4>
                        <p className="text-left">
                          By leveraging low-latency, resilient LLM endpoints and highly performant database brokers, KairovenLabs has deployed several pre-configured sandbox modules. These allow students and technical managers to test cognitive automation workflows in safe, sandbox environments.
                        </p>
                        <p className="text-left">
                          This dramatic reduction in setup friction and code complexity enables creators to bypass tedious infrastructure plumbing, shifting developer energy directly to business-logic generation and deployment refinement.
                        </p>
                      </>
                    )}

                    {selectedBlogPost.id === 2 && (
                      <>
                        <h4 className="text-white font-sans font-bold text-lg leading-snug mt-2 text-left">
                          Defining the Next Paradigm of Agency
                        </h4>
                        <p className="text-left">
                          Traditional machine learning algorithms are reactive systems. You provide an input vector; they produce an output value. Even standard conversational LLMs operate under a turn-by-turn reactive loop. <strong>Agentic AI</strong> dismantles this threshold, introducing autonomous system-level action.
                        </p>

                        <div className="p-5 my-3 rounded-2xl bg-[#010101] border border-white/5">
                          <h5 className="text-xs font-mono font-bold text-brand-purple uppercase tracking-wider mb-2.5 text-left">Why Agency Matters:</h5>
                          <p className="text-xs text-gray-400 mb-3 text-left">
                            Instead of waiting for custom user typing, an active AI Agent operates semi-autonomously using high-level objectives:
                          </p>
                          <ul className="space-y-2 text-xs text-gray-400 text-left">
                            <li className="flex gap-2"><span className="text-brand-purple font-mono">01.</span><div><strong>Reasoning Loops (ReAct):</strong> The agent observes current systems state, formulates an internal plan of steps, executes, observes results, and reflects.</div></li>
                            <li className="flex gap-2"><span className="text-brand-purple font-mono">02.</span><div><strong>Tool Retrieval & Execution:</strong> Agents autonomously trigger API request headers, run server-side sandboxed calculation scripts, and query database clusters.</div></li>
                            <li className="flex gap-2"><span className="text-brand-purple font-mono">03.</span><div><strong>Goal-Directed Persistent Execution:</strong> The engine spins in background check loops, persisting work until criteria are met.</div></li>
                          </ul>
                        </div>

                        <h4 className="text-white font-sans font-bold text-lg leading-snug mt-2 text-left">
                          The KairovenLabs Alignment Platform
                        </h4>
                        <p className="text-left">
                          Within the next 18 months, agentic clusters will handle over 40% of standard logistic schedules, continuous software compilation cycles, and system alerts optimization. Preparing developers for this reality is the exact motivation for our KairovenLabs Cognitive Sandbox playgrounds.
                        </p>
                      </>
                    )}

                    {selectedBlogPost.id === 3 && (
                      <>
                        <h4 className="text-white font-sans font-bold text-lg leading-snug mt-2 text-left">
                          Shifting from Consumer to Architect
                        </h4>
                        <p className="text-left">
                          Building a duplicate "Todo list" or a boilerplate "ChatGPT API wrapper" is no longer enough to catch the attention of top-tier engineering recruiters in 2026. Companies are looking for developers who can integrate custom schema rules, connect scalable databases, and deploy performant servers.
                        </p>

                        <div className="p-5 my-3 rounded-2xl bg-[#010101] border border-white/5 space-y-3 text-left">
                          <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider text-left">3 Resume-Defining System Blueprints:</h5>

                          <div className="border-b border-white/5 pb-2">
                            <span className="text-xs font-semibold text-brand-cyan">1. The Autonomous Security Auditor</span>
                            <p className="text-xs text-gray-400 mt-1">An artificial agent that scans project repositories to map imports, highlights circular dependency chains, and drafts defensive typescript integration rulesets.</p>
                          </div>

                          <div className="border-b border-white/5 pb-2">
                            <span className="text-xs font-semibold text-brand-purple">2. Dynamic Sandbox Schema Compiler</span>
                            <p className="text-xs text-gray-400 mt-1">An interactive simulator that accepts a natural-language prompt describing business entities and compiles fully persistent Firestore schema files and security rulesets inside a visual debugger.</p>
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-brand-indigo">3. Real-time Maps Dispatch Coordinator</span>
                            <p className="text-xs text-gray-400 mt-1">A lightweight dashboard incorporating Map APIs that tracks simulated worker coordinates, computes optimal geographic vectors, and relays live state telemetry.</p>
                          </div>
                        </div>

                        <p className="text-left">
                          Bringing these functional solutions to life on KairovenLabs Academic Sandboxes offers students the opportunity to practice full-stack architecture design, preparing them directly for industry challenges.
                        </p>
                      </>
                    )}

                    {selectedBlogPost.id === 4 && (
                      <>
                        <h4 className="text-white font-sans font-bold text-lg leading-snug mt-2 text-left">
                          Pressure Cookers for High-Growth Talents
                        </h4>
                        <p className="text-left">
                          There is a distinct magic in restricted, high-pressure environments. A hackathon is not simply about writing syntax; it is an active simulator of the startup build phase, demanding fast choices, smart triage, and persuasive product presentations.
                        </p>

                        <div className="p-5 my-3 rounded-2xl bg-[#010101] border border-white/5 relative overflow-hidden">
                          <div className="absolute top-0 right-10 w-[80px] h-[1px] bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
                          <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 text-left">Key Hackathon Learning Catalysts:</h5>
                          <ul className="list-disc pl-4 space-y-2 text-xs text-gray-400 font-sans text-left">
                            <li><strong>Architectural Pruning:</strong> Teams quickly learn they can't build everything. They must identify the core high-value user flow and polish it aggressively.</li>
                            <li><strong>Interdisciplinary Alignment:</strong> Bringing designers, marketers, and technical coders into structural alignment teaches students how industries actually interact.</li>
                            <li><strong>Overcoming Technical Blocks:</strong> Solving a stuck compiler, a missing API variable, or a configuration crisis under the ticking countdown clock builds mental grit.</li>
                          </ul>
                        </div>

                        <p className="text-left">
                          At KairovenLabs, our hackathons are designed as highly structured launchpads with live judging from active founders, industry sponsors, and tech guides.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Footer message indicator */}
                  <div className="mt-8 p-4 rounded-xl bg-white/[0.01] border border-white/5 text-gray-400 text-xs text-center font-mono">
                    ✦ THIS INSIGHT BRIEF HAS BEEN ARCHIVED UNDER NODE SECURITY PROTOCOL A-14. ✦
                  </div>

                </div>
              </div>

              {/* Action actions inside drawer footer */}
              <div className="p-6 border-t border-white/5 bg-black/60 flex items-center justify-end gap-3.5 sticky bottom-0 z-20 backdrop-blur-md">
                <button
                  onClick={() => setSelectedBlogPost(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedBlogPost(null);
                    handleNavClick('Contact', 'contact');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-cyan text-black text-xs font-semibold tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  SUBSCRIBE TO SYSTEM UPDATE CHANNELS
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Inline helper component to avoid missing clock icon variables
function ClockComponent() {
  return (
    <svg
      className="w-3.5 h-3.5 inline mr-1 text-gray-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
