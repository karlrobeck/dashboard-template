export const globalConfig = {
  features: {
    monitoring: {
      systeminformation: {
        stats: {
          enabled: true,
          documentation:
            "Enable or disable the collection of system statistics.",
          cpu: {
            enable: true,
            label: "CPU Usage",
            documentation:
              "Enable or disable the collection of CPU usage statistics.",
          },
          memory: {
            enable: true,
            label: "Memory Usage",
            documentation:
              "Enable or disable the collection of memory usage statistics.",
          },
          disk: {
            enable: true,
            label: "Disk Usage",
            documentation:
              "Enable or disable the collection of disk usage statistics.",
          },
        },
        charts: {
          enable: true,
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
          enable: true,
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
