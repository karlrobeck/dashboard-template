import { action, redirect } from "@solidjs/router";
import {
  getEvent,
  getSession,
  HTTPEvent,
  Session,
  SessionConfig,
  SessionData,
  useSession,
} from "vinxi/http";
import { globalConfig } from "~/config";

export const sessionConfig = {
  password: "MY-SUPER-SECRET-PASSWORD-11123-12412412-312",
} as SessionConfig;

export type UserSession = {
  user?: string;
  role?: string;
  scopes?: string[];
};

export async function verifyRole(
  event: HTTPEvent,
  roles: string[]
): Promise<boolean> {
  "use server";
  const session = await getSession<UserSession>(event, sessionConfig);
  const sessionData = session.data;

  if (!sessionData?.role) {
    return false;
  }

  if (!roles.includes(sessionData?.role)) {
    return false;
  }
  return true;
}

export async function verifyScopes(
  event: HTTPEvent,
  scopes: string[]
): Promise<boolean> {
  "use server";
  const session = await useSession(event, sessionConfig);

  const sessionData: UserSession = session?.data;

  if (!sessionData?.scopes) {
    return false;
  }

  const verifiedScopes = scopes.filter((val) => {
    if (!sessionData?.scopes?.includes(val)) {
      return false;
    } else {
      return true;
    }
  });
  if (verifiedScopes.length === 0) {
    return false;
  }
  return true;
}

export async function verifyLogin(event: HTTPEvent): Promise<boolean> {
  "use server";
  try {
    if (await verifyRole(event, ["admin"])) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const signOut = action(async () => {
  "use server";
  const event = getEvent();
  const session = await useSession(event, sessionConfig);
  session.clear();
  throw redirect("/admin/login", 308);
});

export const fetchLogin = action(async (data: FormData) => {
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
    username.toString() !== globalConfig.security.username ||
    password.toString() !== globalConfig.security.password
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
