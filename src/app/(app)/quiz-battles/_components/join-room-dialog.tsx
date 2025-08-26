"use client"

import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useJoinRoom } from "../_hooks/use-join-room"

export function JoinRoomDialog() {
  const { isJoinRoomDialogOpen, setIsJoinRoomDialogOpen, form, joinRoom } =
    useJoinRoom()

  return (
    <Dialog open={isJoinRoomDialogOpen} onOpenChange={setIsJoinRoomDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="secondary">
          <Users className="h-4 w-4" />
          Join Quiz Battle
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-8 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Join Quiz Battle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(joinRoom)}
          >
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter invite code..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className="self-end" type="submit">
              Join Room
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
