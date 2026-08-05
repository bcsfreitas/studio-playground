// The program page's tabs used to be nested routes (/learn/:id/classroom, and
// /learn/:id/program before that). They are now `?tab=` state on the program
// page itself, so those paths no longer resolve to anything. Redirect them
// instead of 404ing links already in the wild.
//
// This is middleware rather than a `routeRules` redirect because Nitro only
// accepts `**` as the final segment of a pattern — `/learn/**/classroom` never
// matches, and silently serves a blank 200 instead of failing loudly.
const LEGACY_TAB_PATH = /^\/learn\/([^/]+)\/(overview|community|classroom|projects|resources|program)\/?$/

// `program` was the classroom's original URL, so it maps to the same tab.
const TAB_FOR_SEGMENT: Record<string, string> = {
  program: 'classroom',
  overview: ''
}

export default defineNuxtRouteMiddleware((to) => {
  const match = to.path.match(LEGACY_TAB_PATH)
  if (!match) return

  const [, programId, segment] = match
  const tab = segment! in TAB_FOR_SEGMENT ? TAB_FOR_SEGMENT[segment!] : segment!

  return navigateTo(
    { path: `/learn/${programId}`, query: tab ? { ...to.query, tab } : to.query },
    { redirectCode: 301 }
  )
})
