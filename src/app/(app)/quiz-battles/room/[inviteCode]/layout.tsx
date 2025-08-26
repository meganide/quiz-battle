import { RequireAuth } from "@/components/require-auth"

import { RequireAuthAlertDialog } from "./_components/require-auth-alert-dialog"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth fallback={<RequireAuthAlertDialog />}>{children}</RequireAuth>
  )
}
