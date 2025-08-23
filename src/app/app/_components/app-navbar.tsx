import { Swords } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";

export function AppNavbar() {
  return (
    <nav className="container mx-auto h-16 flex items-center gap-4 justify-between sticky top-0">
      <section className="flex items-center gap-4">
        <span className="mr-12">Quiz Battle</span>
        <Link href="/app">
          <Button variant="link">
            <Swords /> Battles
          </Button>
        </Link>
      </section>
      <NavUser />
    </nav>
  );
}
