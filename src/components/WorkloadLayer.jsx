import React from 'react';
import Card from './Card';
import Badge from './Badge';

const HOST_THEMES = {
  'Zulu': { color: 'text-azure', bg: 'bg-azure/10', border: 'border-azure/20', dot: 'bg-azure' },
  'pi4': { color: 'text-amberGold', bg: 'bg-amberGold/10', border: 'border-amberGold/20', dot: 'bg-amberGold' },
  'ha-fleet': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  'Remote': { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', dot: 'bg-slate-500' }
};

const WorkloadLayer = () => {
  const workloads = {
    media: [
      { name: "Sonarr", icon: "📺", host: "Zulu", hash: "s4:9d2" },
      { name: "Radarr", icon: "🎬", host: "Zulu", hash: "r1:f3a" },
      { name: "Lidarr", icon: "🎵", host: "Zulu", hash: "l9:bb1" },
      { name: "Prowlarr", icon: "🔍", host: "Zulu", hash: "p2:c42" },
      { name: "Huntarr", icon: "🎯", host: "Zulu", hash: "h4:8e1" },
      { name: "Cleanuparr", icon: "🧹", host: "Zulu", hash: "c1:2d3" },
      { name: "Dispatcharr", icon: "📦", host: "Zulu", hash: "d5:0f9" },
      { name: "Sonobarr", icon: "🎶", host: "Zulu", hash: "s9:a1b" },
      { name: "TubeArchivist", icon: "📼", host: "Zulu", hash: "t2:7c4" },
      { name: "iPlayarr", icon: "📱", host: "Zulu", hash: "i3:6b2" },
      { name: "Copyparty", icon: "🎵", host: "Zulu", hash: "c6:4s1" },
    ],
    net: [
      { name: "qBittorrent", icon: "⏬", host: "Zulu", hash: "q1:3d2" },
      { name: "NZBGet", icon: "📰", host: "Zulu", hash: "n4:9f1" },
      { name: "FlareSolverr", icon: "🛡️", host: "Zulu", hash: "f2:a1b" },
      { name: "Slskd (P2P)", icon: "🎧", host: "Zulu", hash: "s3:c4d" },
      { name: "Nginx Proxy Mgr", icon: "🔀", host: "Zulu", hash: "n8:1e2" },
      { name: "Threadfin", icon: "📡", host: "Zulu", hash: "t5:0g1" },
      { name: "Vaultwarden", icon: "🔒", host: "ha-fleet", hash: "v2:8h3" },
      { name: "Cloudflared", icon: "☁️", host: "pi4", hash: "c1:4k5" },
      { name: "WatchYourLAN", icon: "👀", host: "Zulu", hash: "w3:1m2" },
      { name: "Glances", icon: "🔍", host: "Zulu", hash: "g2:5n4" },
    ],
    ops: [
      { name: "Homepage", icon: "🏠", host: "Zulu", hash: "h1:9z2" },
      { name: "Homarr", icon: "🖥️", host: "Zulu", hash: "h2:4x1" },
      { name: "Dashy", icon: "📈", host: "Zulu", hash: "d3:7y4" },
      { name: "Code-Server", icon: "💻", host: "Zulu", hash: "c1:2w3" },
      { name: "GitLab CI", icon: "🦊", host: "ha-fleet", hash: "g4:1q2" },
      { name: "Terraform", icon: "🏗️", host: "Zulu", hash: "t2:8r4" },
      { name: "Ansible", icon: "⚙️", host: "pi4", hash: "a5:9t1" },
      { name: "Filebrowser Q.", icon: "📁", host: "Zulu", hash: "f3:6u2" },
    ]
  };

  return (
    <section className="mb-24 relative">
      {/* Background Watermark (Docker) */}
      <div className="absolute -top-12 -right-12 opacity-[0.03] pointer-events-none select-none z-0">
        <DockerIcon className="w-96 h-96" />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4 relative z-10">
        <div className="flex flex-col">
          <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 4: Distributed Services</h3>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-azure mt-1">Dockerized Infrastructure Registry</span>
        </div>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-azure-light font-normal">CI/CD Automation, Microservices Architecture, Reverse Proxy Logic, Docker Swarm, Observability Stack</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 relative z-10">
        <Card title="Service Topologies" glowColor="rgba(59, 130, 246, 0.1)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TopoBox title="🛡️ Access" count="4 Nodes" color="rose" items={[
              { name: "Cloudflared HA", loc: "pi4/ha01" },
              { name: "Vaultwarden", loc: "ha-fleet" },
              { name: "Guacamole", loc: "ha-fleet" }
            ]} />
             <TopoBox title="📊 Observability" count="Global" color="azure" items={[
              { name: "Grafana/Prometheus", loc: "Zulu" },
              { name: "Dozzle Aggregator", loc: "pi4" },
              { name: "cAdvisor / Kuma", loc: "Global" }
            ]} />
             <TopoBox title="🛠️ Automation" count="Core" color="amber" items={[
              { name: "Pre/Post Scripts", loc: "PVE Node" },
              { name: "Pi-hole HA", loc: "Zulu/ha-fleet" },
              { name: "Ansible Control", loc: "pi4" }
            ]} />
             <TopoBox title="💾 Data & Rescue" count="9.1 TB" color="purple" items={[
              { name: "Veeam Exporter", loc: "Zulu" },
              { name: "[Knightbox] Repo", loc: "Remote" },
              { name: "OMV Direct Disk", loc: "OMV VM" }
            ]} />
          </div>
        </Card>

        <Card title={
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              <DockerIcon className="w-6 h-6 text-azure" />
              <span>Container Management & Orchestration</span>
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-azure/10 border border-azure/20 rounded-md">
                <div className="w-1 h-1 rounded-full bg-azure animate-pulse" />
                <span className="text-[9px] font-black text-azure uppercase tracking-tighter">Stack Healthy (36 Containers)</span>
              </div>
            </div>
            <HostLegend />
          </div>
        } glowColor="rgba(168, 85, 247, 0.1)">
          <div className="flex flex-col gap-6 bg-black/20 p-6 rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl">
            {/* Docker Floating Label for mobile */}
            <div className="md:hidden flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-1.5 py-1 px-3 bg-azure/10 border border-azure/20 rounded-full">
                <DockerIcon className="w-3 h-3 text-azure" />
                <span className="text-[10px] font-bold text-azure uppercase tracking-widest">Containerized Registry</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>k3s/docker:verified</span>
              </div>
            </div>
            
            <MarqueeRow label="🎬 Media Stack" items={workloads.media} duration="45s" />
            <MarqueeRow label="⬇️ Downloads & Proxy" items={workloads.net} duration="40s" reverse />
            <MarqueeRow label="🛠️ Ops & Dashboards" items={workloads.ops} duration="50s" />
          </div>
        </Card>
      </div>
    </section>
  );
};

const HostLegend = () => (
  <div className="flex flex-wrap gap-3 md:gap-6">
    {Object.entries(HOST_THEMES).filter(([name]) => name !== 'Remote').map(([name, theme]) => (
      <div key={name} className="flex items-center gap-2 group">
        <span className={`w-2 h-2 rounded-full ${theme.dot} shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-125 transition-transform`} />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{name}</span>
      </div>
    ))}
  </div>
);

const DockerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.983 11.078h2.119c.102 0 .174.084.174.18v2.164c0 .102-.078.18-.174.18h-2.119a.186.186 0 0 1-.186-.18v-2.164a.186.186 0 0 1 .186-.18zm-2.827 0h2.118a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18h-2.118a.185.185 0 0 1-.185-.18v-2.164a.185.185 0 0 1 .185-.18zm-2.827 0h2.119a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18H8.329a.185.185 0 0 1-.185-.18v-2.164a.185.185 0 0 1 .185-.18zm-2.827 0h2.119a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18H5.502a.185.185 0 0 1-.185-.18v-2.164a.185.185 0 0 1 .185-.18zM11.156 8.252h2.118a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18h-2.118a.185.185 0 0 1-.185-.18V8.432a.185.185 0 0 1 .185-.18zm-2.827 0h2.119a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18H8.329a.185.185 0 0 1-.185-.18V8.432a.185.185 0 0 1 .185-.18zm-2.827 0h2.119a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18H5.502a.185.185 0 0 1-.185-.18V8.432a.185.185 0 0 1 .185-.18zM8.329 5.425h2.119a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18H8.329a.185.185 0 0 1-.185-.18V5.605a.185.185 0 0 1 .185-.18zm4.72 2.827h2.119a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18h-2.119a.185.185 0 0 1-.185-.18V8.432a.185.185 0 0 1 .185-.18zm1.323-6.572v2.99s-3.186.143-3.186 3.543c0 2.453 1.152 3.018 1.152 3.018s.168.084.144.18c-.024.12-.144.144-.144.144a.2.2 0 0 0-.144.192s1.42 2.405 5.28 2.405c.12 0 .24 0 .336-.048a1.04 1.04 0 0 0 .504-.456s1.656-2.5 1.656-3.882c0-3.33-2.616-5.467-5.616-5.467v-2.31c0-.12-.048-.24-.144-.312a.45.45 0 0 0-.312-.12zm-9.356 8.147H7.39a.186.186 0 0 1 .186.18v2.164a.186.186 0 0 1-.186.18H4.996a.185.185 0 0 1-.185-.18v-2.164a.185.185 0 0 1 .185-.18z"/>
  </svg>
);

const TopoBox = ({ title, count, color, items }) => {
  const colors = {
    rose: "border-t-rose-500 bg-rose-500/10",
    azure: "border-t-azure bg-azure/10",
    amber: "border-t-amberGold bg-amberGold/10",
    purple: "border-t-purple-500 bg-purple-500/10"
  };

  return (
    <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden group">
      <div className={`p-4 font-bold text-xs uppercase tracking-widest border-t-2 flex justify-between items-center ${colors[color]}`}>
        {title} <span className="opacity-60 text-[10px]">{count}</span>
      </div>
      <div className="p-4 space-y-3">
        {items.map(item => (
          <div key={item.name} className="flex justify-between items-center text-[11px]">
            <span className="text-slate-200 font-medium">{item.name}</span>
            <span className="text-slate-500 font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded">{item.loc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarqueeRow = ({ label, items, duration, reverse = false }) => (
  <div className="flex flex-col md:flex-row md:items-center relative group/row">
    <div className="w-fit mb-2 md:mb-0 md:min-w-[140px] md:relative md:z-10 bg-slate-900 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-extrabold text-white uppercase tracking-widest shadow-2xl backdrop-blur-md">
      {label}
    </div>
    <div className={`flex-1 overflow-hidden relative ${reverse ? 'flex-row-reverse' : ''}`}>
       <div 
        className="flex whitespace-nowrap py-2 group-hover/row:[animation-play-state:paused]"
        style={{ 
          animation: `scroll ${duration} linear infinite ${reverse ? 'reverse' : ''}` 
        }}
      >
        <div className="flex gap-4 px-4 font-mono">
          {items.map((item, idx) => {
            const hostTheme = HOST_THEMES[item.host] || HOST_THEMES['Remote'];
            return (
              <div key={idx} className={`flex items-center gap-3 px-4 py-2 bg-slate-950/40 border-2 ${hostTheme.border.replace('/20', '/60')} border-azure/30 rounded-2xl text-sm font-semibold hover:bg-azure/5 hover:-translate-y-1 transition-all cursor-default group/pill shadow-lg shadow-azure/5`}>
                <div className="relative">
                   <span className="text-xl group-hover/pill:scale-110 transition-transform block">{item.icon}</span>
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 z-20 shadow-glow shadow-emerald-500/50">
                     <div className="w-full h-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                   </div>
                </div>
                <div className="flex flex-col min-w-[100px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-white leading-none font-bold tracking-tight">{item.name}</span>
                    <span className="text-[8px] text-slate-600 font-mono opacity-50 uppercase tracking-tighter">ID:{item.hash}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <DockerIcon className="w-2.5 h-2.5 text-azure" />
                    <span className={`text-[8px] uppercase tracking-[0.15em] font-black ${hostTheme.color}`}>{item.host}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-4 px-4 font-mono">
          {items.map((item, idx) => {
            const hostTheme = HOST_THEMES[item.host] || HOST_THEMES['Remote'];
            return (
              <div key={`dup-${idx}`} className={`flex items-center gap-3 px-4 py-2 bg-slate-950/40 border-2 ${hostTheme.border.replace('/20', '/60')} border-azure/30 rounded-2xl text-sm font-semibold hover:bg-azure/5 hover:-translate-y-1 transition-all cursor-default group/pill shadow-lg shadow-azure/5`}>
                <div className="relative">
                   <span className="text-xl group-hover/pill:scale-110 transition-transform block">{item.icon}</span>
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 z-20 shadow-glow shadow-emerald-500/50">
                     <div className="w-full h-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                   </div>
                </div>
                <div className="flex flex-col min-w-[100px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-white leading-none font-bold tracking-tight">{item.name}</span>
                    <span className="text-[8px] text-slate-600 font-mono opacity-50 uppercase tracking-tighter">ID:{item.hash}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <DockerIcon className="w-2.5 h-2.5 text-azure" />
                    <span className={`text-[8px] uppercase tracking-[0.15em] font-black ${hostTheme.color}`}>{item.host}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default WorkloadLayer;
