export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  filterType: 'Business' | 'Student';
  category: string;
  description: string;
  tags: string[];
  metrics: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

export const servicesData: Service[] = [
  {
    id: 'ai-automation',
    title: 'AI Automation Workflows',
    description: 'Optimize operations with autonomous agents that handle data entry, content pipeline management, and complex API integrations.',
    iconName: 'Cpu',
    features: ['Multi-app integration', 'Self-healing workflows', 'Custom business logic']
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI Systems',
    description: 'Deploy goal-driven LLM applications capable of planning, tool usage, iterative reasoning, and collaborative task execution.',
    iconName: 'Terminal',
    features: ['Autonomous execution', 'Chain-of-thought processing', 'Secure memory stores']
  },
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    description: 'Context-aware multilingual voice and text conversational assistants trained specifically on your company knowledge bases.',
    iconName: 'MessageSquare',
    features: ['RAG technology integration', 'Omnichannel deployment', 'Sentiment analytics']
  },
  {
    id: 'web-development',
    title: 'Web Solutions',
    description: 'Supercharged, search-engine-optimized, lightning-fast React and full-stack web platforms engineered for maximum conversion.',
    iconName: 'Laptop',
    features: ['Next.js & Vite performance', 'Custom visual aesthetics', 'Robust API layers']
  },
  {
    id: 'saas',
    title: 'SaaS Development',
    description: 'Launch scalable, secure, multi-tenant digital platforms with integrated billing systems, dashboards, and role-based permissions.',
    iconName: 'Shield',
    features: ['Stripe billing pre-integrated', 'Multi-tenant auth support', 'Interactive metrics views']
  },
  {
    id: 'student-support',
    title: 'Student Hub & Hackathons',
    description: 'Mentorship, structured project pipelines, hackathon tracks, and resume-worthy real-world development training for engineering students.',
    iconName: 'Trophy',
    features: ['Web3/AI hackathon sponsorships', 'Portfolio project guidance', 'Interactive learning clubs']
  }
];

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Advanced Jarvis AI Assistant',
    filterType: 'Business',
    category: 'AI Assistant / Automation',
    description: 'An advanced browser-based AI assistant capable of voice interaction, task automation, web search, system controls, and intelligent command execution.',
    tags: ['AI Assistant', 'Automation', 'Voice AI', 'Web Integration'],
    metrics: '95% task success rate'
  },
  {
    id: '2',
    title: 'Audio to Indian Sign Language Converter',
    filterType: 'Student',
    category: 'AI / Accessibility',
    description: 'An AI-powered accessibility solution that converts spoken audio into Indian Sign Language representations for inclusive communication.',
    tags: ['Accessibility AI', 'Speech Processing', 'AI Translation', 'Real-Time AI'],
    metrics: '98.2% translation BLEU'
  },
  {
    id: '3',
    title: 'AI Financial Insight Agent',
    filterType: 'Business',
    category: 'Agentic AI / Finance AI',
    description: 'An AI-powered financial assistant delivering personalized financial insights and intelligent recommendations using modern AI agent architecture.',
    tags: ['Agentic AI', 'Financial AI', 'AI Recommendations', 'Automation'],
    metrics: '12x analytics speedup'
  },
  {
    id: '4',
    title: 'Intelligent Agricultural Advisory System',
    filterType: 'Business',
    category: 'AI / Smart Agriculture',
    description: 'An intelligent recommendation platform helping farmers solve soil nutrient imbalance and improve crop selection using AI.',
    tags: ['Smart Agriculture', 'AI Recommendation', 'Data Intelligence', 'AI Solutions'],
    metrics: '94.1% recommendation match'
  },
  {
    id: '5',
    title: 'AI-Powered Threat Detection System',
    filterType: 'Student',
    category: 'Cybersecurity / AI',
    description: 'A machine learning-based malware detection system trained on cybersecurity datasets for intelligent threat prediction.',
    tags: ['Machine Learning', 'Cybersecurity', 'Threat Detection', 'AI Security'],
    metrics: '99.9% detection rate'
  },
  {
    id: '6',
    title: 'A Hybrid Deep Learning Architecture for 3D Object Detection and Ensembling 2D Projection and 3D Voxel Grid',
    filterType: 'Student',
    category: 'Research / Deep Learning / Computer Vision',
    description: 'A published IEEE NQCamp research work proposing a hybrid deep learning architecture that combines 2D projection techniques and 3D voxel grid representations for advanced 3D object detection and intelligent ensembling.',
    tags: ['Deep Learning', 'Computer Vision', '3D Object Detection', 'Voxel Grid', 'IEEE Research', 'Neural Networks'],
    metrics: 'Published IEEE Research'
  }
];

export const eventsData: Event[] = [
  {
    id: 'ev-1',
    title: 'AI Innovation Hackathon',
    date: 'Upcoming',
    type: 'Upcoming',
    description: 'A collaborative hackathon focused on solving real-world problems using AI and automation.'
  },
  {
    id: 'ev-2',
    title: 'AI & SaaS Workshop',
    date: 'Planned',
    type: 'Planned',
    description: 'Hands-on sessions covering AI tools, SaaS development, automation systems, and startup building.'
  },
  {
    id: 'ev-3',
    title: 'Engineering Project Expo',
    date: 'Coming Soon',
    type: 'Coming Soon',
    description: 'A showcase platform for innovative engineering projects, AI systems, and student-built solutions.'
  },
  {
    id: 'ev-4',
    title: 'Community Tech Meetup',
    date: 'Upcoming',
    type: 'Upcoming',
    description: 'An interactive networking and learning event connecting developers, innovators, startups, and engineering students.'
  }
];
