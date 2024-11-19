"use client"
import Link from "next/link"
import { useState } from "react"
import { FormEvent } from "react"
import { LoginCredentials } from "~/lib/types/auth"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { bskyLogin } from "~/lib/utils/auth"
import { LoadingSpinner } from "./ui/spinner"
import { useRouter } from "next/navigation"

export function LoginForm() {

  const [credentials, setCredentials] = useState<LoginCredentials>({ identifier: '', password: '' })
  const [error, setError] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true)

    const login = await bskyLogin({ credentials })
    if (!login) {
      setError(true)
      setLoading(false)
      console.error('Unable to login, invalid credentials')
    } else {
      setLoading(false)
      console.log('Login success')
      router.push("/")
    }

  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter Bluesky credentials to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Username</Label>
              <Input
                id="identifier"
                type="text"
                name="identifier"
                placeholder="username.bsky.social"
                required
                value={credentials.identifier}
                onChange={(e) => setCredentials(prev => ({ ...prev, identifier: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? <LoadingSpinner></LoadingSpinner> : error ? 'Incorrect Credentials' : 'Login' }
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="https://bsky.app/" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card >
  )
}
