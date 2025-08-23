import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section>
      <h1>Quiz Battle</h1>
      <Link href="/signin">
        <Button>Sign In</Button>
      </Link>
    </section>
  );
}
