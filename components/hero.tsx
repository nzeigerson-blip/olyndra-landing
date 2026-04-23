export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Now accepting early access signups
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            The Fintech for International Entrepreneurs Leading{" "}
            <span className="text-primary">Global Agentic Commerce</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
            We&apos;re building the financial infrastructure that empowers entrepreneurs worldwide to move money seamlessly, 
            make smarter decisions with AI-powered insights, and scale their businesses without borders.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#early-access"
              className="w-full sm:w-auto rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Request Early Access
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto rounded-xl bg-card border border-border px-8 py-4 text-base font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { value: "150+", label: "Countries Supported" },
            { value: "50ms", label: "Avg. Transaction Speed" },
            { value: "99.99%", label: "Uptime Guaranteed" },
            { value: "$0", label: "Hidden Fees" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-card border border-border p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
