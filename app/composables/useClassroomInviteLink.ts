import type { MentorClassroom } from '~/composables/useProgramMockData'

/**
 * Shared by every surface that shows a classroom's invite link (the Settings
 * tab and the invite modal) — was duplicated byte-for-byte between them
 * before this composable existed. `/teach/join/[code]` doesn't exist yet —
 * there's no join flow to build yet, so this link is a display/copy
 * affordance for the mentor, not a working destination.
 */
export function useClassroomInviteLink(
  classroom: MentorClassroom | Ref<MentorClassroom>,
  messages: { copied: string, copyFailed: string }
) {
  const { t } = useI18n()
  const toast = useToast()

  const resolved = computed(() => (isRef(classroom) ? classroom.value : classroom))
  const inviteLink = computed(() => `${useRequestURL().origin}/teach/join/${resolved.value.accessCode}`)

  async function copyLink() {
    try {
      if (import.meta.client) await navigator.clipboard.writeText(inviteLink.value)
      toast.add({ title: t(messages.copied), color: 'success' })
    } catch {
      // Clipboard access can be denied outside a user gesture the browser
      // recognizes, or by permissions policy — the mentor still has the link
      // visible in the field above, so this is a soft failure, not a dead end.
      toast.add({ title: t(messages.copyFailed), color: 'error' })
    }
  }

  return { inviteLink, copyLink }
}
