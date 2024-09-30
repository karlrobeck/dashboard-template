import BreadcrumbURL from "~/components/Breadcrumb";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  createAsync,
  Location,
  RouteSectionProps,
  useAction,
  useNavigate,
} from "@solidjs/router";
import { For, onMount, Show, Suspense } from "solid-js";
import { getEvent } from "vinxi/http";
import { signOut, verifyLogin } from "~/lib/security";
import { globalConfig } from "~/config";
import lodash from "lodash";

const DashboardSidebarNav = ({ location }: { location: Location }) => {
  return (
    <ul class="pt-2.5 space-y-2.5">
      <li>
        <span class="muted">Navigation</span>
      </li>
      <For each={Object.entries(globalConfig.navigation)}>
        {([key, val]) => (
          <li>
            <a href={val.href}>
              <Button
                classList={{
                  "bg-accent hover:bg-accent/70": location.pathname.startsWith(
                    val.href
                  ),
                }}
                variant={"ghost"}
                class="w-full justify-start gap-2.5"
              >
                {val.icon}
                {lodash.startCase(key)}
              </Button>
            </a>
          </li>
        )}
      </For>
      <li>
        <span class="muted">System</span>
      </li>
      <li>
        <a href="/admin/dashboard/settings/monitoring">
          <Button
            classList={{
              "bg-accent hover:bg-accent/70": location.pathname.startsWith(
                "/admin/dashboard/settings/monitoring"
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
      <li>
        <form action={signOut} method="post">
          <Button
            type="submit"
            variant={"ghost"}
            class="w-full justify-start gap-2.5"
          >
            <i class="bi bi-box-arrow-left"></i>
            Sign out
          </Button>
        </form>
      </li>
    </ul>
  );
};

const DashboardLayout = (props: RouteSectionProps) => {
  const navigate = useNavigate();
  const isLoggedIn = createAsync(async () => {
    "use server";
    const event = getEvent();
    const result = await verifyLogin(event);
    return result;
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
          <h4 class="heading-4">{globalConfig.general.applicationName}</h4>
          <span class="muted">{globalConfig.general.companyName}</span>
          <DashboardSidebarNav location={props.location} />
        </aside>
        <div class="w-full h-full">
          <div class="h-full px-4 space-y-4">
            <div class="sticky top-0 bg-background py-4 z-50 border-b border-border">
              <BreadcrumbURL />
            </div>
            <div class="h-[90%] pb-4 overflow-y-auto">{props.children}</div>
          </div>
        </div>
      </main>
    </Show>
  );
};

export default DashboardLayout;
