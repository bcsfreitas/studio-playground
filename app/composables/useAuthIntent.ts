import { programTemplates } from '~/composables/programData/templates'
import { usePreviewState, type PreviewState } from '~/composables/usePreviewState'

type SignUpPath = 'learn' | 'teach' | 'build'

/**
 * Where the three "What brings you here?" cards land once the account exists.
 * They carry `?path=` for the sign-up copy; this turns that choice into a
 * destination. `build` is deliberately absent — that path isn't designed yet,
 * so it falls through to the home page.
 */
const PATH_DESTINATIONS: Partial<Record<SignUpPath, string>> = {
  learn: '/learn?audience=learner',
  teach: '/learn?audience=educator'
}

const HOME = '/'

/**
 * Same-origin relative paths only. `//evil.com` is a protocol-relative URL to a
 * browser, not a path, and this is the shape an open redirect takes once auth
 * stops being a mock.
 */
function isSafeNext(value: unknown): value is string {
  return typeof value === 'string'
    && value.startsWith('/')
    && !value.startsWith('//')
    && !value.includes('\\')
}

function isSignUpPath(value: unknown): value is SignUpPath {
  return value === 'learn' || value === 'teach' || value === 'build'
}

/** Link for a guest wall: sign up, then come back to `next`. */
export function signUpTo(next?: string, path?: SignUpPath) {
  return {
    path: '/auth/signup',
    query: {
      ...(isSafeNext(next) ? { next } : {}),
      ...(path ? { path } : {})
    }
  }
}

/** Same, for a wall that offers signing in to someone who already has an account. */
export function signInTo(next?: string) {
  return {
    path: '/auth/signin',
    query: isSafeNext(next) ? { next } : {}
  }
}

/**
 * The auth screens' half of the deal: read where this flow is headed, say so,
 * and finish by putting the app in the state the flow produced.
 *
 * The intent rides the URL rather than storage so a refresh in the middle of
 * sign-up doesn't drop it, and so a link into the flow can carry one.
 */
export function useAuthReturn() {
  const route = useRoute()
  const { state } = usePreviewState()

  const destination = computed(() => {
    if (isSafeNext(route.query.next)) return route.query.next
    const path = route.query.path
    return (isSignUpPath(path) && PATH_DESTINATIONS[path]) || HOME
  })

  /**
   * Naming the destination is the whole point of carrying it — a learner who
   * clicked Enroll should see that they'll be brought back. Silent when there's
   * nothing worth saying (the home page, an unrecognised path).
   */
  const returnLabel = computed(() => {
    const to = destination.value
    if (to === HOME) return undefined

    const programId = to.match(/^\/learn\/([^/?#]+)/)?.[1]
    if (programId) return programTemplates.find(p => p.id === programId)?.title
    if (to.startsWith('/learn')) return 'the program catalog'
    return undefined
  })

  /** What signup/verify hands to the next screen so the intent survives a step. */
  function carryQuery(extra: Record<string, string> = {}) {
    return {
      ...extra,
      ...(isSafeNext(route.query.next) ? { next: route.query.next } : {}),
      ...(isSignUpPath(route.query.path) ? { path: route.query.path } : {})
    }
  }

  /**
   * End of the flow. There is no session to create, so the preview state is
   * what "signed in" means here — signing up produces a fresh account, signing
   * in an existing one.
   */
  function finish(as: PreviewState) {
    state.value = as
    return navigateTo(destination.value)
  }

  return { destination, returnLabel, carryQuery, finish }
}
