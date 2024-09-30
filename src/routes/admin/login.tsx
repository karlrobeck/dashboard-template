import {
  action,
  cache,
  createAsync,
  redirect,
  useNavigate,
} from "@solidjs/router";

import { onMount, Show } from "solid-js";
import { getEvent } from "vinxi/http";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Input from "~/components/ui/Input";
import { Label } from "~/components/ui/label";
import { globalConfig } from "~/config";
import { fetchLogin, verifyLogin } from "~/lib/security";

const LoginPage = () => {
  // verify if the user is logged in
  const navigate = useNavigate();
  const isLoggedIn = createAsync(async () => {
    "use server";
    const event = getEvent();
    const result = await verifyLogin(event);
    if (result) {
      return;
    }
  });
  onMount(() => {
    if (isLoggedIn()) {
      navigate("/admin/dashboard");
    }
  });
  return (
    <Show when={!isLoggedIn()}>
      <main class="container mx-auto max-w-[1440px] w-full max-h-screen h-screen grid grid-cols-2">
        <div class="h-full w-full bg-accent p-4 flex flex-col justify-between">
          <div class="space-y-2.5">
            <h4 class="heading-4">{globalConfig.general.companyName}</h4>
            <p class="lead small">{globalConfig.general.applicationName}</p>
          </div>
          <span class="muted">Developed by: Karl Robeck Alferez</span>
        </div>
        <div class="h-full w-full flex justify-center items-center px-24">
          <Card class="w-full">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login with your credentials</CardDescription>
            </CardHeader>
            <form action={fetchLogin} method="post">
              <CardContent class="space-y-2.5 w-full">
                <div class="w-full">
                  <Label for="username" class="pb-1.5">
                    Email
                  </Label>
                  <Input
                    id="username"
                    class="w-full"
                    type="username"
                    name="username"
                  />
                </div>
                <div class="w-full">
                  <Label for="email" class="pb-1.5">
                    Password
                  </Label>
                  <Input
                    id="password"
                    class="w-full"
                    type="password"
                    name="password"
                  />
                </div>
              </CardContent>
              <CardFooter class="gap-x-2.5">
                <Button type="submit">Log In</Button>
                <Button variant="link">Forgot Password?</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </Show>
  );
};

export default LoginPage;
