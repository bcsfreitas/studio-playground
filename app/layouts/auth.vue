<script setup lang="ts">
const { t } = useI18n()

const BENEFITS = ['playFree', 'learnByMaking', 'shareWork'] as const
</script>

<template>
  <!-- No sidebar and no topbar: an auth screen is the one place in the platform
       with nothing to navigate to yet. This is a sibling of `dashboard.vue`
       rather than a variant of it, and pages opt in with
       `definePageMeta({ layout: 'auth' })`. -->
  <div class="flex min-h-dvh bg-default lg:p-3">
    <div class="flex flex-1 flex-col px-6 py-8 sm:px-10">
      <NuxtLink to="/" class="shrink-0">
        <img src="/images/endless-logo-horizontal.svg" alt="Endless Studios" width="132" height="36">
      </NuxtLink>

      <!-- `my-auto` rather than `justify-center`: it centres the form in the
           leftover space but still lets a tall form (sign-up has four fields)
           push the column taller and scroll instead of being clipped. -->
      <div class="my-auto w-full max-w-[400px] self-center py-12">
        <slot />
      </div>
    </div>

    <!-- Decoration only, so it's the first thing to go on a narrow viewport —
         the form is the whole job below `lg`. -->
    <aside class="relative hidden w-[46%] max-w-[720px] shrink-0 overflow-hidden rounded-3xl lg:block">
      <!-- The guest home's hero art. It's a wide banner and this frame is tall,
           so the focal point is pushed right — that's where the trio stands;
           a centred crop would land on empty sky. -->
      <img
        src="/images/img/hero-banner.png"
        alt=""
        class="absolute inset-0 size-full object-cover object-[72%_center]"
      >

      <!-- Same bottom-up scrim PathChoiceCards uses, and for the same reason:
           white on the orange artwork is well under WCAG AA on its own. -->
      <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />

      <div class="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-10">
        <h2 class="font-heading text-4xl font-bold tracking-[-0.5px] text-white">
          {{ t('auth.showcase.headline') }}
        </h2>
        <ul class="flex flex-col gap-2.5">
          <li v-for="benefit in BENEFITS" :key="benefit" class="flex items-center gap-2.5 text-white/90">
            <UIcon name="lucide:check" class="size-4 shrink-0" />
            <span class="text-sm">{{ t(`auth.showcase.${benefit}`) }}</span>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
