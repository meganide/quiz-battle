import { useQuery } from "convex/react"

import type { Id } from "~/convex/_generated/dataModel"

import { api } from "~/convex/_generated/api"

export function useUser() {
  const user = useQuery(api.users.queries.getMe)

  return {
    ...user,
    _id: user?._id ?? (crypto.randomUUID() as Id<"users">),
  }
}
