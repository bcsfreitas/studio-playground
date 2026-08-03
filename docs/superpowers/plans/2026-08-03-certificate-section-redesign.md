# Certificate Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `ProgramCertificateShowcase.vue` from a single flat card into a two-column mockup + benefits-checklist layout, dropping the Share/Download buttons.

**Architecture:** Single-file component change plus i18n key updates in both locales. No new props, no data model changes — `certificate.name`, `certificate.issuingOrg`, and `certificate.microcredentials` (all already passed in) are the only inputs used.

**Tech Stack:** Vue 3 `<script setup>`, Nuxt UI v4 (`UIcon`, `UBadge`), Tailwind CSS v4, `@nuxtjs/i18n`. No test framework in this repo — verification is manual via `npm run dev`.

## Global Constraints

- Use Nuxt UI components, not hand-rolled HTML, per `CLAUDE.md`'s "Building UI" section.
- Every UI-chrome string lives in `i18n/locales/en.json` / `es.json` under `program.*`, consumed via `useI18n()`'s `t()` — per the existing pattern in this file and `docs/superpowers/specs/2026-07-28-program-page-design.md`.
- No test suite exists — verify by running the dev server and viewing `/learn/[programId]` in the browser.

---

### Task 1: Update i18n strings

**Files:**
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`

**Interfaces:**
- Produces: `program.certificate.eyebrow`, `program.certificate.benefits.validateSkills.title`, `program.certificate.benefits.validateSkills.body` (takes `{issuingOrg}`), `program.certificate.benefits.keepForever.title`, `program.certificate.benefits.keepForever.body`, `program.certificate.benefits.shareAnywhere.title`, `program.certificate.benefits.shareAnywhere.body` — all consumed by Task 2.
- Removes: `program.certificate.shareButton`, `program.certificate.downloadButton` — confirm nothing else references them first (`grep -rn "certificate.shareButton\|certificate.downloadButton" app/`).

- [ ] **Step 1: Edit `i18n/locales/en.json`**

Find the existing `"certificate"` block under `"program"`:

```json
    "certificate": {
      "shareButton": "Share",
      "downloadButton": "Download",
      "microcredentialsLabel": "Microcredentials"
    },
```

Replace it with:

```json
    "certificate": {
      "eyebrow": "Certificate",
      "microcredentialsLabel": "Microcredentials",
      "benefits": {
        "validateSkills": {
          "title": "Validate your skills",
          "body": "Earn a credential from {issuingOrg} showing exactly what you built in this program."
        },
        "keepForever": {
          "title": "Yours to keep",
          "body": "Once earned, it never expires and stays on your learner profile."
        },
        "shareAnywhere": {
          "title": "Share it anywhere",
          "body": "Add it to a resume, portfolio, or LinkedIn."
        }
      }
    },
```

- [ ] **Step 2: Edit `i18n/locales/es.json`**

Find the matching Spanish `"certificate"` block (same shape, Spanish values) and replace it with:

```json
    "certificate": {
      "eyebrow": "Certificado",
      "microcredentialsLabel": "Microcredenciales",
      "benefits": {
        "validateSkills": {
          "title": "Valida tus habilidades",
          "body": "Obtén una credencial de {issuingOrg} que muestra exactamente lo que construiste en este programa."
        },
        "keepForever": {
          "title": "Es tuyo para siempre",
          "body": "Una vez obtenido, nunca caduca y permanece en tu perfil de estudiante."
        },
        "shareAnywhere": {
          "title": "Compártelo donde quieras",
          "body": "Agrégalo a tu currículum, portafolio o LinkedIn."
        }
      }
    },
```

- [ ] **Step 3: Verify no remaining references to the removed keys**

Run: `grep -rn "certificate.shareButton\|certificate.downloadButton" app/`
Expected: no output (Task 2 removes the only usages, so run this again after Task 2 too).

- [ ] **Step 4: Commit**

```bash
git add i18n/locales/en.json i18n/locales/es.json
git commit -m "Update certificate i18n strings for redesigned section"
```

---

### Task 2: Restyle `ProgramCertificateShowcase.vue`

**Files:**
- Modify: `app/components/ProgramCertificateShowcase.vue`

**Interfaces:**
- Consumes: `ProgramCertificate` (`name`, `issuingOrg`, `microcredentials?`) from `~/composables/useProgramMockData` (unchanged); the i18n keys added in Task 1.
- Produces: nothing consumed elsewhere — rendered only from `app/pages/learn/[programId].vue` as `<ProgramCertificateShowcase :certificate="template.certificate" />` (unchanged usage).

- [ ] **Step 1: Replace the component**

Replace the entire file with:

```vue
<script setup lang="ts">
import type { ProgramCertificate } from '~/composables/useProgramMockData'

defineProps<{
  certificate: ProgramCertificate
}>()

const { t } = useI18n()

const BENEFITS = ['validateSkills', 'keepForever', 'shareAnywhere'] as const
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="rounded-2xl border border-default p-6">
        <div class="rounded-xl border border-dashed border-default p-6 flex flex-col items-center text-center gap-2">
          <span class="text-xs font-semibold text-dimmed uppercase tracking-wide">
            {{ t('program.certificate.eyebrow') }}
          </span>
          <UIcon name="lucide:award" class="size-10 text-primary my-2" />
          <div class="font-heading font-bold text-lg text-highlighted">{{ certificate.name }}</div>
          <div class="text-sm text-dimmed">{{ certificate.issuingOrg }}</div>
        </div>
      </div>

      <ul class="flex flex-col gap-4">
        <li v-for="benefit in BENEFITS" :key="benefit" class="flex items-start gap-3">
          <UIcon name="lucide:check-circle-2" class="size-5 text-primary shrink-0 mt-0.5" />
          <p class="text-sm text-default">
            <span class="font-semibold text-highlighted">{{ t(`program.certificate.benefits.${benefit}.title`) }}</span>
            — {{ t(`program.certificate.benefits.${benefit}.body`, { issuingOrg: certificate.issuingOrg }) }}
          </p>
        </li>
      </ul>
    </div>

    <div v-if="certificate.microcredentials?.length" class="flex flex-col gap-2">
      <span class="text-xs font-semibold text-muted uppercase tracking-wide">
        {{ t('program.certificate.microcredentialsLabel') }}
      </span>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="mc in certificate.microcredentials"
          :key="mc.id"
          :label="mc.name"
          icon="lucide:badge-check"
          color="secondary"
          variant="subtle"
        />
      </div>
    </div>
  </div>
</template>
```

Note: `program.certificate.benefits.${benefit}.title`/`.body` is a dynamic i18n key built from the fixed, literal `BENEFITS` tuple — all 3 concrete key paths exist verbatim in both locale files from Task 1, so `@nuxtjs/i18n` resolves them at runtime same as any other `t()` call.

- [ ] **Step 2: Verify no remaining references to the removed keys**

Run: `grep -rn "certificate.shareButton\|certificate.downloadButton" app/`
Expected: no output.

- [ ] **Step 3: Manual verification**

Run: `npm run dev` (or use the already-running dev server)

Visit `/learn/<programId>` for any program (e.g. `ship-your-first-game`) and scroll to the certificate section ("What you'll earn").

Expected:
- Two columns on desktop: certificate mockup card on the left, 3-item checklist on the right; stacks to one column on mobile widths.
- Mockup shows "CERTIFICATE" eyebrow, an award icon, the certificate name, and the issuing org, inside a dashed inner frame.
- Checklist shows 3 bullets with colored checkmarks, bold lead-in text, and body copy (first one interpolates the program's issuing org).
- Microcredential badges still render below, when the program has any (e.g. `ship-your-first-game` has 2, `level-design-lab` has 0 — confirm the badge row is absent for that one).
- No Share/Download buttons anywhere in this section.
- Switch locale to Spanish (`ULocaleSelect` on the page) and confirm the eyebrow, checklist, and microcredentials label all translate.

If anything looks off, fix in this same file before moving on.

- [ ] **Step 4: Commit**

```bash
git add app/components/ProgramCertificateShowcase.vue
git commit -m "Restyle certificate section as mockup + benefits checklist"
```
