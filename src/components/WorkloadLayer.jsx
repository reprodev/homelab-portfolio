import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { 
  LayoutGrid, Globe, Shield, Terminal, Boxes, Zap, 
  ExternalLink, X, Play, Square, RotateCcw, FileCode, Sliders,
  ShieldAlert, Volume2, VolumeX, RefreshCw
} from 'lucide-react';
import { DockerLogo, PlexLogo } from './BrandLogos';
import { triggerTranscode, triggerDr, useSimEvent, SIM_EVENTS } from '../lib/simBus';
import { playSound, getAudioContext } from '../lib/audio';

// High-fidelity Docker daemon container telemetry profiles
const CONTAINER_DATA = {
  nextcloud: {
    id: "sha256:nextcloud_aio_8f812b11",
    name: "Nextcloud",
    tag: "AIO - Data Hub",
    image: "nextcloud:aio-latest",
    port: "8080:80",
    created: "2026-03-12T14:22:18.91Z",
    env: ["MYSQL_DATABASE=nextcloud", "MYSQL_USER=nextcloud", "NEXTCLOUD_TRUSTED_DOMAINS=portal.khurramnazir.com", "REDIS_HOST=redis"],
    mounts: [
      { type: "volume", name: "nextcloud_aio_data", source: "/var/lib/docker/volumes/nextcloud_data/_data", destination: "/var/www/html/data" }
    ],
    logs: [
      "[INFO] Nextcloud AIO starter initializing...",
      "[OK] Redis database cache connection established.",
      "[INFO] Apache/2.4.52 (Unix) OpenSSL/1.1.1t configured -- resuming normal operations.",
      "[OK] Connected to PostgreSQL DB on backup host.",
      "[INFO] cron.php executed successfully (0.012s).",
      "[INFO] Syncing files for user 'khurram': 24 updates pending...",
      "[OK] File check complete. 0 conflicts found.",
      "[INFO] Backup snapshot completed successfully."
    ]
  },
  vaultwarden: {
    id: "sha256:vaultwarden_rust_a38ff120",
    name: "Vaultwarden",
    tag: "Bitwarden Core",
    image: "vaultwarden/server:latest",
    port: "80:80",
    created: "2026-04-01T08:12:44.22Z",
    env: ["SIGNUPS_ALLOWED=false", "WEBSOCKET_ENABLED=true", "DATA_FOLDER=/data"],
    mounts: [
      { type: "volume", name: "vaultwarden_db", source: "/var/lib/docker/volumes/vaultwarden/_data", destination: "/data" }
    ],
    logs: [
      "[INFO] Starting Vaultwarden server on port 80...",
      "[OK] SQLite database migration completed successfully.",
      "[INFO] WebSockets enabled on port 3012.",
      "[WARNING] User registration is disabled (SIGNUPS_ALLOWED=false).",
      "[INFO] Vaultwarden admin panel disabled for security.",
      "[OK] Active web vault session established from <SECURED_IP>.",
      "[INFO] Synchronization complete for device 'Pixel_4a_5G'.",
      "[OK] DB vacuum successful. DB size: 24.5 MB."
    ]
  },
  guacamole: {
    id: "sha256:guacamole_client_9b2dd0a5",
    name: "Guacamole",
    tag: "RDP Gatehouse",
    image: "guacamole/guacamole:latest",
    port: "8080:8080",
    created: "2026-01-20T10:45:12.33Z",
    env: ["GUACD_HOSTNAME=guacd", "MYSQL_DATABASE=guacamole_db", "MYSQL_USER=guac_user"],
    mounts: [
      { type: "bind", source: "/opt/guacamole/conf", destination: "/etc/guacamole" }
    ],
    logs: [
      "[INFO] Guacamole client webapp starting...",
      "[OK] Connected to guacd at guacd:4822.",
      "[INFO] Attempting active SSH connection to 'pibuster4'...",
      "[OK] SSH session handshake complete. Terminal initiated.",
      "[INFO] Attempting RDP connection to 'ha03'...",
      "[OK] RDP credentials accepted. Desktop session launched.",
      "[INFO] Channel closed for user session <SESSION_491>."
    ]
  },
  homepage: {
    id: "sha256:gethomepage_f18e9a22",
    name: "Homepage",
    tag: "Services Dashboard",
    image: "ghcr.io/gethomepage/homepage:latest",
    port: "3000:3000",
    created: "2026-05-15T07:11:04.09Z",
    env: ["NODE_ENV=production", "PORT=3000"],
    mounts: [
      { type: "bind", source: "/opt/homepage/config", destination: "/app/config" }
    ],
    logs: [
      "[INFO] Homepage daemon launching on node...",
      "[OK] Loaded configurations from config/settings.yaml.",
      "[OK] Loaded service layout mappings (12 services online).",
      "[INFO] Querying Proxmox API for cluster telemetry status...",
      "[OK] Proxmox query successful (status: nominal, cpu: 14%).",
      "[INFO] API connection established to Pi-hole recursive server.",
      "[OK] Dashboard loaded in 4ms for external request."
    ]
  },
  nginx: {
    id: "sha256:nginx_proxy_manager_c2e36611",
    name: "Nginx Proxy Mgr.",
    tag: "Edge Certs",
    image: "jc21/nginx-proxy-manager:latest",
    port: "80:80, 443:443, 81:81",
    created: "2026-02-18T19:30:15.55Z",
    env: ["DB_MYSQL_HOST=db", "DB_MYSQL_PORT=3306", "DB_MYSQL_USER=npm", "DB_MYSQL_NAME=npm"],
    mounts: [
      { type: "volume", name: "npm_data", source: "/var/lib/docker/volumes/npm_data/_data", destination: "/data" },
      { type: "volume", name: "npm_letsencrypt", source: "/var/lib/docker/volumes/npm_letsencrypt/_data", destination: "/etc/letsencrypt" }
    ],
    logs: [
      "[INFO] Nginx Proxy Manager initializing...",
      "[OK] Connected to database backend.",
      "[INFO] Querying Let's Encrypt certificates...",
      "[OK] Cert for 'khurramnazir.com' active (expires in 64 days).",
      "[OK] Cert for 'reprodev.com' active (expires in 41 days).",
      "[INFO] Reloading Nginx configurations...",
      "[OK] Nginx reload complete. Dynamic configurations applied.",
      "[INFO] Routing request: HTTPS GET / -> proxmox_core:8006"
    ]
  },
  pihole: {
    id: "sha256:pihole_dns_e9a1811a",
    name: "Pi-hole",
    tag: "Recursive DNS",
    image: "pihole/pihole:latest",
    port: "53:53/udp, 80:80",
    created: "2025-12-05T12:02:19.44Z",
    env: ["TZ=Europe/London", "WEBPASSWORD=<SECURE>", "PIHOLE_DNS_=1.1.1.1"],
    mounts: [
      { type: "volume", name: "pihole_config", source: "/var/lib/docker/volumes/pihole/_data", destination: "/etc/pihole" }
    ],
    logs: [
      "[INFO] Pi-hole core starting up...",
      "[OK] Loading FTL engine (v5.24)...",
      "[OK] Loaded blocklists: 249,102 ad domains.",
      "[INFO] FTL recursive DNS listener active on port 53.",
      "[OK] Query from <SUBNET_CLIENT_12> blocked: 'telemetry.microsoft.com'",
      "[OK] Query from <SUBNET_CLIENT_04> allowed: 'github.com'",
      "[INFO] Gravity DB sync successful."
    ]
  },
  uptime: {
    id: "sha256:uptime_kuma_3d42b109",
    name: "Uptime Kuma",
    tag: "Telemetry Hub",
    image: "louislam/uptime-kuma:latest",
    port: "3001:3001",
    created: "2026-03-24T06:12:45.00Z",
    env: ["UPTIME_KUMA_PORT=3001"],
    mounts: [
      { type: "volume", name: "uptime_kuma_data", source: "/var/lib/docker/volumes/uptime_kuma/_data", destination: "/app/data" }
    ],
    logs: [
      "[INFO] Uptime Kuma core initialized.",
      "[OK] SQLite persistent telemetry engine running.",
      "[INFO] Launching pings for 14 active nodes...",
      "[OK] Ping target 'Cloudflare Ingress' responsive (11ms).",
      "[OK] Ping target 'Proxmox Core' responsive (0.6ms).",
      "[OK] HTTP target 'reprodev.com' returned status 200 OK.",
      "[INFO] Fleet telemetry health: 100% nominal."
    ]
  },
  dozzle: {
    id: "sha256:dozzle_log_watcher_f723e029",
    name: "Dozzle",
    tag: "Log Aggregation",
    image: "amir20/dozzle:latest",
    port: "8888:8080",
    created: "2026-04-20T16:14:18.99Z",
    env: ["DOZZLE_LEVEL=info"],
    mounts: [
      { type: "bind", source: "/var/run/docker.sock", destination: "/var/run/docker.sock" }
    ],
    logs: [
      "[INFO] Dozzle log watcher launching...",
      "[OK] Connected to local Docker daemon socket (/var/run/docker.sock).",
      "[INFO] Discovered 8 active container engines.",
      "[INFO] Log stream caching initialized. Buffer size: 1000 lines.",
      "[OK] Stream connection established to client UI session.",
      "[INFO] Dozzle service active on port 8080.",
      "[OK] Subscribing to container events: nextcloud, vaultwarden, pihole..."
    ]
  }
};

const DYNAMIC_LOG_POOL = [
  "[OK] Telemetry heartbeat verified: 0.4ms response latency.",
  "[INFO] Garbage collector sweep finished; freed 22.4MB heaps successfully.",
  "[OK] Inbound RPC payload digested -- action: telemetry_heartbeat.",
  "[INFO] Outbound sync successfully completed to backup host (ha02).",
  "[WARNING] DNS recursion requested from untrusted zone -- block cached."
];

// Chaos Incident templates
const CHAOS_INCIDENTS = {
  vm: {
    title: "ZuluServer VM Outage",
    logs: [
      "[0.0s] [ALARM] Anomaly detected: ZuluServer VM lost heartbeat on core host.",
      "[0.8s] [MONITOR] TCP port probe failed: zulu_server_vm:32400 (Connection Refused).",
      "[1.6s] [SRE-HEALER] Evicting active workloads from failed node ZuluServer...",
      "[2.4s] [SRE-HEALER] Orchestrating hot-standby VM node templates bootstrap on hypervisor core...",
      "[3.5s] [SRE-HEALER] Decompressing backup blocks from Veeam repo (482GB restored)...",
      "[4.5s] [SRE-HEALER] Re-binding LAN subnets and Docker networking interfaces...",
      "[5.6s] [SRE-HEALER] Pod reschedule complete! Verifying operational TCP sockets...",
      "[6.8s] [OK] ZuluServer resurrected on ha02 standby node! Telemetry nominal. Incident resolved."
    ]
  },
  network: {
    title: "45% Packet Loss Drop",
    logs: [
      "[0.0s] [ALARM] Ingress trace anomaly: Network latency spikes detected at Cloudflare Edge.",
      "[0.8s] [MONITOR] Ping probe drop: 45.2% packet loss on ingress interface pibuster4.",
      "[1.6s] [SRE-ANALYSER] Diagnostics: BGP route flapping discovered at local ISP border.",
      "[2.5s] [SRE-HEALER] Invoking dynamic failover routing policies...",
      "[3.6s] [SRE-HEALER] Hot-swapping primary tunnel gateway interface to failover node ha01...",
      "[4.5s] [SRE-HEALER] VPN interface tunnel handshake verified. Handshaking keys...",
      "[5.5s] [OK] Traffic routing nominal. Packet drop rate: 0.00%. Ingress stabilized."
    ]
  },
  dns: {
    title: "DNS Cache Poisoning",
    logs: [
      "[0.0s] [ALARM] Threat detected: Spoofed DNS response patterns targeting local resolvers.",
      "[0.8s] [MONITOR] Query rate anomaly on Pi-hole resolver nodes (+820% query volume).",
      "[1.6s] [SRE-ANALYSER] Packet inspect: Cache poisoning payloads identified from external subnets.",
      "[2.4s] [SRE-HEALER] Directing resolver node hardening instructions...",
      "[3.4s] [SRE-HEALER] Forcing strict DNSSEC validation policies across all internal zones...",
      "[4.5s] [SRE-HEALER] Flushing corrupted DNS caches and querying authority root anchors...",
      "[5.8s] [OK] Local zone caches clean. 14 poisonous records purged. Core DNS secured."
    ]
  }
};

// Auditory alert siren synthesizer engine (Web Audio API)
let sirenInterval = null;
let osc1 = null;
let osc2 = null;
let gainNode = null;

const startSiren = () => {
  try {
    // Reuse the site-wide shared AudioContext — never construct (or close) our own.
    const ctx = getAudioContext();
    if (!ctx) return;

    osc1 = ctx.createOscillator();
    osc2 = ctx.createOscillator();
    gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(480, ctx.currentTime);
    osc2.frequency.setValueAtTime(490, ctx.currentTime);

    // Extremely subtle volume (polite UX guidelines)
    gainNode.gain.setValueAtTime(0.005, ctx.currentTime);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();

    let high = true;
    sirenInterval = setInterval(() => {
      if (!osc1 || !osc2) return;
      const targetFreq = high ? 600 : 400;
      osc1.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + 0.45);
      osc2.frequency.exponentialRampToValueAtTime(targetFreq + 10, ctx.currentTime + 0.45);
      high = !high;
    }, 500);
  } catch (e) {}
};

const stopSiren = () => {
  if (sirenInterval) clearInterval(sirenInterval);
  try {
    // Disconnect our nodes only — the shared context stays alive for the site.
    if (osc1) { osc1.stop(); osc1.disconnect(); }
    if (osc2) { osc2.stop(); osc2.disconnect(); }
    if (gainNode) { gainNode.disconnect(); }
  } catch (e) {}
  sirenInterval = null;
  osc1 = null;
  osc2 = null;
  gainNode = null;
};

// SRE Chaos Control Center Widget Card Component
const SREChaosIncidentDeck = ({ ddosActive, drStep }) => {
  const [activeIncident, setActiveIncident] = useState(null); // null | vm | network | dns
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [chaosLogs, setChaosLogs] = useState(["[SYSTEM] Chaos Daemon initialized.", "[SYSTEM] Node heartbeat monitor nominal. Ready."]);
  const logEndRef = useRef(null);


  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chaosLogs]);

  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  const triggerChaos = (type) => {
    if (activeIncident) return;
    playSound('click');
    setActiveIncident(type);
    setChaosLogs([]);
    
    if (soundEnabled) {
      startSiren();
    }

    const incident = CHAOS_INCIDENTS[type];
    let step = 0;

    // Direct synchronous updates on the global simulation bus to orchestrate page-wide panic
    if (type === 'vm') {
      triggerDr(1); // Catastrophic outage state
    }

    const timer = setInterval(() => {
      if (step < incident.logs.length) {
        setChaosLogs(prev => [...prev, incident.logs[step]]);
        
        // Sync incremental self-healing steps with Veeam DR bar dynamically
        if (type === 'vm') {
          if (step === 2) triggerDr(2); // Recovering
          if (step === 5) triggerDr(3); // Verifying
          if (step === 7) triggerDr(4); // Restored successfully
        }
        
        step += 1;
      } else {
        clearInterval(timer);
        stopSiren();
        
        // Soft timeout to reset the cluster visual status back to NOMINAL
        setTimeout(() => {
          setActiveIncident(null);
          if (type === 'vm') {
            triggerDr(0); // Reset DR drill state
          }
        }, 3000);
      }
    }, 900);
  };

  return (
    <Card title={
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className={activeIncident ? "text-red-500 animate-bounce" : "text-slate-400"} />
          <div className="flex flex-col text-left">
            <span className="leading-tight">Chaos Incident Cockpit</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-red-500/70 font-black mt-1">SRE Self-Healing Engine</span>
          </div>
        </div>
        
        {/* Skeuomorphic tactile sound toggle */}
        <button
          onClick={() => { playSound('click'); setSoundEnabled(!soundEnabled); if (soundEnabled) stopSiren(); }}
          className={`p-1.5 rounded-xl border transition-all duration-300 relative z-30 ${
            soundEnabled 
              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
              : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
          }`}
          title={soundEnabled ? "Disable Siren Sound" : "Enable Siren Sound"}
        >
          {soundEnabled ? <Volume2 size={13} className="animate-pulse" /> : <VolumeX size={13} />}
        </button>
      </div>
    } glowColor={activeIncident ? "rgba(239, 68, 68, 0.25)" : "rgba(100, 116, 139, 0.08)"}>
      
      <div className="space-y-4">
        {/* Buttons Panel */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'vm', label: '💥 VM Outage', type: 'vm', desc: 'Outage failover' },
            { id: 'network', label: '🌪️ Net Loss', type: 'network', desc: '45% packet loss' },
            { id: 'dns', label: '🔒 DNS Poison', type: 'dns', desc: 'Pihole zones' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => triggerChaos(btn.type)}
              disabled={!!activeIncident || ddosActive || drStep > 0}
              className={`py-2 rounded-lg font-mono text-[9px] font-black uppercase transition-all duration-300 border text-center flex flex-col items-center justify-center relative z-20 ${
                activeIncident === btn.type
                  ? 'bg-red-500 text-black border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse'
                  : activeIncident || ddosActive || drStep > 0
                    ? 'bg-slate-900 border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-red-500/10 hover:border-red-500/20 active:scale-95'
              }`}
            >
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Real-time CRT Self-Healing Logging console */}
        <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl h-[120px] overflow-y-auto no-scrollbar scroll-smooth flex flex-col font-mono text-[9px] leading-relaxed text-left relative crt-screen">
          <div className="absolute top-1.5 right-2 text-[7px] font-black text-slate-600 uppercase tracking-widest select-none">
            {activeIncident ? `${CHAOS_INCIDENTS[activeIncident].title} Active` : "sre monitoring active"}
          </div>
          <div className="space-y-1 crt-text relative z-20">
            {chaosLogs.map((log, index) => {
              let logColor = 'text-slate-400';
              if (log.includes('[ALARM]')) logColor = 'text-red-400 font-bold';
              else if (log.includes('[OK]')) logColor = 'text-emerald-400 font-bold';
              else if (log.includes('[SRE-HEALER]')) logColor = 'text-amber-400/90';
              else if (log.includes('[SYSTEM]')) logColor = 'text-blue-400 font-extrabold';

              return (
                <div key={index} className={logColor}>
                  <span className="text-slate-600 mr-1.5 select-none">&gt;</span>
                  {log}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Interactive Container Inspector Drawer Component
const DockerProfilerDrawer = ({ containerKey, onClose }) => {
  const data = CONTAINER_DATA[containerKey];
  const [activeTab, setActiveTab] = useState('logs'); // logs | inspect
  const [status, setStatus] = useState('running'); // running | stopped | restarting
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [cpuLoad, setCpuLoad] = useState(1.4);
  const [ramLoad, setRamLoad] = useState(118);
  const consoleEndRef = useRef(null);
  const restartTimerRef = useRef(null); // cleared on unmount so a mid-restart close never leaks

  useEffect(() => () => clearInterval(restartTimerRef.current), []);

  useEffect(() => {
    if (!data) return;
    setVisibleLogs([...data.logs]);
    setStatus('running');
    setCpuLoad(parseFloat((0.8 + Math.random() * 2.2).toFixed(1)));
    setRamLoad(Math.floor(92 + Math.random() * 45));
  }, [containerKey, data]);

  // Handle live logs typing stream
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      const randomLog = DYNAMIC_LOG_POOL[Math.floor(Math.random() * DYNAMIC_LOG_POOL.length)];
      const now = new Date().toLocaleTimeString();
      setVisibleLogs(prev => [...prev, `[${now}] ${randomLog}`]);
      setCpuLoad(parseFloat((0.5 + Math.random() * 3.5).toFixed(1)));
      setRamLoad(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.min(Math.max(prev + delta, 80), 256);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [status]);

  // Autoscroll terminal to the bottom on new logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleLogs]);

  const handleRestart = () => {
    playSound('click');
    setStatus('restarting');
    setCpuLoad(0);
    const restartLogs = [
      "[SYSTEM] Restart request received from Docker Host Profiler",
      "[INFO] Sending SIGTERM signal to container daemon PID 29402...",
      "[OK] Daemon killed successfully.",
      "[INFO] Re-initializing environment namespaces and Docker network bridges...",
      "[OK] Network bridges successfully bound.",
      "[INFO] Allocating isolated compute sandbox and mounting volumes...",
      "[OK] Volume attachments clean.",
      "[SYSTEM] Virtualization context started. Telemetry engine fully online!"
    ];

    let index = 0;
    setVisibleLogs([]);

    restartTimerRef.current = setInterval(() => {
      if (index < restartLogs.length) {
        setVisibleLogs(prev => [...prev, restartLogs[index]]);
        index += 1;
      } else {
        clearInterval(restartTimerRef.current);
        setStatus('running');
        setVisibleLogs([...data.logs]);
        setCpuLoad(parseFloat((1.1 + Math.random() * 2.5).toFixed(1)));
      }
    }, 300);
  };

  const handleStop = () => {
    playSound('click');
    if (status === 'running') {
      setStatus('stopped');
      setCpuLoad(0);
      setVisibleLogs(prev => [...prev, "[WARNING] Container sandbox stopped by administrator daemon. Logging paused."]);
    } else {
      setStatus('running');
      setVisibleLogs(prev => [...prev, "[SYSTEM] Service started successfully. Resuming telemetry..."]);
    }
  };

  if (!data) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-slate-950/95 border-l border-white/10 shadow-2xl flex flex-col z-[110] font-mono overflow-hidden blueprint-dots crt-screen"
    >
      {/* Header Panel */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/60 relative">
        <div className="flex items-center gap-3.5">
          <div className="relative w-4 h-4 flex items-center justify-center rounded-full bg-slate-900 border border-white/10">
            <span className={`w-2.5 h-2.5 rounded-full ${
              status === 'running' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' 
              : status === 'restarting' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping'
              : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
            }`} />
          </div>
          <div className="text-left">
            <h4 className="text-[17px] font-black text-white italic uppercase tracking-tight">{data.name}</h4>
            <p className="text-[8px] text-slate-500 uppercase tracking-widest leading-none mt-1">Docker Daemon Profiler // Active</p>
          </div>
        </div>
        <button 
          onClick={() => { playSound('click'); onClose(); }}
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Resource Meters */}
      <div className="p-5 border-b border-white/5 bg-slate-900/30 grid grid-cols-2 gap-4 text-left">
        <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl space-y-1">
          <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Zap size={8} /> CPU Load</span>
            <span className="text-[#39ff14]">{cpuLoad}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#39ff14] rounded-full transition-all duration-700" style={{ width: `${cpuLoad * 10}%` }} />
          </div>
        </div>
        <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl space-y-1">
          <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Boxes size={8} /> Allocated RAM</span>
            <span className="text-azure-light">{ramLoad} MB</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-azure rounded-full transition-all duration-700" style={{ width: `${(ramLoad / 256) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-black/20 text-[9px] font-black uppercase tracking-widest">
        <button
          onClick={() => { playSound('click'); setActiveTab('logs'); }}
          className={`flex-1 py-3 text-center border-r border-white/5 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logs' ? 'bg-slate-900/50 text-[#39ff14] border-b-2 border-b-[#39ff14]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal size={10} /> CLI Console logs
        </button>
        <button
          onClick={() => { playSound('click'); setActiveTab('inspect'); }}
          className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-2 ${
            activeTab === 'inspect' ? 'bg-slate-900/50 text-[#39ff14] border-b-2 border-b-[#39ff14]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode size={10} /> Docker Inspect Config
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-black/40 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'logs' ? (
            <motion.div
              key="terminal-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col justify-between"
            >
              {/* Terminal View */}
              <div className="w-full bg-slate-950/90 border border-white/5 rounded-2xl p-4 flex-1 overflow-y-auto max-h-[360px] text-left text-[10px] font-mono leading-relaxed space-y-1.5 select-text no-scrollbar relative">
                <div className="absolute top-2 right-3 text-[7px] text-slate-500 uppercase tracking-widest select-none">stdout stream</div>
                {visibleLogs.map((log, idx) => {
                  let logColor = 'text-amber-500/90';
                  if (log.includes('[OK]')) logColor = 'text-emerald-400 font-bold';
                  if (log.includes('[WARNING]')) logColor = 'text-red-400 font-black animate-pulse';
                  if (log.includes('[SYSTEM]')) logColor = 'text-blue-400 font-extrabold';
                  
                  return (
                    <div key={idx} className={logColor}>
                      <span className="text-slate-600 mr-2 select-none">&gt;</span>
                      {log}
                    </div>
                  );
                })}
                <div ref={consoleEndRef} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inspect-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full text-left"
            >
              <pre className="p-4 bg-slate-950/90 border border-white/5 rounded-2xl text-[9px] text-[#00f0ff] overflow-x-auto max-h-[360px] leading-normal select-text no-scrollbar">
                <code>{JSON.stringify({
                  "Id": data.id,
                  "Created": data.created,
                  "Path": "/entrypoint.sh",
                  "Args": data.name === "Nextcloud" ? ["apache2-foreground"] : [],
                  "State": {
                    "Status": status,
                    "Running": status === 'running',
                    "CpuUsage": `${cpuLoad}%`,
                    "Memory": `${ramLoad}MB`
                  },
                  "Mounts": data.mounts,
                  "Config": {
                    "Image": data.image,
                    "ExposedPorts": { [data.port]: {} },
                    "Env": data.env
                  }
                }, null, 2)}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Drawer Footer Operations */}
      <div className="p-5 border-t border-white/10 bg-slate-950/80 grid grid-cols-2 gap-4">
        <button
          onClick={handleRestart}
          disabled={status === 'restarting'}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl font-mono text-[10px] font-black uppercase transition-all duration-300 border ${
            status === 'restarting'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-white/5'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          <RotateCcw size={12} className={status === 'restarting' ? 'animate-spin' : ''} />
          Restart Container
        </button>
        <button
          onClick={handleStop}
          disabled={status === 'restarting'}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl font-mono text-[10px] font-black uppercase transition-all duration-300 border ${
            status === 'restarting'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-white/5'
              : status === 'stopped'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
          }`}
        >
          {status === 'stopped' ? (
            <>
              <Play size={12} />
              Start Sandbox
            </>
          ) : (
            <>
              <Square size={12} />
              Stop Sandbox
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const Sparkline = ({ type, ddosActive, drStep }) => {
  const [points, setPoints] = React.useState(Array.from({ length: 20 }, () => 15));
  // Pause the 150ms tick once the sparkline scrolls out of view
  const [viewRef, inView] = useInViewPause('100px');

  React.useEffect(() => {
    if (!inView) return undefined;
    const interval = setInterval(() => {
      setPoints(prev => {
        let val;
        if (ddosActive && type === 'network') {
          val = 70 + Math.random() * 25; // Network spikes to 95%
        } else if (ddosActive && type === 'cpu') {
          val = 80 + Math.random() * 15; // CPU spikes to 95%
        } else if ((drStep === 2 || drStep === 3) && type === 'disk') {
          val = 60 + Math.random() * 35; // Disk IO spikes during backup restore
        } else {
          val = 15 + Math.sin(Date.now() / 400) * 8 + Math.random() * 5; // Idle wave
        }
        return [...prev.slice(1), val];
      });
    }, 150);
    return () => clearInterval(interval);
  }, [ddosActive, drStep, type, inView]);

  const width = 190;
  const height = 45;
  const maxVal = 100;
  const xStep = width / (points.length - 1);
  
  // Map points to SVG coordinates
  const pathD = points.map((p, i) => {
    const x = i * xStep;
    const y = height - (p / maxVal) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const strokeColor = ddosActive && (type === 'network' || type === 'cpu')
    ? 'stroke-red-500'
    : (drStep === 2 || drStep === 3) && type === 'disk'
      ? 'stroke-amber-500'
      : 'stroke-emerald-400';

  return (
    <svg ref={viewRef} className="w-full h-[45px]" viewBox={`0 0 ${width} ${height}`}>
      <path d={pathD} fill="none" className={`transition-all duration-300 ${strokeColor}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const WorkloadLayer = () => {
  const [isTranscoding, setIsTranscoding] = React.useState(false);
  const [transcodeSpeed, setTranscodeSpeed] = React.useState(4.2);
  const [gpuLoad, setGpuLoad] = React.useState(34);
  const [bufferLevel, setBufferLevel] = React.useState(65);

  const [ddosActive, setDdosActive] = React.useState(false);
  const [drStep, setDrStep] = React.useState(0);

  // Inspector state
  const [inspectContainer, setInspectContainer] = useState(null); // nextcloud | vaultwarden | ...

  React.useEffect(() => {
    if (!isTranscoding) return;
    const interval = setInterval(() => {
      setTranscodeSpeed(parseFloat((3.8 + Math.random() * 0.8).toFixed(1)));
      setGpuLoad(Math.floor(29 + Math.random() * 11));
      setBufferLevel(prev => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2);
        return Math.min(Math.max(next, 55), 75);
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isTranscoding]);

  // Global simulation bus
  useSimEvent(SIM_EVENTS.ddos, ({ active }) => setDdosActive(active));
  useSimEvent(SIM_EVENTS.dr, ({ step }) => setDrStep(step));
  useSimEvent(SIM_EVENTS.transcode, ({ active }) => setIsTranscoding(active));

  // Disable background scrolling when drawer is active
  useEffect(() => {
    if (inspectContainer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [inspectContainer]);

  return (
    <section className="mb-24 relative select-none">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 4: Distributed Services & Workloads</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Docker Ecosystem, Microservices, Reverse Proxy, Observability</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Docker Pool */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title={
              <div className="flex items-center gap-3">
                <DockerLogo className="w-6 h-6 text-[#2496ED]" />
                <div className="flex flex-col">
                  <span className="leading-tight">Docker Container Pool</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#2496ED]/70 font-black mt-1">Declarative Workloads</span>
                </div>
              </div>
            }
            glowColor="rgba(36, 150, 237, 0.15)"
          >
            {/* Control Bar Hint */}
            <div className="mt-2 text-left bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders size={10} className="text-[#2496ED]" />
                Tactile Host Node Daemon Active
              </span>
              <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest animate-pulse font-black">
                🖱️ Click container to inspect daemon
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
              <div>
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic">Productivity & Access</h4>
                <div className="space-y-3">
                  <ServiceItem name="Nextcloud" tag="AIO - Data Hub" color="azure" onClick={() => setInspectContainer('nextcloud')} />
                  <ServiceItem name="Vaultwarden" tag="Bitwarden Core" color="emerald" onClick={() => setInspectContainer('vaultwarden')} />
                  <ServiceItem name="Guacamole" tag="RDP Gatehouse" color="amber" onClick={() => setInspectContainer('guacamole')} />
                  <ServiceItem name="Homepage" tag="Services Dashboard" color="emerald" onClick={() => setInspectContainer('homepage')} />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic">Network Utilities</h4>
                <div className="space-y-3">
                  <ServiceItem name="Nginx Proxy Mgr." tag="Edge Certs" color="azure" onClick={() => setInspectContainer('nginx')} />
                  <ServiceItem name="Pi-hole" tag="Recursive DNS" color="emerald" onClick={() => setInspectContainer('pihole')} />
                  <ServiceItem name="Uptime Kuma" tag="Telemetry Hub" color="emerald" onClick={() => setInspectContainer('uptime')} />
                  <ServiceItem name="Dozzle" tag="Log Aggregation" color="muted" onClick={() => setInspectContainer('dozzle')} />
                </div>
              </div>
            </div>
          </Card>

          {/* High-Performance Host Workload (PLEX) */}
          <Card 
            title={
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#EBA000]/10 border border-[#EBA000]/20 rounded-lg">
                  <PlexLogo className="w-5 h-5 text-[#EBA000]" />
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight">Performance Host Workloads</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#EBA000]/70 font-black mt-1">Native GPU acceleration</span>
                </div>
              </div>
            }
            glowColor="rgba(235, 160, 0, 0.1)"
          >
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/plex">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EBA000]/10 rounded-xl flex items-center justify-center border border-[#EBA000]/20 group-hover/plex:scale-110 transition-transform">
                    <PlexLogo className="w-7 h-7 text-[#EBA000]" />
                  </div>
                  <div>
                    <h5 className="text-lg font-black text-white italic uppercase tracking-tight text-left">Plex Media Server</h5>
                    <p className="text-[10px] text-slate-500 font-mono text-left">Running natively on ZuluServer (Ubuntu)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => triggerTranscode(!isTranscoding)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-black uppercase transition-all duration-300 relative z-20 ${
                      isTranscoding 
                        ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse' 
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isTranscoding ? '⏹ Stop HW Stream' : '▶ Simulate 4K transcode'}
                  </button>
                  <div className="hidden sm:flex gap-2">
                    <Badge color="amber">IHD Graphics Passthrough</Badge>
                    <Badge color="azure">Native Performance</Badge>
                  </div>
                </div>
             </div>
             
             {isTranscoding && (
                <div className="mt-4 p-4 bg-black/60 border border-amber-500/20 rounded-2xl space-y-4 relative overflow-hidden crt-screen">
                  <div className="flex justify-between items-center text-[8px] font-mono text-amberGold border-b border-white/5 pb-2 relative z-20 crt-text">
                    <span>INTEL QUICK SYNC VIDEO (QSV) DECODE/ENCODE PIPELINE</span>
                    <span className="flex items-center gap-1.5 uppercase font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Hardware Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4 font-mono text-[10px] py-2 relative z-20 text-slate-300">
                    <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 relative">
                      <span className="text-slate-500 font-extrabold uppercase text-[7px] tracking-wider mb-1">Source Stream</span>
                      <span className="text-white font-black uppercase text-[10px] italic">4K HEVC HDR10</span>
                      <span className="text-slate-400 text-[8px] mt-0.5">Bitrate: 68 Mbps</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 relative group">
                      <span className="text-amberGold font-extrabold uppercase text-[7px] tracking-wider mb-1 crt-text">GPU Transcoder</span>
                      <span className="text-amber-400 font-black uppercase text-[10px] italic flex items-center gap-1">
                        <Zap size={10} className="animate-bounce" /> QSV Engine
                      </span>
                      <span className="text-slate-400 text-[8px] mt-0.5">Speed: {transcodeSpeed}x</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-slate-500 font-extrabold uppercase text-[7px] tracking-wider mb-1">Destination</span>
                      <span className="text-white font-black uppercase text-[10px] italic text-emerald-400">1080P H.264 SDR</span>
                      <span className="text-slate-400 text-[8px] mt-0.5">Bitrate: 8 Mbps</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[9px] border-t border-white/5 pt-3 relative z-20 crt-text text-slate-300 text-left">
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Intel UHD Graphics 730 Load</span>
                        <span className="text-amber-400 font-bold">{gpuLoad}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${gpuLoad}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Hardware Transcode Buffer Fill</span>
                        <span className="text-emerald-400 font-bold">{bufferLevel}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${bufferLevel}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
             )}

              <p className="text-[11px] text-slate-500 italic mt-4 leading-relaxed px-2 text-left">
                Strategically deployed as a native host-OS application to ensure direct access to <strong>Intel QuickSync GPU</strong> instructions for 4K HW transcoding, bypassing containerized driver overhead.
              </p>
          </Card>
        </div>

        {/* Right Column: Observability & Chaos Incident Cockpit */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Observability Stack" glowColor="rgba(16, 185, 129, 0.1)">
            <div className="space-y-6">
              {/* Real-time Observability Sparklines HUD */}
              <div className="p-4 bg-black/60 border border-white/5 rounded-2xl space-y-4 crt-screen">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-emerald-400 border-b border-white/5 pb-1 relative z-20 crt-text">
                  <span>Grafana Live Telemetry</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Real-time
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 relative z-20 font-mono text-[9px] text-left">
                  {/* CPU Sparkline */}
                  <div className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-2 text-slate-300">
                    <span className="text-slate-500 font-extrabold uppercase text-[7px] leading-none mb-1">Sim CPU</span>
                    <span className={`text-[11px] font-black italic ${ddosActive ? 'text-red-400' : 'text-emerald-400'}`}>
                      {ddosActive ? '94.6%' : '14.2%'}
                    </span>
                    <div className="mt-1">
                      <Sparkline type="cpu" ddosActive={ddosActive} drStep={drStep} />
                    </div>
                  </div>

                  {/* Net Sparkline */}
                  <div className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-2 text-slate-300">
                    <span className="text-slate-500 font-extrabold uppercase text-[7px] leading-none mb-1">Sim Net</span>
                    <span className={`text-[11px] font-black italic ${ddosActive ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {ddosActive ? '892 MB/s' : '412 KB/s'}
                    </span>
                    <div className="mt-1">
                      <Sparkline type="network" ddosActive={ddosActive} drStep={drStep} />
                    </div>
                  </div>

                  {/* Disk IO Sparkline */}
                  <div className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-2 text-slate-300">
                    <span className="text-slate-500 font-extrabold uppercase text-[7px] leading-none mb-1">Sim Disk</span>
                    <span className={`text-[11px] font-black italic ${(drStep === 2 || drStep === 3) ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                      {(drStep === 2 || drStep === 3) ? '280 MB/s' : '1.8 MB/s'}
                    </span>
                    <div className="mt-1">
                      <Sparkline type="disk" ddosActive={ddosActive} drStep={drStep} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">Full-Stack Metrics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge color="emerald">Prometheus</Badge>
                  <Badge color="azure">Grafana</Badge>
                  <Badge color="muted">Netdata</Badge>
                </div>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-slate-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">Edge Security</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge color="muted">Authelia</Badge>
                  <Badge color="amber">CrowdSec</Badge>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 italic">Future Roadmap</h4>
                 <Badge color="azure" className="w-full justify-center py-2 opacity-50">K3s Migration Phase 2</Badge>
              </div>
            </div>
          </Card>

          {/* SRE Chaos Incident Deck */}
          <SREChaosIncidentDeck ddosActive={ddosActive} drStep={drStep} />
        </div>
      </div>

      <RationaleSection title="Rationale: Container-First Abstraction" color="azure" icon={Boxes}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-azure" /> Strategic Abstraction
            </h6>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              Decoupling services from the host OS via <strong>Docker</strong> ensures that the core infrastructure remains "clean". This containerized approach allows for rapid testing, easy migration between Proxmox nodes, and simplified dependency management across the entire distributed fleet.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational Flow
            </h6>
            <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>GitOps Reconciliation:</strong> Instead of imperative updates, the system utilizes a declarative pull-model via Git repositories to sync container states.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Persistence:</strong> Named Docker volumes are backed up daily using the Layer 3.5 pipeline to ensure no data loss during service migrations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Isolation:</strong> Services are partitioned into distinct network bridges to prevent lateral movement between workloads.</span>
              </li>
            </ul>
          </div>
        </div>
      </RationaleSection>

      {/* Slide-out Terminal/JSON Inspector Overlay */}
      <AnimatePresence>
        {inspectContainer && (
          <>
            {/* Backdrop lock blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectContainer(null)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            />
            <DockerProfilerDrawer 
              containerKey={inspectContainer} 
              onClose={() => setInspectContainer(null)} 
            />
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

const ServiceItem = ({ name, tag, color, onClick }) => {
  const glowColors = {
    azure: "bg-azure shadow-[0_0_8px_#3b82f6]",
    emerald: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    amber: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
    muted: "bg-slate-700 shadow-none"
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3.5 bg-slate-900 border border-white/10 rounded-2xl hover:border-white/30 hover:scale-[1.02] active:scale-98 transition-all group/item shadow-lg relative overflow-hidden cursor-pointer"
    >
      <div className={`absolute top-0 left-0 bottom-0 w-1 transition-opacity ${glowColors[color]}`} />
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-white italic tracking-tight uppercase leading-none mb-1 group-hover/item:text-azure-light transition-colors">{name}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black opacity-60 italic">{tag}</span>
        </div>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${glowColors[color]}`} />
    </div>
  );
};

const Activity = ({ className, size, strokeWidth }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default WorkloadLayer;
