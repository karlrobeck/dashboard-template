import { useParams } from "@solidjs/router";
import { For, JSX, JSXElement, Show } from "solid-js";
import globalConfig from "~/../config.json";

const GeneralSettings = () => {
  const param = useParams();

  return (
    <div class="space-y-4">
      <h2 class="heading-2 border-b">{param.feature}</h2>
      <For each={Object.keys(Object(globalConfig)?.features?.[param.feature])}>
        {(f1_item) => (
          <>
            <h4 class="heading-4">{f1_item}</h4>
            <For
              each={Object.keys(
                Object(globalConfig)?.features?.[param.feature][f1_item]
              )}
            >
              {(f2_item) => <>{f2_item}</>}
            </For>
          </>
        )}
      </For>
    </div>
  );
};

export default GeneralSettings;
