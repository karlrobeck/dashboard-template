import sysInfo from "systeminformation";

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
