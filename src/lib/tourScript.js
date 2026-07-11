import { triggerDdos, triggerDr, triggerTranscode, triggerTerraform } from './simBus';

/*
  tourScript — the scripted sequence the GuidedTour controller plays back.

  Each step:
    sectionId   DOM id to scroll to (matches CollapsibleSection / section ids)
    title       short heading shown in the narration bar
    caption     one-line narration
    durationMs  how long to dwell before advancing (>= any sim it triggers)
    onEnter()   optional: fire sim-bus helpers to auto-run the matching demo
    onExit()    optional: clean up the sim it started
*/
export const TOUR_STEPS = [
  {
    sectionId: 'topology',
    title: 'Live Infrastructure Topology',
    caption: 'A real-time 3D map: Cloudflare edge → tunnel nodes → Proxmox core → workloads.',
    durationMs: 6000,
  },
  {
    sectionId: 'layer-code',
    title: 'Lifecycle 01 — Code',
    caption: 'terraform plan → apply: watch the fleet converge to its declared state, resource by resource.',
    durationMs: 17000, // covers plan (~6.1s) + auto-chain (1.2s) + apply (~7.7s) + a beat on 'done'
    onEnter: () => triggerTerraform('plan', { auto: true }),
    onExit: () => triggerTerraform('idle'),
  },
  {
    sectionId: 'layer-2',
    title: 'Lifecycle 02 — Provision',
    caption: 'A Proxmox hypervisor running a decoupled fleet of VMs across NVMe + SATA storage.',
    durationMs: 6000,
  },
  {
    sectionId: 'layer-1',
    title: 'Lifecycle 03 — Run: Zero Trust Edge',
    caption: 'Watch the Cloudflare WAF absorb a simulated DDoS while the whole fleet goes red.',
    durationMs: 8500,
    onEnter: () => triggerDdos(true),
    onExit: () => triggerDdos(false),
  },
  {
    sectionId: 'layer-3',
    title: 'Lifecycle 03 — Run: Compute Fleet',
    caption: 'The Terraform-declared fleet in operation — node consoles, K3s autoscaling, GitOps sync.',
    durationMs: 6000,
  },
  {
    sectionId: 'layer-4',
    title: 'Lifecycle 03 — Run: Workloads',
    caption: 'Containerised services plus native Plex 4K HW transcode on Intel QuickSync.',
    durationMs: 7500,
    onEnter: () => triggerTranscode(true),
    onExit: () => triggerTranscode(false),
  },
  {
    sectionId: 'layer-dr',
    title: 'Lifecycle 04 — Protect',
    caption: 'A live Veeam failover drill — sub-5s RTO, zero data loss, 3-2-1 strategy.',
    durationMs: 9500,
    onEnter: () => triggerDr(1),
    onExit: () => triggerDr(0),
  },
  {
    sectionId: 'knowledge-base',
    title: 'Lifecycle 05 — Learn: Knowledge & Projects',
    caption: 'Deep-dive guides and open-source tools — the story behind the stack.',
    durationMs: 6000,
  },
];

export const TOUR_START_EVENT = 'homelab-tour-start';
