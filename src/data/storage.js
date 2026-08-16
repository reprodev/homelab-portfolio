/*
  storage.js — the Proxmox storage array, described once.

  Consumed by HardwareLayer's "Storage Array Logic" card and referenced by
  HypervisorTopology3D's storage node labels. As with fleet.js, the 3D scene
  keeps its own `pos` coordinates and link wiring — only the text comes from here.
*/

/*
  `label`/`capacity` feed the HardwareLayer list; `short`/`sub` feed the tighter
  3D chips in HypervisorTopology3D. Two presentations, one set of facts — swap a
  disk here and both views follow.
*/
export const STORAGE = [
  // Primary VM datastore, not a cache tier — the pre-V5.3 "LVM Cache" label was wrong.
  { id: 'nvme', label: 'nvme0n1 (VM Datastore)', capacity: '1 TB NVMe', badge: 'azure', short: 'nvme0n1', sub: '1 TB NVMe · VM Store' },
  { id: 'sata', label: 'sda & sdc (SATA SSD)', capacity: '2 × 1 TB', badge: 'success', short: 'sda & sdc', sub: '2 × 1 TB SATA SSD' },
  // WD60EZAZ is the WD *Blue* line — the site claimed "WD Red" until V5.3.
  // Red would be an EFAX/EFZX/EFPX suffix. Corrected against lsblk.
  { id: 'wdblue', label: 'sdb (Passthrough)', capacity: '6 TB WD Blue', badge: 'amber', short: 'sdb WD Blue', sub: '6 TB WD Blue HDD' },
  // External USB3 volume (WD101EDBZ), passed to the NAS VM and re-served over
  // SMB/NFS — not a hypervisor-attached disk, hence the separate framing.
  { id: 'ext10', label: '10 TB (USB3 → NAS)', capacity: '10 TB Ext', badge: 'azure', external: true },
  // Rendered at reduced opacity — present in the chassis, not in active service.
  // No 3D chip: the spare channel is list-only. Intel Optane Memory M10 (16GB
  // nominal, 13.4GB usable).
  { id: 'optane', label: 'nvme1n1 (Optane M10)', capacity: '16 GB', badge: 'muted', idle: true },
];

export const storageById = (id) => STORAGE.find((d) => d.id === id);
