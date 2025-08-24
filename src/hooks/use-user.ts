import { useQuery } from "convex/react"

import { api } from "~/convex/_generated/api"

export function useUser() {
  const user = useQuery(api.users.queries.getMe)

  return user
}
