<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { MentorClassroom } from '~/composables/useProgramMockData'
import { useMentorClassrooms } from '~/composables/useMentorClassrooms'
import { useClassroomInviteLink } from '~/composables/useClassroomInviteLink'

const props = defineProps<{
  classroom: MentorClassroom
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const toast = useToast()
const { addLearners } = useMentorClassrooms()

const { inviteLink, copyLink } = useClassroomInviteLink(
  computed(() => props.classroom),
  { copied: 'teach.hub.invite.linkCopied', copyFailed: 'teach.hub.invite.linkCopyFailed' }
)

async function copyCode() {
  try {
    if (import.meta.client) await navigator.clipboard.writeText(props.classroom.accessCode ?? '')
    toast.add({ title: t('teach.hub.invite.codeCopied'), color: 'success' })
  } catch {
    toast.add({ title: t('teach.hub.invite.codeCopyFailed'), color: 'error' })
  }
}

type InviteTab = 'send' | 'csv'
const activeTab = ref<InviteTab>('send')

const tabItems = computed<TabsItem[]>(() => [
  { label: t('teach.hub.invite.tabs.send'), value: 'send' },
  { label: t('teach.hub.invite.tabs.csv'), value: 'csv' }
])

interface ParsedCsv {
  headers: string[]
  rows: Record<string, string>[]
}

const csvFile = ref<File | null>(null)
const parsed = ref<ParsedCsv | null>(null)

function parseCsv(text: string): ParsedCsv {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0)
  if (lines.length === 0) return { headers: [], rows: [] }
  // Naive comma split — no quoted-field/escaping support. Acceptable for a
  // scaffold explicitly pending a real column schema; revisit once one exists.
  const headers = lines[0]!.split(',').map(h => h.trim())
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? '').trim()]))
  })
  return { headers, rows }
}

watch(csvFile, async (file) => {
  parsed.value = file ? parseCsv(await file.text()) : null
})

// This modal is opened repeatedly from the checklist (not mounted once per
// wizard run like the old step was) — every open starts clean rather than
// wherever the last visit left it.
watch(open, (isOpen) => {
  if (!isOpen) return
  activeTab.value = 'send'
  csvFile.value = null
  parsed.value = null
})

function onConfirmImport() {
  if (!parsed.value) return
  // PLACEHOLDER HEURISTIC pending the real CSV template — takes the first
  // column's value as the student's display name, purely so this scaffold
  // has a visible effect on the roster ahead of a real column schema. Do not
  // build anything that reads this as a validated/confirmed name — swap out
  // the moment the real CSV template arrives.
  const firstHeader = parsed.value.headers[0]
  const learners = parsed.value.rows.map(row => ({
    name: firstHeader ? row[firstHeader] ?? '' : '',
    completion: 0
  }))
  addLearners(props.classroom.id, learners)
  parsed.value = null
  csvFile.value = null
}
</script>

<template>
  <UModal v-model:open="open">
    <template #title>
      {{ t('teach.hub.invite.title') }}
    </template>

    <template #body>
      <div class="flex flex-col gap-6">
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          color="primary"
          variant="link"
          size="md"
          :content="false"
        />

        <div v-if="activeTab === 'send'" class="flex flex-col gap-6">
          <UPageCard variant="subtle">
            <template #header>
              <span class="text-xs font-semibold text-dimmed uppercase tracking-wide">
                {{ t('teach.hub.invite.linkLabel') }}
              </span>
            </template>
            <div class="flex items-center gap-2">
              <UInput :model-value="inviteLink" readonly class="w-full font-mono text-xs" />
              <UButton :label="t('teach.hub.invite.copyLink')" icon="lucide:link" color="neutral" variant="outline" @click="copyLink" />
            </div>
          </UPageCard>

          <div class="flex items-center gap-3 text-xs font-semibold text-dimmed uppercase tracking-wide">
            <div class="h-px flex-1 bg-default" />
            {{ t('teach.hub.invite.or') }}
            <div class="h-px flex-1 bg-default" />
          </div>

          <UPageCard variant="subtle">
            <template #header>
              <span class="text-xs font-semibold text-dimmed uppercase tracking-wide">
                {{ t('teach.hub.invite.codeLabel') }}
              </span>
            </template>
            <div class="flex items-center gap-2">
              <UInput :model-value="classroom.accessCode" readonly class="w-full font-mono text-xs" />
              <UButton :label="t('teach.hub.invite.copyCode')" icon="lucide:hash" color="neutral" variant="outline" @click="copyCode" />
            </div>
          </UPageCard>
        </div>

        <div v-else class="flex flex-col gap-3">
          <UFileUpload v-model="csvFile" accept=".csv" variant="area" :label="t('teach.hub.invite.csv.dropLabel')" />
          <p v-if="parsed" class="text-sm text-muted">
            {{ t('teach.hub.invite.csv.preview', parsed.rows.length, { count: parsed.rows.length }) }}
          </p>
          <UButton
            v-if="parsed"
            :label="t('teach.hub.invite.csv.confirm')"
            color="primary"
            :disabled="!parsed.rows.length"
            @click="onConfirmImport"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end">
        <UButton :label="t('teach.hub.invite.done')" color="primary" @click="open = false" />
      </div>
    </template>
  </UModal>
</template>
