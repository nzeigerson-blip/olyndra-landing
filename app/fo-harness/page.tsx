/**
 * FO partner test harness.
 *
 * Internal integration-test page: it stands in for the partner-side website that
 * calls Grove's partner API, so the partner→Grove hand-off is exercised across the
 * public internet exactly as the real integration will be. It is Olyndra's own test
 * page — it does not represent or present itself as any partner's website.
 *
 * Not linked from anywhere on the site, and noindex.
 */

import type { Metadata } from "next";
import FoHarnessClient from "./harness-client";

export const metadata: Metadata = {
  title: "Partner harness (internal)",
  robots: { index: false, follow: false, nocache: true },
};

export default function FoHarnessPage() {
  return <FoHarnessClient />;
}
