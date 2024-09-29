import { children, createSignal, JSX, Suspense, useTransition } from "solid-js";
import { Card } from "./ui/card";
import { ProgressCircle } from "./ui/progress-circle";

export interface CardProgressProp {
  value: number;
  children: JSX.Element;
}

const CardProgress = (props: CardProgressProp) => {
  const c = children(() => props.children);

  return (
    <Suspense
      fallback={
        <div class="w-full h-24 animate-pulse bg-accent/55 rounded-md"></div>
      }
    >
      <Card class="w-full">
        <div class="p-4 flex flex-row items-center gap-5">
          <ProgressCircle value={props.value} />
          {c()}
        </div>
      </Card>
    </Suspense>
  );
};

export default CardProgress;
