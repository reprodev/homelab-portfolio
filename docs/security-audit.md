# SECURITY AUDIT: Public Infrastructure Disclosure Policy
> **Target:** Khurram Nazir Public Repository  
> **Aesthetic Standard:** Gold Master V4.2.0 Compliant  
> **Status:** Operational

This document serves as the official security baseline for the Khurram Nazir public homelab repository. It defines what data is safe for public visibility, the standard threat model, and the automated/manual measures used to prevent infrastructure disclosure leaks.

---

## 1. Threat Modeling Overview
As a homelab showcased publicly on GitHub and rendered via GitHub Pages, the host infrastructure is exposed to external scanning, OSINT analysis, and targeted credential harvesting. The primary security threats include:
1. **Local Subnet Exposure:** Revealing private IPv4 addresses, active VLAN structures, local DNS configurations, or gateway models.
2. **API & Credential Leakage:** Accidentally pushing private tokens (Notion API keys, Cloudflare API tokens, local AD credentials) to the open git history.
3. **Physical/Hardware Correlation:** Exposing active system serial numbers, disk UUIDs, or absolute system paths containing local user profiles.

---

## 2. Ingress & Traffic Security Guardrails
To prevent exposing the physical homelab location and public ip addresses, the ingress architecture is kept strictly abstract:
*   **Zero Public DNS Mapping:** No custom public-facing domains or internal reverse proxy tunnels map directly to bare-metal systems within public code blocks.
*   **Cloudflare Tunnels (Abstracted):** Ingress details (Cloudflare Tunnel IDs and daemon configs) are fully managed via secure, private environment variables or are completely omitted from public configuration schemas.

---

## 3. The Shareability Audit Checklist
This checklist defines the strict distinction between what parameters are safe to expose in public files and what must be fully scrubbed:

| System Parameter | 🟢 Safe to Publish (Public) | 🔴 Forbidden / Restricted (Private) |
| :--- | :--- | :--- |
| **Node Identity** | Generic system names (`ZuluServer`, `pibuster4`, `ha01`, `ha02`, `ha03`). | Active hostnames linked to local AD domains (e.g., `nas.local.lan`). |
| **Networking** | VLAN roles, generic flow directions, subnet labels (`DMZ`, `MANAGEMENT`). | Exact IPv4 CIDR blocks (e.g., `192.168.10.150/24`), local MAC addresses, internal gateways, WG keys. |
| **Credentials** | Placeholder environment variables in `.env.example`. | Database passwords, Cloudflare tokens, Notion API integration tokens, private SSH keys. |
| **Storage Layout** | Block device labels (`nvme0n1`, `sdb`), RAID levels, partition sizes. | Physical disk serial numbers, volume UUIDs, absolute file paths containing local user names. |

---

## 4. Leak Mitigation Protocols
*   **GitGuardian & Secret Scanner Integration:** Active workspace repositories integrate GitGuardian and pre-commit secret scanners (e.g., Trufflehog) to verify credential hygiene.
*   **Regex Auditing Hooks:** Prior to any deployment or public commit, source code undergoes a dynamic pre-flight compliance sweep for private CIDR blocks, AD names, and raw tokens.
