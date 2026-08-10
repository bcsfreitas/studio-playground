// The program page's tabs used to be nested routes (/learn/:id/classroom, and
// /learn/:id/program before that), then briefly `?tab=` on the program page.
// Tabs are now front-end state with no URL at all, so none of those paths
// resolve. Send them to the program page rather than 404ing links in the wild;
// which tab opens is no longer expressible in a URL, so they land on the
// default one.
//
// This is middleware rather than a `routeRules` redirect because Nitro only
// accepts `**` as the final segment of a pattern — `/learn/**/classroom` never
// matches, and silently serves a blank 200 instead of failing loudly.
const LEGACY_TAB_PATH = /^\/learn\/([^/]+)\/(overview|community|classroom|projects|resources|program)\/?$/

export default defineNuxtRouteMiddleware((to) => {
  const match = to.path.match(LEGACY_TAB_PATH)
  if (!match) return

  const [, programId] = match

  return navigateTo({ path: `/learn/${programId}`, query: to.query }, { redirectCode: 301 })
})
