"use client"

import type React from "react"

import { useConvexAuth } from "convex/react"
import { redirect } from "next/navigation"

import { Spinner } from "@/components/spinner"

type RequireAuthProps =
  | {
      children: React.ReactNode
      fallback?: React.ReactNode
      redirectTo?: never
    }
  | {
      children?: React.ReactNode
      fallback?: never
      redirectTo: string
    }

export function RequireAuth({
  children,
  fallback,
  redirectTo,
}: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return (
      <div className="mt-4 flex w-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback ?? redirect(redirectTo ?? "/")
  }

  return children
}
