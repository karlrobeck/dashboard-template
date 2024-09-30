export interface globalConfigType {
  general: Record<string, any>;
  navigation: Record<string, any>;
  security: SecurityConfig;
  settings: SettingsConfig;
}

export interface SecurityConfig {
  username: string;
  password: string;
}

export interface SettingsConfig {
  monitoring?: MonitoringConfig;
}

export interface MonitoringConfig {
  systeminformation?: SystemInformationConfig;
}

export interface SystemInformationConfig {
  realtimeFeed?: RealtimeFeed;
  charts?: RealtimeChartFeed;
  sysInfo?: SysInfoConfig;
}

export interface ToggleFeature {
  enabled: boolean;
  documentation?: string;
}

export interface SysInfoConfig extends ToggleFeature {
  listInfo: string[];
}

export interface RealtimeFeed extends ToggleFeature {
  cpu?: RealtimeFeedConfig;
  memory?: RealtimeFeedConfig;
  disk?: RealtimeFeedConfig;
  pollingSeconds?: number;
}

export interface RealtimeChartFeed extends ToggleFeature {
  cpu?: RealtimeChartConfig;
  memory?: RealtimeChartConfig;
  disk?: RealtimeChartConfig;
}

export interface RealtimeFeedConfig {
  label: string;
  documentation?: string;
}

export interface RealtimeChartConfig {
  label: string;
  backgroundColor?: string;
  documentation?: string;
}

export const globalConfig: globalConfigType = {
  general: {
    companyName: "Marahuyo Developers",
    applicationName: "Monitoring System",
  },
  navigation: {
    monitoring: {
      href: "/admin/dashboard/monitoring",
      icon: <i class="bi bi-display"></i>,
    },
  },
  security: {
    username: "karlrobeck",
    password: "randompassword",
  },
  settings: {
    monitoring: {
      systeminformation: {
        realtimeFeed: {
          enabled: true,
          documentation:
            "Enable or disable the collection of system statistics.",
          cpu: {
            label: "CPU Usage",
            documentation:
              "Enable or disable the collection of CPU usage statistics.",
          },
          memory: {
            label: "Memory Usage",
            documentation:
              "Enable or disable the collection of memory usage statistics.",
          },
          disk: {
            label: "Disk Usage",
            documentation:
              "Enable or disable the collection of disk usage statistics.",
          },
        },
        charts: {
          enabled: true,
          cpu: {
            label: "CPU Usage",
            backgroundColor: "",
            documentation: "Configuration for the CPU usage chart.",
          },
          memory: {
            label: "Memory Usage",
            backgroundColor: "",
            documentation: "Configuration for the memory usage chart.",
          },
          disk: {
            label: "Disk Usage",
            backgroundColor: "",
            documentation: "Configuration for the disk usage chart.",
          },
          documentation:
            "Enable or disable the display of system information charts.",
        },
        sysInfo: {
          enabled: true,
          documentation: "Enable or disable the display of system information.",
          listInfo: [
            "cpu",
            "cpuCurrentSpeed",
            "mem",
            "memLayout",
            "fsSize",
            "osInfo",
            "versions",
            "users",
          ],
        },
      },
    },
  },
};
