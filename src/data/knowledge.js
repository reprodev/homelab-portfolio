/*
  knowledge.js — the writing/portfolio catalogue behind KnowledgeLayer.

  Moved out of the component in V5.4 when the content roughly tripled. Same rules
  as the other data modules: no JSX (components map `iconKey` to a lucide icon),
  and facts live here rather than in markup.

  Content sets:
    SERIES   — multi-part series and tag archives. One card stands for 3–9 posts,
               which is what keeps ~24 new items from becoming a wall of cards.
    GUIDES   — individual standalone write-ups.
    PROJECTS — shipped software and open-source work.

  Components consume KNOWLEDGE (= SERIES + GUIDES, one filterable grid — see
  FACETS) and PROJECTS (its own row). SERIES and GUIDES are exported as the
  composition inputs, not as the rendering API; import KNOWLEDGE unless you
  specifically need one half. All tag-archive URLs verified live 2026-08-15.
*/

// --- Series & tag archives -------------------------------------------------
export const SERIES = [
  {
    id: 'az-802',
    title: 'AZ-802: Windows Server Hybrid',
    desc: 'Nine-part study series building a hybrid estate end to end — multi-DC Active Directory forest, unattended Server 2025 lab builds, Entra Connect sync, Azure Arc onboarding, Update Manager fleet patching, failover clustering with a cloud witness, File Sync, and KQL log analytics.',
    iconKey: 'cloud',
    link: 'https://reprodev.com/tag/az-802/',
    tags: ['Windows Server', 'Azure', 'Hybrid', 'AD'],
    parts: 9,
    time: '9-part series',
    glowColor: 'rgba(96, 165, 250, 0.25)',
  },
  {
    id: 'docker-series',
    title: 'Get Started with Docker',
    desc: 'A nine-part path from first container to a secured, monitored stack: install on Pi and Windows, then Pi-hole, Portainer, Nginx Proxy Manager, Cloudflare Tunnel, Apache Guacamole and Dozzle — the same components running in this lab today.',
    iconKey: 'layers',
    link: 'https://reprodev.com/tag/get-started-with-docker/',
    tags: ['Docker', 'Self-hosting', 'Beginner'],
    parts: 9,
    time: '9-part series',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'thinkpiece',
    title: 'Thursday Thinkpiece',
    desc: 'Longer-form opinion on where the industry is heading: EU AI Act content labelling, how AI agents escape their sandboxes, apprenticeship routes into tech, and the corporate creep pushing self-hosters from Plex toward Jellyfin.',
    iconKey: 'message',
    link: 'https://reprodev.com/tag/thursday-thinkpiece/',
    tags: ['Opinion', 'AI', 'Careers'],
    parts: 3,
    time: 'Essays',
    glowColor: 'rgba(168, 85, 247, 0.25)',
  },
  {
    id: 'install-guides',
    title: 'The Install Guides Archive',
    desc: 'A running repository of step-by-step installation and configuration walk-throughs for homelab services — the reference notes behind most of what runs here.',
    iconKey: 'archive',
    link: 'https://reprodev.com/tag/install-guides/',
    tags: ['Guides', 'Config', 'Homelab'],
    parts: 8,
    time: 'Tag archive',
    glowColor: 'rgba(16, 185, 129, 0.2)',
  },
  {
    id: 'homelab-archive',
    title: 'Homelab Field Notes',
    desc: 'Problems hit in production and how they were actually solved: auto-healing Docker mounts after NFS drops, decoupling AppData without corrupting SQLite, and the full AZ-802 lab overview.',
    iconKey: 'server',
    link: 'https://reprodev.com/tag/homelab/',
    tags: ['Homelab', 'NFS', 'Proxmox'],
    parts: 3,
    time: 'Tag archive',
    glowColor: 'rgba(251, 191, 36, 0.2)',
  },
];

// --- Individual guides -----------------------------------------------------
// `date` is the machine-readable form of `time`; "New" is derived from it
// (see isRecent) rather than hand-maintained — the old hardcoded "New" tags had
// gone five months stale.
export const GUIDES = [
  {
    id: 'appdata-nfs',
    title: 'Decoupling Docker Configs: AppData to NFS',
    desc: 'Migrating Docker AppData configs to an OpenMediaVault NFS share while keeping SQLite-backed containers local to avoid database corruption.',
    iconKey: 'database',
    link: 'https://reprodev.com/decoupling-docker-configs-moving-appdata-to-nfs-without-breaking-sqlite/',
    tags: ['Docker', 'NFS'],
    time: 'Jul 2026',
    date: '2026-07',
    glowColor: 'rgba(16, 185, 129, 0.2)',
  },
  {
    id: 'usb-to-nfs',
    title: 'From USB to NFS: 10TB Storage Migration',
    desc: 'Moving a 10TB USB storage drive out of a Proxmox VM onto an NFS share without breaking any dependent services.',
    iconKey: 'harddrive',
    link: 'https://reprodev.com/from-usb-to-nfs-moving-a-10tb-usb-storage-drive-out-of-a-proxmox-vm-without-breaking-anything/',
    tags: ['Proxmox', 'Storage'],
    time: 'Jun 2026',
    date: '2026-06',
    glowColor: 'rgba(168, 85, 247, 0.2)',
  },
  {
    id: 'tailscale',
    title: 'Tailscale: Simple Remote Access',
    desc: 'Standing up a Tailscale mesh VPN for secure remote homelab access, without exposing services or wrestling with router configs.',
    iconKey: 'network',
    link: 'https://reprodev.com/tailscale-simple-remote-access-for-your-homelab-without-the-headache/',
    tags: ['Networking', 'Zero Trust'],
    time: 'Mar 2026',
    date: '2026-03',
    glowColor: 'rgba(96, 165, 250, 0.2)',
  },
  {
    id: 'proxmox-vs-esxi',
    title: 'The Proxmox vs ESXi Hypervisor Debate',
    desc: "Critical analysis of VMware's legacy against Proxmox VE's growing dominance in the modern homelab environment.",
    iconKey: 'harddrive',
    link: 'https://reprodev.com/is-the-reign-of-esxi-as-the-hypervisor-of-choice-for-learning-at-home-virtually-over/',
    tags: ['Virtualization', 'Proxmox', 'Opinion'],
    time: '20 min read',
    glowColor: 'rgba(168, 85, 247, 0.2)',
  },
  {
    id: 'pi-baseline',
    title: 'Raspberry Pi 4 Model B Baseline Setup',
    desc: 'Physical hardening and OS provisioning for the primary ARM control head in the physical cluster.',
    iconKey: 'cpu',
    link: 'https://reprodev.com/set-up-raspberry-pi/',
    tags: ['Hardware', 'ARM'],
    time: '20 min read',
    glowColor: 'rgba(251, 191, 36, 0.2)',
  },
];

// --- Projects --------------------------------------------------------------
export const PROJECTS = [
  {
    id: 'capo2keys',
    title: 'Capo2Keys',
    desc: 'A Flask app, deployed as a Docker container, that converts guitar chord charts to piano-compatible keys — preserving lyrics and structure, exporting to PDF/TXT.',
    iconKey: 'music',
    link: 'https://github.com/reprodev/Capo2Keys',
    tags: ['Flask', 'Docker'],
    time: 'Feb 2026',
    date: '2026-02',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    image: 'https://reprodev.com/content/images/size/w2000/2026/02/Ghost-Blog-Featured-Image12.png',
  },
  {
    id: 'service-desk-sim',
    title: 'Service Desk Sim',
    desc: 'A dystopian corporate simulation of enterprise IT support chaos, exploring operational psychology and procedural logic.',
    iconKey: 'monitor',
    link: 'https://store.steampowered.com/app/4851960/Service_Desk_Sim/',
    tags: ['Steam', 'Godot', 'Featured'],
    time: 'Wishlist Now',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    image: 'https://servicedesksim.com/ServiceDeskSimLogoV1.webp',
  },
  {
    id: 'lgtv',
    title: 'LGTV Firmware Utility',
    desc: 'Massively successful open-source utility for LG TV webOS firmware management. High community impact.',
    iconKey: 'zap',
    link: 'https://github.com/reprodev/LGTV-Firmware-Downgrade',
    tags: ['webOS', 'Utility', '1,040+ Forks'],
    time: '139+ Stars',
    glowColor: 'rgba(96, 165, 250, 0.2)',
    image: 'https://opengraph.githubassets.com/2f21bd7725001ff4c03111e652c625ba0798387b79034a75e32d68d42d5d616f/reprodev/LGTV-Firmware-Downgrade',
  },
  {
    id: 'powercsr',
    title: 'PowerCSR: GUI Tool',
    desc: 'A custom PowerShell-based GUI to simplify and automate Certificate Signing Requests and Private Key generation.',
    iconKey: 'terminal',
    link: 'https://dev.to/reprodev/simplify-your-openssl-csr-requests-with-powercsr-gui-tool-148h',
    tags: ['PowerShell', 'Security'],
    time: 'dev.to / Starred',
    glowColor: 'rgba(96, 165, 250, 0.2)',
    image: 'https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fv4m15j90v57p4j8p6m2g.png',
  },
  {
    id: 'exchange-toolbox',
    title: 'Exchange-Toolbox V2',
    desc: 'Advanced menu-driven PowerShell GUI for enterprise-level Exchange administration and automation tasks.',
    iconKey: 'archive',
    link: 'https://github.com/reprodev/Exchange-ToolboxV2',
    tags: ['PowerShell', 'Enterprise'],
    time: 'GitHub Repo',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    image: 'https://opengraph.githubassets.com/791c5e933405f6e80668f9a94f0685e8271705e4659f518804595e840656a81b/reprodev/Exchange-ToolboxV2',
  },
  {
    id: 'giphy-linker',
    title: 'GIPHY Linker Utility',
    desc: 'Developer automation tool for embedding GIPHY links into articles, specifically optimized for Dev.to / Hashnode.',
    iconKey: 'code',
    link: 'https://github.com/reprodev/GIPHY-Linker',
    tags: ['PowerShell', 'Automation'],
    time: 'reprodev.com',
    glowColor: 'rgba(168, 85, 247, 0.2)',
    image: 'https://opengraph.githubassets.com/791c5e933405f6e80668f9a94f0685e8271705e4659f518804595e840656a81b/reprodev/GIPHY-Linker',
  },
  {
    id: 'github-hub',
    title: 'GitHub Hub: reprodev',
    desc: 'Explore 40+ repositories covering PowerShell automation, infrastructure-as-code, and custom developer tools.',
    iconKey: 'github',
    link: 'https://github.com/reprodev',
    tags: ['Open Source', 'Portfolio'],
    time: '40+ Repos',
    glowColor: 'rgba(251, 191, 36, 0.2)',
    image: 'https://avatars.githubusercontent.com/u/8764255?v=4',
  },
];

/*
  Filter facets for the combined SERIES + GUIDES grid.

  A curated handful rather than the ~30 raw tag values — a filter bar with thirty
  options is a worse experience than none. Each facet matches if an item carries
  any of its tags. Verified non-empty at authoring time; `facetCount` below lets
  the UI hide any facet that ever falls to zero.
*/
export const FACETS = [
  { id: 'all', label: 'All', tags: null },
  { id: 'docker', label: 'Docker', tags: ['Docker', 'Self-hosting'] },
  { id: 'azure', label: 'Windows & Azure', tags: ['Windows Server', 'Azure', 'AD', 'Hybrid'] },
  { id: 'homelab', label: 'Homelab', tags: ['Homelab', 'Proxmox', 'Storage', 'NFS', 'Hardware', 'ARM', 'Virtualization', 'Guides', 'Config'] },
  { id: 'network', label: 'Networking', tags: ['Networking', 'Zero Trust'] },
  { id: 'opinion', label: 'Opinion', tags: ['Opinion', 'AI', 'Careers'] },
];

// Everything in the filterable grid: series first (they represent the most posts).
export const KNOWLEDGE = [...SERIES, ...GUIDES];

// `item.tags` guarded: an entry added without tags should fall out of every
// non-"all" facet, not throw and take the whole section down with it.
export const matchesFacet = (item, facet) =>
  !facet || !facet.tags || (item.tags || []).some((t) => facet.tags.includes(t));

export const facetCount = (facet) => KNOWLEDGE.filter((i) => matchesFacet(i, facet)).length;

/*
  "New" is derived, not authored. `date` is 'YYYY-MM'; anything within the last
  four months counts. The previous hardcoded "New" tags sat on Feb/Mar posts for
  five months before anyone noticed.
*/
export const isRecent = (item, now = new Date()) => {
  if (!item.date) return false;
  const [y, m] = item.date.split('-').map(Number);
  if (!y || !m) return false;
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return months >= 0 && months < 4;
};
