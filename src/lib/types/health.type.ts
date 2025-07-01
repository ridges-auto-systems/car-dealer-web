export interface HealthCheck {
  status: string;
  service: string;
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  database: {
    connected: boolean;
    provider: string;
    status: string;
  };
  company: {
    name: string;
    tagline: string;
  };
}
