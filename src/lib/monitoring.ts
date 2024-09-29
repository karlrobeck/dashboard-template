import { action } from "@solidjs/router";
import sysInfo from "systeminformation";
import { getEvent } from "vinxi/http";
import { verifyRole, verifyScopes } from "./security";
import globalConfig from "~/../config.json";
import { Accessor, createEffect } from "solid-js";

export interface SystemMonitorInfo {
  cpu: sysInfo.Systeminformation.CpuData;
  cpuCurrentSpeed: sysInfo.Systeminformation.CpuCurrentSpeedData;
  mem: sysInfo.Systeminformation.MemData;
  memLayout: sysInfo.Systeminformation.MemLayoutData;
  fsSize: sysInfo.Systeminformation.FsSizeData[];
  osInfo: sysInfo.Systeminformation.OsData;
  shell: string;
  versions: sysInfo.Systeminformation.VersionData;
  users: sysInfo.Systeminformation.UserData;
}

export interface SystemMonitorMetrics {
  cpuCurrentSpeed: sysInfo.Systeminformation.CpuCurrentSpeedData;
  mem: sysInfo.Systeminformation.MemData;
  fsSize: sysInfo.Systeminformation.FsSizeData[];
}

export function calculateCPUUsage(): number {
  return 0;
}

export function calculateMemoryUsage(
  totalMem: number,
  activeMem: number
): number {
  return parseFloat(((activeMem / totalMem) * 100).toFixed(2));
}

export function calculateDiskUsage(
  fsSize: sysInfo.Systeminformation.FsSizeData[]
) {
  const totalSize =
    fsSize.map((val) => val.size).reduce((prev, curr) => prev + curr, 0) || 0;
  const usedSize =
    fsSize.map((val) => val.used).reduce((prev, curr) => prev + curr, 0) || 0;
  return parseFloat(((usedSize / totalSize) * 100).toFixed(2));
}

export const fetchSysMetrics = action(
  async (): Promise<SystemMonitorMetrics | undefined> => {
    "use server";
    const event = getEvent();
    if (
      !(await verifyRole(event, ["admin"])) ||
      !(await verifyScopes(event, ["admin:monitor:metrics:read"]))
    ) {
      return;
    }
    return await sysInfo.get({
      cpuCurrentSpeed: "*",
      mem: "*",
      fsSize: "*",
    });
  }
);

export const fetchSysInfo = action(
  async (): Promise<SystemMonitorInfo | undefined> => {
    "use server";
    const event = getEvent();
    if (
      !(await verifyRole(event, ["admin"])) ||
      !(await verifyScopes(event, ["admin:monitor:sysInfo:read"]))
    ) {
      return;
    }
    const sysConfig = () => {
      const obj: any = {};
      for (let key of globalConfig.features.monitoring.systeminformation
        .sysInfo) {
        obj[key] = "*";
      }
      return obj;
    };
    return await sysInfo.get(sysConfig());
  }
);
