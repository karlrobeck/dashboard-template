import { Accessor, For, Resource, Show, Suspense } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import lodash from "lodash";
import { SystemMonitorInfo } from "~/routes/admin/dashboard/monitoring";

const SysInfoCardTableLoading = () => {
  return (
    <section class="space-y-5">
      <div class="w-full h-64 animate-pulse transition-all bg-accent/55 rounded-md"></div>
      <div class="w-full h-screen animate-pulse transition-all bg-accent/55 rounded-md"></div>
    </section>
  );
};

const SysInfoCardTable = ({
  sysInfo,
}: {
  sysInfo: Accessor<SystemMonitorInfo | undefined>;
}) => {
  const flattenObj = (obj: any) => {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && !Array.isArray(value)) {
        const nestedResult = flattenObj(value);
        Object.entries(nestedResult).forEach(([nestedKey, nestedValue]) => {
          result[`${key}.${nestedKey}`] = nestedValue;
        });
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  return (
    <Show when={sysInfo() !== undefined} fallback={<SysInfoCardTableLoading />}>
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

export default SysInfoCardTable;
