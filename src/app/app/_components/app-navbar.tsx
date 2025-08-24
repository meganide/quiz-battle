import { NavUser } from "./nav-user"

export function AppNavbar() {
  return (
    <div className="sticky top-0 z-50 w-full bg-neutral-700 px-4">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <section className="flex items-center gap-4">
          <span className="mr-12">Quiz Battle</span>
        </section>
        <NavUser />
      </nav>
    </div>
  )
}
