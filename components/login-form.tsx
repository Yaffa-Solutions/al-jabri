"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("authToken", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))

        toast.success("Login successful!", {
          description: `Welcome back, ${data.data.user.name}!`,
        })

        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        toast.error("Login failed", {
          description: data.error || "Invalid credentials",
        })
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      toast.error("Connection error", {
        description: "Please check your internet connection and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-[#324557] to-[#48647E] py-12 px-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#B99B75] rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#324557]">Welcome Back</CardTitle>
          <CardDescription className="text-[#5F83A4]">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#324557] font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#324557] font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-[#86A1BA]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-[#86A1BA] focus:border-[#B99B75]"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#86A1BA]" />
                <span className="text-[#324557]">Remember me</span>
              </label>
              <a href="#" className="text-[#B99B75] hover:text-[#CEB89E] font-semibold">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#B99B75] hover:bg-[#CEB89E] text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-center text-sm text-[#5F83A4]">
              Don't have an account?{" "}
              <a href="#" className="text-[#B99B75] hover:text-[#CEB89E] font-semibold">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
