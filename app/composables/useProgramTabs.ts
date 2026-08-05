import type { InjectionKey } from 'vue'

export interface ProgramTabsApi {
  /** Open a tab by id. Unknown or currently-hidden ids are ignored. */
  setTab: (tabId: string) => void
  /**
   * Open a specific classroom lesson. The lesson id still travels in `?item=`
   * because the classroom reads it from the route; only the tab itself is
   * front-end state.
   */
  openLesson: (itemId: string) => void
}

const PROGRAM_TABS_KEY: InjectionKey<ProgramTabsApi> = Symbol('program-tabs')

/**
 * The active tab is plain component state in the program shell, not a route
 * param — tabs behave like tabs, so switching one doesn't change the URL or
 * touch history.
 *
 * The cost is that a link can no longer target a tab, so anything in a tab's
 * content that needs to open another one (the Home dashboard's "Continue
 * learning", Overview's project gallery) calls these instead of navigating.
 */
export function provideProgramTabs(api: ProgramTabsApi) {
  provide(PROGRAM_TABS_KEY, api)
}

/**
 * No-ops outside the shell so a tab component still mounts standalone in
 * Storybook — there is no tab strip to drive in that case.
 */
export function useProgramTabs(): ProgramTabsApi {
  return inject(PROGRAM_TABS_KEY, { setTab: () => {}, openLesson: () => {} })
}
