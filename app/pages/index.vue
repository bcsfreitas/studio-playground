<script setup lang="ts">
import {
  feedPosts,
  programRecs,
  openTasks,
  bounties,
  upcomingEvents,
  weekCellsFor,
  topbarStatsFor,
  userName,
  userAvatar,
  streakDays
} from '~/composables/useHomeMockData'
import { usePreviewState } from '~/composables/usePreviewState'

definePageMeta({ layout: 'dashboard' })

const { isGuest, isStarting, isOnboarded, isLoggedIn } = usePreviewState()
const showRecs = computed(() => isStarting.value || isGuest.value)

const streakTitle = computed(() => (isOnboarded.value ? `${streakDays}-day streak` : 'Start your streak'))
const streakMeta = computed(() => (isOnboarded.value ? 'Best: 14 days' : 'Best: 0 days'))
const weekCells = computed(() => weekCellsFor(isOnboarded.value))
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value))

const tab = ref<'all' | 'announce' | 'game' | 'program'>('all')
const tabs: { id: typeof tab.value, label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'announce', label: 'Announcements' },
  { id: 'game', label: 'Game updates' },
  { id: 'program', label: 'Program boards' }
]
const filteredPosts = computed(() => feedPosts.filter(p => tab.value === 'all' || p.cat === tab.value))
</script>

<template>
  <!-- The body carries no padding or gap of its own: the topbar is a full-bleed
       band and everything below it sits in a UContainer, which brings its own
       responsive side padding. The `sm:` halves are needed because the theme's
       defaults are `p-4 sm:p-6` / `gap-4 sm:gap-6`, and tailwind-merge only
       treats same-variant classes as conflicting — a bare `p-0` leaves
       `sm:p-6` live, which insets the topbar from `sm` up. -->
  <UDashboardPanel :ui="{ root: 'bg-muted', body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <!-- Signed in, not just active: a new learner gets the same bar, with
           counters that start at zero. Guests get the same band too, carrying
           the sign-in pair instead of an account. -->
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer>

        <!-- Top CTA banner -->
        <div
          v-if="isGuest"
          class="mt-10 flex flex-row items-center justify-between gap-3.5 rounded-2xl bg-cover bg-center h-[360px] p-12"
          style="background-image: url('/images/img/hero-banner.png')"
        >
          <div class="flex flex-col items-start gap-3.5">
            <h1 class="font-heading font-bold text-5xl text-white" >
              Come play.
            </h1>
            <p class="max-w-[440px] text-md text-white/85">
              Every game here was made by a kid. Play as many as you like, then build one yourself. We'll show you every step. No account needed to start.
            </p>
            <!-- `color="neutral"` rather than primary: the banner art is already
                 the brand orange, so an orange button on top of it disappears. -->
            <UButton to="/auth/signup" label="Get started" color="neutral" size="lg" class="mt-1" />
          </div>
        </div>

        <!-- Sits outside the two-column grid below, at the same level as the
             hero, so the row spans the full container instead of being boxed
             into the main column. One persistent slot, one job: see
             WhatsNextSlot's own doc comment for the state machine this
             replaces (guest cards, checklist card, and the resume card all
             used to live here separately). -->
        <section :class="isGuest ? 'mt-20' : 'mt-10'">
          <WhatsNextSlot />
        </section>

        <div class="grid items-start gap-12" style="grid-template-columns: minmax(0,1fr) 324px; margin-top: 80px">
          <!-- ============ MAIN COLUMN ============ -->
          <div class="flex flex-col items-stretch justify-start flex-nowrap min-w-0 w-full gap-20">

            <!-- Learning -->
            <section class="w-full self-auto">
              <div v-if="showRecs">
                <SectionTitle
                  title="Start learning"
                  subtitle="Pick a program to begin your journey — every task you finish earns XP."
                >
                  <template #trailing>
                    <UButton color="secondary" variant="ghost" size="xs">
                      Browse all programs
                    </UButton>
                  </template>
                </SectionTitle>
                <div class="grid grid-cols-2 gap-4">
                  <ProgramTile
                    v-for="r in programRecs.slice(0, 2)"
                    :key="r.id"
                    :to="`/learn/${r.id}`"
                    :image="r.image"
                    :name="r.name"
                    :description="r.description"
                    :tasks-count="r.tasksCount"
                    :status="r.status"
                  />
                </div>
              </div>
            </section>

            <!-- Your open tasks -->
            <section v-if="isLoggedIn">
              <SectionTitle title="Your open tasks">
                <template #trailing>
                  <UButton color="secondary" variant="ghost" size="xs">
                    All open tasks
                  </UButton>
                </template>
              </SectionTitle>
              <div v-if="isOnboarded" class="grid grid-cols-2 gap-6">
                <TaskTile
                  v-for="t in openTasks"
                  :key="t.name"
                  :name="t.name"
                  :status="t.status"
                  :project="t.project"
                  :project-image="t.projectImage"
                  :due="t.due"
                  :due-soon="t.dueSoon"
                />
              </div>
              <div
                v-if="isStarting"
                class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl"
                style="padding: 32px 24px"
              >
                <Icon name="lucide:sparkles" class="size-[22px] text-primary" />
                <div class="font-heading text-[15px] font-bold text-default">No open tasks yet</div>
                <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">
                  Tasks you start in programs — and GitHub issues you pick up — will land here.
                </p>
              </div>
            </section>

            <!-- New & noteworthy -->
            <section>
              <h2 class="m-0 font-heading font-bold tracking-[-0.5px] text-highlighted" style="font-size: 24px; height: 32px">
                New &amp; noteworthy
              </h2>
              <div class="flex flex-wrap gap-2" style="margin: 12px 0 16px">
                <div
                  v-for="t in tabs"
                  :key="t.id"
                  class="px-3.5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer select-none transition-all duration-150"
                  :class="tab === t.id
                    ? 'bg-midnight-950 text-white border border-midnight-950'
                    : 'bg-white text-muted border border-default'"
                  @click="tab = t.id"
                >
                  {{ t.label }}
                </div>
              </div>
              <div class="flex flex-col gap-10">
                <PostCard
                  v-for="p in filteredPosts"
                  :key="p.id"
                  :post-id="p.id"
                  :author="p.author"
                  :avatar="p.avatar"
                  :time="p.time"
                  :image="p.image"
                  :likes="p.likes"
                  :comments="p.comments"
                  :is-mentor="p.isMentor"
                  :can-comment="isLoggedIn"
                >
                  {{ p.body }}
                </PostCard>
              </div>
            </section>
          </div>

          <!-- ============ RIGHT RAIL ============ -->
          <div class="flex flex-col gap-6 min-w-0 w-full">
            <StreakCard v-if="isLoggedIn" :title="streakTitle" :meta="streakMeta" :days="weekCells" />
            <UpcomingEventsCard :events="upcomingEvents" />
            <BountiesCard :bounties="bounties" />
          </div>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>

  <DevPreviewBar />
</template>
