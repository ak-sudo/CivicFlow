"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      const errorMessage = error?.message || String(error)

      // Only retry on network/connection errors, not on user errors
      const shouldRetry =
        errorMessage.includes("fetch") ||
        errorMessage.includes("521") ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("Web server is down")

      if (!shouldRetry || attempt === maxRetries - 1) {
        throw error
      }

      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt)
      console.log(`[v0] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

function getErrorMessage(error: any): string {
  const errorMessage = error?.message || String(error)

  // Check for common Supabase/network errors
  if (errorMessage.includes("fetch") && errorMessage.includes("failed")) {
    return "Unable to connect to the authentication service. The Supabase project may be initializing. Please wait a moment and try again."
  }

  if (errorMessage.includes("Unexpected token") || errorMessage.includes("not valid JSON")) {
    return "Authentication service is temporarily unavailable. Please try again in a few minutes."
  }

  if (errorMessage.includes("User already registered")) {
    return "An account with this email already exists. Please login instead."
  }

  if (errorMessage.includes("Invalid login credentials")) {
    return "Invalid email or password. Please check your credentials and try again."
  }

  if (errorMessage.includes("Email not confirmed")) {
    return "Please verify your email address before logging in. Check your inbox for the confirmation link."
  }

  if (errorMessage.includes("Network request failed") || errorMessage.includes("521")) {
    return "Network error: Unable to reach authentication service. The Supabase project may need to be resumed."
  }

  // Return the original error if it's user-friendly, otherwise a generic message
  if (errorMessage.length < 100 && !errorMessage.includes("<!DOCTYPE")) {
    return errorMessage
  }

  return "An unexpected error occurred. Please try again or contact support if the issue persists."
}

export async function signUp(formData: FormData) {
  try {
    const result = await retryWithBackoff(async () => {
      const supabase = await createClient()

      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const fullName = formData.get("fullName") as string
      const phone = formData.get("phone") as string
      const role = formData.get("role") as string

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role,
          },
        },
      })

      if (error) {
        throw error
      }

      return { data, error: null }
    })

    revalidatePath("/", "layout")
    return { success: true, data: result.data }
  } catch (error: any) {
    console.error("[v0] Signup exception:", error)
    return { error: getErrorMessage(error) }
  }
}

export async function signIn(formData: FormData) {
  try {
    const result = await retryWithBackoff(async () => {
      const supabase = await createClient()

      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return { data, error: null }
    })

    const supabase = await createClient()

    // Get user profile to determine redirect
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", result.data.user.id).single()

    revalidatePath("/", "layout")

    // Redirect based on role
    if (profile) {
      switch (profile.role) {
        case "admin":
          redirect("/admin/dashboard")
        case "worker":
          redirect("/worker/dashboard")
        default:
          redirect("/citizen/dashboard")
      }
    }

    redirect("/citizen/dashboard")
  } catch (error: any) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error
    }
    console.error("[v0] Login exception:", error)
    return { error: getErrorMessage(error) }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error: any) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error
    }
    console.error("[v0] Signout exception:", error)
  }
}
