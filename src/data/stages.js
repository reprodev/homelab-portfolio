/*
  stages.js — the lifecycle stages as a skimmer sees them (V6).

  Feeds three views: StageNav (rail / bottom bar), SkimStrip (the 60-second row
  under the hero) and StageBento (the headline tiles each stage shows before it
  is opened). Same rules as the other data modules: no JSX, and **no new facts**.
  Every tile is either derived from fleet/storage/security/observability or
  restates copy that already appears in that stage's own section — so a number
  changed there changes here too (honesty rule, CLAUDE.md #10).

  Shape:
    id        anchor the nav scrolls to (a legacy section id, or `stage-run`)
    sections  section ids that count as "in this stage" for the scrollspy
    num/title/short  labels; `short` fits the mobile bottom bar
    proves    one line: what this stage demonstrates
    headline  the one fact the skim strip shows
    tiles     [{ stat, label, sub? }] — 4 per stage
    ctas      [{ label, sim, target }] — sim keys map to bus helpers in StageBento
*/
import { HOST_VITALS, FLEET } from './fleet';
import { STORAGE } from './storage';
import { SECURITY_HEADLINE } from './security';
import { OBSERVABILITY_GROUPS } from './observability';

const [vmCount, lxcCount] = HOST_VITALS.guests.split(' · '); // '9 VMs', '3 LXCs'
const activeDisks = STORAGE.filter((d) => !d.idle);
const alwaysOnHosts = FLEET.filter((n) => !n.ephemeral);
const zulu = FLEET.find((n) => n.id === 'zulu');
const zuluContainers = zulu?.details.services.find((s) => /containers/i.test(s))?.match(/~?\d+/)?.[0];
const observabilityCount = OBSERVABILITY_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const STAGES = [
  {
    id: 'layer-code',
    sections: ['layer-code'],
    num: '01',
    title: 'Code',
    short: 'Code',
    fullTitle: 'Infrastructure as Code Pipeline',
    proves: 'Infrastructure as code, CI security gates and scheduled config management.',
    headline: 'Terraform + Ansible, gated and scheduled in GitLab CI',
    tiles: [
      { stat: '5', label: 'Pipeline stages', sub: 'Git → CI → Packer → Terraform → Ansible' },
      { stat: '3', label: 'CI security gates', sub: 'gitleaks · checkov · trivy' },
      { stat: 'CI', label: 'Scheduled Ansible', sub: 'Nightly backups · cleanup · reboot audit' },
      { stat: 'WIP', label: 'Packer images', sub: 'HCL written, CI validated, build pending' },
    ],
    ctas: [{ label: 'Run terraform plan', sim: 'terraform', target: 'layer-code' }],
  },
  {
    id: 'layer-2',
    sections: ['layer-2'],
    num: '02',
    title: 'Provision',
    short: 'Provision',
    fullTitle: 'Bare-Metal & Hypervisor',
    proves: 'Hardware sizing, hypervisor design and storage tiering.',
    headline: `${HOST_VITALS.cpu.split(' · ')[0]} · ${HOST_VITALS.ram.split(' ')[0]} GB · ${vmCount} + ${lxcCount}`,
    tiles: [
      { stat: HOST_VITALS.ram.split(' DDR')[0], label: 'Hypervisor RAM', sub: `${HOST_VITALS.cpu} · ${HOST_VITALS.platform}` },
      { stat: vmCount.split(' ')[0], label: 'Virtual machines', sub: `plus ${lxcCount}` },
      { stat: String(activeDisks.length), label: 'Storage tiers', sub: 'NVMe · SATA SSD · HDD · external' },
      { stat: 'Pi 4', label: 'Separate control head', sub: 'Ingress survives hypervisor maintenance' },
    ],
    ctas: [],
  },
  {
    id: 'stage-run',
    sections: ['stage-run', 'layer-1', 'layer-3', 'layer-4'],
    num: '03',
    title: 'Run',
    short: 'Run',
    fullTitle: 'Edge, Fleet & Workloads',
    proves: 'Zero-trust edge, fleet operations and an observable container platform.',
    headline: `${SECURITY_HEADLINE.stat} inbound ports — every route is an outbound tunnel`,
    tiles: [
      { stat: SECURITY_HEADLINE.stat, label: SECURITY_HEADLINE.label, sub: 'Outbound-only Cloudflare tunnels' },
      { stat: String(alwaysOnHosts.length), label: 'Fleet hosts', sub: 'Bare metal, VMs and a Windows node' },
      { stat: zuluContainers || '—', label: 'Containers on the data core', sub: 'GitOps-managed on ZuluServer' },
      { stat: String(observabilityCount), label: 'Observability components', sub: 'Metrics · alerting · logs · network' },
    ],
    ctas: [
      { label: 'Simulate a DDoS', sim: 'ddos', target: 'layer-1' },
      { label: 'Simulate a 4K transcode', sim: 'transcode', target: 'layer-4' },
    ],
  },
  {
    id: 'layer-dr',
    sections: ['layer-dr'],
    num: '04',
    title: 'Protect',
    short: 'Protect',
    fullTitle: 'Disaster Recovery & Continuity',
    proves: 'Backup design, offsite copies and a restore that has actually been tested.',
    headline: 'Veeam images plus a restore-tested offsite copy',
    tiles: [
      { stat: 'Veeam', label: 'Image-level backups', sub: 'Block-level incrementals of the Proxmox VMs' },
      { stat: 'Daily', label: 'Offsite copy', sub: 'To Dropbox, restore-tested' },
      { stat: 'Nightly', label: 'App-level backups', sub: 'SQLite (6 databases) + Vaultwarden, from CI' },
      { stat: '3-2-1', label: 'Backup strategy', sub: '3 copies · 2 media · 1 offsite' },
    ],
    ctas: [{ label: 'Run a DR drill', sim: 'dr', target: 'layer-dr' }],
  },
];

export const stageForSection = (sectionId) => STAGES.find((s) => s.sections.includes(sectionId));
