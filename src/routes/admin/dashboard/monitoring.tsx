import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import { globalConfig } from "~/config";
import {
  fetchSysInfo,
  fetchSysMetrics,
  SystemMonitorInfo,
  SystemMonitorMetrics,
} from "~/lib/monitoring";
import {
  MonitorCharts,
  MonitoringStatCard,
  SystemLiveFeed,
} from "~/components/monitoring";

const MonitoringPage = () => {
  const sysInfoAction = useAction(fetchSysInfo);
  const sysInfoMetricsAction = useAction(fetchSysMetrics);
  const [sysInfo, setSysInfo] = createSignal<SystemMonitorInfo>();
  const [sysInfoStats, setSysInfoMetrics] =
    createSignal<SystemMonitorMetrics>();

  onMount(async () => {
    if (
      globalConfig.settings.monitoring?.systeminformation?.realtimeFeed
        ?.enabled ||
      globalConfig.settings.monitoring?.systeminformation?.charts?.enabled
    ) {
      setSysInfoMetrics(await sysInfoMetricsAction());
    }
    setSysInfo(await sysInfoAction());
  });

  const fetcher = setInterval(async () => {
    if (
      globalConfig.settings.monitoring?.systeminformation?.realtimeFeed
        ?.enabled ||
      globalConfig.settings.monitoring?.systeminformation?.charts?.enabled
    ) {
      setSysInfoMetrics(await sysInfoMetricsAction());
    }
  }, globalConfig.settings.monitoring?.systeminformation?.realtimeFeed?.pollingSeconds || 3000);
  onCleanup(() => clearInterval(fetcher));

  return (
    <article class="space-y-4 ">
      <h2 class="heading-2">System Overview</h2>
      <Show
        when={
          globalConfig?.settings?.monitoring?.systeminformation?.charts?.enabled
        }
      >
        <MonitorCharts sysStats={sysInfoStats} />
      </Show>
      <Show
        when={
          globalConfig.settings.monitoring?.systeminformation?.realtimeFeed
            ?.enabled
        }
      >
        <SystemLiveFeed sysStats={sysInfoStats} />
      </Show>
      <h3 class="heading-3">System Details</h3>
      <MonitoringStatCard sysInfo={sysInfo} />
    </article>
  );
};

export default MonitoringPage;
