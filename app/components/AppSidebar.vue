<script setup lang="ts">
withDefaults(defineProps<{
  isLoggedIn: boolean
  isGuest: boolean
  userName: string
  showAdmin?: boolean
}>(), {
  showAdmin: true
})

const playOpen = ref(true)
const learnOpen = ref(true)
const adminOpen = ref(true)

const playItems = ['Explore Games', 'My Games']
const learnItems = ['My Programs', 'Resources']
const adminItems = ['Games', 'Programs', 'Resources', 'Intake Form', 'Feed Console', 'Users', 'Institutions', 'Events']
</script>

<template>
  <aside
    class="fixed left-0 top-0 bottom-0 w-[232px] bg-white border-r border-default flex flex-col box-border z-50"
    style="padding: 20px 14px 20px"
  >
    <img src="/images/black-endless-logo.png" alt="Endless Studios" class="h-6 w-auto self-start mb-[22px]" style="margin: 2px 10px 22px">

    <nav class="flex flex-col gap-0.5 overflow-y-auto min-h-0">
      <div class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl cursor-pointer text-sm font-semibold text-highlighted bg-slate-100">
        <Icon name="lucide:home" class="size-5 text-primary" />
        Home
      </div>

      <div
        class="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer text-sm font-semibold text-muted"
        @click="playOpen = !playOpen"
      >
        <span class="flex items-center gap-2.5">
          <Icon name="lucide:gamepad-2" class="size-5" />
          Play
        </span>
        <Icon :name="playOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4 opacity-50" />
      </div>
      <div v-if="playOpen" class="flex flex-col" style="padding-left: 42px">
        <a
          v-for="item in playItems"
          :key="item"
          href="#"
          class="py-1.5 px-2.5 rounded-lg text-sm text-muted hover:bg-muted hover:text-default"
        >{{ item }}</a>
      </div>

      <div
        class="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer text-sm font-semibold text-muted"
        @click="learnOpen = !learnOpen"
      >
        <span class="flex items-center gap-2.5">
          <Icon name="lucide:brain" class="size-5" />
          Learn
        </span>
        <Icon :name="learnOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4 opacity-50" />
      </div>
      <div v-if="learnOpen" class="flex flex-col" style="padding-left: 42px">
        <a
          v-for="item in learnItems"
          :key="item"
          href="#"
          class="py-1.5 px-2.5 rounded-lg text-sm text-muted hover:bg-muted hover:text-default"
        >{{ item }}</a>
      </div>

      <div class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl cursor-pointer text-sm font-semibold text-muted hover:bg-muted hover:text-default">
        <Icon name="lucide:blocks" class="size-5" />
        Make
      </div>

      <div class="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer text-sm font-semibold text-muted hover:bg-muted hover:text-default">
        <span class="flex items-center gap-2.5">
          <img src="/images/logo-endless.svg" alt="" class="size-5">
          Contribute
        </span>
        <Icon name="lucide:external-link" class="size-4 opacity-50" />
      </div>

      <template v-if="showAdmin">
        <USeparator class="my-2" />

        <div
          class="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer text-sm font-semibold text-muted"
          @click="adminOpen = !adminOpen"
        >
          <span class="flex items-center gap-2.5">
            <Icon name="lucide:settings" class="size-5" />
            Admin
          </span>
          <Icon :name="adminOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4 opacity-50" />
        </div>
        <div v-if="adminOpen" class="flex flex-col" style="padding-left: 42px">
          <a
            v-for="item in adminItems"
            :key="item"
            href="#"
            class="py-1.5 px-2.5 rounded-lg text-sm text-muted hover:bg-muted hover:text-default"
          >{{ item }}</a>
        </div>
      </template>
    </nav>

    <div class="mt-auto shrink-0">
      <div v-if="isLoggedIn" class="flex flex-col gap-2">
        <div class="flex items-center gap-4 py-2 px-4 rounded-lg cursor-pointer hover:bg-muted">
          <Icon name="lucide:bell" class="size-5 text-muted" />
          <span class="flex-1 text-sm font-medium text-muted">Notifications</span>
          <UBadge color="neutral" variant="outline" size="sm">13</UBadge>
        </div>
        <USeparator />
        <div class="flex items-center gap-6 p-4 rounded-lg cursor-pointer hover:bg-muted">
          <div class="flex flex-1 items-center gap-2 min-w-0">
            <UAvatar :text="userName.charAt(0).toUpperCase()" size="sm" />
            <span class="text-base font-semibold text-highlighted truncate">{{ userName }}</span>
          </div>
          <Icon name="lucide:chevrons-up-down" class="size-4 opacity-50 shrink-0" />
        </div>
      </div>
      <div v-if="isGuest" class="flex flex-col gap-2 pt-3.5 border-t border-muted">
        <UButton color="primary" size="sm" block>Join free</UButton>
        <UButton color="neutral" variant="outline" size="sm" block>Log in</UButton>
      </div>
    </div>
  </aside>
</template>
