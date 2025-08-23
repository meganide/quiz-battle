"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { Clock, Settings, Trophy, Users } from "lucide-react";
import { CreateRoom } from "@/app/app/_components/create-room";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";

export default function AppPage() {
  const { signOut } = useAuthActions();
  const myRooms = useQuery(api.rooms.queries.getMyRooms);
  const publicRooms = useQuery(api.rooms.queries.getPublicRooms);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Quiz Battle</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              Sign out
            </Button>
          </nav>
        </section>
      </header>

      <section className="container py-8">
        <div className="grid gap-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">Welcome back!</h2>
                <p className="text-muted-foreground">
                  Ready to challenge your friends to a quiz battle?
                </p>
              </div>
              <CreateRoom />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Rooms
              </h3>
              <div className="space-y-3">
                {myRooms === undefined ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Card
                        key={`my-rooms-skeleton-${i}`}
                        className="animate-pulse"
                      >
                        <CardHeader className="pb-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <div className="h-6 bg-muted rounded w-16"></div>
                            <div className="h-6 bg-muted rounded w-20"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : myRooms.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        You haven't created any rooms yet.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click "Create Room" to get started!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  myRooms.map((room) => (
                    <Card
                      key={room._id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <Badge
                            variant={
                              room.status === "waiting"
                                ? "default"
                                : room.status === "active"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {room.status}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {room.currentPlayers}/{room.maxPlayers}
                          </span>
                          <span>{room.topic}</span>
                          <Badge variant="outline" className="text-xs">
                            {room.difficulty}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Public Rooms
              </h3>
              <div className="space-y-3">
                {publicRooms === undefined ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Card
                        key={`public-rooms-skeleton-${i}`}
                        className="animate-pulse"
                      >
                        <CardHeader className="pb-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <div className="h-6 bg-muted rounded w-16"></div>
                            <div className="h-6 bg-muted rounded w-20"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : publicRooms.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No public rooms available.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Be the first to create one!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  publicRooms.map((room) => (
                    <Card
                      key={room._id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <Button size="sm" variant="outline">
                            Join
                          </Button>
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {room.currentPlayers}/{room.maxPlayers}
                          </span>
                          <span>{room.topic}</span>
                          <Badge variant="outline" className="text-xs">
                            {room.difficulty}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
