import { splitProps, type Component, type ComponentProps } from "solid-js"
import { cn } from "~/lib/utils"

const Input: Component<ComponentProps<"input">> = (
    props
) => {

    const [local, others] = splitProps(props, ["class"])

    return (
        <input class={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", local.class)} {...others} />
    )
}

export default Input