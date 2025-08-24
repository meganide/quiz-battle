"use client"

import type { PresenceState } from "../../_types"
import type { Id } from "~/convex/_generated/dataModel"

import { cn } from "@/lib/utils"

import { MoreUsersPopover } from "./more-users-popover"
import { PresenceAvatar } from "./presence-avatar"

type FacePileProps = {
  presenceState: PresenceState[]
  hostId: Id<"users">
  className?: string
}

export function PresenceFacePile({
  presenceState,
  hostId,
  className,
}: FacePileProps) {
  const visible = presenceState.slice(0, 5)
  const hidden = presenceState.slice(5)

  if (presenceState.length === 0) {
    return null
  }

  return (
    <section className={cn("flex items-center", className)}>
      <div className="flex items-center">
        {visible.map((presence, index) => (
          <PresenceAvatar
            key={presence.userId}
            hostId={hostId}
            index={index}
            presence={presence}
            total={visible.length}
          />
        ))}
        {hidden.length > 0 && (
          <MoreUsersPopover hostId={hostId} users={hidden} />
        )}
      </div>
    </section>
  )
}
