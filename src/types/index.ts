export interface ServerInfo {
  id: number;
  firewall_group_id: null | number;
  subscription_id: string;
  plan: string;
  hostname: string;
  state: string;
  actions_lock: string;
  cpus: number;
  memory: number;
  disk: number;
  bandwidth: number;
  ns1: string;
  ns2: string;
  ipv4: IPAddress[];
  ipv6: IPAddress[];
  template: Template;
  created_at: string;
}

interface IPAddress {
  id: number;
  address: string;
  ptr: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  documentation: null | string;
}

export interface MetricsData {
  cpu_usage: MetricItem;
  ram_usage: MetricItem;
  disk_space: MetricItem;
  outgoing_traffic: MetricItem;
  incoming_traffic: MetricItem;
  uptime: MetricItem;
}

export interface MetricItem {
  unit: string;
  usage: {
    [timestamp: string]: number;
  };
}

export interface FormattedMetricData {
  labels: string[];
  values: number[];
  timestamps: number[];
}

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

export type MetricType = 'cpu_usage' | 'ram_usage' | 'disk_space' | 'outgoing_traffic' | 'incoming_traffic' | 'uptime';