import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import globalConfig from "~/../config.json";
import {
  calculateDiskUsage,
  calculateMemoryUsage,
  fetchSysInfo,
  fetchSysMetrics,
  SystemMonitorInfo,
  SystemMonitorMetrics,
} from "~/lib/monitoring";
import {
  MonitorCharts,
  MonitoringStatCard,
  SystemMetrics,
} from "~/components/monitoring";

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
      <h2 class="heading-2">System Overview</h2>
      <Show
        when={
          Object(globalConfig)?.features?.monitoring?.systeminformation
            ?.charts !== undefined
        }
      >
        <MonitorCharts sysStats={sysInfoStats} />
      </Show>
      <Show
        when={
          Object(globalConfig)?.features?.monitoring?.systeminformation
            ?.stats !== undefined
        }
      >
        <SystemMetrics sysStats={sysInfoStats} />
      </Show>
      <h3 class="heading-3">System Details</h3>
      <MonitoringStatCard sysInfo={sysInfo} />
    </article>
  );
};

export default MonitoringPage;
