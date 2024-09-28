import sysInfo from 'systeminformation';
import os from 'os';
import { exec, execSync } from 'child_process';
import { stdin } from 'process';

export interface SystemMonitorStats {
    cpu: sysInfo.Systeminformation.CpuData
    cpuCurrentSpeed: sysInfo.Systeminformation.CpuCurrentSpeedData
    mem: sysInfo.Systeminformation.MemData
    memLayout: sysInfo.Systeminformation.MemLayoutData
    fsSize: sysInfo.Systeminformation.FsSizeData[]
    osInfo: sysInfo.Systeminformation.OsData,
    shell: string,
    versions: sysInfo.Systeminformation.VersionData,
    users: sysInfo.Systeminformation.UserData
}

export async function GET(): Promise<SystemMonitorStats> {
    return await sysInfo.get({
        cpu: "*",
        cpuCurrentSpeed: "*",
        mem: "*",
        memLayout: "*",
        fsSize: "*",
        osInfo: "*",
        shell: "*",
        versions: "*",
        users: "*",
    })
}