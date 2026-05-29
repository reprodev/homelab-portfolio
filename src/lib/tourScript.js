import { triggerDdos, triggerDr, triggerTranscode } from './simBus';

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
    sectionId: 'layer-1',
    title: 'Layer 1 — Zero Trust Edge',
    caption: 'Watch the Cloudflare WAF absorb a simulated DDoS while the whole fleet goes red.',
    durationMs: 8500,
    onEnter: () => triggerDdos(true),
    onExit: () => triggerDdos(false),
  },
  {
    sectionId: 'layer-2',
    title: 'Layer 2 — Hardware Infrastructure',
    caption: 'A Proxmox hypervisor running a decoupled fleet of VMs across NVMe + SATA storage.',
    durationMs: 6000,
  },
  {
    sectionId: 'layer-3',
    title: 'Layer 3 — Logical Orchestration',
    caption: 'Declarative GitOps reconciliation with Terraform and Ansible.',
    durationMs: 6000,
  },
  {
    sectionId: 'layer-dr',
    title: 'Layer 3.5 — Disaster Recovery',
    caption: 'A live Veeam failover drill — sub-5s RTO, zero data loss, 3-2-1 strategy.',
    durationMs: 9500,
    onEnter: () => triggerDr(1),
    onExit: () => triggerDr(0),
  },
  {
    sectionId: 'layer-4',
    title: 'Layer 4 — Distributed Workloads',
    caption: 'Containerised services plus native Plex 4K HW transcode on Intel QuickSync.',
    durationMs: 7500,
    onEnter: () => triggerTranscode(true),
    onExit: () => triggerTranscode(false),
  },
  {
    sectionId: 'knowledge-base',
    title: 'Layer 5 — Knowledge & Projects',
    caption: 'Deep-dive guides and open-source tools — the story behind the stack.',
    durationMs: 6000,
  },
];

export const TOUR_START_EVENT = 'homelab-tour-start';
