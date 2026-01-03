import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Script from "next/script";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Camera,
  BrainCircuit,
  UserCheck,
  Wrench,
  Gift,
  Shield,
  MapPin,
  Construction,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Bone,
  WashingMachine,
  HardHat,
  User,
  Users,
  HardHatIcon,
  ArrowRight,
  Clock,
  Award,
  BarChart3,
  Home,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background" />
        <div className="container relative px-4 md:px-6 py-24 md:py-32 lg:py-40 mx-auto">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium"
            >
              AI-Powered Civic Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
              See it. Report it.{" "}
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                Resolve it.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed max-w-3xl mx-auto">
              Empowering citizens to build cleaner, safer, and smarter cities
              through AI-driven civic reporting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base"
                asChild
              >
                <Link href="/citizen/dashboard">
                  Start Reporting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base bg-transparent"
                asChild
              >
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 mt-16 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 text-foreground">
                Explore All Interfaces
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/citizen/dashboard"
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    <User className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Citizen View</span>
                </Link>
                <Link
                  href="/civicbook"
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    <Home className="h-6 w-6" />
                  </div>
                  <span className="font-medium">CivicBook</span>
                </Link>
                <Link
                  href="/worker/dashboard"
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    <HardHatIcon className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Worker View</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Admin View</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12 text-right shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-justify">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground mt-2">
                Issues Resolved
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">5K+</div>
              <div className="text-sm text-muted-foreground mt-2">
                Active Citizens
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground mt-2">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">24hrs</div>
              <div className="text-sm text-muted-foreground mt-2">
                Avg. Response Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              How CivicFlow Works
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              From report to resolution in five simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Camera,
                title: "1. Capture",
                desc: "Take a photo of the civic issue you encounter",
              },
              {
                icon: BrainCircuit,
                title: "2. AI Analyzes",
                desc: "Our AI classifies and assesses severity automatically",
              },
              {
                icon: UserCheck,
                title: "3. Admin Routes",
                desc: "Issue is assigned to the right department and worker",
              },
              {
                icon: Wrench,
                title: "4. Worker Resolves",
                desc: "Worker completes the task with proof of work",
              },
              {
                icon: Gift,
                title: "5. Earn Incentives",
                desc: "You earn reward points and redeemable coupons",
              },
            ].map((step, i) => (
              <Card
                key={i}
                className="relative border-2 hover:border-accent hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground mb-4">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Report Section */}
      <section id="features" className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              What You Can Report
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              From potholes to streetlights, we cover all civic issues
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Construction,
                title: "Potholes",
                desc: "Damaged roads and pathways affecting traffic",
              },
              {
                icon: Trash2,
                title: "Waste Overflow",
                desc: "Overflowing garbage bins and waste management issues",
              },
              {
                icon: Lightbulb,
                title: "Streetlights",
                desc: "Non-functional or damaged streetlights",
              },
              {
                icon: AlertTriangle,
                title: "Traffic Signals",
                desc: "Faulty traffic signals and road safety issues",
              },
              {
                icon: Bone,
                title: "Animal Carcasses",
                desc: "Deceased animals on roads requiring removal",
              },
              {
                icon: WashingMachine,
                title: "Public Toilets",
                desc: "Unclean or damaged public sanitation facilities",
              },
              {
                icon: HardHat,
                title: "Damaged Pathways",
                desc: "Broken sidewalks and pedestrian walkways",
              },
              {
                icon: MapPin,
                title: "Other Issues",
                desc: "Any other civic concerns in your area",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="hover:border-accent hover:shadow-md transition-all group"
              >
                <CardHeader>
                  <item.icon className="h-10 w-10 text-accent mb-3 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Why Choose CivicFlow
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              The benefits of using our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Faster Resolutions",
                desc: "AI-powered routing ensures issues reach the right department instantly",
              },
              {
                icon: BarChart3,
                title: "Transparent Tracking",
                desc: "Track your report status in real-time from submission to resolution",
              },
              {
                icon: Award,
                title: "Earn Rewards",
                desc: "Get points for reporting issues and redeem government benefits",
              },
              {
                icon: Shield,
                title: "Safer Neighborhoods",
                desc: "Help make your community cleaner, safer, and more livable",
              },
            ].map((benefit, i) => (
              <Card
                key={i}
                className="border-2 hover:border-accent hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-3">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="border-0 shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-accent to-accent/80 p-12 md:p-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground text-balance">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg md:text-xl text-accent-foreground/90 max-w-2xl mx-auto text-balance leading-relaxed">
                Join thousands of citizens already making their communities
                better. Report your first issue today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto h-12 px-8 text-base bg-background text-foreground hover:bg-background/90"
                  asChild
                >
                  <Link href="/citizen/dashboard">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <LandingFooter />

    </div>
  );
}
