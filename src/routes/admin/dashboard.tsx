import BreadcrumbURL from "~/components/Breadcrumb"
import { Button, buttonVariants } from "~/components/ui/button"
import { Location, RouteSectionProps } from "@solidjs/router";

const DashboardSidebarNav = ({ location }: { location: Location }) => {
    return <ul class="pt-[1.25rem] space-y-2.5">
        <li>
            <a href="/admin/dashboard/monitoring">
                <Button classList={{ "bg-accent hover:bg-accent/70": location.pathname.startsWith("/admin/dashboard/monitoring") }} variant={"ghost"} class="w-full justify-start gap-2.5">
                    <i class="bi bi-house-door"></i>
                    Monitoring
                </Button>
            </a>
        </li>
        <li>
            <a href="/admin/dashboard/settings">
                <Button classList={{ "bg-accent hover:bg-accent/70": location.pathname.startsWith("/admin/dashboard/settings") }} variant={"ghost"} class="w-full justify-start gap-2.5">
                    <i class="bi bi-gear-wide"></i>
                    Settings
                </Button>
            </a>
        </li>
        <li>
            <a href="/dashboard/about">
                <Button classList={{ "bg-accent hover:bg-accent/70": location.pathname.startsWith("/admin/dashboard/about") }} variant={"ghost"} class="w-full justify-start gap-2.5">
                    <i class="bi bi-info-square"></i>
                    About
                </Button>
            </a>
        </li>
    </ul>
}

const DashboardLayout = (props: RouteSectionProps) => {
    return (
        <main class="flex max-h-screen h-screen">
            <aside class="w-1/6 p-4 border-border border-r">
                <h4>Dashboard Template</h4>
                <DashboardSidebarNav location={props.location} />
            </aside>
            <div class="w-full h-full">
                <header class="h-fit bg-accent p-4 border border-border">Header</header>
                <div class="h-[90%] p-4 overflow-y-auto space-y-4">
                    <BreadcrumbURL />
                    {props.children}
                </div>
            </div>
        </main>
    )
}

export default DashboardLayout