import { createEffect, createResource, createSignal, For, JSX, onCleanup, Resource, Show, Suspense } from "solid-js"
import CardProgress from "~/components/CardProgress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { LineChart } from "~/components/ui/charts"
import { ProgressCircle } from "~/components/ui/progress-circle"
import sysInformation, { Systeminformation } from "systeminformation"
import { SystemMonitorStats } from "~/routes/api/monitor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Skeleton } from "~/components/ui/skeleton"

const SystemStats = ({ sysInfo }: { sysInfo: Resource<SystemMonitorStats> }) => {

    const ramUsage = (): number => {
        const totalMem = sysInfo.latest?.mem.total || 0;
        const activeMem = sysInfo.latest?.mem.active || 0;
        return parseFloat(((activeMem / totalMem) * 100).toFixed(2))
    }

    const diskUsage = (): number => {
        const usedDisk = sysInfo.latest?.fsSize.map((val) => val.used).reduce((prev, curr) => prev + curr, 0) || 0;
        const totalDiskSize = sysInfo.latest?.fsSize.map((val) => val.size).reduce((prev, curr) => prev + curr, 0) || 0;
        return parseFloat(((usedDisk / totalDiskSize) * 100).toFixed(2));
    }

    return <Suspense fallback={<>Loading</>}>
        <section class="grid grid-cols-3 gap-5">
            <CardProgress value={sysInfo.latest?.cpuCurrentSpeed.avg || 0}>
                <div class="space-y-2.5">
                    <CardDescription>CPU Usage</CardDescription>
                    <CardTitle>{sysInfo.latest?.cpuCurrentSpeed.avg || 0}%</CardTitle>
                </div>
            </CardProgress>
            <CardProgress value={ramUsage()}>
                <div class="space-y-2.5">
                    <CardDescription>Memory Usage</CardDescription>
                    <CardTitle>{ramUsage()}%</CardTitle>
                </div>
            </CardProgress>
            <CardProgress value={diskUsage()}>
                <div class="space-y-2.5">
                    <CardDescription>Disk Usage</CardDescription>
                    <CardTitle>{diskUsage()}%</CardTitle>
                </div>
            </CardProgress>
        </section>
    </Suspense>
}

const SysInfoCard = ({ title, data }: { title: JSX.Element, data: any }) => {
    return <Suspense fallback={<>Loading</>}>
        <section>
            <Card>
                <CardHeader>
                    {title}
                </CardHeader>
                <CardContent class="space-y-5">
                    <For each={Object.keys(data)}
                        fallback={<>Loading</>}
                        children={(item) => {
                            const value = data[item]

                            if (typeof value !== "object" && typeof value !== "boolean") {
                                return <div class="grid grid-cols-2 border-b py-2.5 items-start">
                                    <CardDescription class="large">{item.toUpperCase()}</CardDescription>
                                    <span class="muted">{value || "No Information Available"}</span>
                                </div>
                            } else if (typeof value === "boolean") {
                                return <div class="grid grid-cols-2 border-b py-2.5 items-start">
                                    <CardDescription class="large">{item.toUpperCase()}</CardDescription>
                                    <span class="muted">{value ? "True" : "False"}</span>
                                </div>
                            } else {
                                const objData = []
                                for (let key of Object.keys(value)) {
                                    objData.push(<div class="grid grid-cols-2 border-b py-2.5 items-start">
                                        <CardDescription class="large">{typeof +item !== "number" && item.toUpperCase()} {key.toUpperCase()}</CardDescription>
                                        <span class="muted">{typeof value[key] === "boolean" ? value[key] ? "True" : "False" : value[key] || "No Information Available"}</span>
                                    </div>)
                                }
                                return objData
                            }
                        }}
                    />
                </CardContent>
            </Card>
        </section>
    </Suspense>
}

const MonitoringLoadingPage = () => {
    return <article class="space-y-4">
        <section class="grid grid-cols-3 gap-5">
            <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
            <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
            <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
        </section>
        <div class="w-1/4 h-10 animate-pulse bg-accent/55 rounded-md"></div>
        <div class="w-1/2 h-10 animate-pulse bg-accent/55 rounded-md"></div>
        <div class="w-full h-screen animate-pulse bg-accent/55 rounded-md"></div>
    </article>
}

const MonitoringPage = () => {

    const [sysInfo, { refetch }] = createResource<SystemMonitorStats>(async () => {
        const response = await fetch('http://127.0.0.1:3000/api/monitor', {
            method: "GET"
        })
        const data: SystemMonitorStats = await response.json();
        return data
    });
    const fetcher = setInterval(async () => {
        await refetch()
    }, 1000);
    onCleanup(() => clearInterval(fetcher))
    return (
        <Suspense fallback={<MonitoringLoadingPage />}>
            <Show fallback={<MonitoringLoadingPage />} when={!sysInfo.loading || sysInfo.latest !== undefined}>
                <article class="space-y-4">
                    <SystemStats sysInfo={sysInfo} />
                    <h4 class="heading-4">System Information</h4>
                    <Tabs defaultValue="cpuInfo">
                        <TabsList>
                            <TabsTrigger value="cpuInfo">CPU</TabsTrigger>
                            <TabsTrigger value="memInfo">Memory</TabsTrigger>
                            <TabsTrigger value="diskInfo">Disk</TabsTrigger>
                            <TabsTrigger value="operatingSystem">Operating System</TabsTrigger>
                            <TabsTrigger value="versions">OS, Kernel, App Versions</TabsTrigger>
                            <TabsTrigger value="users">Users</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cpuInfo">
                            <SysInfoCard
                                title={<CardTitle>CPU Information</CardTitle>}
                                data={sysInfo.latest?.cpu || sysInfo()?.cpu}
                            />
                        </TabsContent>
                        <TabsContent value="memInfo">
                            <SysInfoCard
                                title={<CardTitle>Memory Information</CardTitle>}
                                data={sysInfo.latest?.mem || sysInfo()?.mem}
                            />
                        </TabsContent>
                        <TabsContent value="diskInfo">
                            <SysInfoCard
                                title={<CardTitle>Disk Information</CardTitle>}
                                data={sysInfo.latest?.fsSize || sysInfo()?.fsSize}
                            />
                        </TabsContent>
                        <TabsContent value="operatingSystem">
                            <SysInfoCard
                                title={<CardTitle>Operating System Information</CardTitle>}
                                data={sysInfo.latest?.osInfo || sysInfo()?.osInfo}
                            />
                        </TabsContent>
                        <TabsContent value="versions">
                            <SysInfoCard
                                title={<CardTitle>Version Information</CardTitle>}
                                data={sysInfo.latest?.versions || sysInfo()?.versions}
                            />
                        </TabsContent>
                        <TabsContent value="users">
                            <SysInfoCard
                                title={<CardTitle>User Information</CardTitle>}
                                data={sysInfo.latest?.users || sysInfo()?.users}
                            />
                        </TabsContent>
                    </Tabs>
                </article>
            </Show>
        </Suspense>
    )
}

export default MonitoringPage