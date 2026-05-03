import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { ShieldCheck } from 'lucide-react';
import { CloudflareLogo, TailscaleLogo } from './BrandLogos';

const NetworkLayer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-2 border-b border-white/5 pb-4 text-center md:text-left">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">Layer 1: The Edge & Ingress</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal uppercase tracking-tighter">Zero Trust, Dual-Tunnel HA, DNS Redundancy</strong>
        </span>
      </div>

      <Card title="Live Zero Trust Ingress Architecture" className="mb-8" glowColor="rgba(59, 130, 246, 0.15)">
        <div className="relative w-full overflow-visible py-8">
          <svg className="absolute inset-0 w-full h-[400px] hidden lg:block z-0 opacity-20 pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
            {/* Trace Definitions (Invisible for Pulses) */}
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
            <path className="animated-path stroke-emerald-500 stroke-[1] opacity-50 fill-none" 
              d="M 770 40 L 770 140 M 640 140 L 900 140 M 640 140 L 640 260 M 900 140 L 900 260" />

            {/* Data Pulses (The 'Wow Factor') */}
            <circle r="2" fill="#3b82f6" className={isMobile ? '' : 'filter blur-[1px]'}>
              <animateMotion dur="3s" repeatCount="indefinite">
                <mpath href="#tr-cf-a" />
              </animateMotion>
            </circle>
            <circle r="2" fill="#3b82f6" className={isMobile ? '' : 'filter blur-[1px]'}>
              <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.2s">
                <mpath href="#tr-cf-b" />
              </animateMotion>
            </circle>
            
            <circle r="2" fill="#10b981" className={isMobile ? '' : 'filter blur-[1px]'}>
              <animateMotion dur="3.5s" repeatCount="indefinite">
                <mpath href="#tr-ts-02" />
              </animateMotion>
            </circle>
            <circle r="2" fill="#10b981" className={isMobile ? '' : 'filter blur-[1px]'}>
              <animateMotion dur="4.5s" repeatCount="indefinite" begin="1.8s">
                <mpath href="#tr-ts-03" />
              </animateMotion>
            </circle>

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

            {/* Faster Backup Pulses */}
            <circle r="1" fill="#3b82f6" className="opacity-40">
              <animateMotion dur="1.5s" repeatCount="indefinite">
                <mpath href="#tr-cf-a" />
              </animateMotion>
            </circle>

            <circle cx="230" cy="140" r="2.5" fill="#3b82f6" />
            <circle cx="770" cy="140" r="2.5" fill="#10b981" />
            <circle cx="500" cy="260" r="3.5" fill="#f59e0b" className="animate-pulse" />
          </svg>
          
          <div className="flex flex-col items-center gap-4 w-full relative z-10 lg:block lg:min-h-[380px]">
             <div className="flex flex-col gap-4 w-full lg:contents">
              <Node 
                icon={<CloudflareLogo className="w-8 h-8 text-[#F38020]" />} 
                name="Public Request" 
                tag="CF Tunnel" 
                color="blue" 
                isMobile={isMobile}
                className="lg:absolute lg:top-0 lg:left-[23%] lg:translate-x-[-50%]" 
              />
              <div className="flex flex-col gap-4 w-full lg:contents">
                <NodeSmall isMobile={isMobile} name="Node A (pibuster4)" details="Primary Tunnel" className="lg:absolute lg:top-[180px] lg:left-[10%] lg:translate-x-[-50%]" />
                <NodeSmall isMobile={isMobile} name="Node B (ha01)" details="Failover Node" className="lg:absolute lg:top-[180px] lg:left-[36%] lg:translate-x-[-50%]" />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:contents">
              <Node 
                icon={<TailscaleLogo className="w-8 h-8 text-emerald-400" />} 
                name="Admin VPN" 
                tag="Tailscale" 
                color="teal" 
                isMobile={isMobile}
                className="lg:absolute lg:top-0 lg:left-[77%] lg:translate-x-[-50%]" 
              />
              <div className="flex flex-col gap-4 w-full lg:contents">
                <NodeSmall isMobile={isMobile} name="ha02 (Security)" details="Auth Mesh" className="lg:absolute lg:top-[180px] lg:left-[64%] lg:translate-x-[-50%]" />
                <NodeSmall isMobile={isMobile} name="ha03 (Access)" details="DNS Primary" className="lg:absolute lg:top-[180px] lg:left-[90%] lg:translate-x-[-50%]" />
              </div>
            </div>

            <Node 
              icon="⚙️" 
              name="Services Core" 
              tag="Internal LAN" 
              color="amber" 
              isMobile={isMobile}
              className="lg:absolute lg:top-[300px] lg:left-[50%] lg:translate-x-[-50%]" 
            />
          </div>
        </div>
      </Card>

      <RationaleSection title="Rationale: Why Zero Trust Ingress?" color="azure" icon={ShieldCheck}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-azure" /> The Architecture Choice
            </h6>
            <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              Traditional port-forwarding (NAT) creates a static attack surface. This design utilizes <strong>Cloudflare Tunnels</strong> to establish an outbound-only connection, effectively hiding the local IP and closing all inbound firewall ports while maintaining 24/7 global accessibility.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
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
