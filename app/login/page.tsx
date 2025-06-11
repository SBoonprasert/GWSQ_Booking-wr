"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample user database - in a real app, this would be in your backend
const userDatabase = {
  // Students
  "john.student@university.edu": { password: "student123", tier: "student", name: "John Student" },
  "mary.student@university.edu": { password: "student123", tier: "student", name: "Mary Student" },
  "alex.student@university.edu": { password: "student123", tier: "student", name: "Alex Student" },

  // Teachers
  "prof.smith@university.edu": { password: "teacher123", tier: "teacher", name: "Prof. Smith" },
  "dr.johnson@university.edu": { password: "teacher123", tier: "teacher", name: "Dr. Johnson" },
  "prof.williams@university.edu": { password: "teacher123", tier: "teacher", name: "Prof. Williams" },

  // Admin
  "admin@university.edu": { password: "admin123", tier: "admin", name: "Administrator" },
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [error, setError] = useState("")
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const router = useRouter()

  const handleUniversityLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login delay
    setTimeout(() => {
      // User login - automatically determine tier
      const user = userDatabase[email as keyof typeof userDatabase]
      if (user && user.password === password && (user.tier === "student" || user.tier === "teacher")) {
        localStorage.setItem("userType", "user")
        localStorage.setItem("userTier", user.tier)
        localStorage.setItem("userName", user.name)
        router.push("/room-selection")
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login delay
    setTimeout(() => {
      // Admin login
      const user = userDatabase[adminEmail as keyof typeof userDatabase]
      if (user && user.password === adminPassword && user.tier === "admin") {
        localStorage.setItem("userType", "admin")
        localStorage.setItem("userName", user.name)
        router.push("/admin")
      } else {
        setError("Invalid admin credentials")
      }
      setIsLoading(false)
      setShowAdminDialog(false)
    }, 1000)
  }

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate email format
    if (!guestEmail || !guestEmail.includes("@") || !guestEmail.includes(".")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Check if email is a university email
    if (guestEmail.endsWith("university.edu")) {
      setError("University members should use the university login. Guest access is for external users only.")
      setIsLoading(false)
      return
    }

    // Store guest info and redirect
    setTimeout(() => {
      localStorage.setItem("userType", "user")
      localStorage.setItem("userTier", "guest")
      localStorage.setItem("userName", guestEmail.split("@")[0]) // Simple name extraction
      router.push("/room-selection")
      setIsLoading(false)
    }, 1000)
  }

  const closeAdminDialog = () => {
    setShowAdminDialog(false)
    setAdminEmail("")
    setAdminPassword("")
    setError("")
  }

  const fillDemoCredentials = (type: "student" | "teacher") => {
    if (type === "student") {
      setEmail("john.student@university.edu")
      setPassword("student123")
    } else {
      setEmail("prof.smith@university.edu")
      setPassword("teacher123")
    }
    setError("")
  }

  const fillAdminCredentials = () => {
    setAdminEmail("admin@university.edu")
    setAdminPassword("admin123")
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
        <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Settings className="w-4 h-4 mr-1" />
              Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>Access the administrative dashboard</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeAdminDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} variant="destructive">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </DialogFooter>
            </form>
            {/* Demo admin credentials */}
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-medium text-red-900 dark:text-red-300 mb-1 text-sm">Demo Admin:</h4>
              <div className="flex items-center justify-between">
                <div className="text-xs text-red-800 dark:text-red-200">admin@university.edu / admin123</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fillAdminCredentials}
                  className="text-xs h-auto p-1"
                >
                  Fill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full max-w-md border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Room Booking System</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="university" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="university">University Login</TabsTrigger>
              <TabsTrigger value="guest">Guest Access</TabsTrigger>
            </TabsList>

            <TabsContent value="university">
              <form onSubmit={handleUniversityLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">University Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                  University members book rooms for free!
                </div>
              </form>

              {/* Demo credentials info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Student:</strong> john.student@university.edu / student123
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fillDemoCredentials("student")}
                      className="text-xs h-auto p-1"
                    >
                      Fill
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Teacher:</strong> prof.smith@university.edu / teacher123
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fillDemoCredentials("teacher")}
                      className="text-xs h-auto p-1"
                    >
                      Fill
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guest">
              <form onSubmit={handleGuestLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-email">Guest Email</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Continuing..." : "Continue as Guest"}
                </Button>
                <div className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md">
                  Note: Guest bookings are subject to standard room rates.
                </div>
              </form>

              {/* Guest info */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-amber-900 dark:text-amber-300 mb-2">Guest Access:</h4>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <div>• No password required</div>
                  <div>• Standard room rates apply</div>
                  <div>• Can book up to 2 rooms</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{" "}
            <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400" asChild>
              <Link href="mailto:support@university.edu">Contact Support</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
