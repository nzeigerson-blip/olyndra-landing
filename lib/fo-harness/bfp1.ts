/**
 * Server-side client for Grove's partner edge — the two legs FO's own backend performs.
 *
 * SERVER-ONLY. Holds both secrets.
 *
 * Leg 1: OAuth2 client-credentials grant as the `fund-onion` realm client. The token
 *        must carry `aud: partner-api` or grove-bff-base's AudienceValidator rejects it.
 * Leg 2: the call to bfp1 with BOTH `X-API-Key` and `Authorization: Bearer` —
 *        grove-bff-base enforces them as layered authentication, not alternatives.
 */

import { loadConfig, type FoHarnessConfig } from "./config";

export type Bfp1Result = {
  status: number;
  body: unknown;
};

/** Never log a token or a secret; log lengths and status only. */
async function fetchAccessToken(config: FoHarnessConfig): Promise<string> {
  const form = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(config.tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    // The IdP's error body names the failure (invalid_client, unauthorized_client…)
    // and contains no secret, so it is safe and useful to surface.
    throw new Bfp1CallError(
      `client-credentials grant failed (${response.status}): ${text}`,
      response.status
    );
  }

  const token = (JSON.parse(text) as { access_token?: string }).access_token;
  if (!token) {
    throw new Bfp1CallError("client-credentials grant returned no access_token", 502);
  }
  return token;
}

export class Bfp1CallError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/**
 * POST to a bfp1 partner route with the full, real partner authentication.
 * `body` undefined sends no request body (the accept-offer route takes none).
 */
export async function callBfp1(path: string, body?: unknown): Promise<Bfp1Result> {
  const config = loadConfig();
  const accessToken = await fetchAccessToken(config);

  const response = await fetch(`${config.bfp1BaseUrl}${path}`, {
    method: "POST",
    headers: {
      "X-API-Key": config.apiKey,
      Authorization: `Bearer ${accessToken}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
  });

  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    // Not JSON — an edge 403 from Caddy is HTML. Pass the text through so the
    // operator sees the real refusal instead of a parse error.
  }

  // Observability: status and path only. The accept-offer response embeds a
  // short-lived bearer credential (login_link) and must never be logged.
  console.log(`[fo-harness] POST ${path} -> ${response.status}`);

  return { status: response.status, body: parsed };
}
