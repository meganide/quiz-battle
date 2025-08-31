import { Container } from "@/components/container";

export  function StartingLoader() {
  return (
    <Container className="flex h-full items-center justify-center py-6">
    <section className="text-center space-y-8 max-w-md mx-auto">
      {/* AI Brain Animation */}
      <article className="relative mx-auto w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full animate-pulse shadow-lg shadow-primary-500/30" />
        <div className="absolute inset-2 bg-gradient-to-tr from-primary-300 to-primary-500 rounded-full animate-ping opacity-75" />
        <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
          <div className="w-8 h-8 text-primary-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
      </article>

      {/* Main Heading */}
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
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
            className="w-3 h-3 bg-primary-400 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </article>

      {/* Status Messages */}
      <article className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Analyzing difficulty levels</span>
        </div>
        <div className="flex items-center justify-center space-x-2 opacity-75">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span>Generating creative questions</span>
        </div>
        <div className="flex items-center justify-center space-x-2 opacity-50">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <span>Preparing battle experience</span>
        </div>
      </article>
    </section>
  </Container>
  )
}
