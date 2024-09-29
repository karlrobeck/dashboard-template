import {
  Accessor,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
  Resource,
  Show,
  Suspense,
} from "solid-js";
import CardProgress from "~/components/CardProgress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SysInfoCardTable from "~/components/SysInfoCard";
import sysInfo from "systeminformation";
import {
  action,
  createAsync,
  redirect,
  useAction,
  useSubmission,
} from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { getCookie, getEvent, setCookie } from "vinxi/http";
import { verifyRole, verifyScopes } from "~/lib/security";
import globalConfig from "~/../config.json";
import {
  calculateCPUUsage,
  calculateDiskUsage,
  calculateMemoryUsage,
} from "~/lib/monitoring";
import { LineChart } from "~/components/ui/charts";
import { Chart } from "chart.js";
import { mergeRefs, Ref, Refs } from "@solid-primitives/refs";
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

const SystemMetrics = ({
  sysStats,
}: {
  sysStats: Accessor<SystemMonitorMetrics | undefined>;
}) => {
  const metricData = createMemo(() => {
    const metrics: Record<string, number> = {};

    if (
      globalConfig.features.monitoring.systeminformation.stats.includes("cpu")
    ) {
      metrics["CPU Usage"] = sysStats()?.cpuCurrentSpeed.avg || 0;
    }

    if (
      globalConfig.features.monitoring.systeminformation.stats.includes(
        "memory"
      )
    ) {
      metrics["Memory Usage"] = calculateMemoryUsage(
        sysStats()?.mem.total || 0,
        sysStats()?.mem.active || 0
      );
    }

    if (
      globalConfig.features.monitoring.systeminformation.stats.includes("disk")
    ) {
      metrics["Disk Usage"] = calculateDiskUsage(sysStats()?.fsSize || []);
    }

    return metrics;
  });

  return (
    <Show
      when={sysStats() !== undefined}
      fallback={
        <section
          class={`grid grid-cols-${
            Object.keys(metricData()).length !== 4
              ? Object.keys(metricData()).length
              : 4
          } gap-5`}
        >
          <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
          <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
          <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
        </section>
      }
    >
      <section
        class={`grid grid-cols-${
          Object.keys(metricData()).length !== 4
            ? Object.keys(metricData()).length
            : 4
        } gap-5`}
      >
        <For each={Object.entries(metricData())}>
          {([name, val]) => (
            <CardProgress value={val}>
              <div class="space-y-2.5">
                <CardDescription>{name.toString()}</CardDescription>
                <CardTitle>{val}%</CardTitle>
              </div>
            </CardProgress>
          )}
        </For>
      </section>
    </Show>
  );
};

const MonitorCharts = ({
  sysStats,
}: {
  sysStats: Accessor<SystemMonitorMetrics | undefined>;
}) => {
  const metricData = createMemo(() => {
    const metrics: Record<string, number> = {};

    if (
      globalConfig.features.monitoring.systeminformation.stats.includes("cpu")
    ) {
      metrics["CPU Usage"] = sysStats()?.cpuCurrentSpeed.avg || 0;
    }

    if (
      globalConfig.features.monitoring.systeminformation.stats.includes(
        "memory"
      )
    ) {
      metrics["Memory Usage"] = calculateMemoryUsage(
        sysStats()?.mem.total || 0,
        sysStats()?.mem.active || 0
      );
    }

    if (
      globalConfig.features.monitoring.systeminformation.stats.includes("disk")
    ) {
      metrics["Disk Usage"] = calculateDiskUsage(sysStats()?.fsSize || []);
    }

    return metrics;
  });

  return (
    <section class="h-full w-full">
      <Tabs>
        <TabsList>
          <For
            each={Object.keys(
              globalConfig.features.monitoring.systeminformation.charts
            )}
          >
            {(item) => <TabsTrigger value={item}>{item}</TabsTrigger>}
          </For>
          <TabsTrigger value="allCharts">All</TabsTrigger>
        </TabsList>
        <For
          each={Object.keys(
            globalConfig.features.monitoring.systeminformation.charts
          )}
        >
          {(item) => {
            const chartConfig =
              globalConfig.features.monitoring.systeminformation.charts;
            return (
              <TabsContent value={item}>
                <MonitorLineChart
                  backgroundColor={Object(chartConfig)[item].backgroundColor}
                  name={Object(chartConfig)[item].label}
                  dataRecord={metricData}
                />
              </TabsContent>
            );
          }}
        </For>
        <TabsContent value="allCharts">
          <For
            each={Object.keys(
              globalConfig.features.monitoring.systeminformation.charts
            )}
          >
            {(item) => {
              const chartConfig =
                globalConfig.features.monitoring.systeminformation.charts;
              return (
                <MonitorLineChart
                  backgroundColor={Object(chartConfig)[item].backgroundColor}
                  name={Object(chartConfig)[item].label}
                  dataRecord={metricData}
                />
              );
            }}
          </For>
        </TabsContent>
      </Tabs>
    </section>
  );
};

const MonitorLineChart = ({
  dataRecord,
  name,
  backgroundColor,
}: {
  dataRecord: Accessor<Record<string, number>>;
  name: string;
  backgroundColor: string;
}) => {
  let chartRef: HTMLCanvasElement | undefined;

  const chartData = {
    labels: [new Date().getSeconds()],
    datasets: [
      {
        label: name,
        data: [0],
        fill: true,
        backgroundColor: backgroundColor,
      },
    ],
  };

  createEffect(() => {
    const dataValue = dataRecord()[name] || 0;
    if (!chartRef) {
      return;
    }
    const chart = Chart.getChart(chartRef);
    if (chart?.data.datasets[0].data.length === 60) {
      chart?.data.datasets[0].data.shift();
      chart?.data.labels?.shift();
    }
    chart?.data.datasets[0].data.push(dataValue);
    chart?.data.labels?.push(new Date().getSeconds());
    chart?.update();
  });

  return (
    <div class="h-64 w-full max-w-screen">
      <LineChart ref={chartRef} data={chartData} />
    </div>
  );
};

const fetchSysMetrics = action(
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

const fetchSysInfo = action(
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

const MonitoringPage = () => {
  const sysInfoAction = useAction(fetchSysInfo);
  const sysInfoMetricsAction = useAction(fetchSysMetrics);
  const [sysInfo, setSysInfo] = createSignal<SystemMonitorInfo>();
  const [sysInfoStats, setSysInfoMetrics] =
    createSignal<SystemMonitorMetrics>();

  onMount(async () => {
    setSysInfoMetrics(await sysInfoMetricsAction());
    setSysInfo(await sysInfoAction());
  });

  const fetcher = setInterval(async () => {
    setSysInfoMetrics(await sysInfoMetricsAction());
  }, 1000);
  onCleanup(() => clearInterval(fetcher));

  return (
    <article class="space-y-4">
      <SystemMetrics sysStats={sysInfoStats} />
      <h4 class="heading-4">System Information</h4>
      <MonitorCharts sysStats={sysInfoStats} />
      <SysInfoCardTable sysInfo={sysInfo} />
    </article>
  );
};

export default MonitoringPage;
