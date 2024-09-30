import { useParams } from "@solidjs/router";
import {
  createSignal,
  For,
  JSX,
  JSXElement,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { globalConfig } from "~/config";
import { flattenObj } from "~/lib/utils";
import lodash, { isArray } from "lodash";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Input from "~/components/ui/Input";
import {
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
  Switch as SwitchToggle,
} from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

const ConvertToInput = ({ value }: { value: any }) => {
  const [multiInputs, setMultiInputs] = createSignal([]);

  return (
    <Switch fallback={<Input placeholder="hello" />}>
      <Match when={typeof value === "object" && !lodash.isArray(value)}>
        <For each={Object.entries(value)}>
          {([key, val]) => (
            <Switch fallback={<ConvertToInput value={val} />}>
              <Match when={typeof val === "boolean"}>
                <div class="flex flex-row items-center pb-4">
                  <Label class="lead">{lodash.startCase(key)}</Label>
                  <ConvertToInput value={val} />
                </div>
              </Match>
            </Switch>
          )}
        </For>
      </Match>
      <Match when={typeof value === "boolean"}>
        <div class="grid w-full max-w-full items-center gap-1.5">
          <SwitchToggle checked={value} class="flex items-center space-x-2">
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </SwitchToggle>
        </div>
      </Match>
      <Match when={typeof value === "string"}>
        <Input class="w-full" placeholder={`Edit`} type="text" />
      </Match>
      <Match when={typeof value === "number"}>
        <Input class="w-full" placeholder={`Edit`} type="number" />
      </Match>
      <Match when={typeof value === "object" && lodash.isArray(value)}>
        <div class="grid w-full max-w-full items-center gap-1.5">
          <For each={value}>{(item) => <ConvertToInput value={item} />}</For>
        </div>
      </Match>
    </Switch>
  );
};

const editSample = (obj: any) => {
  const data: Record<string, any> = {};

  for (let [key, val] of Object.entries(obj)) {
    const configName = key.split(".").at(-1);
    const restNames = key.split(".").slice(0, -1);
    const featureName = restNames.shift();
    if (configName) {
      const tempObj: any = {};
      tempObj[configName] = val;
      if (data[`${featureName}.${restNames.join(".")}`]) {
        data[`${featureName}.${restNames.join(".")}`].push(tempObj);
      } else {
        data[`${featureName}.${restNames.join(".")}`] = [tempObj];
      }
    }
  }

  return Object.entries(data)
    .sort()
    .reduce((prev, [key, val]) => ({ ...prev, [key]: val }), {});
};

function getItemWithDocumentation(data: any): any | undefined {
  let dataString;
  data.forEach((val: any) => {
    if ("documentation" in val) {
      dataString = val["documentation"];
    }
  });
  return dataString;
}

const GeneralSettings = () => {
  const param = useParams();

  return (
    <div class="space-y-4 overflow-y-auto">
      <h2 class="heading-2">{lodash.startCase(param.feature)}</h2>
      <For
        each={Object.entries(
          editSample(
            flattenObj(Object(globalConfig)?.features?.[param.feature])
          )
        )}
      >
        {([f1_item, value]) => {
          const configName = f1_item.split(".").at(-1);
          const restNames = f1_item.split(".").slice(0, -1);
          const featureName = restNames.shift();

          return (
            <>
              <Breadcrumb class="border-b pb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink class="large muted uppercase">
                      {lodash.startCase(featureName)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <For each={restNames}>
                    {(name, index) => (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink class="large muted uppercase">
                            {lodash.startCase(name)}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </For>
                  <BreadcrumbItem>
                    <BreadcrumbLink current class="uppercase">
                      {lodash.startCase(configName)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div class="grid gap-5 leading-none">
                <p class="muted">{getItemWithDocumentation(value)}</p>
                <ConvertToInput value={value} />
              </div>
            </>
          );
        }}
      </For>
    </div>
  );
};

export default GeneralSettings;
