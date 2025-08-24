"use client"

import { Plus } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

import { useCreateRoom } from "../_hooks/use-create-room"

export function CreateRoomDialog() {
  const {
    isCreateRoomDialogOpen,
    setIsCreateRoomDialogOpen,
    isCreating,
    form,
    createRoom,
  } = useCreateRoom()

  return (
    <Dialog
      open={isCreateRoomDialogOpen}
      onOpenChange={setIsCreateRoomDialogOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Quiz Battle
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-8 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Quiz Battle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(createRoom)}
          >
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz topic..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Questions
                      <span className="text-muted-foreground text-sm">
                        {field.value}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        className="w-full"
                        max={50}
                        min={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timePerQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Time Per Question
                      <span className="text-muted-foreground text-sm">
                        {field.value}s
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        className="w-full"
                        max={60}
                        min={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between space-y-0">
                      <div className="flex flex-col gap-1">
                        <FormLabel htmlFor="isPrivate">Visibility</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          {field.value ? "Invite-only access" : "Public access"}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          id="isPrivate"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button className="self-end" disabled={isCreating} type="submit">
              {isCreating ? "Creating..." : "Create Room"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
