import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { ShieldCheck, ShieldAlert, Terminal, Key, RefreshCw } from 'lucide-react';
import { CloudflareLogo, TailscaleLogo } from './BrandLogos';
import { triggerDdos, useSimEvent, SIM_EVENTS } from '../lib/simBus';

// HMR Cache Bust: 1
const NetworkLayer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [ddosActive, setDdosActive] = useState(false);
  const [vpnActive, setVpnActive] = useState(false);
  const [logs, setLogs] = useState([]);
  const logsContainerRef = useRef(null);
  const ddosRef = useRef(false); // tracks last broadcast state to log clean transitions

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Standard live request logs generator
  const getStandardLog = () => {
    const IPs = [
      '66.249.66.1 (US)', '185.190.140.2 (DE)', '45.132.220.10 (NL)', 
      '198.51.100.42 (CA)', '104.28.14.88 (GB)', '162.158.111.4 (FR)'
    ];
    const endpoints = ['/index.html', '/api/v1/health', '/metrics', '/assets/main.js', '/favicon.ico'];
    const randomIP = IPs[Math.floor(Math.random() * IPs.length)];
    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    return `[200 OK] ${randomIP} - GET ${randomEndpoint} (via Cloudflare Tunnel)`;
  };

  // Malicious threat logs generator
  const getThreatLog = () => {
    const maliciousIPs = ['185.220.101.4 (PL)', '45.143.203.18 (RU)', '223.104.21.90 (CN)', '80.92.114.33 (UA)'];
    const attackTypes = [
      'WAF rule: PORT SCAN MITIGATED',
      'WAF rule: SQL INJECTION DETECTED',
      'IP Banned in CrowdSec Repository',
      'TCP Flood Filter Blocked Packet'
    ];
    const randomIP = maliciousIPs[Math.floor(Math.random() * maliciousIPs.length)];
    const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    return `[BLOCKED] ${randomIP} - ${randomAttack}`;
  };

  // Dynamic log scrolling interval
  useEffect(() => {
    // Fill console with some initial logs
    const initialLogs = Array.from({ length: 5 }, () => getStandardLog());
    setLogs(initialLogs);

    const interval = setInterval(() => {
      if (ddosActive) {
        // High-frequency malicious traffic blocks
        setLogs(prev => [...prev.slice(-30), getThreatLog(), getThreatLog()]);
      } else {
        // Calm periodic request monitoring
        setLogs(prev => [...prev.slice(-30), getStandardLog()]);
      }
    }, ddosActive ? 300 : 2500);

    return () => clearInterval(interval);
  }, [ddosActive]);

  // Handle auto-scroll to bottom of WAF logs container without scrolling window
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTo({
        top: logsContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  // Button only broadcasts intent on the global bus; the listener below is the
  // single source of truth, so the tour can drive the exact same behaviour.
  const toggleDdos = () => triggerDdos(!ddosActive);

  // React to DDoS state from anywhere (this button, or the GuidedTour).
  useSimEvent(SIM_EVENTS.ddos, ({ active }) => {
    const wasActive = ddosRef.current;
    ddosRef.current = active;
    setDdosActive(active);
    if (active) {
      setVpnActive(false); // Can't VPN during attack
      setLogs(prev => [
        ...prev,
        " ",
        "[WAF-ALERT] CRITICAL DDoS ATTEMPT DETECTED AT EDGE GATEWAYS!",
        "[WAF-ALERT] Cloudflare WAF dynamic mitigation levels raised to high.",
        " "
      ]);
    } else if (wasActive) {
      setLogs(prev => [...prev, "[WAF-ALERT] WAF mitigation complete. Zero system intrusion verified.", " "]);
    }
  });

  const toggleVpn = () => {
    if (ddosActive) return; // Block VPN activation during active attack
    if (vpnActive) {
      setVpnActive(false);
      setLogs(prev => [...prev, "[TAILSCALE] VPN Tunnel disconnected gracefully from 'kn-admin-device.local'.", " "]);
    } else {
      setVpnActive(true);
      setLogs(prev => [
        ...prev, 
        " ",
        "[TAILSCALE] VPN Handshake complete... SSH access authorized.",
        "[TAILSCALE] Connected virtual interface: ha02 -> kn-admin-device.local",
        " "
      ]);
    }
  };

  const resetAll = () => {
    triggerDdos(false);
    ddosRef.current = false;
    setVpnActive(false);
    setLogs(["Active Edge Monitoring online. Logs cleared.", " "]);
  };

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-2 border-b border-white/5 pb-4 text-center md:text-left">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">Layer 1: The Edge & Ingress</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal uppercase tracking-tighter">Zero Trust, Dual-Tunnel HA, DNS Redundancy</strong>
        </span>
      </div>

      <Card title={
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col text-left">
            <span>Live Zero Trust Ingress Architecture</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-1 font-bold">Secure Gateways & WAF Simulator</span>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDdos}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-tight transition-all active:scale-95 shadow-md border
                ${ddosActive 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-red-500/10 hover:border-red-500/20'
                }`}
            >
              <ShieldAlert size={12} /> {ddosActive ? "Mitigating DDoS..." : "Simulate DDoS"}
            </button>
            
            <button
              onClick={toggleVpn}
              disabled={ddosActive}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-tight transition-all active:scale-95 shadow-md border
                ${vpnActive 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : ddosActive
                    ? 'border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                }`}
            >
              <Key size={12} /> {vpnActive ? "VPN Connected" : "VPN Connect"}
            </button>

            <button
              onClick={resetAll}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 text-slate-400 hover:text-white transition-all shadow-sm"
              title="Reset Simulator"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
      } className="mb-8" glowColor={ddosActive ? "rgba(239, 68, 68, 0.25)" : vpnActive ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.15)"}>
        
        {/* Dynamic Threat Notification Bar */}
        {ddosActive && (
          <div className="mt-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between text-red-400 animate-pulse transition-all">
            <div className="flex items-center gap-3">
              <ShieldAlert size={16} />
              <span className="text-[10px] font-mono uppercase font-black tracking-widest">
                DDoS Attack Mitigation Active: Banning Malicious IPs at Edge Cloudflare Tunnels!
              </span>
            </div>
            <span className="text-[9px] font-mono font-black uppercase italic bg-red-500/20 px-2 py-0.5 rounded-md">WAF High</span>
          </div>
        )}

        <div className="relative w-full overflow-visible py-8">
          
          {/* SVG Animated Connector Paths */}
          <svg className="absolute inset-0 w-full h-[400px] hidden lg:block z-0 opacity-20 pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
            {/* Trace Definitions */}
            <path id="tr-cf-a" d="M 230 40 L 230 140 L 100 140 L 100 180" fill="none" />
            <path id="tr-cf-b" d="M 230 140 L 360 140 L 360 180" fill="none" />
            <path id="tr-ts-02" d="M 770 40 L 770 140 L 640 140 L 640 180" fill="none" />
            <path id="tr-ts-03" d="M 770 140 L 900 140 L 900 180" fill="none" />
            <path id="tr-core-a" d="M 100 180 L 100 260 L 500 260 L 500 310" fill="none" />
            <path id="tr-core-b" d="M 360 180 L 360 260 L 500 260" fill="none" />
            <path id="tr-core-02" d="M 640 180 L 640 260 L 500 260" fill="none" />
            <path id="tr-core-03" d="M 900 180 L 900 260 L 500 260" fill="none" />

            {/* Visual Decorative Paths */}
            <path className="animated-path stroke-azure stroke-[1] opacity-50 fill-none" 
              d="M 230 40 L 230 140 M 100 140 L 360 140 M 100 140 L 100 260 L 900 260 M 360 140 L 360 260 M 500 260 L 500 310" />
            <path className={`animated-path stroke-[1] fill-none transition-colors duration-500
              ${vpnActive ? 'stroke-emerald-500 opacity-90' : 'stroke-emerald-500/50'}`}
              d="M 770 40 L 770 140 M 640 140 L 900 140 M 640 140 L 640 260 M 900 140 L 900 260" />

            {/* Dynamic Pulses based on Simulator States */}
            {ddosActive ? (
              <>
                {/* Intense Red Attack Pulses from CF Edge to Ingress Nodes */}
                <circle r="4" fill="#ef4444" className="filter blur-[1px]">
                  <animateMotion dur="0.6s" repeatCount="indefinite">
                    <mpath href="#tr-cf-a" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#f59e0b">
                  <animateMotion dur="0.9s" repeatCount="indefinite" begin="0.2s">
                    <mpath href="#tr-cf-b" />
                  </animateMotion>
                </circle>
              </>
            ) : (
              <>
                {/* Standard Request flow */}
                <circle r="2.5" fill="#3b82f6" className={isMobile ? '' : 'filter blur-[1px]'}>
                  <animateMotion dur="3s" repeatCount="indefinite">
                    <mpath href="#tr-cf-a" />
                  </animateMotion>
                </circle>
                <circle r="2" fill="#3b82f6" className={isMobile ? '' : 'filter blur-[1px]'}>
                  <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.2s">
                    <mpath href="#tr-cf-b" />
                  </animateMotion>
                </circle>
              </>
            )}

            {/* VPN authorized connection pulses */}
            {vpnActive && (
              <>
                <circle r="3" fill="#10b981" className="shadow-[0_0_8px_#10b981]">
                  <animateMotion dur="1.5s" repeatCount="indefinite">
                    <mpath href="#tr-ts-02" />
                  </animateMotion>
                </circle>
                <circle r="2.5" fill="#10b981" className="shadow-[0_0_8px_#10b981]">
                  <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.5s">
                    <mpath href="#tr-ts-03" />
                  </animateMotion>
                </circle>
              </>
            )}

            {/* Core server output pulses */}
            <circle r="1.5" fill="white" className="opacity-80">
              <animateMotion dur="3s" repeatCount="indefinite" begin="2s">
                <mpath href="#tr-core-a" />
              </animateMotion>
            </circle>
            <circle r="1.5" fill="white" className="opacity-80">
              <animateMotion dur="3.2s" repeatCount="indefinite" begin="2.5s">
                <mpath href="#tr-core-03" />
              </animateMotion>
            </circle>

            <circle cx="230" cy="140" r="2.5" fill="#3b82f6" />
            <circle cx="770" cy="140" r="2.5" fill={vpnActive ? "#10b981" : "#10b981/50"} />
            <circle cx="500" cy="260" r="3.5" fill="#f59e0b" className="animate-pulse" />
          </svg>
          
          <div className="flex flex-col items-center gap-4 w-full relative z-10 lg:block lg:min-h-[380px]">
             
             {/* Public Ingress Side */}
             <div className="flex flex-col gap-4 w-full lg:contents">
               <div className={`lg:absolute lg:top-0 lg:left-[23%] lg:translate-x-[-50%] transition-all duration-500 w-full lg:w-auto
                 ${ddosActive ? 'scale-105' : ''}`}>
                 <Node 
                   icon={<CloudflareLogo className="w-8 h-8 text-[#F38020]" />} 
                   name="Public Request" 
                   tag="CF Tunnel" 
                   color="blue" 
                   isMobile={isMobile}
                   className={`${ddosActive ? 'border-t-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)]' : ''}`} 
                 />
               </div>
               <div className="flex flex-col gap-4 w-full lg:contents">
                 <div className="lg:absolute lg:top-[180px] lg:left-[10%] lg:translate-x-[-50%] w-full lg:w-auto">
                   <NodeSmall isMobile={isMobile} name="Node A (pibuster4)" details="Primary Tunnel" />
                 </div>
                 <div className="lg:absolute lg:top-[180px] lg:left-[36%] lg:translate-x-[-50%] w-full lg:w-auto">
                   <NodeSmall isMobile={isMobile} name="Node B (ha01)" details="Failover Node" />
                 </div>
               </div>
             </div>

             {/* Admin Tailscale Side */}
             <div className="flex flex-col gap-4 w-full lg:contents">
               <div className={`lg:absolute lg:top-0 lg:left-[77%] lg:translate-x-[-50%] transition-all duration-500 w-full lg:w-auto
                 ${vpnActive ? 'scale-105' : 'opacity-40'}`}>
                 <Node 
                   icon={<TailscaleLogo className="w-8 h-8 text-emerald-400" />} 
                   name="Admin VPN" 
                   tag="Tailscale" 
                   color="teal" 
                   isMobile={isMobile}
                   className={`${vpnActive ? 'shadow-[0_0_25px_rgba(16,185,129,0.35)] border-t-emerald-400' : ''}`} 
                 />
               </div>
               <div className="flex flex-col gap-4 w-full lg:contents">
                 <div className={`lg:absolute lg:top-[180px] lg:left-[64%] lg:translate-x-[-50%] transition-opacity duration-500 w-full lg:w-auto ${vpnActive ? 'opacity-100' : 'opacity-40'}`}>
                   <NodeSmall isMobile={isMobile} name="ha02 (Security)" details="Auth Mesh" />
                 </div>
                 <div className={`lg:absolute lg:top-[180px] lg:left-[90%] lg:translate-x-[-50%] transition-opacity duration-500 w-full lg:w-auto ${vpnActive ? 'opacity-100' : 'opacity-40'}`}>
                   <NodeSmall isMobile={isMobile} name="ha03 (Access)" details="DNS Primary" />
                 </div>
               </div>
             </div>

             {/* Services Core LAN Node */}
             <div className="lg:absolute lg:top-[300px] lg:left-[50%] lg:translate-x-[-50%] w-full lg:w-auto">
               <Node 
                 icon="⚙️" 
                 name="Services Core" 
                 tag="Internal LAN" 
                 color="amber" 
                 isMobile={isMobile}
               />
             </div>
          </div>
        </div>

        {/* Live Active WAF/Firewall Terminal Stream */}
        <div className="mt-8 bg-black/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col h-[200px] shadow-inner font-mono text-[10px] leading-relaxed group/waf focus-within:border-azure/30 transition-all duration-300 crt-screen">
          
          {/* Log title header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 relative z-20">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-azure animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">
                Edge WAF Firewalls & Tunnels Log Console
              </span>
            </div>
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border transition-all duration-500
              ${ddosActive 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : vpnActive
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {ddosActive ? "⚠️ HIGH THREAT" : vpnActive ? "🔐 ADMIN ESTABLISHED" : "🛡️ PROTECTED"}
            </span>
          </div>

          {/* Logs Viewport */}
          <div ref={logsContainerRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth space-y-1 pr-2 crt-text relative z-20">
            {logs.map((log, index) => {
              const isAlert = log.includes('[WAF-ALERT]');
              const isVpn = log.includes('[TAILSCALE]');
              const isBlock = log.includes('[BLOCKED]');
              
              let textColor = 'text-slate-400';
              if (isAlert) textColor = 'text-red-400 font-bold';
              else if (isVpn) textColor = 'text-emerald-400 font-bold';
              else if (isBlock) textColor = 'text-red-500 font-black animate-pulse';
              else if (log.includes('via Cloudflare Tunnel')) textColor = 'text-blue-400/90';

              return (
                <div key={index} className={`${textColor} whitespace-pre-wrap`}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <RationaleSection title="Rationale: Why Zero Trust Ingress?" color="azure" icon={ShieldCheck}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-azure" /> The Architecture Choice
            </h6>
            <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              Traditional port-forwarding (NAT) creates a static attack surface. This design utilizes <strong>Cloudflare Tunnels</strong> to establish an outbound-only connection, effectively hiding the local IP and closing all inbound firewall ports while maintaining 24/7 global accessibility.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational Flow
            </h6>
            <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="text-azure-light font-bold">1/</span>
                <span><strong>Encrypted Handshake:</strong> cloudflared (Pi4) connects to the nearest Cloudflare Edge.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-azure-light font-bold">2/</span>
                <span><strong>Header Inspection:</strong> WAF rules at the edge filter traffic before it touches the LAN.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-azure-light font-bold">3/</span>
                <span><strong>Target Routing:</strong> Verified traffic is routed internally via secure tunneling.</span>
              </li>
            </ul>
          </div>
        </div>
      </RationaleSection>
    </section>
  );
};

const Node = ({ icon, name, tag, color, isMobile, className = "" }) => {
  const colors = {
    blue: "border-t-azure bg-azure/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    teal: "border-t-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    amber: "border-t-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
  };

  return (
    <motion.div 
      whileHover={{ 
        scale: isMobile ? 1.12 : 1.05, 
        y: isMobile ? -8 : -5, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)" 
      }}
      whileTap={{ scale: 0.95 }}
      className={`bg-slate-950/60 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-2 w-full lg:w-fit text-center backdrop-blur-xl border-t-2 ${colors[color]} ${className}`}
    >
      <div className="w-14 h-14 bg-white/[0.03] rounded-full flex items-center justify-center text-2xl mb-1 shadow-inner">{icon}</div>
      <span className="font-black text-[13px] text-white uppercase italic tracking-tight">{name}</span>
      <div className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-md text-slate-400 uppercase tracking-widest">{tag}</div>
    </motion.div>
  );
};

const NodeSmall = ({ name, details, isMobile, className = "" }) => {
  return (
    <motion.div 
      whileHover={{ 
        scale: isMobile ? 1.15 : 1.1, 
        backgroundColor: "rgba(255,255,255,0.08)", 
        borderColor: "rgba(255,255,255,0.2)" 
      }}
      whileTap={{ scale: 0.9 }}
      className={`bg-slate-900/40 border border-white/5 p-4 rounded-xl text-center w-full lg:w-fit lg:max-w-[150px] backdrop-blur-md transition-all ${className}`}
    >
      <div className="text-[11px] font-black text-white italic uppercase mb-1">{name}</div>
      <div className="text-[9px] text-slate-500 font-medium leading-tight">{details}</div>
    </motion.div>
  );
};

export default NetworkLayer;
