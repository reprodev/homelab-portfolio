import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import { Calendar, CheckCircle2, ChevronRight, Server, Cloud, ShieldCheck, Cpu } from 'lucide-react';

const playClick = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
};

const JourneyLayer = () => {
  const [activeMonth, setActiveMonth] = useState(1);

  const roadmapData = [
    {
      month: 1,
      title: "Month 1: Enterprise On-Prem Base",
      subtitle: "Securing & standardizing the compute fleet",
      status: "100% COMPLETE",
      color: "emerald",
      icon: Server,
      achievements: [
        {
          title: "Declarative GitOps Bootstrap (ArgoCD)",
          desc: "Deployed ArgoCD in-cluster to manage standard workload states from GitLab repositories, replacing push-based scripting with self-healing, pull-based reconciliation loops.",
          evidence: "SSH deploy key authentication, passwordless repository access, automated drift correction."
        },
        {
          title: "Lightweight Observability Stack (Prometheus + Grafana)",
          desc: "Provisioned the Prometheus operator stack customized for tight 2GB RAM limits (disabled Alertmanager, tuned retention to 1 day, capped StatefulSet memory at 512Mi).",
          evidence: "Enabled custom systemd swapfiles across physical nodes to prevent CPU thrashing."
        },
        {
          title: "Vulnerability Scanning & Supply Chain SecOps",
          desc: "Built automated container building pipelines with multi-stage Dockerfiles (reducing image sizes by 70%) and hardwired pre-push Trivy scanning stages.",
          evidence: "Zero High/Critical CVE target threshold enforced on build pipelines."
        }
      ]
    },
    {
      month: 2,
      title: "Month 2: Scaling to Hybrid Cloud",
      subtitle: "Bridging physical hypervisors with secure cloud IaC",
      status: "100% COMPLETE",
      color: "azure",
      icon: Cloud,
      achievements: [
        {
          title: "Production AWS Multi-AZ Networking",
          desc: "Declaratively built a Multi-AZ VPC utilizing modularized HashiCorp Terraform state configs in eu-west-2, distributed across symmetric Availability Zones.",
          evidence: "Zero idle-cost design excluding NAT Gateways, relying on isolated private boundaries."
        },
        {
          title: "Secure S3 Backend State Locking",
          desc: "Bootstrapped remote state storage using S3 with AES256 server-side encryption and DynamoDB locking tables to allow secure, concurrent team runs.",
          evidence: "VPC remote state files linked dynamically to workload task specifications."
        },
        {
          title: "Serverless Compute & Offsite Backups",
          desc: "Migrated Flask status containers to AWS ECS Fargate, scaling tasks to minimal bounds (0.25 vCPU / 512MB RAM) at exactly $0.00/mo idle operating costs.",
          evidence: "Automated daily Vaultwarden backups pushed to S3 with restricted-scope IAM policies."
        }
      ]
    },
    {
      month: 3,
      title: "Month 3: Hardening & Interactive Telemetry",
      subtitle: "Showcasing resilience, live telemetry, and visual assets",
      status: "IN PROGRESS",
      color: "amber",
      icon: ShieldCheck,
      achievements: [
        {
          title: "Interactive SVG GitOps Topology Canvas",
          desc: "Redesigned the Logical Layer dashboard into a coordinate-anchored dynamic SVG path canvas illustrating the GitOps hybrid trace loop in real-time.",
          evidence: "Laser path wave particles, pulsating node sonar rings, and custom brand morph graphics."
        },
        {
          title: "K3s Pod Autoscaler & Load Balancer Sandbox",
          desc: "Built a fully reactive Horizontal Pod Autoscaler (HPA) simulation demonstrating automatic pod scaling, HAProxy load distribution, and Web Audio acoustic chimes.",
          evidence: "Zero-dependency auditory oscillators, and framer-motion replica scale-up animations."
        },
        {
          title: "CV Rebranding & Interview Drills (Handoff Draft)",
          desc: "Reframing homelab assets as a high-fidelity automated hybrid-cloud infrastructure sandbox, utilizing standard-compliant STAR storytelling frameworks.",
          evidence: "Detailed technical interview runbooks focusing on DevSecOps, IaC, and S3 DR protocols."
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 font-mono text-[10px] text-slate-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Month Selector Buttons - 4 Columns */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
            <Calendar size={12} className="text-azure-light" /> Modernization Phases
          </h4>
          
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
            {roadmapData.map((phase) => {
              const isActive = activeMonth === phase.month;
              const Icon = phase.icon;
              
              const accentColor = 
                phase.month === 1 ? 'border-emerald-500/30 text-emerald-400' :
                phase.month === 2 ? 'border-azure/30 text-azure' :
                'border-amber-500/30 text-amber-400';
              
              return (
                <motion.button
                  key={phase.month}
                  whileHover={{ x: isActive ? 0 : 5, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setActiveMonth(phase.month);
                    playClick();
                  }}
                  className={`flex-1 shrink-0 w-[75vw] lg:w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-md relative snap-center ${
                    isActive 
                      ? 'bg-slate-900/60 border-white/20 shadow-xl' 
                      : 'bg-slate-950/20 border-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`p-2 bg-black/40 rounded-xl border border-white/5 ${isActive ? accentColor : 'text-slate-500'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black italic text-white uppercase text-[9px] tracking-tight truncate">Month {phase.month}</span>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 border rounded uppercase tracking-tighter ${accentColor}`}>
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-[8px] text-slate-500 font-medium truncate">{phase.subtitle}</p>
                  </div>
                  
                  {isActive && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 hidden lg:block ${accentColor}`}>
                      <ChevronRight size={16} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Panel - 8 Columns */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeMonth && (
              <motion.div
                key={activeMonth}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card 
                  title={
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      <span>{roadmapData.find(p => p.month === activeMonth).title}</span>
                    </div>
                  }
                  glowColor={
                    activeMonth === 1 ? 'rgba(16, 185, 129, 0.08)' :
                    activeMonth === 2 ? 'rgba(96, 165, 250, 0.08)' :
                    'rgba(245, 158, 11, 0.08)'
                  }
                  className="border border-white/5"
                >
                  <div className="space-y-6">
                    {roadmapData.find(p => p.month === activeMonth).achievements.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start border-l border-white/5 pl-4 ml-1 relative">
                        {/* Dynamic timeline node indicator */}
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-[#050505] bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                        
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h5 className="text-[11px] font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                            <span>{item.title}</span>
                            <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                          </h5>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                            {item.desc}
                          </p>
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[7.5px] font-black uppercase text-slate-600 tracking-wider">Telemetry Evidence:</span>
                            <span className="text-[8px] font-mono text-emerald-300 font-bold tracking-tight bg-emerald-950/10 border border-emerald-500/10 px-2 py-0.5 rounded-md truncate">
                              {item.evidence}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JourneyLayer;
