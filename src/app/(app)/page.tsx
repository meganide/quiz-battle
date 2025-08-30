import { Brain, Sparkles, Trophy, Users } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/container"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <section className="flex min-h-full items-center justify-center px-2 sm:px-4">
      <Container className="py-2 sm:py-4">
        <Card className="border-primary/20 relative mx-auto max-w-5xl overflow-hidden bg-gradient-to-br from-neutral-500/50 via-neutral-600/30 to-neutral-700/50 shadow-2xl backdrop-blur-sm">
          {/* Decorative background elements */}
          <div className="bg-primary/10 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl md:-top-32 md:-right-32 md:h-64 md:w-64" />
          <div className="bg-primary/5 absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-2xl md:-bottom-16 md:-left-16 md:h-48 md:w-48" />

          <CardContent className="relative px-3 py-4 md:py-8">
            <article className="grid gap-8 sm:gap-12 md:gap-16">
              {/* Hero Section */}
              <header className="space-y-6 text-center sm:space-y-8">
                {/* Logo and Icon Cluster */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto">
                    <Logo showTitle linkClassName="mx-auto w-fit" />
                  </div>
                  {/* Icon decorations */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm sm:h-10 sm:w-10 md:h-12 md:w-12">
                      <Brain className="text-primary h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="bg-primary/30 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-2 backdrop-blur-sm sm:h-14 sm:w-14 md:h-16 md:w-16">
                      <Sparkles className="text-primary h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                    <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm sm:h-10 sm:w-10 md:h-12 md:w-12">
                      <Trophy className="text-primary h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </div>

                {/* Value Proposition */}
                <div className="space-y-3 sm:space-y-4">
                  <p className="mx-auto max-w-3xl text-base leading-relaxed text-balance text-neutral-100 sm:text-lg md:text-xl lg:text-2xl">
                    Create AI-powered quizzes on any topic and challenge friends
                    in real-time battles.
                  </p>
                  <p className="text-primary text-base font-medium sm:text-lg md:text-xl">
                    Most points win!
                  </p>
                </div>
              </header>

              {/* Feature Grid */}
              <section className="mx-auto w-full max-w-4xl">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                  <div className="rounded-lg bg-neutral-700/30 p-4 text-center backdrop-blur-sm sm:p-6">
                    <div className="bg-primary/20 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-12 sm:w-12">
                      <Brain className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="text-primary mb-2 text-sm font-semibold sm:text-base">
                      AI Generated
                    </h3>
                    <p className="text-xs text-balance text-neutral-200 sm:text-sm">
                      Instant quizzes on any topic you can imagine
                    </p>
                  </div>

                  <div className="rounded-lg bg-neutral-700/30 p-4 text-center backdrop-blur-sm sm:p-6">
                    <div className="bg-primary/20 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-12 sm:w-12">
                      <Users className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="text-primary mb-2 text-sm font-semibold sm:text-base">
                      Real-Time
                    </h3>
                    <p className="text-xs text-balance text-neutral-200 sm:text-sm">
                      Battle friends live with instant responses
                    </p>
                  </div>

                  <div className="rounded-lg bg-neutral-700/30 p-4 text-center backdrop-blur-sm sm:p-6">
                    <div className="bg-primary/20 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-12 sm:w-12">
                      <Trophy className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="text-primary mb-2 text-sm font-semibold sm:text-base">
                      Compete
                    </h3>
                    <p className="text-xs text-balance text-neutral-200 sm:text-sm">
                      Earn points and climb the leaderboards
                    </p>
                  </div>
                </div>
              </section>

              {/* Call to Action */}
              <footer className="text-center">
                <Button
                  asChild
                  className="h-10 px-6 text-base font-semibold shadow-lg sm:h-12 sm:px-8 sm:text-lg md:h-14 md:px-10 md:text-xl"
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
