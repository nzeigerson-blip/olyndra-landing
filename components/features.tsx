import { Shield, Zap, Brain } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "Bank-level encryption, multi-factor authentication, and real-time fraud detection keep your funds and data protected around the clock.",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Transfers",
    description:
      "Move money across borders in seconds, not days. Our global network ensures your payments arrive instantly, wherever you do business.",
  },
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Smart insights, automated compliance, and predictive analytics help you make better financial decisions and stay ahead of the market.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Built for the Future of Finance
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Everything you need to manage your global business finances, designed with simplicity and power in mind.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl bg-card border border-border p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
