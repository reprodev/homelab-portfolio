import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import Reveal from './Reveal';
import RationaleSection from './RationaleSection';
import TerraformSim from './TerraformSim';
import { Terminal as TerminalIcon, GitBranch, Layers } from 'lucide-react';
import { TerraformLogo, AnsibleLogo, PackerLogo } from './BrandLogos';
import { useSimEvent, SIM_EVENTS, usePrefersReducedMotion } from '../lib/simBus';

/*
  AutomationLayer — Lifecycle 01 · Code (section id "layer-code").

  The IaC control plane of the whole dashboard: pipeline strip (Git → CI →
  Packer → Terraform → Ansible), the TerraformSim plan→apply showstopper,
  the stack cards, and the honesty coverage row. Content/copy is specified in
  docs/iac-layer-spec.md §a — keep them in sync.
*/

// Pipeline strip stages. x = center on the 400-wide SVG canvas.
const PIPELINE_STAGES = [
  { id: 'git', label: 'Git Push', sub: 'homelab-infra', x: 35 },
  { id: 'ci', label: 'CI Validate', sub: 'fmt · tflint', x: 117 },
  { id: 'packer', label: 'Packer Image', sub: 'ubuntu-2404-golden', x: 199 },
  { id: 'terraform', label: 'Terraform', sub: 'plan · apply', x: 281 },
  { id: 'ansible', label: 'Ansible', sub: 'converge', x: 363 },
];

const PipelineStrip = () => {
  const reducedMotion = usePrefersReducedMotion();
  // Glow the Terraform stage while the sim is active — same bus event the sim
  // itself owns; purely presentational local state (no extra events).
  const [tfActive, setTfActive] = useState(false);
  useSimEvent(SIM_EVENTS.terraform, ({ phase }) => {
    setTfActive(phase === 'plan' || phase === 'apply');
  });

  return (
    <div className="relative w-full h-[110px] border border-white/5 bg-slate-950/40 rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      {/* Cyber grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 400 110" preserveAspectRatio="none" fill="none">
        <path d="M 35,48 L 363,48" stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} strokeDasharray="3 3" />
        {reducedMotion ? (
          <path d="M 35,48 L 363,48" stroke="url(#pipeline-flow)" strokeWidth={2} strokeLinecap="round" />
        ) : (
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            d="M 35,48 L 363,48"
            stroke="url(#pipeline-flow)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
        <defs>
          <linearGradient id="pipeline-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      {PIPELINE_STAGES.map((stage) => {
        const isTf = stage.id === 'terraform';
        const lit = isTf && tfActive;
        return (
          <div
            key={stage.id}
            className="absolute -translate-x-1/2 flex flex-col items-center gap-1 text-center z-10"
            style={{ left: `${(stage.x / 400) * 100}%`, top: '26%' }}
          >
            <div className={`px-2 py-1.5 rounded-xl border transition-all duration-500 font-mono text-[7px] sm:text-[8px] font-black uppercase tracking-wider
              ${lit
                ? 'bg-violet-500/15 border-violet-400 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.35)] scale-105'
                : 'bg-slate-900/60 border-white/10 text-slate-400'
              }`}
            >
              {stage.label}
            </div>
            <span className="text-[5.5px] sm:text-[6px] text-slate-600 font-mono leading-none">{stage.sub}</span>
          </div>
        );
      })}
    </div>
  );
};

const COVERAGE = [
  { label: 'ZuluServer', codified: true },
  { label: 'OMV NAS', codified: true },
  { label: 'ha01–ha03', codified: true },
  { label: 'pibuster4', codified: false },
  { label: 'Proxmox host', codified: false },
];

const AutomationLayer = () => (
  <section className="mb-24">
    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
      <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Lifecycle 01: Infrastructure as Code Pipeline</h3>
      <span className="text-sm font-mono text-slate-400">
        Core Skills: <strong className="text-violet-400 font-normal">Terraform, Packer, Ansible, GitOps CI/CD</strong>
      </span>
    </div>

    {/* Pipeline strip — the lifecycle in one line */}
    <Reveal>
      <PipelineStrip />
    </Reveal>

    {/* The showstopper: terraform plan → apply */}
    <Reveal delay={0.08}>
      <Card
        className="mt-6"
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <TerraformLogo className="w-5 h-5 text-[#7B42BC]" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">Terraform Control Plane</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-violet-400/70 font-black mt-1">Run the plan → apply pipeline</span>
              </div>
            </div>
            <GitBranch size={14} className="text-slate-600 hidden sm:block" />
          </div>
        }
        glowColor="rgba(123, 66, 188, 0.15)"
      >
        <p className="text-xs text-slate-400 italic leading-relaxed mb-4">
          The fleet below isn't hand-built — it's declared in HCL and converged by Terraform against the
          Proxmox hypervisor. Run a real plan→apply cycle: the diff streams in the terminal while the
          resource graph converges node by node. The 3D topology above reacts too.
        </p>
        <TerraformSim />
      </Card>
    </Reveal>

    {/* Stack cards: Terraform / Packer / Ansible */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <Reveal delay={0}>
        <Card title={
          <div className="flex items-center gap-3">
            <TerraformLogo className="w-5 h-5 text-[#7B42BC]" />
            <span>Declarative Provisioning</span>
          </div>
        } glowColor="rgba(123, 66, 188, 0.1)" className="h-full">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 italic leading-relaxed">
              <strong>HashiCorp Terraform</strong> provisions the core VM and LXC fleet on the Proxmox
              hypervisor — state-locked, plan-reviewed, and version-controlled in Git.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="muted">PVE-Provider</Badge>
              <Badge color="muted">Cloud-Init</Badge>
              <Badge color="muted">HCL-Modules</Badge>
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.08}>
        <Card title={
          <div className="flex items-center gap-3">
            <PackerLogo className="w-5 h-5 text-[#02A8EF]" />
            <span>Golden Images</span>
          </div>
        } glowColor="rgba(2, 168, 239, 0.1)" className="h-full">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 italic leading-relaxed">
              <strong>Packer</strong> bakes the <span className="font-mono text-slate-300">ubuntu-2404-golden</span> template
              (VMID 9001) with cloud-init and qemu-guest-agent preinstalled — the same template the
              plan's <span className="font-mono text-slate-300">clone</span> block provisions from.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="muted">Template 9001</Badge>
              <Badge color="muted">Cloud-Init Baked</Badge>
              <Badge color="muted">CI Built</Badge>
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.16}>
        <Card title={
          <div className="flex items-center gap-3">
            <AnsibleLogo className="w-5 h-5 text-[#EE0000]" />
            <span>Config Convergence</span>
          </div>
        } glowColor="rgba(238, 0, 0, 0.1)" className="h-full">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 italic leading-relaxed">
              <strong>RedHat Ansible</strong> takes over after provisioning — desired-state configuration
              of OS packages, user identities, and security hardening across the fleet.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="muted">Playbooks</Badge>
              <Badge color="muted">Inventory HA</Badge>
              <Badge color="muted">Vault Vars</Badge>
            </div>
          </div>
        </Card>
      </Reveal>
    </div>

    {/* Coverage chips — the honesty row */}
    <Reveal delay={0.1}>
      <div className="mt-6 p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Layers size={13} className="text-violet-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">IaC Coverage</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COVERAGE.map((item) => (
            <span
              key={item.label}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[9px] font-bold transition-colors
                ${item.codified
                  ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                  : 'bg-transparent border-dashed border-white/15 text-slate-500'
                }`}
            >
              {item.codified ? 'Codified' : 'Manual by choice'} · {item.label}
            </span>
          ))}
        </div>
        <span className="text-[9px] text-slate-500 italic sm:ml-auto shrink-0">
          Core fleet codified; the metal underneath is still hands-on — deliberately.
        </span>
      </div>
    </Reveal>

    <RationaleSection title="Rationale: Declarative State & GitOps" color="emerald" icon={TerminalIcon}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Infrastructure as Code (IaC)
          </h6>
          <p className="text-slate-400 text-xs font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
            Treating infrastructure as "cattle, not pets" is central to this design. Core nodes are
            provisioned via <strong>Terraform</strong> from <strong>Packer</strong> golden images and
            configured via <strong>Ansible</strong>. This ensures the environment is reproducible and
            version-controlled — a destroyed VM is a five-minute rebuild, not a weekend.
          </p>
        </div>
        <div>
          <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-azure" /> Strategic Decision
          </h6>
          <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold">◃</span>
              <span><strong>Desired State:</strong> Systemd timers execute automated reconciliation to sync cluster state with Git repositories.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold">◃</span>
              <span><strong>Automation Layer:</strong> Ansible handles the imperative host setup while Docker Compose manages the declarative workload stack.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold">◃</span>
              <span><strong>Honest Coverage:</strong> The bare-metal ARM head (pibuster4) and the hypervisor itself stay hands-on by choice — codified core, hands-on edge.</span>
            </li>
          </ul>
        </div>
      </div>
    </RationaleSection>
  </section>
);

export default AutomationLayer;
