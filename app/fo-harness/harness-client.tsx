"use client";

/**
 * Harness UI. Pure presentation — holds NO Grove credential.
 *
 * The access key typed here gates this page only; it is not a Grove credential and
 * is not part of the partner contract. The X-API-Key and the m2m client secret live
 * exclusively in the server-side shim.
 */

import { useState } from "react";

type Decision = {
  metadata?: { application_id?: string; company_crn?: string; decision_timestamp?: string };
  data?: {
    decision?: string;
    decline_reason?: string;
    offer?: Record<string, unknown> | null;
  };
};

type SubmitResult = {
  applicationId: string;
  upstreamStatus: number;
  decision: Decision;
  sent: unknown;
};

const money = (v: unknown): string => {
  const m = v as { amount?: number | string; currency?: string } | undefined;
  if (!m || m.amount === undefined) return "—";
  return `${m.currency ?? ""} ${Number(m.amount).toLocaleString()}`.trim();
};

export default function FoHarnessClient() {
  const [accessKey, setAccessKey] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [loginLink, setLoginLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSent, setShowSent] = useState(false);

  async function post(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-harness-access-key": accessKey },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error ?? `request failed (${response.status})`);
    return json;
  }

  async function submit(kind: "good" | "bad") {
    setBusy(kind);
    setError(null);
    setResult(null);
    setLoginLink(null);
    try {
      setResult((await post("/api/fo-harness/submit", { kind })) as SubmitResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown failure");
    } finally {
      setBusy(null);
    }
  }

  async function acceptOffer() {
    if (!result) return;
    setBusy("accept");
    setError(null);
    try {
      const json = await post("/api/fo-harness/accept-offer", {
        applicationId: result.applicationId,
      });
      const link = json?.acceptOffer?.login_link ?? null;
      if (!link) throw new Error("accept-offer returned no login_link");
      setLoginLink(link);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown failure");
    } finally {
      setBusy(null);
    }
  }

  const decision = result?.decision?.data?.decision;
  const offer = result?.decision?.data?.offer as Record<string, unknown> | undefined;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 font-sans">
      <p className="mb-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
        Internal test harness — not a customer-facing page
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Partner application harness</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Submits a real partner application to Grove across the public internet, with the
        same layered authentication a partner integration uses: an API key plus an OAuth2
        client-credentials bearer token. Both secrets are held server-side.
      </p>

      <label className="mt-8 block text-sm font-medium">
        Harness access key
        <input
          type="password"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          autoComplete="off"
          placeholder="required"
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => submit("good")}
          disabled={!accessKey || busy !== null}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {busy === "good" ? "Submitting…" : "Submit good application"}
        </button>
        <button
          onClick={() => submit("bad")}
          disabled={!accessKey || busy !== null}
          className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          {busy === "bad" ? "Submitting…" : "Submit weak-financials application"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-medium">Failed</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">{error}</pre>
        </div>
      )}

      {result && (
        <section className="mt-8 rounded border border-neutral-200 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">
              {decision === "APPROVED" && <span className="text-green-700">Approved</span>}
              {decision === "DECLINED" && <span className="text-red-700">Declined</span>}
              {!decision && <span className="text-neutral-700">No decision returned</span>}
            </h2>
            <span className="text-xs text-neutral-500">
              HTTP {result.upstreamStatus} · {result.applicationId}
            </span>
          </div>

          {decision === "DECLINED" && (
            <p className="mt-3 text-sm text-neutral-700">
              Reason: {result.decision?.data?.decline_reason ?? "—"}
            </p>
          )}

          {decision === "APPROVED" && offer && (
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-neutral-500">Loan amount</dt>
              <dd>{money(offer.loan_amount)}</dd>
              <dt className="text-neutral-500">Net advance</dt>
              <dd>{money(offer.net_advance)}</dd>
              <dt className="text-neutral-500">Monthly repayment</dt>
              <dd>{money(offer.monthly_repayment)}</dd>
              <dt className="text-neutral-500">APR</dt>
              <dd>{String(offer.apr ?? "—")}</dd>
              <dt className="text-neutral-500">Term</dt>
              <dd>
                {(offer.term as { amount?: number; unit?: string })?.amount ?? "—"}{" "}
                {(offer.term as { amount?: number; unit?: string })?.unit ?? ""}
              </dd>
              <dt className="text-neutral-500">Offer expires</dt>
              <dd>{String(offer.offer_expiry_date ?? "—")}</dd>
            </dl>
          )}

          {decision === "APPROVED" && !loginLink && (
            <button
              onClick={acceptOffer}
              disabled={busy !== null}
              className="mt-5 rounded bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {busy === "accept" ? "Requesting link…" : "Accept offer"}
            </button>
          )}

          {loginLink && (
            <div className="mt-5 rounded border border-green-300 bg-green-50 p-4">
              <p className="text-sm text-green-900">
                Offer accepted. Open the journey-entry link to continue as the applicant.
              </p>
              <a
                href={loginLink}
                className="mt-3 inline-block rounded bg-green-700 px-4 py-2 text-sm font-medium text-white"
              >
                Continue to Grove
              </a>
              <p className="mt-2 text-xs text-green-800">
                Single-use and short-lived — request a new one if it expires.
              </p>
            </div>
          )}

          <button
            onClick={() => setShowSent(!showSent)}
            className="mt-5 text-xs text-neutral-500 underline"
          >
            {showSent ? "Hide" : "Show"} the payload that was sent
          </button>
          {showSent && (
            <pre className="mt-2 max-h-80 overflow-auto rounded bg-neutral-50 p-3 text-xs">
              {JSON.stringify(result.sent, null, 2)}
            </pre>
          )}
        </section>
      )}
    </main>
  );
}
