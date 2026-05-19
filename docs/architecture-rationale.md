# ARCHITECTURE: Decoupled Compute & Resilience Rationale
> **Target:** Khurram Nazir Infrastructure Design  
> **Aesthetic Standard:** Gold Master V4.2.0 Compliant  
> **Status:** Operational

This document explains the technical "Why" behind the architectural division of the compute fleet, detailing the hybrid compute model (x86 vs. ARM) and the storage isolation layer.

---

## 1. The Compute Dilemma: x86 vs. ARM
The homelab infrastructure leverages a strategic dual-architecture model to balance raw processing throughput with low-power high-availability ingress routing:

### 🖥️ Proxmox VE Hypervisor Host (`ZuluServer` - x86_64)
*   **Hardware Architecture:** Custom multi-thread x86 processor, 64GB DDR4 ECC RAM, mirrored ZFS boot storage pool.
*   **Primary Workloads:** Compute-intensive, heavy database applications, media streaming (Plex), GitOps controllers, and high-performance virtual hosts.
*   **Key Advantage:** Integrates direct Intel QuickSync (QSV) hardware acceleration via custom kernel mapping for real-time 4K HEVC transcoding, and leverages ZFS pool management to ensure high storage block resiliency.

### 🛰️ Control Head Ingress Node (`pibuster4` - ARM64)
*   **Hardware Architecture:** Dedicated bare-metal Raspberry Pi 4 Model B (8GB RAM) powered via a high-end POE+ HAT.
*   **Primary Workloads:** Local administrative gateway, reverse proxy, Uptime Kuma monitoring node, Cloudflare Tunnel edge endpoints, and emergency console access.
*   **Key Advantage:** Operating on an completely independent physical bare-metal system outside the hypervisor pool ensures ingress access is maintained during scheduled virtualization restarts.

---

## 2. Infrastructure Decoupling & High Availability
In standard homelabs, virtualizing everything (including routing and DNS ingress) inside a single Proxmox node creates a catastrophic single point of failure (SPOF). By decoupling routing onto the standalone ARM Pi 4:
1.  **Maintenance Resilience:** Proxmox hypervisor upgrades, hardware expansion reboots, and storage maintenance do not disrupt internet ingress or core network routing.
2.  **Telemetry Sanity:** External heartbeat checks (e.g., Uptime Kuma) and Cloudflare tunnels remain active to securely record and log VM startup states during restorations.
3.  **Out-of-Band Control:** In the event of a hypervisor ZFS pool crash, secure administrative shells are still accessible via the Pi 4 terminal to orchestrate recovery.

---

## 3. Storage Decoupling: Virtualization Bypass
Virtualizing storage disks adds significant latency and makes file system recovery complex. To avoid this overhead, the homelab implements physical disk passthrough:
*   **The Model:** The physical SATA connection IDs of the **6TB WD Red** NAS disks are mapped directly to the OpenMediaVault (OMV) VM instance.
*   **Why It Matters:**
    *   OMV reads and writes directly to raw disk block layers, reducing storage controller overhead to near-zero.
    *   S.M.A.R.T. health diagnostics pass through unimpeded to early-warn of drive degradation.
    *   If the virtualization hypervisor fails, the NAS drive can be physically plugged into any generic linux machine and mounted instantly with perfect file system parity (EXT4/XFS layer preservation).
