import { Container } from "@/components/container"

export function StartingLoader() {
  return (
    <Container className="flex h-full items-center justify-center py-6">
      <section className="mx-auto max-w-md space-y-8 text-center">
        {/* AI Brain Animation */}
        <article className="relative mx-auto mb-8 h-24 w-24">
          <div className="from-primary-400 to-primary-600 shadow-primary-500/30 absolute inset-0 animate-pulse rounded-full bg-gradient-to-br shadow-lg" />
          <div className="from-primary-300 to-primary-500 absolute inset-2 animate-ping rounded-full bg-gradient-to-tr opacity-75" />
          <div className="bg-background absolute inset-4 flex items-center justify-center rounded-full">
            <div className="text-primary-400 h-8 w-8">
              <svg
                className="animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </article>

        {/* Main Heading */}
        <header className="space-y-3">
          <h1 className="from-primary-300 to-primary-500 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
            AI Quiz Master at Work
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our AI is crafting mind-bending questions just for you...
          </p>
        </header>

        {/* Loading Dots */}
        <article className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-primary-400 h-3 w-3 animate-bounce rounded-full"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </article>

        {/* Status Messages */}
        <article className="text-muted-foreground space-y-2 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span>Analyzing difficulty levels</span>
          </div>
          <div className="flex items-center justify-center space-x-2 opacity-75">
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-yellow-400"
              style={{ animationDelay: "0.5s" }}
            />
            <span>Generating creative questions</span>
          </div>
          <div className="flex items-center justify-center space-x-2 opacity-50">
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-blue-400"
              style={{ animationDelay: "1s" }}
            />
            <span>Preparing battle experience</span>
          </div>
        </article>
      </section>
    </Container>
  )
}
