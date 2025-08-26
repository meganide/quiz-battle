import { Users } from "lucide-react"
import Link from "next/link"

import { HeaderTitle } from "@/components/header-title"
import { SignInWithGoogleButton } from "@/components/sign-in-with-google-button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function RequireAuthAlertDialog() {
  return (
    <section>
      <HeaderTitle href="/quiz-battles" Icon={Users} title="Quiz Battle Room" />
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You don&apos;t have access to this room
            </AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to join a room. Please sign in to
              continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/quiz-battles">
              <Button variant="outline">Go to quiz battles</Button>
            </Link>
            <SignInWithGoogleButton />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
