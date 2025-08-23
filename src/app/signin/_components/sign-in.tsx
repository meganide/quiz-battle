"use client"

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignIn() {
  const { signIn } = useAuthActions();
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <section className="w-full max-w-md space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome to Quiz Battle
          </h1>
          <p className="text-slate-600 text-sm">
            Sign in to start competing in epic quiz battles
          </p>
        </header>
        
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-semibold">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Continue with your Google account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => void signIn("google", {redirectTo: "/app"})}
              className="w-full h-12 bg-white hover:bg-gray-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
              variant="outline"
            >
              <svg 
                className="w-5 h-5 mr-3" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  fill="#4285F4" 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path 
                  fill="#34A853" 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path 
                  fill="#FBBC05" 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path 
                  fill="#EA4335" 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </CardContent>
        </Card>
        
        <footer className="text-center">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <a href="/terms" className="underline hover:text-slate-700 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-slate-700 transition-colors">
              Privacy Policy
            </a>
          </p>
        </footer>
      </section>
    </main>
  );
}
