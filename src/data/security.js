/*
  security.js — edge security posture.

  V5.3 correction: this section previously badged **Authelia** and **CrowdSec**,
  neither of which is deployed. They are now in SECURITY_ROADMAP where they belong.
  What replaced them is not filler — it is the genuinely deployed posture, and it
  is a stronger story than two unshipped tool names: there is no inbound port open
  to the internet at all.

  Same rules as the other data modules: no ports, no IPs, no hostnames.
*/

export const EDGE_SECURITY = [
  { name: 'Cloudflare Zero Trust', detail: 'Outbound-only tunnels' },
  { name: 'Cloudflare WAF', detail: 'Managed rulesets' },
  { name: 'Access OTP', detail: 'One-time-pin on remote desktop' },
  { name: 'Geo-IP Filtering', detail: 'UK-only ingress' },
  { name: 'ufw + fail2ban', detail: 'Ansible-enforced, fleet-wide' },
  { name: 'SSH Key-Only', detail: 'Password auth disabled' },
];

/*
  The headline claim this section can honestly make: zero inbound ports. Every
  external route is an outbound tunnel the edge dials out to establish, so there
  is no listening service exposed to the internet and no port-forward on the router.
*/
export const SECURITY_HEADLINE = {
  stat: '0',
  label: 'Inbound ports open',
  body:
    'Nothing is port-forwarded. Every public route is an outbound-only tunnel, so ' +
    'there is no listening service exposed to the internet to attack in the first place.',
};

// Not deployed — stated as intent, not capability.
export const SECURITY_ROADMAP = [
  { name: 'Authelia', detail: 'SSO / forward-auth' },
  { name: 'CrowdSec', detail: 'Shared IP reputation' },
];
