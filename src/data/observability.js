/*
  observability.js — the real monitoring stack.

  Before V5.3 this layer was three badges (Prometheus / Grafana / Netdata) next to
  sparklines labelled "Sim". Netdata was never actually deployed; the rest of a
  genuine stack was missing. This file names what actually runs.

  DELIBERATELY OMITTED: port numbers, host IPs, dashboard URLs. They add nothing to
  a portfolio reader and everything in src/ is publicly readable. Retention windows
  and topology *are* included — they're the interesting engineering detail.
*/

export const OBSERVABILITY_GROUPS = [
  {
    id: 'metrics',
    label: 'Metrics',
    color: 'emerald',
    items: [
      { name: 'Prometheus', detail: '30-day retention' },
      { name: 'Grafana', detail: 'Dashboards' },
      { name: 'cAdvisor', detail: 'Per-container' },
      { name: 'Node Exporter', detail: 'Fleet-wide' },
      { name: 'Pulse', detail: 'Hypervisor' },
      { name: 'Glances', detail: 'Host-level' },
    ],
  },
  {
    id: 'alerting',
    label: 'Alerting',
    color: 'amber',
    items: [
      { name: 'Alertmanager', detail: 'Routes to Telegram' },
      { name: 'Uptime Kuma', detail: 'Dual instance' },
      { name: 'Blackbox Exporter', detail: 'Synthetic probes' },
      { name: 'Healthchecks', detail: "Dead man's switch" },
    ],
  },
  {
    id: 'logs',
    label: 'Logs',
    color: 'azure',
    items: [
      { name: 'Loki', detail: '7-day retention' },
      { name: 'Dozzle', detail: 'Hub + 5 agents' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    color: 'muted',
    items: [
      { name: 'WatchYourLAN', detail: 'Device discovery' },
      { name: 'Speedtest Tracker', detail: '6-hourly ISP probes' },
    ],
  },
];

/*
  The alert path — animated in WorkloadLayer, driven by the existing
  SIM_EVENTS.ddos event (no new bus vocabulary; invariant §1).
  `t` is the ms offset at which each stage lights once an alert fires.
*/
export const ALERT_PATH = [
  { id: 'scrape', label: 'Scrape', sub: 'node_exporter', t: 0 },
  { id: 'rule', label: 'Rule Eval', sub: 'threshold breach', t: 500 },
  { id: 'alertmanager', label: 'Alertmanager', sub: 'group · dedupe', t: 1000 },
  { id: 'telegram', label: 'Telegram', sub: 'delivered', t: 1500 },
];

/*
  The design decision worth stating out loud: the primary Uptime Kuma and the
  Telegram alert relay run on a separate low-power node, not on the server they
  watch — so the thing that alerts survives the thing that fails.
*/
export const OUT_OF_BAND_NOTE = {
  title: 'Out-of-Band by Design',
  body:
    'The primary uptime monitor and alert relay run on an independent low-power node, ' +
    'not on the server they watch. When the data core goes down, the thing that tells ' +
    'me it went down is still up.',
};
