import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { SignInWithGoogleButton } from "./sign-in-with-google-button"

type SignInDialogProps = {
  children: React.ReactNode
}

export function SignInDialog({ children }: SignInDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Continue with your Google account
          </DialogDescription>
        </DialogHeader>
        <SignInWithGoogleButton />
      </DialogContent>
    </Dialog>
  )
}
