const STORAGE_KEY = 'mentor-status'

// One hydration per session — same reasoning as useOnboardingIntent.ts.
let hydrated = false

/**
 * The mock "server-side" educator/mentor role grant. There is no backend, so
 * this composable's localStorage write IS the server-side effect the
 * qualification drawer's processing step performs — granting it is what
 * flips AppSidebar's Teach nav item and CreateCohortDrawer's CTA behavior,
 * since both read `isMentor` reactively.
 */
export function useMentorStatus() {
  const isMentor = useState<boolean>(STORAGE_KEY, () => false)

  onMounted(() => {
    if (hydrated || !import.meta.client) return
    hydrated = true
    isMentor.value = localStorage.getItem(STORAGE_KEY) === '1'
  })

  function grantMentorStatus() {
    isMentor.value = true
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, '1')
  }

  return { isMentor, grantMentorStatus }
}
