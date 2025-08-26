import { Swords } from "lucide-react"

import type { Metadata } from "next"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"

import { QuizBattlesHeader } from "./_components/quiz-battles-header"
import { QuizRoomsList } from "./_components/quiz-rooms-list"

export const metadata: Metadata = {
  title: "Quiz Battles",
  description: "Quiz Battles",
}

export default function QuizBattlesPage() {
  return (
    <section>
      <HeaderTitle Icon={Swords} title="Quiz Battles" />
      <Container className="flex flex-col gap-4">
        <QuizBattlesHeader />
        <QuizRoomsList />
      </Container>
    </section>
  )
}
