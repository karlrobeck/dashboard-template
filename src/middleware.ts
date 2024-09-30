import { createMiddleware } from "@solidjs/start/middleware";
import type { FetchEvent } from "@solidjs/start/server";

async function loggingMiddleware(event: FetchEvent) {
  const status = event.response.status || 0;

  if (status >= 100 && status <= 399) {
    console.log(
      `${event.clientAddress} - ${event.request.method} - ${event.request.url} Status ${event.response.status}`
    );
  }

  if (status >= 400 && status <= 499) {
    console.warn(
      `${event.clientAddress} - ${event.request.method} - ${event.request.url} Status ${event.response.status}`
    );
  }

  return;
}

export default createMiddleware({
  // uncomment it to see
  // onRequest: [loggingMiddleware],
  onBeforeResponse: [loggingMiddleware],
});
