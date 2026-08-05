<script setup lang="ts">
import {
  feedPosts,
  programRecs,
  continueLearning,
  openTasks,
  bounties,
  upcomingEvents,
  gettingStartedItems,
  weekCellsFor,
  userName,
  streakDays,
  xpLabel,
  notificationCount,
  type PreviewState
} from '~/composables/useHomeMockData'

definePageMeta({ layout: 'dashboard' })

const state = ref<PreviewState>('active')

const isActive = computed(() => state.value === 'active')
const isNew = computed(() => state.value === 'new')
const isGuest = computed(() => state.value === 'guest')
const isLoggedIn = computed(() => !isGuest.value)
const showRecs = computed(() => isNew.value || isGuest.value)

const streakTitle = computed(() => (isActive.value ? `${streakDays}-day streak` : 'Start your streak'))
const streakMeta = computed(() => (isActive.value ? 'Best: 14 days' : 'Best: 0 days'))
const weekCells = computed(() => weekCellsFor(isActive.value))

const tab = ref<'all' | 'announce' | 'game' | 'program'>('all')
const tabs: { id: typeof tab.value, label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'announce', label: 'Announcements' },
  { id: 'game', label: 'Game updates' },
  { id: 'program', label: 'Program boards' }
]
const filteredPosts = computed(() => feedPosts.filter(p => tab.value === 'all' || p.cat === tab.value))

const previewStates: { id: PreviewState, label: string }[] = [
  { id: 'new', label: 'New learner' },
  { id: 'active', label: 'Active learner' },
  { id: 'guest', label: 'Guest' }
]
</script>

<template>
  <UDashboardPanel :ui="{ root: 'bg-muted', body: 'p-0 gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar v-if="isActive" :xp-label="xpLabel" :streak-days="streakDays" :user-name="userName" :notification-count="notificationCount" />

      <UContainer>
        <div style="height: 40px; width: 100%" />

        <!-- Top CTA banner -->
        <div
          v-if="isGuest"
          class="flex flex-row items-center justify-between gap-3.5 rounded-2xl bg-cover bg-center h-[360px] p-12"
          style="background-image: url('/images/img/hero-banner.png')"
        >
          <div class="flex flex-col items-start gap-3.5">
            <h1 class="font-heading font-bold text-5xl text-white" >
              Build worlds together.
            </h1>
            <p class="max-w-[440px] text-md text-white/85">
              Endstar is a 3D multiplayer game-making platform. Place blocks, wire up levers and traps, script with Lua — and build alongside your friends in the same world, live.
            </p>
          </div>
        </div>

        <div class="grid items-start gap-12" style="grid-template-columns: minmax(0,1fr) 324px; margin-top: 80px">
          <!-- ============ MAIN COLUMN ============ -->
          <div class="flex flex-col items-stretch justify-start flex-nowrap min-w-0 w-full gap-20">

            <!-- Learning -->
            <section class="w-full self-auto">
              <div v-if="isActive">
                <SectionTitle title="Continue learning">
                  <template #trailing>
                    <UButton color="secondary" variant="ghost" size="xs">
                      View all programs
                    </UButton>
                  </template>
                </SectionTitle>

                <UPageCard
                  v-if="continueLearning"
                  orientation="horizontal"
                  reverse
                  class="transition-shadow duration-250 hover:shadow-2xl"
                >
                  <img :src="continueLearning.image" :alt="continueLearning.name" class="h-full object-cover rounded-2xl">

                  <template #body>
                    <div class="text-xs font-semibold uppercase text-dimmed w-full">Program</div>
                    <div class="mt-1 font-heading font-bold text-highlighted text-2xl">{{ continueLearning.name }}</div>
                    <div class="text-sm text-muted">Current task: {{ continueLearning.currentTask }}</div>
                    <div class="flex items-center gap-3 mt-4">
                      <UProgress :model-value="continueLearning.progress" color="primary"/>
                      <span class="text-xs text-default">{{ continueLearning.progress }}%</span>
                    </div>
                    <div class="mt-3">
                      <UButton
                        color="primary"
                        size="xl"
                        icon="lucide:play"
                        :to="`/learn/${continueLearning.id}`"
                      >Resume learning</UButton>
                    </div>
                  </template>
                </UPageCard>
              </div>

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
              <div v-if="isActive" class="grid grid-cols-2 gap-6">
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
                v-if="isNew"
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
                  :author="p.author"
                  :avatar="p.avatar"
                  :time="p.time"
                  :image="p.image"
                  :likes="p.likes"
                  :comments="p.comments"
                  :is-mentor="p.isMentor"
                >
                  {{ p.body }}
                </PostCard>
              </div>
            </section>
          </div>

          <!-- ============ RIGHT RAIL ============ -->
          <div class="flex flex-col gap-6 min-w-0 w-full">
            <GettingStartedCard v-if="isNew" :items="gettingStartedItems" />
            <StreakCard v-if="isLoggedIn" :title="streakTitle" :meta="streakMeta" :days="weekCells" />
            <UpcomingEventsCard :events="upcomingEvents" />
            <BountiesCard :bounties="bounties" />
          </div>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>

  <!-- Dev-only preview state switcher (not part of the product's real UI) -->
  <div
    class="fixed right-[18px] bottom-[18px] z-[200] flex items-center gap-1"
    style="background: rgba(2,6,24,0.92); border-radius: 100px; padding: 5px 6px 5px 14px; box-shadow: var(--shadow-menu)"
  >
    <span class="text-[10px] font-bold tracking-[0.08em] text-slate-400 mr-1.5">PREVIEW AS</span>
    <div
      v-for="p in previewStates"
      :key="p.id"
      class="px-3 py-1.5 rounded-full text-[12.5px] font-semibold cursor-pointer select-none transition-all duration-150"
      :class="state === p.id ? 'bg-white text-slate-900' : 'text-slate-300'"
      @click="state = p.id"
    >
      {{ p.label }}
    </div>
  </div>
</template>
