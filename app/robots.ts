import type { MetadataRoute } from "next";

/**
 * Everything on the marketing site stays crawlable; the internal partner harness and
 * its shim routes do not. The harness page also carries its own noindex metadata —
 * robots.txt is a request, the meta tag is the control.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/fo-harness", "/api/fo-harness"],
      },
    ],
  };
}
