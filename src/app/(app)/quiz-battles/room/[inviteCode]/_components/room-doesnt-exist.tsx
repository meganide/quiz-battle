import { AlertTriangle, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function RoomDoesntExist() {
  return (
    <section>
      <HeaderTitle href="/quiz-battles" Icon={Users} title="Quiz Battle Room" />
      <Container className="flex flex-col gap-4">
        <Card className="text-center">
          <CardHeader className="flex flex-col items-center">
            <AlertTriangle className="text-muted-foreground h-8 w-8" />
            <section className="space-y-2">
              <CardTitle className="text-xl">Room Not Found</CardTitle>
              <CardDescription className="max-w-sm">
                The quiz room you&apos;re looking for doesn&apos;t exist or may
                have been removed.
              </CardDescription>
            </section>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/quiz-battles">
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz Battles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}
