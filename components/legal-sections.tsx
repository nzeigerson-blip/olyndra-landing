export function LegalSections() {
  return (
    <>
      {/* Privacy Policy Section */}
      <section id="privacy-policy" className="border-t border-border bg-muted/20 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Privacy Policy
          </h2>
          <div className="prose prose-sm text-muted-foreground space-y-4">
            <p className="text-sm leading-relaxed">
              [Your privacy policy content will go here. This section is a placeholder for your generated legal text.]
            </p>
            <p className="text-sm leading-relaxed">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section id="terms-of-service" className="border-t border-border bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Terms of Service
          </h2>
          <div className="prose prose-sm text-muted-foreground space-y-4">
            <p className="text-sm leading-relaxed">
              [Your terms of service content will go here. This section is a placeholder for your generated legal text.]
            </p>
            <p className="text-sm leading-relaxed">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
