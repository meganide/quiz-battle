"use client"

import type { PresenceState } from "../../_types"

import { cn } from "@/lib/utils"

import { MoreUsersPopover } from "./more-users-popover"
import { PresenceAvatar } from "./presence-avatar"

type FacePileProps = {
  presenceState: PresenceState[]
  className?: string
}

export function PresenceFacePile({ presenceState, className }: FacePileProps) {
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
            index={index}
            presence={presence}
            total={visible.length}
          />
        ))}
        {hidden.length > 0 && <MoreUsersPopover users={hidden} />}
      </div>
    </section>
  )
}
