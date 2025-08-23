"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { api } from "../../../../convex/_generated/api";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters"),
  isPrivate: z.boolean(),
  topic: z.string().min(1, "Please enter a topic"),
  numQuestions: z
    .number()
    .min(5, "Minimum 5 questions")
    .max(50, "Maximum 50 questions"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timePerQuestion: z
    .number()
    .min(10, "Minimum 10 seconds")
    .max(60, "Maximum 60 seconds"),
});

type FormValues = z.infer<typeof formSchema>;





export function CreateRoom() {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const createRoom = useMutation(api.rooms.mutations.create);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isPrivate: false,
      topic: "",
      numQuestions: 10,
      difficulty: "medium" as const,
      timePerQuestion: 30,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsCreating(true);
      const result = await createRoom(values);

      // Close dialog and redirect to room
      setOpen(false);
      form.reset();

      // Show success message with invite code if private
      if (values.isPrivate && result.inviteCode) {
        // You could show a toast here with the invite code
        console.log("Invite code:", result.inviteCode);
      }

      // Navigate to the room
      router.push(`/app/room/${result.roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      // You could show an error toast here
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-3">
          <DialogTitle>Create Quiz Room</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
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
                name="isPrivate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between space-y-0">
                      <div>
                        <FormLabel>Private Room</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          {field.value ? "Invite-only access" : "Public access"}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Questions
                        <span className="text-sm text-muted-foreground">
                          {field.value}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={5}
                          max={50}
                          step={5}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
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
                        <span className="text-sm text-muted-foreground">
                          {field.value}s
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={10}
                          max={60}
                          step={5}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} className="flex-1">
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
