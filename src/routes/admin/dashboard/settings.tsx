import { Location, RouteSectionProps } from "@solidjs/router";
import { For, Match, Switch } from "solid-js";
import { Button } from "~/components/ui/button";
import globalConfig from "~/../config.json";
import lodash from "lodash";
const SettingsSidebarNav = ({ location }: { location: Location }) => {
  return (
    <aside class="h-full border-r p-4 col-span-2">
      <ul class="space-y-2.5">
        <For each={Object.keys(globalConfig.features)}>
          {(item) => (
            <li>
              <a href={`/admin/dashboard/settings/${item}`}>
                <Button
                  classList={{
                    "bg-accent hover:bg-accent/70":
                      location.pathname === `/admin/dashboard/settings/${item}`,
                  }}
                  class="justify-start w-full"
                  variant={"ghost"}
                >
                  {lodash.startCase(item)}
                </Button>
              </a>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
};

const SettingsLayout = (props: RouteSectionProps) => {
  return (
    <div class="h-full">
      <h4 class="heading-2 border-b border-border pb-4">Settings</h4>
      <div class="grid grid-cols-12 w-full h-full">
        <SettingsSidebarNav location={props.location} />
        <div class="p-4 col-span-10">{props.children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
