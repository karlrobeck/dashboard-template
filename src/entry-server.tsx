// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { ErrorBoundary } from "solid-js";
import { HttpStatusCode } from "@solidjs/start";
export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <ErrorBoundary
          fallback={(e) => {
            console.log(e);
            return (
              <>
                <HttpStatusCode code={404} />
              </>
            );
          }}
        >
          <body class="dark bg-background text-foreground">
            <div id="app">{children}</div>
            {scripts}
          </body>
        </ErrorBoundary>
      </html>
    )}
  />
));
