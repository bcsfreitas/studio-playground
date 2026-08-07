import type { FormError } from '@nuxt/ui'

/**
 * Stand-in for the auth calls this platform doesn't have yet. Every screen in
 * `app/pages/auth/` submits through here so they all feel the same and there is
 * exactly one place to delete once a real backend exists.
 *
 * Nothing is checked and nothing is stored: no credential is wrong, and signing
 * in doesn't change what any other page renders. The home page happens to open
 * in its signed-in state already, which is what makes the redirect at the end of
 * the flow look right.
 */
export function useMockAuth() {
  const pending = ref(false)

  // Long enough to read as work being done, short enough not to feel broken.
  const FAKE_LATENCY_MS = 900

  async function submit(then: () => unknown) {
    if (pending.value) return
    pending.value = true
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY_MS))
    pending.value = false
    await then()
  }

  return { pending, submit }
}

/**
 * Deliberately permissive — it catches a missing `@` or a typed-in name, not an
 * unroutable domain. These screens are a mockup, so the job is to prove the
 * error states render, not to gatekeep.
 */
export function isEmailish(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function requiredError(name: string, value: string, message: string): FormError[] {
  return value.trim() ? [] : [{ name, message }]
}
