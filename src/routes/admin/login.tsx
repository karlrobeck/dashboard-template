import {
  action,
  cache,
  createAsync,
  redirect,
  useNavigate,
} from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { getEvent, useSession } from "vinxi/http";
import { sessionConfig, verifyLogin, verifyRole } from "~/lib/security";

const fetchLogin = action(async (data: FormData) => {
  "use server";
  const username = data.get("username");
  const password = data.get("password");
  // check if both present
  if (!username || !password) {
    // return invalid username or password
    return;
  }
  // check if match with env file
  if (
    username.toString() !== "username" ||
    password.toString() !== "password"
  ) {
    // return invalid username or password
    return;
  }
  // create a auth token and store it in cookie
  const event = getEvent();
  const session = await useSession(event, sessionConfig);
  await session.update({
    role: "admin",
    scopes: ["admin:monitor:metrics:read", "admin:monitor:sysInfo:read"],
  });
  throw redirect("/admin/dashboard", 308);
});

const LoginPage = () => {
  // verify if the user is logged in
  const navigate = useNavigate();
  const isLoggedIn = createAsync(async () => {
    "use server";
    const event = getEvent();
    return await verifyLogin(event);
  });
  onMount(() => {
    if (isLoggedIn()) {
      navigate("/admin/dashboard");
    }
  });
  return (
    <Show when={!isLoggedIn()}>
      <main>
        <form action={fetchLogin} method="post">
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            type="text"
            name="username"
          />
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            type="text"
            name="password"
          />
          <button>Submit</button>
        </form>
      </main>
    </Show>
  );
};

export default LoginPage;
