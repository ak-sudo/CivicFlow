import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/civiflow-logo.png" alt="CiviFlow Logo" width={40} height={40} className="object-contain" />
              <span className="text-xl font-bold">CiviFlow</span>
            </Link>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 md:px-6 py-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to CiviFlow, a civic engagement platform operated by the Government of India. By accessing or
                using our platform, you agree to be bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
                this platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to use CiviFlow for civic reporting and engagement purposes. This license shall
                automatically terminate if you violate any of these restrictions and may be terminated by CiviFlow at
                any time. Upon terminating your viewing of these materials or upon the termination of this license, you
                must destroy any downloaded materials in your possession whether in electronic or printed format.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. User Accounts and Registration</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of CiviFlow, you may be required to register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Notify us immediately of any unauthorized access or use of your account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Use your real identity and not impersonate others</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Report Submission Guidelines</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  When submitting reports through CiviFlow, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Submit accurate and truthful information about civic issues</li>
                  <li>Not submit false, misleading, or malicious reports</li>
                  <li>Include relevant photos, location data, and descriptions</li>
                  <li>Respect the privacy of others in submitted content</li>
                  <li>Not use the platform for spam, harassment, or illegal activities</li>
                  <li>Accept that reports may be publicly visible to promote transparency</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Content and Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                By submitting content to CiviFlow, you grant the Government of India a non-exclusive, worldwide,
                royalty-free license to use, reproduce, modify, and distribute your content for the purpose of civic
                improvement and public service. You retain ownership of your content but acknowledge that it may be used
                for administrative, analytical, and public transparency purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of CiviFlow is also governed by our Privacy Policy. We are committed to protecting your
                personal information in accordance with the Information Technology Act, 2000, and the Digital Personal
                Data Protection Act, 2023. Please review our Privacy Policy to understand our practices regarding your
                personal data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Prohibited Activities</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">You are prohibited from using CiviFlow to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Submit false or fraudulent reports</li>
                  <li>Harass, threaten, or defame others</li>
                  <li>Violate any local, state, national, or international laws</li>
                  <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
                  <li>Introduce viruses, malware, or other harmful code</li>
                  <li>Engage in any automated use of the system without express permission</li>
                  <li>Collect user information without consent</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Government Authority and Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                CiviFlow is operated by government authorities who reserve the right to investigate complaints, remove
                content, suspend accounts, or take legal action for violations of these terms. Users agree to cooperate
                with official investigations and acknowledge that law enforcement may access their data when legally
                required.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Service Availability and Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                CiviFlow reserves the right to modify, suspend, or discontinue any aspect of the platform at any time
                without notice. We do not guarantee that the platform will be available at all times or that it will be
                free from errors, viruses, or other harmful components. We may also modify these Terms of Service at any
                time, and your continued use constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, CiviFlow and the Government of India shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages resulting from your use or inability
                to use the platform. This includes but is not limited to damages for loss of profits, data, or other
                intangible losses.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless CiviFlow, the Government of India, and their officers, agents,
                and employees from any claim, demand, loss, or damage, including reasonable attorneys' fees, arising out
                of your use of the platform, your violation of these terms, or your violation of any rights of another
                person or entity.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Dispute Resolution and Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any
                disputes arising from these terms or your use of CiviFlow shall be subject to the exclusive jurisdiction
                of the courts in New Delhi, India. Users agree to attempt to resolve disputes through good faith
                negotiation before pursuing legal action.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">13. Worker and Administrator Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">
                Government workers and administrators using CiviFlow agree to maintain professional conduct, protect
                citizen privacy, respond to reports in a timely manner, and use the platform solely for official civic
                duties. Misuse of administrative privileges may result in disciplinary action and legal consequences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">14. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your account and access to CiviFlow immediately, without
                prior notice or liability, for any reason, including but not limited to a breach of these Terms of
                Service. Upon termination, your right to use the platform will immediately cease.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">15. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg space-y-2">
                <p className="font-medium">CiviFlow Support</p>
                <p className="text-muted-foreground">Email: helpdesk@civicflow.gov.in</p>
                <p className="text-muted-foreground">Phone: +91-11-12345684</p>
                <p className="text-muted-foreground">Address: Government of India, New Delhi - 110001</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">16. Acknowledgment</h2>
              <p className="text-muted-foreground leading-relaxed">
                By using CiviFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms
                of Service. You also acknowledge that these terms constitute the entire agreement between you and
                CiviFlow regarding your use of the platform.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-border">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} CiviFlow. All rights reserved. |{" "}
            <Link href="/privacy" className="hover:text-foreground underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
