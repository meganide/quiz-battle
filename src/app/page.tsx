import Link from "next/link"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <Container>
      <h1>Quiz Battle</h1>
      <Link href="/signin">
        <Button>Sign In</Button>
      </Link>
    </Container>
  )
}
