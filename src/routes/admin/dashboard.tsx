import BreadcrumbURL from "~/components/Breadcrumb";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  createAsync,
  Location,
  RouteSectionProps,
  useNavigate,
} from "@solidjs/router";
import { onMount, Show, Suspense } from "solid-js";
import { getEvent } from "vinxi/http";
import { verifyLogin } from "~/lib/security";

const DashboardSidebarNav = ({ location }: { location: Location }) => {
  return (
    <ul class="pt-[1.25rem] space-y-2.5">
      <li>
        <a href="/admin/dashboard/monitoring">
          <Button
            classList={{
              "bg-accent hover:bg-accent/70": location.pathname.startsWith(
                "/admin/dashboard/monitoring"
              ),
            }}
            variant={"ghost"}
            class="w-full justify-start gap-2.5"
          >
            <i class="bi bi-house-door"></i>
            Monitoring
          </Button>
        </a>
      </li>
      <li>
        <a href="/admin/dashboard/settings">
          <Button
            classList={{
              "bg-accent hover:bg-accent/70": location.pathname.startsWith(
                "/admin/dashboard/settings"
              ),
            }}
            variant={"ghost"}
            class="w-full justify-start gap-2.5"
          >
            <i class="bi bi-gear-wide"></i>
            Settings
          </Button>
        </a>
      </li>
      <li>
        <a href="/dashboard/about">
          <Button
            classList={{
              "bg-accent hover:bg-accent/70": location.pathname.startsWith(
                "/admin/dashboard/about"
              ),
            }}
            variant={"ghost"}
            class="w-full justify-start gap-2.5"
          >
            <i class="bi bi-info-square"></i>
            About
          </Button>
        </a>
      </li>
    </ul>
  );
};

const DashboardLayout = (props: RouteSectionProps) => {
  const navigate = useNavigate();

  const isLoggedIn = createAsync(async () => {
    "use server";
    const event = getEvent();
    return await verifyLogin(event);
  });
  onMount(() => {
    if (!isLoggedIn()) {
      navigate("/admin/login");
    }
  });
  return (
    <Show when={isLoggedIn()}>
      <main class="flex max-h-screen h-screen">
        <aside class="w-1/6 p-4 border-border border-r">
          <h4>Dashboard Template</h4>
          <DashboardSidebarNav location={props.location} />
        </aside>
        <div class="w-full h-full">
          <div class="h-full px-4 pb-4 overflow-y-auto space-y-4">
            <div class="sticky top-0 bg-background py-4 z-50 border-b border-border">
              <BreadcrumbURL />
            </div>
            {props.children}
          </div>
        </div>
      </main>
    </Show>
  );
};

export default DashboardLayout;
