import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
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
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <Card className="p-6 bg-primary/5 border-primary/20">
              <p className="text-sm leading-relaxed">
                CiviFlow is committed to protecting your privacy and personal data. This Privacy Policy explains how we
                collect, use, store, and protect your information in compliance with the Information Technology Act,
                2000, the Digital Personal Data Protection Act, 2023, and other applicable data protection laws of
                India.
              </p>
            </Card>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.1 Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    When you register and use CiviFlow, we may collect the following personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Full name and contact details (email address, phone number)</li>
                    <li>Government-issued identification numbers (Aadhaar, if required for verification)</li>
                    <li>Address and location information</li>
                    <li>Profile photograph (optional)</li>
                    <li>Employment information (for government workers and administrators)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.2 Report and Usage Data</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    When you submit reports or interact with the platform, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Report descriptions, categories, and severity levels</li>
                    <li>Photos and media files attached to reports</li>
                    <li>Location data (GPS coordinates) of reported issues</li>
                    <li>Timestamps of report submissions and updates</li>
                    <li>Comments and interactions on reports</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.3 Technical Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We automatically collect certain technical information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Device information (type, operating system, browser)</li>
                    <li>IP address and general location</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Usage patterns and analytics data</li>
                    <li>Error logs and diagnostic information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>To provide and maintain the CiviFlow platform and its services</li>
                  <li>To process and respond to civic reports and complaints</li>
                  <li>To verify user identity and prevent fraud or misuse</li>
                  <li>To communicate with you about report status and platform updates</li>
                  <li>To analyze trends and improve civic services</li>
                  <li>To generate anonymized statistics for public transparency</li>
                  <li>To comply with legal obligations and government requirements</li>
                  <li>To allocate resources and prioritize civic maintenance work</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">3. Information Sharing and Disclosure</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 Public Visibility</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To promote transparency and accountability, certain information is publicly visible on CiviFlow:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                    <li>Report descriptions, photos, and locations</li>
                    <li>Report status and resolution updates</li>
                    <li>Your public username (not your full personal details)</li>
                    <li>Timestamps of report submissions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Government Agencies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We share your information with relevant government departments and civic authorities responsible for
                    addressing reported issues. This includes municipal corporations, police departments, health
                    departments, and other public service agencies.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.3 Legal Requirements</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may disclose your information when required by law, court order, or government regulation, or
                    when necessary to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                    <li>Comply with legal processes and law enforcement requests</li>
                    <li>Protect the rights, property, or safety of CiviFlow, users, or the public</li>
                    <li>Investigate potential violations of our Terms of Service</li>
                    <li>Prevent fraud, security threats, or illegal activities</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">4. Data Security</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Encryption of data in transit and at rest using SSL/TLS protocols</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Restricted access to personal data on a need-to-know basis</li>
                  <li>Employee training on data protection and privacy</li>
                  <li>Secure backup and disaster recovery procedures</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we
                  strive to use commercially acceptable means to protect your personal information, we cannot guarantee
                  its absolute security.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">5. Your Rights and Choices</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Under Indian data protection laws, you have the following rights:
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Access and Correction</h4>
                    <p className="text-sm text-muted-foreground">
                      You can access and update your personal information through your account settings at any time.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Data Portability</h4>
                    <p className="text-sm text-muted-foreground">
                      You can request a copy of your personal data in a structured, machine-readable format.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Deletion</h4>
                    <p className="text-sm text-muted-foreground">
                      You can request deletion of your account and personal data, subject to legal retention
                      requirements.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Opt-Out</h4>
                    <p className="text-sm text-muted-foreground">
                      You can opt out of non-essential communications and marketing emails.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Complaint</h4>
                    <p className="text-sm text-muted-foreground">
                      You can lodge a complaint with the Data Protection Authority if you believe your privacy rights
                      have been violated.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                CiviFlow uses cookies and similar tracking technologies to enhance user experience, analyze platform
                usage, and improve our services. Cookies are small text files stored on your device. You can control
                cookie preferences through your browser settings, but disabling cookies may affect platform
                functionality.
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">We use the following types of cookies:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Essential cookies for platform functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Security cookies to protect your account</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                Privacy Policy, unless a longer retention period is required or permitted by law. Report data is
                retained indefinitely for historical records, transparency, and civic planning purposes. Personal
                account data is retained for the duration of your account's active status and may be retained for up to
                7 years after account closure for legal and audit purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                CiviFlow is intended for users aged 18 and above. We do not knowingly collect personal information from
                children under 18. If we become aware that we have collected personal data from a child under 18 without
                parental consent, we will take steps to delete that information promptly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                CiviFlow may contain links to third-party websites or integrate with third-party services (such as
                mapping services). We are not responsible for the privacy practices of these third parties. We encourage
                you to read their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your personal information is primarily stored and processed within India. If data is transferred outside
                India for any reason, we ensure that appropriate safeguards are in place to protect your information in
                accordance with Indian data protection laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
                legal requirements, or other factors. We will notify you of any material changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date. Your continued use of CiviFlow after
                changes are posted constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data,
                please contact us:
              </p>
              <Card className="p-6 bg-muted/50">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Data Protection Officer</p>
                    <p className="text-sm text-muted-foreground">CiviFlow Privacy Team</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Email:</span> privacy@civicflow.gov.in
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Support:</span> helpdesk@civicflow.gov.in
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Phone:</span> +91-11-12345684
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Address:</span> Government of India, New Delhi - 110001
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">13. Consent</h2>
              <p className="text-muted-foreground leading-relaxed">
                By using CiviFlow, you consent to the collection, use, and disclosure of your personal information as
                described in this Privacy Policy. If you do not agree with this policy, please do not use the platform.
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
            <Link href="/terms" className="hover:text-foreground underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
