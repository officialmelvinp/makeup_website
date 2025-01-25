"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyToken = async () => {
      const tokenFromUrl = searchParams.get("token")
      if (tokenFromUrl) {
        setToken(tokenFromUrl)
        try {
          const response = await fetch(`/api/admin-reset-password?token=${tokenFromUrl}`)
          const data = await response.json()
          if (response.ok && data.message === "Token is valid") {
            setIsTokenValid(true)
          } else {
            setError(data.message || "Invalid or expired token")
          }
        } catch (error) {
          console.error("Error verifying token:", error)
          setError("An error occurred while verifying the token")
        }
      } else {
        setError("No reset token provided")
      }
      setIsLoading(false)
    }
    verifyToken()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      const response = await fetch("/api/admin-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin")
        }, 3000)
      } else {
        setError(data.message || "Failed to reset password")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      setError("An error occurred. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verifying Reset Token</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Please wait...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Password Reset Successful</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your password has been reset. You will be redirected to the login page shortly.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Error</h2>
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          <div className="text-center">
            <a href="/admin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Return to Admin Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return null
}

