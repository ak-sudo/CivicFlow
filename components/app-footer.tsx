import Link from "next/link"
import Image from "next/image"

export function AppFooter() {
  return (
    <footer className="border-t mt-3 border-border bg-muted/30 mt-auto">
      <div className="container px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={32} height={32} className="object-contain" />
            <span className="text-sm font-semibold">CivicFlow</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>helpdesk@civicflow.gov.in</span>
          </div>

          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CivicFlow</p>
        </div>
      </div>
    </footer>
  )
}
