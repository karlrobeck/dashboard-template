import { JSX, Suspense } from "solid-js"
import { Card } from "./ui/card"
import { ProgressCircle } from "./ui/progress-circle"

export interface CardProgressProp {
    value: number
    children: JSX.Element
}

const CardProgress = (props: CardProgressProp) => {
    return (
        <Suspense>
            <Card class="w-full">
                <div class="p-4 flex flex-row items-center gap-5">
                    <ProgressCircle value={props.value} />
                    {props.children}
                </div>
            </Card>
        </Suspense>
    )
}

export default CardProgress