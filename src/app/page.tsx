"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { SignIn } from "./_components/sign-in";

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isAuthenticated ? <Button onClick={() => void signOut()}>Sign out</Button> : <SignIn />}
      
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </main>
  );
}
