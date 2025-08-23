"use client";

import { useQuery } from "convex/react";
import { Users2 } from "lucide-react";
import { CreateRoom } from "@/app/app/_components/create-room";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

function RoomCard({
  room,
  showJoinButton = false,
}: {
  room: Doc<"rooms">;
  showJoinButton?: boolean;
}) {
  return (
    <Card className="group hover:shadow-sm transition-all duration-200 border-border/50">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base font-medium leading-none">
              {room.name}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users2 className="h-3.5 w-3.5" />
                {room.playerIds.length} players
              </span>
              <span>{room.topic}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {room.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={room.status === "lobby" ? "default" : "secondary"}
              className="capitalize text-xs"
            >
              {room.status}
            </Badge>
            {showJoinButton && (
              <Button
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Join
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function EmptyState({ type }: { type: "myRooms" | "publicRooms" }) {
  const content =
    type === "myRooms"
      ? {
          title: "No rooms created yet",
          description: "Create your first quiz room to get started",
        }
      : {
          title: "No public rooms available",
          description: "Be the first to create a public room",
        };

  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {content.title}
          </p>
          <p className="text-xs text-muted-foreground">{content.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  const skeletons = ["skeleton-1", "skeleton-2"];

  return (
    <div className="space-y-4">
      {skeletons.map((id) => (
        <Card key={id} className="animate-pulse">
          <CardHeader>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default function AppPage() {
  const myRooms = useQuery(api.rooms.queries.getMyRooms);
  const publicRooms = useQuery(api.rooms.queries.getPublicRooms);

  return (
    <Container className="flex flex-1">
      <div className="container py-12">
        <div className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>
                <p className="text-muted-foreground">
                  Manage your quiz rooms and join challenges
                </p>
              </div>
              <CreateRoom />
            </div>
          </section>

          <div className="grid gap-12 lg:grid-cols-2">
            <section className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">My Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Rooms you've created
                </p>
              </div>

              <div className="space-y-4">
                {myRooms === undefined ? (
                  <LoadingSkeleton />
                ) : myRooms.length === 0 ? (
                  <EmptyState type="myRooms" />
                ) : (
                  myRooms.map((room) => <RoomCard key={room._id} room={room} />)
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Public Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Join active quiz battles
                </p>
              </div>

              <div className="space-y-4">
                {publicRooms === undefined ? (
                  <LoadingSkeleton />
                ) : publicRooms.length === 0 ? (
                  <EmptyState type="publicRooms" />
                ) : (
                  publicRooms.map((room) => (
                    <RoomCard key={room._id} room={room} showJoinButton />
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
}
