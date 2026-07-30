/**
 * FO test-harness shim configuration.
 *
 * This module is SERVER-ONLY. Neither secret may ever reach the browser: no
 * NEXT_PUBLIC_ prefix, and nothing here may be imported from a client component.
 *
 * Defaults are the local-dev values from grove-platform's
 * bfp1/src/main/resources/application-bfp1.yml, so the harness runs against a
 * local stack with no real secret. The deployed harness gets every value from
 * Vercel environment variables.
 */

export type FoHarnessConfig = {
  bfp1BaseUrl: string;
  tokenUri: string;
  clientId: string;
  clientSecret: string;
  apiKey: string;
};

/** Thrown when a required secret is absent. Fail loudly, never silently unauthenticated. */
export class FoHarnessConfigError extends Error {}

export function loadConfig(): FoHarnessConfig {
  const clientSecret = process.env.FO_HARNESS_CLIENT_SECRET ?? "";
  const apiKey = process.env.FO_HARNESS_API_KEY ?? "";

  // Local-dev fallbacks mirror application-bfp1.yml. In any deployed environment
  // both of these are real values injected by Vercel.
  const resolvedApiKey = apiKey || "local-dev-partner-key";

  if (!clientSecret) {
    throw new FoHarnessConfigError(
      "FO_HARNESS_CLIENT_SECRET is not set. The shim performs a real client-credentials " +
        "grant as the `fund-onion` realm client; there is no unauthenticated mode."
    );
  }

  return {
    bfp1BaseUrl: (process.env.FO_HARNESS_BFP1_BASE_URL ?? "http://localhost:8093").replace(/\/+$/, ""),
    tokenUri:
      process.env.FO_HARNESS_TOKEN_URI ??
      "http://localhost:8180/realms/grove/protocol/openid-connect/token",
    clientId: process.env.FO_HARNESS_CLIENT_ID ?? "fund-onion",
    clientSecret,
    apiKey: resolvedApiKey,
  };
}

/**
 * Gate on the harness itself.
 *
 * The harness drives a real Grove environment with real partner credentials, and it
 * is hosted on a public origin. Without this check, anyone who finds the URL can
 * fire applications into the dev bank. This gate protects the PAGE; it is not part
 * of the FO contract, which stays exactly as FO will use it (X-API-Key + bearer).
 *
 * Fails closed: no configured key means no access.
 */
export function assertHarnessAccess(request: Request): void {
  const expected = process.env.FO_HARNESS_ACCESS_KEY ?? "";
  if (!expected) {
    throw new FoHarnessConfigError(
      "FO_HARNESS_ACCESS_KEY is not set. The harness refuses to run rather than expose " +
        "an open driver of a real Grove environment."
    );
  }
  const presented = request.headers.get("x-harness-access-key") ?? "";
  if (presented !== expected) {
    throw new FoHarnessAccessDenied();
  }
}

export class FoHarnessAccessDenied extends Error {}
