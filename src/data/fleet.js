/*
  fleet.js — single source of truth for hardware/host facts.

  Why this file exists: the same host used to be described in up to five places
  (LogicalLayer fleetData, HardwareLayer's vitals + node grid, Topology3D NODES,
  HypervisorTopology3D NODES) and the copies had drifted apart — OMV NAS was
  "80GB Disk" in one file and "6TB passthrough" in another, and the DietPi disk
  sizes disagreed. Facts live here now; components own presentation.

  CONVENTIONS
  - No JSX. Components map `iconKey` → a BrandLogos component, so this stays a
    plain data module.
  - No layout. The 3D scenes keep their own hand-tuned `pos` coordinates and edge
    wiring (invariant §5 / showstoppers: topology anchoring is a hard rule) and
    pull only *text* from here via `fleetById`.
  - NO REAL IPs, hostnames beyond those already public, port numbers, or account
    identifiers. Everything in src/ ships to the browser as readable strings.
    New hosts added in V5.3 use generic role names on purpose.
*/

// ---------------------------------------------------------------------------
// Shared spec fragments — defined once so two views can never disagree again.
// ---------------------------------------------------------------------------
const DIETPI_RAM = '2GB Allocated';
const DIETPI_DISK = '8GB Disk';
// OMV serves two distinct volumes: the internal 6TB SATA drive passed straight
// through from the hypervisor, and a 10TB external USB3 volume. Both are
// re-exported over SMB/CIFS and NFS.
// Verified against the guest 2026-08-15 — the OS disk is a 16GB virtual disk
// (the site previously claimed 80GB) and RAM is 5GB (previously claimed 8GB).
const OMV_DISK = '16GB OS · 6TB Passthrough · 10TB USB3';

/*
  Proxmox host vitals — verified against the host 2026-08-15 (lsblk + dmidecode).
  Intel i5-8400: 6 cores / 6 threads (no hyperthreading, so cores == threads).
  RAM: 4 × 16GB Crucial Ballistix Sport LT DDR4-2666, dual-channel.
*/
export const HOST_VITALS = {
  // `cpu` already states 6C / 6T — a separate `threads` field was redundant and
  // went unrendered, so it was removed rather than left as dead data.
  cpu: 'i5-8400 · 6C / 6T',
  ram: '64 GB DDR4-2666',
  controller: 'VirtIO SCSI',
  platform: 'Proxmox VE 9.1',
  guests: '9 VMs · 3 LXCs',
};

// ---------------------------------------------------------------------------
// Logical compute fleet — the node rings in LogicalLayer.
// `id` values are load-bearing: LogicalLayer's terminal scripts and PROMPT_NAMES
// key off them. Do not rename without updating that component.
// ---------------------------------------------------------------------------
export const FLEET = [
  {
    id: 'pi4',
    iconKey: 'raspberrypi',
    name: 'pibuster4',
    tag: 'Bare-metal',
    sub: 'Control Head / Ingress',
    percent: 45,
    color: 'emerald',
    details: {
      os: 'Debian 13 (Trixie)',
      cpu: '4-Core Cortex-A72 @ 1.8GHz',
      ram: '4GB LPDDR4',
      disk: '525GB SATA SSD (USB)',
      net: 'Eth0 (Physical)',
      services: ['Cloudflared HA', 'Ansible Controller', 'Dozzle Fleet Hub', 'Gateway Suite'],
      guideUrl: 'https://reprodev.com/set-up-raspberry-pi/',
    },
  },
  {
    id: 'zulu',
    iconKey: 'ubuntu',
    name: 'ZuluServer',
    tag: 'Ubuntu VM',
    sub: 'Data Core / Observability',
    percent: 85,
    color: 'amber',
    details: {
      os: 'Ubuntu Server (HWE)',
      cpu: 'Proxmox VM (6 vCPU)',
      ram: '16.8GB Allocated',
      disk: '180GB boot · NFS-bound state',
      net: 'virtio bridge (internal)',
      services: ['~40 GitOps Containers', 'Plex (bare-metal)', 'Prometheus / Grafana', 'Tdarr Server'],
      guideUrl: 'https://reprodev.com/tag/install-guides/',
    },
  },
  {
    id: 'ha',
    iconKey: 'dietpi',
    name: 'DietPi HA Fleet',
    tag: 'Micro VMs',
    sub: 'Distributed Services',
    percent: 30,
    color: 'azure',
    details: {
      os: 'DietPi (Optimized Debian)',
      cpu: '1-vCPU per Instance',
      ram: `${DIETPI_RAM} each`,
      disk: `${DIETPI_DISK} each`,
      net: 'HA Overlay (Mesh)',
      services: ['CF Tunnel (ha01)', 'Vaultwarden (ha02)', 'Guac / Pi-hole (ha03)'],
    },
  },
  {
    id: 'nas',
    iconKey: 'omv',
    name: 'OMV NAS VM',
    tag: 'Debian VM',
    sub: 'Disk Passthrough',
    percent: 70,
    color: 'emerald',
    details: {
      os: 'OpenMediaVault (Debian 13)',
      cpu: '2 vCPU · IOThread-Optimized',
      ram: '5GB Allocated',
      disk: OMV_DISK,
      // Not a separate physical storage network: guest-to-guest traffic rides the
      // hypervisor's virtio bridge, so it never touches a physical NIC at all.
      net: 'virtio bridge (internal)',
      services: ['SMB / CIFS Shares', 'NFSv4 Exports', '10TB Media Array', 'Time Machine Target'],
    },
  },
  // --- V5.3 additions -------------------------------------------------------
  {
    id: 'monitor',
    iconKey: 'raspberrypi',
    name: 'Monitor Node',
    tag: 'Out-of-band',
    sub: 'Independent Watchdog',
    percent: 15,
    color: 'azure',
    details: {
      os: 'DietPi / Debian 13 (Trixie)',
      cpu: '4-Core Cortex-A53 @ 1.0GHz',
      ram: '512MB LPDDR2',
      disk: '32GB microSD',
      net: 'WiFi (Independent path)',
      services: ['Uptime Kuma (Primary)', 'Telegram Alerter', 'Blackbox Probes', 'Node Exporter'],
    },
  },
  /*
    Not part of the always-on fleet. This is the AZ-802 study environment — a
    Windows Server / Azure hybrid lab that is spun up on demand and shut down
    again, so it is flagged `ephemeral` and rendered with a dashed tag chip. The
    site's established vocabulary for "present but deliberately not in the
    running set" (cf. the unmanaged pibuster4 node in TerraformSim).
  */
  {
    id: 'hybridlab',
    iconKey: 'windows',
    name: 'Hybrid Lab',
    tag: 'On-Demand',
    sub: 'AD / Azure Study Environment',
    percent: 0,
    color: 'azure',
    ephemeral: true,
    details: {
      os: 'Windows Server 2025',
      cpu: 'Hyper-V (nested)',
      ram: 'Allocated on spin-up',
      disk: 'Unattended rebuild from ISO',
      net: 'Isolated lab switch',
      services: ['Multi-DC AD Forest', 'Entra Connect Sync', 'Azure Arc Onboarding', 'Failover Cluster'],
      guideUrl: 'https://reprodev.com/tag/az-802/',
    },
  },
  {
    id: 'knightbox',
    iconKey: 'windows',
    name: 'Knightbox',
    tag: 'Windows Host',
    sub: 'Backup & GPU Compute',
    percent: 55,
    color: 'amber',
    details: {
      os: 'Windows 11 Pro',
      cpu: 'i7-12700K · 12C / 20T',
      ram: '64GB DDR5-5600',
      disk: '1TB NVMe + 3TB Veeam Repo',
      net: '2.5GbE (Physical)',
      services: ['Veeam B&R Hub (7 jobs)', 'RTX 3070 · NVENC Worker', 'Local LLM Inference'],
    },
  },
];

// ---------------------------------------------------------------------------
// Proxmox guests — the "Active Virtual Nodes" grid in HardwareLayer.
// A different slice of the same lab: these are hypervisor guests, whereas FLEET
// groups by logical role. Shared specs come from the constants above.
// ---------------------------------------------------------------------------
/*
  These are the guests that are ACTUALLY RUNNING (verified on the hypervisor
  2026-08-15: 9 VMs + 3 LXCs). Do not add a guest here because a Terraform config
  exists for it — an earlier V5.3 draft listed a Semaphore LXC and an OPNsense
  gateway on that basis and both were wrong: the OPNsense environment is named
  `opnsense-sandbox` and neither is deployed. Declared ≠ running.
*/
export const VIRTUAL_NODES = [
  { name: 'ZuluServer', sub: 'Docker + Plex • Ubuntu', managed: 'Terraform', color: 'emerald', iconKey: 'ubuntu' },
  { name: 'OMV NAS', sub: OMV_DISK, managed: 'Terraform', color: 'azure', iconKey: 'omv' },
  { name: 'ha01 (CF)', sub: `${DIETPI_DISK} • DietPi`, color: 'emerald', iconKey: 'dietpi' },
  { name: 'ha02 (Vault)', sub: `${DIETPI_DISK} • DietPi`, color: 'emerald', iconKey: 'dietpi' },
  { name: 'ha03 (Guac)', sub: `${DIETPI_DISK} • DietPi`, color: 'emerald', iconKey: 'dietpi' },
  { name: 'DietReproPi', sub: `${DIETPI_DISK} • DietPi`, color: 'emerald', iconKey: 'dietpi' },
  // K3s runs, but only as a rebuildable sandbox — no production workload has
  // moved onto it. Labelled so nobody reads it as a production cluster.
  { name: 'k3s-server', sub: 'Sandbox cluster • control', color: 'azure' },
  { name: 'k3s-agent', sub: 'Sandbox cluster • worker', color: 'azure' },
  { name: 'sql-triage-lab', sub: 'Ephemeral test bench', color: 'amber' },
  { name: 'LXC Pool', sub: 'jellyfin · cockpit · it-tools', color: 'emerald' },
  { name: 'Templates', sub: 'Cloud-Init Golden Images', color: 'amber' },
];

// ---------------------------------------------------------------------------
// Lookup used by the 3D scenes so their inspector copy can't drift from FLEET.
// ---------------------------------------------------------------------------
export const fleetById = (id) => FLEET.find((n) => n.id === id);
