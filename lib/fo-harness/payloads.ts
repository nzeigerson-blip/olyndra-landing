/**
 * The two FO application payloads.
 *
 * Every field path here is read from grove-platform `origin/main`, not invented:
 *   - parsed by onboarding/…/partner/PartnerOrchestrationService.java
 *   - decided by underwriting/…/service/UnderwritingService.java
 *
 * A wrong field name does NOT error — PartnerOrchestrationService uses
 * JsonNode.path(), so an unrecognised key maps silently to null. That is why these
 * are pinned against the real parser rather than a docs example.
 *
 * Underwriting's five Stage-1 rules, all of which must hold to be APPROVED:
 *   1. data.company.type == "LIMITED_COMPANY"
 *   2. data.company.trading_from_date is at least 12 months ago
 *   3. data.company.last_12_months_turnover.amount >= 50000
 *   4. at least one data.company.trading_addresses[].country == "GB"
 *   5. data.loan.amount >= 20000
 * A decline returns the fixed reason "Does not meet lending criteria".
 */

export type PayloadKind = "good" | "bad";

/** FO's own application key. Fresh per run — a replayed key returns the stored decision. */
export function newApplicationId(): string {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `FO-TEST-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function tradingFromDate(yearsAgo: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  return d.toISOString().slice(0, 10);
}

/** Passes all five rules → APPROVED. */
function goodPayload(applicationId: string) {
  return {
    metadata: { application_id: applicationId },
    data: {
      company: {
        company_number: "09876543",
        type: "LIMITED_COMPANY",
        trading_from_date: tradingFromDate(6),
        last_12_months_turnover: { amount: 850000, currency: "GBP" },
        vat_status: { is_vat_registered: true },
        industry_sic_code: "62012",
        number_of_employees: 24,
        trading_addresses: [
          {
            house_number: "48",
            street_line_1: "Mortimer Street",
            town: "London",
            postcode: "W1W 7RY",
            country: "GB",
          },
        ],
      },
      loan: { amount: 75000, currency: "GBP" },
      people: [
        {
          title: "Ms",
          first_name: "Priya",
          last_name: "Raman",
          date_of_birth: "1984-03-11",
          residential_addresses: [
            {
              house_name: "Elmswood",
              house_number: "12",
              street_line_1: "Rosebery Avenue",
              town: "St Albans",
              postcode: "AL1 2JT",
              country: "GB",
            },
          ],
        },
      ],
    },
  };
}

/**
 * Weak financials → DECLINED.
 *
 * Deliberately breaks rules 3 and 5 only (turnover 18,000 and loan 5,000) and leaves
 * every other rule satisfied, so the decline is unambiguously a financials decline
 * and not an accidental malformed-payload decline.
 */
function badPayload(applicationId: string) {
  const good = goodPayload(applicationId);
  return {
    ...good,
    data: {
      ...good.data,
      company: {
        ...good.data.company,
        company_number: "07654321",
        last_12_months_turnover: { amount: 18000, currency: "GBP" },
      },
      loan: { amount: 5000, currency: "GBP" },
    },
  };
}

export function buildPayload(kind: PayloadKind, applicationId: string): unknown {
  return kind === "good" ? goodPayload(applicationId) : badPayload(applicationId);
}
