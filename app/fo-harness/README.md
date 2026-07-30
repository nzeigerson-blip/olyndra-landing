# Partner application harness (internal)

Stands in for the partner-side website that calls Grove's partner API, so the
partner→Grove hand-off is exercised across the public internet exactly as the real
integration will be — not same-origin, not with a shortcut credential.

Design of record: `grove-claude-framework/docs/infra/s24-fo-test-harness-hi-slice.md`.

## Shape

- `page.tsx` / `harness-client.tsx` — browser UI. Holds **no** Grove credential.
- `../api/fo-harness/submit` — server shim: client-credentials grant, then
  `POST /api/v1/applications`.
- `../api/fo-harness/accept-offer` — server shim: `POST /api/v1/applications/{id}/accept-offer`,
  returns the journey-entry `login_link`.
- `../../lib/fo-harness/*` — server-only config, the bfp1 client, the two payloads.

The browser calls only its own origin. The shim reaches bfp1 server-to-server, which is
why the two secrets can be real and why CORS does not apply.

## Environment

This repo is **public**. No secret may ever be committed here — not in code, not in a
committed `.env`, not in a build arg. All values come from Vercel environment variables.

| Variable | Notes |
|---|---|
| `FO_HARNESS_ACCESS_KEY` | Gates the harness page. **No default — unset means the shim refuses to run.** Not a Grove credential. |
| `FO_HARNESS_CLIENT_SECRET` | m2m secret for realm client `fund-onion`. **No default.** |
| `FO_HARNESS_API_KEY` | Partner `X-API-Key`. Defaults to the local-dev value. |
| `FO_HARNESS_BFP1_BASE_URL` | e.g. `https://partner.stg.olyndra.ai`. Defaults to localhost. |
| `FO_HARNESS_TOKEN_URI` | e.g. `https://auth.stg.olyndra.ai/realms/grove/protocol/openid-connect/token`. Defaults to localhost. |
| `FO_HARNESS_CLIENT_ID` | Defaults to `fund-onion`. |

Secret values live in AWS Secrets Manager (`eu-west-2`):
`grove/dev/fundonion/m2m-client-credentials` and `grove/dev/bfp1/partner-api-key`.

**With no env vars set the harness is inert** — it returns a configuration error and
makes no outbound call. That is deliberate: deploying it does not arm it.

## Contract

Every field of both payloads is pinned to grove-platform `origin/main` — parsed by
`onboarding/…/partner/PartnerOrchestrationService.java`, decided by
`underwriting/…/service/UnderwritingService.java`. A wrong field name does **not**
error; `JsonNode.path()` maps it silently to `null`. Re-verify against the real parser
before changing a payload.

## Per-test-window steps (owner: Head Infra)

1. Keycloak must run with `KC_HOSTNAME=auth.stg.olyndra.ai` and
   `KC_PROXY_HEADERS=xforwarded`, or the token's `iss` is wrong and bfp1 rejects it.
2. bfp1 must run with `GROVE_BFF_JWT_ISSUER_URI=https://auth.stg.olyndra.ai/realms/grove`.
   Left blank, bfp1 checks only the API key and the m2m leg is not tested at all.
3. Run `grove-infra/s24-devbox/keycloak-fo-partner-client.sh` — required again after any
   `docker compose down`.
4. Vercel's egress IP is dynamic: the first call gets a **403** from the partner edge.
   Read the source IP from `/var/log/caddy/partner.log`, add that `/32` to
   `https_allowed_cidrs`, reload Caddy, retry. Drop the `/32` when the window closes.
   That first 403 **is** the proof that an unlisted caller is refused.
