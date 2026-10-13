export interface DnsRecord {
  type: string;
  value: string;
  ttl?: number;
}

export interface ThreatScoreFactor {
  id: string;
  name: string;
  score: number;
  max: number;
  description: string;
  status: 'safe' | 'warning' | 'danger';
}

export interface ThreatScoreBreakdown {
  total: number;
  summary: string;
  factors: ThreatScoreFactor[];
}

export interface ThreatData {
  is_vpn: boolean;
  is_proxy: boolean;
  is_tor: boolean;
  is_datacenter: boolean;
  risk_score: number;
  threat_level: 'Low' | 'Medium' | 'High';
  network_type: string;
  vpn_service?: string;
  detection_reasons: string[];
  score_breakdown?: ThreatScoreBreakdown;
}

export interface WeatherData {
  temp: number;
  condition: string;
  wind: number;
  humidity: number;
}

export interface IpData {
  ip: string;
  type: 'IPv4' | 'IPv6';
  city: string;
  region: string;
  country: string;
  country_code: string;
  flag: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
  hostname: string;
  currency: string;
  threat: ThreatData;
  weather: WeatherData;
  dns: DnsRecord[];
  raw?: Record<string, any>;
  is_gps_verified?: boolean;
  isp_pop_city?: string;
}

export interface PingStat {
  seq: number;
  latency: number;
  timestamp: number;
}

export type ActiveTab = 'dashboard' | 'dns' | 'compare' | 'batch' | 'raw';
export type Language = 'hu' | 'en';
