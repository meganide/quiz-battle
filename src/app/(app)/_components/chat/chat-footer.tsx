import { useConvexAuth } from "convex/react"

import { SignInDialog } from "@/components/sign-in-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { useSendMessage } from "../../_hooks/use-send-message"

export function ChatFooter() {
  const {
    message,
    setMessage,
    isMessageTooLong,
    isButtonDisabled,
    handleKeyDown,
    throttledSendMessage,
  } = useSendMessage()

  const { isAuthenticated } = useConvexAuth()

  if (!isAuthenticated) {
    return (
      <SignInDialog>
        <Button className="w-full">Login to Chat</Button>
      </SignInDialog>
    )
  }

  return (
    <footer className="relative">
      <Input
        placeholder="Your message..."
        value={message}
        className={cn(
          "h-12 pr-[76px]",
          isMessageTooLong &&
            "border-red-500 outline-red-500 focus-visible:ring-red-500"
        )}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="absolute top-1/2 right-2 h-8 -translate-y-1/2 px-3"
        disabled={isButtonDisabled}
        size="sm"
        onClick={throttledSendMessage}
      >
        Send
      </Button>
    </footer>
  )
}
