import { Brain, Sparkles, Trophy, Users } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/container"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <section className="flex min-h-full items-center justify-center px-4">
      <Container className="py-4">
        <Card className="border-primary/20 relative mx-auto max-w-5xl overflow-hidden bg-gradient-to-br from-neutral-500/50 via-neutral-600/30 to-neutral-700/50 shadow-2xl backdrop-blur-sm">
          {/* Decorative background elements */}
          <div className="bg-primary/10 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl md:-top-32 md:-right-32 md:h-64 md:w-64" />
          <div className="bg-primary/5 absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-2xl md:-bottom-16 md:-left-16 md:h-48 md:w-48" />

          <CardContent className="relative px-6 py-12 md:px-16 md:py-20">
            <article className="grid gap-12 md:gap-16">
              {/* Hero Section */}
              <header className="space-y-8 text-center">
                {/* Logo and Icon Cluster */}
                <div className="space-y-6">
                  <div className="mx-auto">
                    <Logo showTitle linkClassName="mx-auto w-fit" />
                  </div>
                  {/* Icon decorations */}
                  <div className="flex items-center justify-center gap-3 md:gap-4">
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm md:h-12 md:w-12">
                      <Brain className="text-primary h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="bg-primary/30 ring-primary/20 flex h-14 w-14 items-center justify-center rounded-full ring-2 backdrop-blur-sm md:h-16 md:w-16">
                      <Sparkles className="text-primary h-7 w-7 md:h-8 md:w-8" />
                    </div>
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm md:h-12 md:w-12">
                      <Trophy className="text-primary h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </div>

                {/* Value Proposition */}
                <div className="space-y-4">
                  <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-100 md:text-xl lg:text-2xl">
                    Create AI-powered quizzes on any topic and challenge friends
                    in real-time battles.
                  </p>
                  <p className="text-primary text-lg font-medium md:text-xl">
                    Most points win!
                  </p>
                </div>
              </header>

              {/* Feature Grid */}
              <section className="mx-auto w-full max-w-4xl">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
                  <div className="rounded-lg bg-neutral-700/30 p-6 text-center backdrop-blur-sm">
                    <div className="bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                      <Brain className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-primary mb-2 text-base font-semibold">
                      AI Generated
                    </h3>
                    <p className="text-sm text-neutral-200">
                      Instant quizzes on any topic you can imagine
                    </p>
                  </div>

                  <div className="rounded-lg bg-neutral-700/30 p-6 text-center backdrop-blur-sm">
                    <div className="bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                      <Users className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-primary mb-2 text-base font-semibold">
                      Real-Time
                    </h3>
                    <p className="text-sm text-neutral-200">
                      Battle friends live with instant responses
                    </p>
                  </div>

                  <div className="rounded-lg bg-neutral-700/30 p-6 text-center backdrop-blur-sm">
                    <div className="bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                      <Trophy className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-primary mb-2 text-base font-semibold">
                      Compete
                    </h3>
                    <p className="text-sm text-neutral-200">
                      Earn points and climb the leaderboards
                    </p>
                  </div>
                </div>
              </section>

              {/* Call to Action */}
              <footer className="text-center">
                <Button
                  asChild
                  className="h-12 px-8 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:h-14 md:px-10 md:text-xl"
                  size="lg"
                >
                  <Link href="/quiz-battles">Start Your First Battle</Link>
                </Button>
              </footer>
            </article>
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}
