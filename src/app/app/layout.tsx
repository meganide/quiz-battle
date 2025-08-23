import { AppNavbar } from "./_components/app-navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full flex-col">
      <AppNavbar />
      {children}
    </section>
  )
}
