import React from 'react';
import Card from './Card';
import Badge from './Badge';

const NetworkLayer = () => {
  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 1: The Edge & Ingress</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Zero Trust Architecture, Cloudflare HA, Tailscale Mesh</strong>
        </span>
      </div>

      <Card title="Live Zero Trust Ingress Architecture" className="mb-16" glowColor="rgba(59, 130, 246, 0.15)">
        <div className="relative w-full overflow-visible py-8">
          
          {/* Animated SVG Lines (Hidden on small screens, shown above 1024px) */}
          <svg className="absolute inset-0 w-full h-[420px] hidden lg:block z-0" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad-cf" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3"/>
              </linearGradient>
              <linearGradient id="grad-ts" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            
            <path className="animated-path stroke-[url(#grad-cf)] filter drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]" d="M 230 30 L 230 130" />
            <path className="animated-path stroke-[url(#grad-cf)] filter drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]" d="M 230 130 L 90 130 L 90 220 L 230 220 L 230 300" />
            <path className="animated-path stroke-[url(#grad-cf)] filter drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]" d="M 230 130 L 370 130 L 370 220 L 230 220" />
            
            <path className="animated-path stroke-[url(#grad-ts)] filter drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" d="M 770 30 L 770 130" />
            <path className="animated-path stroke-[url(#grad-ts)] filter drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" d="M 770 130 L 630 130 L 630 220 L 770 220 L 770 300" />
            <path className="animated-path stroke-[url(#grad-ts)] filter drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" d="M 770 130 L 910 130 L 910 220 L 770 220" />

            <path className="animated-path stroke-[url(#grad-cf)] opacity-40" d="M 230 300 L 500 300 L 500 340" />
            <path className="animated-path stroke-[url(#grad-ts)] opacity-40" d="M 770 300 L 500 300 L 500 340" />
            
            <circle className="cf-packet" r="4" fill="#60a5fa">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 230 30 L 230 130 L 90 130 L 90 220 L 230 220 L 230 300 L 500 300 L 500 340" />
            </circle>
            <circle className="ts-packet" r="4" fill="#34d399">
              <animateMotion dur="3.5s" repeatCount="indefinite" path="M 770 30 L 770 130 L 630 130 L 630 220 L 770 220 L 770 300 L 500 300 L 500 340" />
            </circle>
          </svg>
          
          <div className="flex flex-col items-center gap-4 w-full relative z-10 lg:block lg:h-[420px]">
            
            {/* INGRESS PATHS */}
            <div className="flex flex-col gap-4 w-full lg:contents">
              {/* Cloudflare Path */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 w-full lg:contents">
                <Node 
                  icon="🌐" 
                  name="Public Request" 
                  tag="Cloudflared HA" 
                  color="blue"
                  className="lg:absolute lg:top-[-20px] lg:left-[23%] lg:translate-x-[-50%]"
                />
                <div className="text-blue-400 font-extrabold text-2xl lg:hidden">↓</div>
                <div className="flex flex-col gap-4 w-full lg:contents">
                  <NodeSmall name="☁️ CF Tunnel (pi4)" details="Physical bare-metal" color="amber" className="lg:absolute lg:top-[200px] lg:left-[9%] lg:translate-x-[-50%]" />
                  <NodeSmall name="☁️ CF Tunnel (ha01)" details="VM on Proxmox Box" color="amber" className="lg:absolute lg:top-[200px] lg:left-[37%] lg:translate-x-[-50%]" />
                </div>
              </div>

              <div className="w-full h-px bg-white/5 relative my-4 lg:hidden before:content-['OR'] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-slate-900 before:px-3 before:text-[10px] before:font-bold before:tracking-widest before:text-slate-500"></div>

              {/* Tailscale Path */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 w-full lg:contents">
                <Node 
                  icon="🔒" 
                  name="Admin VPN" 
                  tag="Tailscale Mesh" 
                  color="teal"
                  className="lg:absolute lg:top-[-20px] lg:left-[77%] lg:translate-x-[-50%]"
                />
                <div className="text-emerald-400 font-extrabold text-2xl lg:hidden">↓</div>
                <div className="flex flex-col gap-4 w-full lg:contents">
                  <NodeSmall name="🦎 Tailscale (ha02)" details="VM on Proxmox Box" color="amber" className="lg:absolute lg:top-[200px] lg:left-[63%] lg:translate-x-[-50%]" />
                  <NodeSmall name="🦎 Tailscale (ha03)" details="VM on Proxmox Box" color="amber" className="lg:absolute lg:top-[200px] lg:left-[91%] lg:translate-x-[-50%]" />
                </div>
              </div>
            </div>

            <div className="text-amber-500 font-extrabold text-3xl my-2 lg:hidden">↓</div>

            <Node 
              icon="⚙️" 
              name="Self-Hosted Services Network" 
              tag="Docker Stack" 
              color="amber"
              className="lg:absolute lg:top-[320px] lg:left-[50%] lg:translate-x-[-50%] border-t-amber-500 animate-glow"
            />
          </div>
        </div>
      </Card>
    </section>
  );
};

const Node = ({ icon, name, tag, color, className = "" }) => {
  const colors = {
    blue: "border-t-blue-500 bg-blue-500/5",
    teal: "border-t-emerald-500 bg-emerald-500/5",
    amber: "border-t-amber-500 bg-amber-500/5"
  };

  return (
    <div className={`net-node bg-slate-900/80 border border-white/10 p-6 rounded-xl flex flex-col items-center gap-2 w-full lg:w-fit text-center shadow-2xl backdrop-blur-md border-t-2 ${colors[color]} ${className}`}>
      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl mb-1">{icon}</div>
      <span className="font-semibold text-sm text-white">{name}</span>
      <div className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded text-slate-300 uppercase tracking-wider">{tag}</div>
    </div>
  );
};

const NodeSmall = ({ name, details, color, className = "" }) => {
  return (
    <div className={`bg-slate-900/80 border border-white/10 p-4 rounded-xl text-center w-full lg:w-fit lg:max-w-[160px] shadow-lg backdrop-blur-md border-t-2 border-t-amber-500/50 ${className}`}>
      <div className="text-xs font-semibold text-white mb-2 leading-tight">{name}</div>
      <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 mt-2 leading-relaxed">{details}</div>
    </div>
  );
};

export default NetworkLayer;
