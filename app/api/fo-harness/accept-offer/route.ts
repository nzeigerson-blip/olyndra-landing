/**
 * Shim leg 2 — accept the offer and receive the journey-entry link.
 *
 * Calls bfp1's on-demand accept-offer route with the SAME two secrets. The path
 * segment is the partner's own application key (FO's `metadata.application_id`),
 * per AcceptOfferRelayService's contract — not a Grove-internal id.
 *
 * The returned `login_link` is a short-lived bearer credential: it is passed to the
 * browser (which must open it) and never logged.
 */

import { NextResponse } from "next/server";
import { callBfp1, Bfp1CallError } from "@/lib/fo-harness/bfp1";
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

    const { applicationId } = (await request.json()) as { applicationId?: string };
    if (!applicationId) {
      return NextResponse.json({ error: "applicationId is required" }, { status: 400 });
    }

    const result = await callBfp1(
      `/api/v1/applications/${encodeURIComponent(applicationId)}/accept-offer`
    );

    return NextResponse.json(
      { upstreamStatus: result.status, acceptOffer: result.body },
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
