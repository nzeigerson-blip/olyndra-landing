"use client"

import { useState } from "react"

export function EarlyAccess() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission - replace with actual Formspree endpoint
    // The form is also set up with action/method for static site compatibility
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <section id="early-access" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xl md:p-12">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Limited Spots Available
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Be First in Line
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join our early access program and help shape the future of global finance. 
                Get exclusive benefits and priority access when we launch.
              </p>
            </div>

            {isSubmitted ? (
              <div className="mt-8 rounded-2xl bg-primary/10 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground">You&apos;re on the list!</h3>
                <p className="mt-2 text-muted-foreground">
                  We&apos;ll be in touch soon with exclusive updates and early access details.
                </p>
              </div>
            ) : (
              <form

                -------
  

>
  {/* Add this hidden input with your actual key */}

  
            -------
                action="https://api.web3forms.com/submit"
                method="POST"
                onSubmit={handleSubmit}
                className="mt-8"
              <input type="hidden" name="access_key" value="aaea8fcf-7152-4f73-96ca-d2a8f539fcca" />
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 rounded-xl border border-input bg-background px-5 py-4 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:shadow-primary/30"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      "Request Access"
                    )}
                  </button>
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  No spam, ever. We respect your privacy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
