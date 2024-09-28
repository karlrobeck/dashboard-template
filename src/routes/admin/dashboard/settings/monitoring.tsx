import { Checkbox } from "~/components/ui/checkbox"

const MonitoringSettings = () => {
    return (
        <article>
            <h2 class="heading-2">Monitoring Settings</h2>
            <section class="">
                <div class="grid grid-cols-2 border-b py-4 items-start">
                    <div class="flex flex-row items-center gap-5">
                        <Checkbox />
                        <span class="large">CPU Monitoring</span>
                    </div>
                    <p class="muted">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui est, voluptas eligendi saepe rem molestiae itaque eum, debitis possimus dolor dolorem quibusdam tempore fuga asperiores ea odit laudantium quae magnam non nam voluptatem sequi ratione? Optio earum illo vero aliquam nesciunt voluptates deserunt. Odit quas, minima expedita cupiditate magnam laboriosam.</p>
                </div>
                <div class="grid grid-cols-2 border-b py-4 items-start">
                    <div class="flex flex-row items-center gap-5">
                        <Checkbox />
                        <span class="large">RAM Monitoring</span>
                    </div>
                    <p class="muted">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui est, voluptas eligendi saepe rem molestiae itaque eum, debitis possimus dolor dolorem quibusdam tempore fuga asperiores ea odit laudantium quae magnam non nam voluptatem sequi ratione? Optio earum illo vero aliquam nesciunt voluptates deserunt. Odit quas, minima expedita cupiditate magnam laboriosam.</p>
                </div>
                <div class="grid grid-cols-2 border-b py-4 items-start">
                    <div class="flex flex-row items-center gap-5">
                        <Checkbox />
                        <span class="large">Disk Monitoring</span>
                    </div>
                    <p class="muted">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui est, voluptas eligendi saepe rem molestiae itaque eum, debitis possimus dolor dolorem quibusdam tempore fuga asperiores ea odit laudantium quae magnam non nam voluptatem sequi ratione? Optio earum illo vero aliquam nesciunt voluptates deserunt. Odit quas, minima expedita cupiditate magnam laboriosam.</p>
                </div>
            </section>
        </article>
    )
}

export default MonitoringSettings