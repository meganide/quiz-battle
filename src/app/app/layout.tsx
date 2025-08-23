import { AppNavbar } from "./_components/app-navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-full flex flex-col">
        <AppNavbar />
        {children}
    </section>
  )
}
