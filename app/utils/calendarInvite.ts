/**
 * A downloadable calendar invite, built in the browser. There's no backend to
 * serve an .ics from, and a mailto/Google-Calendar link would leave the learner
 * outside the app — a Blob download works offline and in any calendar client.
 */

// All-day events use date-only values (VALUE=DATE) with an exclusive DTEND, so
// a session running Aug 4 → Aug 22 ends on the 23rd in the file.
function toIcsDate(isoDate: string): string {
  return isoDate.replaceAll('-', '')
}

function dayAfter(isoDate: string): string {
  const next = new Date(`${isoDate}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + 1)
  return toIcsDate(next.toISOString().slice(0, 10))
}

// Commas, semicolons and backslashes are field separators in iCalendar text,
// so a program title containing one has to arrive escaped.
function escapeText(value: string): string {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
}

export interface CalendarInvite {
  uid: string
  title: string
  description?: string
  url?: string
  startDate: string
  endDate: string
}

export function buildIcs(invite: CalendarInvite, stampedAt = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Endless Studios//Studio//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${invite.uid}`,
    // Required by RFC 5545; some clients drop the event without it.
    `DTSTAMP:${stampedAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${toIcsDate(invite.startDate)}`,
    `DTEND;VALUE=DATE:${dayAfter(invite.endDate)}`,
    `SUMMARY:${escapeText(invite.title)}`
  ]

  if (invite.description) lines.push(`DESCRIPTION:${escapeText(invite.description)}`)
  if (invite.url) lines.push(`URL:${escapeText(invite.url)}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return `${lines.join('\r\n')}\r\n`
}

export function downloadIcs(invite: CalendarInvite, fileName: string): void {
  const blob = new Blob([buildIcs(invite)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName.endsWith('.ics') ? fileName : `${fileName}.ics`
  link.click()

  URL.revokeObjectURL(url)
}
