/**
 * Shim leg 1 — submit an FO application to the real Grove partner edge.
 *
 * The browser posts only { kind: "good" | "bad" }. The payload is built here and the
 * two secrets never leave the server. This is what makes the page-plus-shim shape
 * mandatory rather than stylistic.
 */

import { NextResponse } from "next/server";
import { callBfp1, Bfp1CallError } from "@/lib/fo-harness/bfp1";
import { buildPayload, newApplicationId, type PayloadKind } from "@/lib/fo-harness/payloads";
import {
  assertHarnessAccess,
  FoHarnessAccessDenied,
  FoHarnessConfigError,
} from "@/lib/fo-harness/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertHarnessAccess(request);

    const { kind } = (await request.json()) as { kind?: PayloadKind };
    if (kind !== "good" && kind !== "bad") {
      return NextResponse.json({ error: 'kind must be "good" or "bad"' }, { status: 400 });
    }

    const applicationId = newApplicationId();
    const payload = buildPayload(kind, applicationId);
    const result = await callBfp1("/api/v1/applications", payload);

    return NextResponse.json(
      { applicationId, sent: payload, upstreamStatus: result.status, decision: result.body },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof FoHarnessAccessDenied) {
      return NextResponse.json({ error: "harness access denied" }, { status: 401 });
    }
    if (error instanceof FoHarnessConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (error instanceof Bfp1CallError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "unknown failure" },
      { status: 500 }
    );
  }
}
