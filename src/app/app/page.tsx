"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function AppPage() {
  const { signOut } = useAuthActions();
  
  return (
    <div>
      <Button onClick={() => void signOut()}>Sign out</Button>
    </div>
  );
}
