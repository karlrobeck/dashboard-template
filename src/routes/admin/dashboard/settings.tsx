import { Location, RouteSectionProps } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { Button } from "~/components/ui/button"

const SettingsSidebarNav = ({ location }: { location: Location }) => {
    return <aside class="h-full border-r p-4 col-span-2">
        <ul class="space-y-2.5">
            <li>
                <a href="/admin/dashboard/settings">
                    <Button classList={{ "bg-accent hover:bg-accent/70": location.pathname === "/admin/dashboard/settings" }} class="justify-start w-full" variant={"ghost"}>General</Button>
                </a>
            </li>
            <li>
                <a href="/admin/dashboard/settings/monitoring">
                    <Button classList={{ "bg-accent hover:bg-accent/70": location.pathname === "/admin/dashboard/settings/monitoring" }} class="justify-start w-full" variant={"ghost"}>Monitoring Settings</Button>
                </a>
            </li>
        </ul>
    </aside>
}

const SettingsLayout = (props: RouteSectionProps) => {
    return (
        <div class="h-full">
            <h4 class="heading-2 border-b border-border pb-4">Settings</h4>
            <div class="grid grid-cols-12 w-full h-full">
                <SettingsSidebarNav location={props.location} />
                <div class="p-4 col-span-10">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default SettingsLayout