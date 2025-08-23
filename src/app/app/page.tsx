import { Swords } from "lucide-react";
import { Container } from "@/components/container";
import { HeaderTitle } from "@/components/header-title";
import { Button } from "@/components/ui/button";

export default function QuizBattlesPage() {
  return (
    <Container>
      <HeaderTitle title="Quiz Battles" Icon={Swords} />
      <section className="flex justify-end items-center">
        <Button>Create Quiz Battle</Button>
      </section>
    </Container>
  );
}
