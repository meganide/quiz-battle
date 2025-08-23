import { Swords } from "lucide-react"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Button } from "@/components/ui/button"

export default function QuizBattlesPage() {
  return (
    <Container className="flex flex-col gap-4">
      <HeaderTitle Icon={Swords} title="Quiz Battles" />
      <section className="flex items-center justify-end">
        <aside>
          <article>
            <span>Live Games</span>
          </article>
        </aside>
        <Button>Create Quiz Battle</Button>
      </section>
    </Container>
  )
}
