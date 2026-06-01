import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Filter, ArrowUpDown, Download, 
  Trash2, Mail, FileText, Check, LogOut, RefreshCw, 
  Lock, ShieldAlert, TrendingUp, Layers, CheckCircle, 
  Clock, AlertCircle, Calendar, User, CheckSquare, Activity
} from 'lucide-react';

interface AdminLeadsPageProps {
  onNavigateHome: (sectionId: string) => void;
}

interface Lead {
  id: string;
  full_name: string;
  email: string;
  service: string;
  project_details: string;
  status: string;
  ip_address: string;
  source_page: string;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

export function AdminLeadsPage({ onNavigateHome }: AdminLeadsPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Leads list and statistics
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    conversionRate: 0
  });

  // Filters, search, sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Dropdown list for filter selections
  const services = [
    'All',
    'AI Automation Workflows',
    'Agentic AI Systems',
    'AI Chatbots',
    'Website Development',
    'SaaS Development',
    'Custom AI Solutions',
    'Student Hub Collaboration',
    'Events & Workshops',
    'Industry Connect',
    'Innovation Programs',
    'General Inquiry'
  ];

  const statuses = [
    'All',
    'New Lead',
    'Contacted',
    'In Discussion',
    'Proposal Sent',
    'Converted',
    'Closed'
  ];

  const actionStatuses = [
    'New Lead',
    'Contacted',
    'In Discussion',
    'Proposal Sent',
    'Converted',
    'Closed'
  ];

  // Try retrieving credentials on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('kairoven_admin_token');
    const savedUser = localStorage.getItem('kairoven_admin_username');
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setUsername(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch leads and statistics if authenticated
  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchLeads();
      fetchDashboardStats();
    }
  }, [isAuthenticated, authToken, serviceFilter, statusFilter, sortBy]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('kairoven_admin_token', data.token);
        localStorage.setItem('kairoven_admin_username', data.username);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setLoginError(data.error || 'Unauthorized admin portal access.');
      }
    } catch (err) {
      setLoginError('Security connection failure. Please verify backend state.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kairoven_admin_token');
    localStorage.removeItem('kairoven_admin_username');
    setAuthToken('');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (serviceFilter) params.append('service', serviceFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (sortBy) params.append('sort', sortBy);

      const response = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setLeads(data.leads || []);
      } else {
        setErrorMsg(data.error || 'Failed to sync leads registers.');
        if (response.status === 401) handleLogout();
      }
    } catch (err) {
      setErrorMsg('Network synchronization error. Check connection stability.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to resolve database analytics:', err);
    }
  };

  const handleUpdateStatus = async (leadId: string, nextStatus: string) => {
    setIsUpdatingId(leadId);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Optimistic state updates
        setLeads(prevLeads => 
          prevLeads.map(lead => lead.id === leadId ? { ...lead, status: nextStatus, updated_at: new Date().toISOString() } : lead)
        );
        fetchDashboardStats(); // refresh visual charts counters
      } else {
        alert(data.error || 'Action rejected by lead service.');
      }
    } catch (err) {
      alert('Communication failure while updating lead state.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/leads/export', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error('Could not download spreadsheet file.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kairoven_leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to construct lead ledger export spreadsheet.');
    }
  };

  // Human-friendly timestamp conversion
  const formatTimeStr = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  // Get visually distinguishing color tokens for state badges
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'New Lead':
        return 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400';
      case 'Contacted':
        return 'border-blue-500/20 bg-blue-500/5 text-blue-400';
      case 'In Discussion':
        return 'border-purple-500/20 bg-purple-500/5 text-purple-400';
      case 'Proposal Sent':
        return 'border-amber-500/20 bg-amber-500/5 text-amber-400';
      case 'Converted':
        return 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]';
      case 'Closed':
        return 'border-white/10 bg-white/5 text-gray-500';
      default:
        return 'border-white/5 bg-white/5 text-gray-400';
    }
  };

  return (
    <div id="admin-sec" className="relative min-h-[calc(100vh-80px)] bg-[#030303] text-white py-16 px-6 lg:px-16 overflow-hidden">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* TOP COMPONENT: BACK ROUTING HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigateHome('home')}
              className="px-3.5 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 flex items-center gap-1.5 text-xs font-mono uppercase cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </button>
            <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />
            <div>
              <span className="text-[10px] font-mono text-brand-cyan tracking-widest uppercase block">Kairoven Ops Command</span>
              <h1 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Secure Lead Registry
                {isAuthenticated && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />}
              </h1>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500">Node user: <span className="text-gray-300 font-semibold">{username}</span></span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-450 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>

        {/* AUTH GATE */}
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-5 h-5 text-brand-purple" />
                </div>
                
                <h2 className="font-display text-lg font-bold text-white tracking-wide mb-2">Security Authorization Required</h2>
                <p className="text-xs text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
                  Enter authorized administrator credentials below to synchronize connection streams with the local database ledger block.
                </p>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-gray-500">Username</label>
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter administrator ID"
                      className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple tracking-wide"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-gray-500">Access Key / Passcode</label>
                    <input 
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple tracking-wide"
                    />
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 text-rose-450 bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 mt-2 text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full mt-4 py-3.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isLoggingIn ? 'Syncing Authorization...' : 'Authenticate Connection'}
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-8"
            >
              
              {/* LEDGER STATISTICS PANEL */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* ID 1 */}
                <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/2 rounded-full blur-xl" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-3">Total Leads Capture</span>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-display font-light text-white tracking-tight">{stats.totalLeads}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[#999]">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* ID 2 */}
                <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/2 rounded-full blur-xl" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#9c9aa1] block mb-3">New Untouched Leads</span>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-display font-light text-cyan-400 tracking-tight">{stats.newLeads}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-cyan-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* ID 3 */}
                <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/2 rounded-full blur-xl" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-3">Contacted Engagements</span>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-display font-light text-brand-purple tracking-tight">{stats.contactedLeads}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-brand-purple">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* ID 4 */}
                <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-xl" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-3">Converted Clients</span>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-display font-light text-emerald-400 tracking-tight">{stats.convertedLeads}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* ID 5 */}
                <div className="col-span-2 lg:col-span-1 bg-[#050505] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/2 rounded-full blur-xl" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-3">Conversion Efficiency</span>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-display font-light text-white tracking-tight">{stats.conversionRate}%</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-white">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </div>

              {/* SEARCH, SORTING & ACTION PANELS */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-lg">
                
                {/* Search */}
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search query (name, email or summary details...)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-5 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan tracking-wide"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[10px] text-gray-500 hover:text-white cursor-pointer uppercase font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Service Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono uppercase tracking-widest text-gray-500">Filter by Domain</label>
                    <div className="relative">
                      <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-white focus:outline-none decoration-none appearance-none cursor-pointer"
                      >
                        {services.map(opt => (
                          <option key={opt} value={opt} className="bg-[#050505] text-white text-xs">{opt}</option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <Filter className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono uppercase tracking-widest text-gray-500">Filter by Status</label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        {statuses.map(opt => (
                          <option key={opt} value={opt} className="bg-[#050505] text-white text-xs">{opt}</option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <Filter className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Sorting Select */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono uppercase tracking-widest text-gray-500">Sorting Order</label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="newest" className="bg-[#050505] text-white text-xs">Newest Inbound</option>
                        <option value="oldest" className="bg-[#050505] text-white text-xs">Oldest Inbound</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Operational Group */}
                  <div className="flex gap-2 self-end mt-4 xl:mt-0 xl:self-auto">
                    <button
                      onClick={fetchLeads}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center justify-center translate-y-[2px]"
                      title="Sync Dashboard Table"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs transition-transform tracking-wider uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer translate-y-[2px] shadow-lg shadow-white/5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* CENTRAL DYNAMIC DATA LIST TABLE */}
              {errorMsg && (
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 flex items-center gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Metadata / Inbound Date</th>
                        <th className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Client Name Details</th>
                        <th className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest mr-4">Target Service Scope</th>
                        <th className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest max-w-sm">Project Specifications</th>
                        <th className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">State Stage</th>
                        <th className="py-4 px-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Actions Workflow</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="py-20 text-center text-xs font-mono text-gray-500 uppercase tracking-widest">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-brand-cyan" />
                            Synchronizing secure registers...
                          </td>
                        </tr>
                      ) : leads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-24 text-center text-xs font-mono text-gray-500 uppercase tracking-widest">
                            <AlertCircle className="w-6 h-6 mx-auto mb-3 text-zinc-600" />
                            No matching inbound leads resolved.
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                            
                            {/* Metadata Column */}
                            <td className="py-5 px-6 shrink-0">
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-mono text-gray-300 font-semibold flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                  {formatTimeStr(lead.created_at)}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500 max-w-[125px] truncate block" title={lead.id}>
                                  ID: {lead.id.substring(0, 8)}...
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500">
                                  IP: {lead.ip_address}
                                </span>
                              </div>
                            </td>

                            {/* Client Contact details */}
                            <td className="py-5 px-6">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-brand-purple" />
                                  {lead.full_name}
                                </span>
                                <a 
                                  href={`mailto:${lead.email}`} 
                                  className="text-[11px] font-mono text-[#777] hover:text-brand-cyan flex items-center gap-1.5 select-all hover:underline"
                                >
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </a>
                              </div>
                            </td>

                            {/* Service selected */}
                            <td className="py-5 px-6">
                              <span className="inline-block text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-brand-indigo/10 bg-brand-indigo/5 text-slate-100 max-w-[160px] truncate block" title={lead.service}>
                                {lead.service}
                              </span>
                              <span className="text-[9px] font-mono text-zinc-500 mt-1 block">
                                Origin: {lead.source_page}
                              </span>
                            </td>

                            {/* Project details area */}
                            <td className="py-5 px-6 max-w-xs md:max-w-md">
                              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400 font-light leading-relaxed max-h-24 overflow-y-auto font-sans">
                                {lead.project_details}
                              </div>
                            </td>

                            {/* Current state badge */}
                            <td className="py-5 px-6">
                              <span className={`inline-flex items-center text-[10px] font-mono font-semibold uppercase tracking-wider border px-2.5 py-1 rounded-full ${getStatusBadgeStyles(lead.status)}`}>
                                {lead.status}
                              </span>
                            </td>

                            {/* Update actions dropdown select */}
                            <td className="py-5 px-6 text-right">
                              <div className="inline-flex flex-col gap-1 items-end relative">
                                <label className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block mb-0.5">Toggle Status</label>
                                <select
                                  disabled={isUpdatingId === lead.id}
                                  value={lead.status}
                                  onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                                  className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-300 font-mono focus:outline-none border-brand-cyan/20 focus:border-brand-cyan disabled:opacity-50 cursor-pointer pr-4"
                                >
                                  {actionStatuses.map(status => (
                                    <option key={status} value={status} className="bg-[#050505] text-white text-[10px]">{status}</option>
                                  ))}
                                </select>
                              </div>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
