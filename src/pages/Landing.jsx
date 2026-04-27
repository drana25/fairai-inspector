import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { setDemoMode } from '../data/demoData';
import toast from 'react-hot-toast';

export default function Landing({ user }) {
  const navigate = useNavigate();

  // Clear demo mode when landing page is visited so returning visitors
  // always see the home page, not the dashboard
  useEffect(() => {
    sessionStorage.removeItem('fairai_demo');
  }, []);

  const handleDemoMode = () => {
    sessionStorage.setItem('fairai_demo', 'true');
    setDemoMode();
    toast.success('Demo mode activated!');
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="landing-page min-h-screen bg-[#0a0a0f] text-gray-200 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[150px]" />
        {/* Particles */}
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 fixed w-full top-0 backdrop-blur-md bg-[#0a0a0f]/60 border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="text-lg">⚖️</span>
            </div>
            <span className="font-bold text-xl text-white">Fair<span className="text-indigo-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#mission" className="hover:text-white transition-colors">Mission</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2"
            >
              Sign In
            </button>
            <button 
              onClick={handleGetStarted}
              className="text-sm font-medium bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-300 tracking-wide">The Standard for AI Fairness</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              Trust Your AI. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Prove It.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              The industry-defining suite for detecting, visualizing, and mitigating bias across Datasets, Algorithms, and Outcomes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 hidden-scroll">
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-1"
              >
                Start Analyzing
              </button>
              <button 
                onClick={handleDemoMode}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>🔍</span> Try Demo Env
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-24 w-full relative rounded-t-3xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl"
            style={{ background: 'linear-gradient(180deg, rgba(18,18,26,0.9) 0%, rgba(10,10,15,1) 100%)' }}
          >
            {/* Section heading */}
            <div className="text-center pt-8 pb-4 px-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">Live App Preview</span>
              <h3 className="text-white font-bold text-xl mt-3">See FairAI Inspector in Action</h3>
              <p className="text-gray-400 text-sm mt-1">Real analysis output from an HR hiring dataset</p>
            </div>

            {/* Two-panel screenshot recreation */}
            <div className="flex flex-col md:flex-row gap-4 p-6 opacity-95 pointer-events-none">

              {/* LEFT PANEL — Bias Report / Fairness Score */}
              <div className="flex-none md:w-[280px] flex flex-col items-center bg-[#0d0d1a] rounded-2xl border border-white/8 p-6 shadow-2xl">
                <h2 className="text-white font-bold text-xl mb-1">Bias Report</h2>
                <p className="text-gray-400 text-xs mb-6">sample_data.csv • 98 rows</p>

                {/* Score Ring */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full" style={{background: 'radial-gradient(circle, rgba(99,0,40,0.3) 0%, rgba(13,13,26,0) 70%)'}}></div>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="url(#redGrad)" strokeWidth="14"
                      strokeDasharray="377" strokeDashoffset="226" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#dc2626"/>
                        <stop offset="100%" stopColor="#f97316"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="relative flex flex-col items-center">
                    <span className="text-5xl font-black text-red-400">40</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">Fairness Score</span>
                  </div>
                </div>

                {/* Warning badge */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-center w-full">
                  <p className="text-amber-400 font-bold text-sm flex items-center justify-center gap-2">
                    <span>⚠️</span> Significant Bias Detected
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Immediate Review Needed</p>
                </div>
              </div>

              {/* RIGHT PANEL — Gender Bias Chart */}
              <div className="flex-1 bg-[#0d0d1a] rounded-2xl border border-white/8 p-5 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-base">Gender</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">FAIL</span>
                </div>

                {/* Chart area */}
                <div className="bg-gradient-to-br from-[#0f1535] via-[#1a1545] to-[#0f1535] rounded-xl p-4 flex-1 border border-white/5 relative overflow-hidden mb-4">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 blur-3xl"></div>
                  </div>
                  <p className="text-white text-xs font-semibold text-center mb-3 relative z-10">Fairness Overview</p>

                  {/* Y axis labels */}
                  <div className="flex h-36 relative z-10">
                    <div className="flex flex-col justify-between text-[9px] text-gray-500 mr-2 pb-4">
                      <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
                    </div>
                    {/* Bars */}
                    <div className="flex-1 flex items-end justify-center gap-10 pb-4 border-l border-b border-white/10">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 rounded-t-xl shadow-[0_0_20px_rgba(59,130,246,0.6)]" style={{height:'110px', background:'#3b82f6'}}></div>
                        <span className="text-[10px] text-gray-400">Male</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 rounded-t-xl shadow-[0_0_20px_rgba(236,72,153,0.6)]" style={{height:'48px', background:'#ec4899'}}></div>
                        <span className="text-[10px] text-gray-400">Female</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-500 text-[9px] italic mt-2 relative z-10">🖱️ Hover over bars for interactive insights</p>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {label:'DIR', value:'0.444'},
                    {label:'SPD', value:'-0.510'},
                    {label:'Majority', value:'Male'},
                    {label:'Minority', value:'Female'},
                  ].map(m => (
                    <div key={m.label} className="bg-[#12121a] border border-white/8 rounded-lg p-2 text-center">
                      <p className="text-gray-500 text-[9px] uppercase tracking-wide">{m.label}</p>
                      <p className="text-white font-bold text-xs mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar (red — fail) */}
                <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{width:'44%'}}></div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="w-full text-center pb-8 px-4">
              <p className="text-xs md:text-sm text-gray-300 bg-[#0a0a0f]/90 inline-block px-5 py-2.5 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl font-medium tracking-wide">
                Real analysis of an HR hiring dataset. Female candidates hired 28% less often than male candidates.
              </p>
            </div>
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#0a0a0f] to-transparent"></div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 bg-[#0a0a0f] relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How FairAI Inspector Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Comprehensive fairness metrics across every stage of your model's lifecycle.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                className="group p-8 rounded-3xl bg-[#12121a] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full blur-2xl transition-all group-hover:bg-indigo-500/20"></div>
                <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">
                  📤
                </div>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">Upload Your Dataset</h3>
                <p className="text-gray-400 leading-relaxed relative z-10 flex-1">
                  Drag and drop any CSV file. Processed entirely in your browser — data never leaves your device.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} transition={{ delay: 0.2 }}
                className="group p-8 rounded-3xl bg-[#12121a] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full blur-2xl transition-all group-hover:bg-purple-500/20"></div>
                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">AI Detects Bias</h3>
                <p className="text-gray-400 leading-relaxed relative z-10 flex-1">
                  Our engine calculates Disparate Impact Ratio per column using the same legal standard as the US EEOC.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} transition={{ delay: 0.4 }}
                className="group p-8 rounded-3xl bg-[#12121a] border border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full blur-2xl transition-all group-hover:bg-pink-500/20"></div>
                <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">
                  📄
                </div>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">Get Plain-English Report</h3>
                <p className="text-gray-400 leading-relaxed relative z-10 flex-1">
                  Google Gemini explains every finding — what it means, why it happened, and what to do about it.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission CTA */}
        <section id="demo" className="py-32 px-6 relative">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 relative z-10">
              Ready to eliminate bias?
            </h2>
            <p className="text-xl text-indigo-200/70 mb-12 max-w-2xl mx-auto relative z-10">
              Join leading organizations ensuring their AI is ethical, compliant, and fair. Try our interactive demo environment instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Get Started Free
              </button>
              <button 
                onClick={handleDemoMode}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600/30 hover:bg-indigo-600/50 text-white border border-indigo-400/30 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
              >
                Explore Demo Mode
              </button>
            </div>
          </div>
        </section>
        {/* Google Solution Challenge Section */}
        <section id="mission" className="py-32 px-6 relative bg-gradient-to-b from-[#1e1b4b] to-[#0a0a0f]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <span className="text-sm font-medium text-blue-300 tracking-wide">Google Solution Challenge</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for Google Solution Challenge 2026</h2>
              <p className="text-gray-400 text-xl font-light">Part of the <span className="text-white font-medium">Build with AI</span> track</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#12121a]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all group">
                 <h3 className="text-blue-400 font-bold mb-4 uppercase text-sm tracking-wider">The Challenge</h3>
                 <p className="text-white font-medium mb-3">Google Solution Challenge 2026</p>
                 <p className="text-gray-400 text-sm leading-relaxed mb-4 font-mono bg-white/5 px-3 py-1 rounded w-fit group-hover:bg-blue-500/10 transition-colors">Build with AI Track</p>
                 <p className="text-gray-400 text-sm leading-relaxed">Solving real-world problems using Google technologies.</p>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }} className="bg-[#12121a]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-pink-500/30 transition-all">
                 <h3 className="text-pink-400 font-bold mb-4 uppercase text-sm tracking-wider">SDG Targets</h3>
                 <div className="flex flex-col gap-3 mb-4">
                    <span className="flex items-center gap-2 text-white font-medium text-sm"><span className="w-2 h-2 bg-pink-500 rounded-full"></span> SDG 10 — Reduced Inequalities</span>
                    <span className="flex items-center gap-2 text-white font-medium text-sm"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> SDG 16 — Justice & Strong Institutions</span>
                 </div>
                 <p className="text-gray-400 text-sm leading-relaxed pt-3 border-t border-white/5">Target: eliminate discriminatory AI practices.</p>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.4 }} className="bg-[#12121a]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-amber-500/30 transition-all">
                 <h3 className="text-amber-400 font-bold mb-4 uppercase text-sm tracking-wider">Tech Stack</h3>
                 <ul className="flex flex-col gap-3">
                    <li className="text-gray-300 text-sm flex items-center gap-3"><span className="text-amber-500 text-xs">▶</span> Firebase Auth & Firestore</li>
                    <li className="text-gray-300 text-sm flex items-center gap-3"><span className="text-amber-500 text-xs">▶</span> Firebase Hosting</li>
                    <li className="text-gray-300 text-sm flex items-center gap-3"><span className="text-blue-400 text-xs">▶</span> Gemini 2.0 Flash API</li>
                    <li className="text-gray-300 text-sm flex items-center gap-3"><span className="text-cyan-400 text-xs">▶</span> React + Vite</li>
                 </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team PIXEL Section */}
        <section id="team" className="py-32 px-6 relative bg-[#0f0f1a]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Meet Team PIXEL</h2>
              <p className="text-gray-400 text-lg">Google Solution Challenge 2026 · India</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-[#161622] rounded-3xl p-8 border border-white/5 hover:-translate-y-2 transition-transform duration-300 text-center flex flex-col items-center">
                 <div className="w-20 h-20 rounded-full border border-indigo-500/20 mb-6 ring-4 ring-indigo-500/20 overflow-hidden">
                   <img src="/team/devanshi.jpg" alt="Devanshi Rana" className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-white font-bold text-xl mb-2">Devanshi Rana</h3>
                 <p className="text-indigo-400 text-sm font-medium mb-1">Team Lead & Full Stack Developer</p>
              </div>
              <div className="bg-[#161622] rounded-3xl p-8 border border-white/5 hover:-translate-y-2 transition-transform duration-300 text-center flex flex-col items-center">
                 <div className="w-20 h-20 rounded-full border border-purple-500/20 mb-6 ring-4 ring-purple-500/20 overflow-hidden">
                   <img src="/team/hetvi.png" alt="Hetvi Rathod" className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-white font-bold text-xl mb-2">Hetvi Rathod</h3>
                 <p className="text-purple-400 text-sm font-medium mb-1">UI/UX Designer</p>
                 <p className="text-gray-500 text-xs">Frontend</p>
              </div>
              <div className="bg-[#161622] rounded-3xl p-8 border border-white/5 hover:-translate-y-2 transition-transform duration-300 text-center flex flex-col items-center">
                 <div className="w-20 h-20 rounded-full border border-blue-500/20 mb-6 ring-4 ring-blue-500/20 overflow-hidden">
                   <img src="/team/mayank.png" alt="Mayank Arambhi" className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-white font-bold text-xl mb-2">Mayank Arambhi</h3>
                 <p className="text-blue-400 text-sm font-medium mb-1">Backend</p>
                 <p className="text-gray-500 text-xs">AI Integration</p>
              </div>
            </div>
          </div>
        </section>

        {/* About the Challenge Banner */}
        <section className="bg-gradient-to-r from-indigo-900/80 to-[#0a0a0f] border-t border-white/10 py-16 px-6">
           <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="text-5xl">🏆</div>
              <div className="flex-1">
                 <p className="text-gray-300 leading-relaxed text-lg mb-4">
                   FairAI Inspector is our submission for the <strong className="text-white">Google Developer Groups Solution Challenge 2026</strong> — an annual competition where student developers build solutions to the UN's 17 Sustainable Development Goals using Google technology. We built this to make AI fairness accessible to every organisation, not just those with data science teams.
                 </p>
                 <a href="https://developers.google.com/community/gdsc-solution-challenge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Learn More <span>→</span>
                 </a>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0f] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <span className="font-bold text-xl text-white">Fair<span className="text-indigo-400">AI</span></span>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center md:items-start group">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Aligned with</span>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-pink-600/10 border border-pink-500/20 rounded-full px-3 py-1 pb-1.5">
                    <span className="text-pink-400 text-[10px] font-bold">SDG 10</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full px-3 py-1 pb-1.5">
                    <span className="text-blue-400 text-[10px] font-bold">SDG 16</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <span className="text-sm font-medium text-white">Built with ❤️ by Team PIXEL</span>
            <span className="text-xs text-indigo-400 font-medium tracking-wide">Google Solution Challenge 2026</span>
            <span className="text-xs text-gray-500 mt-2">&copy; 2026 FairAI Inspector · Team PIXEL · All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
