"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import {
  BarChart3,
  Brain,
  Gamepad2,
  Globe,
  Hash,
  Lock,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters"),
  isPrivate: z.boolean().default(false),
  topic: z.string().min(1, "Please select a topic"),
  numQuestions: z
    .number()
    .min(5, "Minimum 5 questions")
    .max(50, "Maximum 50 questions"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  maxPlayers: z
    .number()
    .min(2, "Minimum 2 players")
    .max(20, "Maximum 20 players"),
});

type FormValues = z.infer<typeof formSchema>;

const topics = [
  "General Knowledge",
  "Science & Technology",
  "History",
  "Geography",
  "Sports",
  "Entertainment",
  "Literature",
  "Art & Culture",
  "Mathematics",
  "Politics",
  "Nature",
  "Food & Cooking",
];

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

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
      difficulty: "medium",
      maxPlayers: 6,
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
        <Button size="lg" className="gap-2">
          <Gamepad2 className="h-5 w-5" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Gamepad2 className="h-6 w-6" />
            Create Quiz Room
          </DialogTitle>
          <DialogDescription>
            Set up your quiz room and invite friends to compete!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <section className="space-y-4">
              <header>
                <h3 className="text-lg font-semibold">Room Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your quiz room details
                </p>
              </header>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Room Name
                      </FormLabel>
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
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            {field.value ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Globe className="h-4 w-4" />
                            )}
                            {field.value ? "Private Room" : "Public Room"}
                          </FormLabel>
                          <FormDescription>
                            {field.value
                              ? "Only people with the invite code can join"
                              : "Anyone can discover and join this room"}
                          </FormDescription>
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
              </div>
            </section>

            <section className="space-y-4">
              <header>
                <h3 className="text-lg font-semibold">Quiz Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your quiz experience
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Topic
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Difficulty
                      </FormLabel>
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
                          <SelectItem value="easy">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={cn("text-xs", difficultyColors.easy)}
                              >
                                Easy
                              </Badge>
                              <span>Perfect for beginners</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  difficultyColors.medium,
                                )}
                              >
                                Medium
                              </Badge>
                              <span>Balanced challenge</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="hard">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={cn("text-xs", difficultyColors.hard)}
                              >
                                Hard
                              </Badge>
                              <span>Expert level</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4">
              <header>
                <h3 className="text-lg font-semibold">Game Parameters</h3>
                <p className="text-sm text-muted-foreground">
                  Fine-tune your quiz settings
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Number of Questions
                        </span>
                        <Badge variant="outline">{field.value}</Badge>
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
                      <FormDescription>
                        Choose between 5-50 questions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Max Players
                        </span>
                        <Badge variant="outline">{field.value}</Badge>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={2}
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        Room capacity (2-20 players)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <footer className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Gamepad2 className="h-4 w-4" />
                    Create Room
                  </>
                )}
              </Button>
            </footer>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
