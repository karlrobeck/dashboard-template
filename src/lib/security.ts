import {
  getEvent,
  getSession,
  HTTPEvent,
  Session,
  SessionConfig,
  SessionData,
  useSession,
} from "vinxi/http";

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
  const session = await getSession(event, sessionConfig);

  const sessionData: UserSession = session.data;

  if (!sessionData.role) {
    return false;
  }

  if (!roles.includes(sessionData.role)) {
    return false;
  }
  return true;
}

export async function verifyScopes(
  event: HTTPEvent,
  scopes: string[]
): Promise<boolean> {
  const session = await getSession(event, sessionConfig);

  const sessionData: UserSession = session.data;

  if (!sessionData.scopes) {
    return false;
  }

  const verifiedScopes = scopes.filter((val) => {
    if (!sessionData.scopes?.includes(val)) {
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
  if (await verifyRole(event, ["admin"])) {
    return true;
  }
  return false;
}
