import { Accessor, createEffect, createMemo, For, Show } from "solid-js";
import {
  calculateDiskUsage,
  calculateMemoryUsage,
  SystemMonitorInfo,
  SystemMonitorMetrics,
} from "~/lib/monitoring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import lodash from "lodash";
import { LineChart } from "./ui/charts";
import { Chart } from "chart.js";
import globalConfig from "~/../config.json";
import CardProgress from "./CardProgress";
import { CardDescription, CardTitle } from "./ui/card";

export const MonitoringStatCardLoading = () => {
  return (
    <section class="space-y-5">
      <div class="w-1/2 h-12 animate-pulse transition-all bg-accent/55 rounded-md"></div>
      <div class="w-full h-screen animate-pulse transition-all bg-accent/55 rounded-md"></div>
    </section>
  );
};

export const MonitoringStatCard = ({
  sysInfo,
}: {
  sysInfo: Accessor<SystemMonitorInfo | undefined>;
}) => {
  return (
    <Show
      when={sysInfo() !== undefined}
      fallback={<MonitoringStatCardLoading />}
    >
      <Tabs>
        <TabsList>
          <For each={Object.keys(sysInfo() || {})}>
            {(item) => {
              //@ts-ignore
              if (typeof sysInfo()?.[item] !== "object") {
                return <></>;
              }
              return (
                <TabsTrigger value={item}>
                  {lodash.startCase(item).toUpperCase()}
                </TabsTrigger>
              );
            }}
          </For>
        </TabsList>
        <For each={Object.keys(sysInfo() || {})}>
          {(item) => {
            // remove any string or non object before iterating
            //@ts-ignore
            if (typeof sysInfo()?.[item] !== "object") {
              return <></>;
            }

            return (
              <TabsContent value={item}>
                <section>
                  <table class="table-fixed border">
                    <thead class="border-b">
                      <tr>
                        <th>Property</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* @ts-ignore */}
                      <For each={Object.keys(sysInfo()?.[item] || {})}>
                        {(data) => {
                          const value: any =
                            //@ts-ignore
                            sysInfo()?.[item][data] ||
                            "No Information Available";
                          return (
                            <>
                              <Show when={typeof value !== "object"}>
                                <tr>
                                  <td>{lodash.startCase(data)}</td>
                                  <td>
                                    {typeof value === "boolean"
                                      ? value.toString()
                                      : value}
                                  </td>
                                </tr>
                              </Show>
                              <Show when={typeof value === "object"}>
                                <For each={Object.entries(value)}>
                                  {([obj_item, obj_val]) => (
                                    <tr>
                                      <td>
                                        {lodash.startCase(data)} -{" "}
                                        {obj_item.toUpperCase()}
                                      </td>
                                      <td>
                                        {/* @ts-ignore */}
                                        {obj_val || "No Information Available"}
                                      </td>
                                    </tr>
                                  )}
                                </For>
                              </Show>
                            </>
                          );
                        }}
                      </For>
                    </tbody>
                  </table>
                </section>
              </TabsContent>
            );
          }}
        </For>
      </Tabs>
    </Show>
  );
};

export const MonitorLineChart = ({
  dataRecord,
  dataName,
  labelName,
  backgroundColor,
}: {
  dataRecord: Accessor<Record<string, number>>;
  dataName: string;
  labelName: string;
  backgroundColor: string;
}) => {
  let chartRef: HTMLCanvasElement | undefined;

  const chartData = {
    labels: [new Date().getSeconds()],
    datasets: [
      {
        label: labelName,
        data: [0],
        fill: true,
        backgroundColor: backgroundColor,
      },
    ],
  };

  createEffect(() => {
    const dataValue = dataRecord()[dataName] || 0;
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

export const MonitorCharts = ({
  sysStats,
}: {
  sysStats: Accessor<SystemMonitorMetrics | undefined>;
}) => {
  const metricData = createMemo(() => {
    const metrics: Record<string, number> = {};
    if (
      Object(globalConfig)?.features?.monitoring?.systeminformation?.charts?.cpu
    ) {
      metrics["cpu"] = sysStats()?.cpuCurrentSpeed.avg || 0;
    }

    if (
      Object(globalConfig)?.features?.monitoring?.systeminformation?.charts
        ?.memory
    ) {
      metrics["memory"] = calculateMemoryUsage(
        sysStats()?.mem.total || 0,
        sysStats()?.mem.active || 0
      );
    }

    if (
      Object(globalConfig)?.features?.monitoring?.systeminformation?.charts
        ?.disk
    ) {
      metrics["disk"] = calculateDiskUsage(sysStats()?.fsSize || []);
    }

    return metrics;
  });

  return (
    <Show
      when={sysStats() !== undefined}
      fallback={
        <section>
          <div class="w-full h-64 animate-pulse transition-all bg-accent/55 rounded-md"></div>
        </section>
      }
    >
      <section class="h-full w-full">
        <Tabs>
          <TabsList>
            <For
              each={Object.keys(
                globalConfig?.features?.monitoring?.systeminformation?.charts
              )}
            >
              {(item) => (
                <TabsTrigger value={item}>
                  {
                    Object(
                      globalConfig?.features?.monitoring?.systeminformation
                        ?.charts
                    )[item].label
                  }
                </TabsTrigger>
              )}
            </For>
            <TabsTrigger value="allCharts">All</TabsTrigger>
          </TabsList>
          <For
            each={Object.keys(
              globalConfig?.features?.monitoring?.systeminformation?.charts
            )}
          >
            {(item) => {
              const chartConfig =
                globalConfig?.features?.monitoring?.systeminformation?.charts;
              return (
                <TabsContent value={item}>
                  <MonitorLineChart
                    backgroundColor={Object(chartConfig)[item]?.backgroundColor}
                    dataName={item}
                    labelName={Object(chartConfig)[item]?.label}
                    dataRecord={metricData}
                  />
                </TabsContent>
              );
            }}
          </For>
          <TabsContent value="allCharts">
            <For
              each={Object.keys(
                globalConfig?.features?.monitoring?.systeminformation?.charts
              )}
            >
              {(item) => {
                const chartConfig =
                  globalConfig?.features?.monitoring?.systeminformation?.charts;
                return (
                  <MonitorLineChart
                    backgroundColor={Object(chartConfig)[item]?.backgroundColor}
                    dataName={item}
                    labelName={Object(chartConfig)[item]?.label}
                    dataRecord={metricData}
                  />
                );
              }}
            </For>
          </TabsContent>
        </Tabs>
      </section>
    </Show>
  );
};

export const SystemMetrics = ({
  sysStats,
}: {
  sysStats: Accessor<SystemMonitorMetrics | undefined>;
}) => {
  const metricData = createMemo(() => {
    const metrics: Record<string, number> = {};

    if (
      Object(globalConfig)?.features?.monitoring?.systeminformation?.stats?.cpu
    ) {
      metrics["cpu"] = sysStats()?.cpuCurrentSpeed.avg || 0;
    }

    if (
      Object(globalConfig)?.features?.monitoring?.systeminformation?.stats
        ?.memory
    ) {
      metrics["memory"] = calculateMemoryUsage(
        sysStats()?.mem.total || 0,
        sysStats()?.mem.active || 0
      );
    }

    if (
      Object(globalConfig)?.features?.monitoring?.systeminformation?.stats?.disk
    ) {
      metrics["disk"] = calculateDiskUsage(sysStats()?.fsSize || []);
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
          <For each={Object.keys(metricData())}>
            {() => (
              <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
            )}
          </For>
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
                <CardDescription>
                  {
                    Object(globalConfig)?.features?.monitoring
                      ?.systeminformation?.stats[name]?.label
                  }
                </CardDescription>
                <CardTitle>{val}%</CardTitle>
              </div>
            </CardProgress>
          )}
        </For>
      </section>
    </Show>
  );
};
