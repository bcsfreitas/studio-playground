// Fourteen portraits under `public/images/avatars/`, sourced from Unsplash
// (Unsplash License: free to use, no attribution required) and cropped to
// faces so they stay readable at 24px.
//
// They stand in for people who do not exist — every learner, mentor and
// testimonial author in this app is mock data. Swap these for real member
// photos before anything ships to actual users.
const AVATAR_COUNT = 14

// Assigned by hand rather than hashed. A hash collides, and two learners who
// sit next to each other in the same members list wearing the same face reads
// as a bug — so anyone who can appear alongside anyone else gets a distinct
// portrait. Faces repeat only across programs, which never share a screen.
const AVATAR_BY_NAME: Record<string, number> = {
  // Core: Threadbare — members, then its two mentors
  'Amara Diallo': 1,
  'Ravi Chandra': 2,
  'Nia Fitzgerald': 3,
  'Tomas Berg': 4,
  'Leila Haddad': 5,
  'Jonah Whitfield': 6,
  'Sana Qureshi': 7,
  'Carlos Medina': 8,
  'Ana Ibarra': 9,

  // Explore: Godot — members, then the mentors across its three instances
  'Sofia Marchetti': 10,
  'Desmond Cole': 11,
  'Hana Kimura': 12,
  'Owen Pryce': 13,
  'Zara Nkemdi': 14,
  'Felix Andersen': 1,
  'Priya Sundaram': 2,
  'Devon Ashby': 7,
  'Grace Halloran': 9,

  // Explore: Threadbare — members
  'Yuki Tanabe': 3,
  'Elena Rossi': 4,
  'Marcus Idowu': 5,
  'Ines Vargas': 6,

  // Program-level facilitators, used only where an instance names no mentor
  'Marisol Vega': 7,
  'Theo Okonkwo': 8,

  // The signed-in user. Listed here rather than left to the hash below so the
  // face is chosen, not drawn — she is in the top bar on every page, so a hash
  // collision would put her portrait next to itself somewhere. With only 14
  // portraits she cannot be unique against everyone, so she takes one of the
  // Explore: Godot members: those appear on a single tab, the furthest thing
  // from a global top bar.
  'Nova': 13
}

/**
 * Maps a person's name to one of the bundled portraits.
 *
 * Deterministic on purpose: the same name always resolves to the same face, so
 * a learner looks like themselves across the members list, the feed and their
 * project card. It also has to produce the same answer on the server and in
 * the browser — anything random here would be a hydration mismatch.
 *
 * Names outside the fixture set (a post written during the session, a mentor
 * added later) fall back to a stable hash rather than no portrait at all.
 */
export function avatarForName(name: string): string {
  let index = AVATAR_BY_NAME[name]

  if (!index) {
    let sum = 0
    for (let i = 0; i < name.length; i++) {
      sum = (sum * 31 + name.charCodeAt(i)) % 100003
    }
    index = (sum % AVATAR_COUNT) + 1
  }

  return `/images/avatars/avatar-${String(index).padStart(2, '0')}.jpg`
}
