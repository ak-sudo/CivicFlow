import Link from "next/link"
import Image from "next/image"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={36} height={36} className="object-contain" />
              <span className="text-lg font-bold">CivicFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">Building cleaner, safer, and smarter cities together.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="#departments" className="hover:text-foreground transition-colors">
                  Departments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>helpdesk@civicflow.gov.in</li>
              <li>+91-11-12345684</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CivicFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
