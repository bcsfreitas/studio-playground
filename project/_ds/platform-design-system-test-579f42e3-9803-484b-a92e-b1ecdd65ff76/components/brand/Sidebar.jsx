/**
 * Sidebar — the Studio platform's full-height left navigation.
 *
 * Vendored from the Endless Studios design system (components/brand/Sidebar.jsx)
 * and adapted to register on the DS namespace so it mounts via <x-import
 * component-from-global-scope="EndlessStudiosDesignSystem_579f42.Sidebar">.
 * React is used from global scope (the DS bundle relies on it too).
 *
 * Brand header (orange infinity mark + "ENDLESS Studio" lockup), a scrollable
 * body of expandable groups (chevron toggles) and single leaf links, a
 * hairline divider, and a pinned footer with a Notifications row (count badge)
 * and an account switcher. Active rows tint orange over a light-orange pill;
 * rows lift to a muted grey on hover. Icons are inline (no runtime icon dep).
 */

const BRAND_ORANGE = '#FF6B00'

// Lucide-style outline paths (24×24, currentColor stroke, rounded caps).
const ICONS = {
  home: ['M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'],
  gamepad: ['M6 11h4', 'M8 9v4', 'M15 12h.01', 'M18 10h.01', 'M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z'],
  brain: ['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z', 'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z'],
  settings: ['M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  infinity: ['M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z'],
  bell: ['M10.268 21a2 2 0 0 0 3.464 0', 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'],
  chevronUp: ['m18 15-6-6-6 6'],
  chevronDown: ['m6 9 6 6 6-6'],
  chevronsUpDown: ['m7 15 5 5 5-5', 'm7 9 5-5 5 5'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
}

function Icon({ name, size = 22, strokeWidth = 1.75, style }) {
  const paths = ICONS[name] || []
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...style }} aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

function BrandMark({ size = 42 }) {
  return (
    <svg width={size} height={size * 18 / 45} viewBox="0 0 45 18" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M33.1649 4.20733C38.7602 4.20733 41.8212 6.4873 41.8212 9.89211C41.8212 13.2969 39.4268 15.491 33.5903 15.491C30.2495 15.491 26.2379 13.4965 22.2043 11.2321L20.2566 12.8658L20.2198 12.8969C24.7761 15.482 29.6998 18.0008 34.212 18.0008C38.9941 18.0008 44.9992 15.6742 44.9992 9.73012C44.9992 3.78602 38.6702 0 33.5175 0C21.3789 0 13.1644 14.5118 6.73638 14.5118C5.38338 14.5118 2.81889 14.0258 2.81889 11.2967C2.81889 8.56765 4.89911 7.37491 7.95195 7.37491C9.51764 7.37491 11.4277 8.10217 13.5587 9.17548L15.5522 7.49188C12.64 5.95882 9.92338 4.82007 7.68119 4.82007C1.22376 4.82007 0 9.27037 0 11.6747C0 14.079 1.52151 17.9632 6.78955 17.9632C17.1645 17.9632 23.4485 4.20652 33.1649 4.20652V4.20733Z" fill={BRAND_ORANGE} />
    </svg>
  )
}

const DEFAULT_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'play', label: 'Play', icon: 'gamepad', children: [
    { id: 'explore-games', label: 'Explore Games' },
    { id: 'my-games', label: 'My Games' },
  ] },
  { id: 'learn', label: 'Learn', icon: 'brain', children: [
    { id: 'my-programs', label: 'My Programs' },
    { id: 'resources', label: 'Resources' },
  ] },
  { id: 'contribute', label: 'Contribute', icon: 'infinity', external: true },
  { divider: true },
  { id: 'admin', label: 'Admin', icon: 'settings', children: [
    { id: 'admin-games', label: 'Games' },
    { id: 'admin-programs', label: 'Programs' },
    { id: 'admin-resources', label: 'Resources' },
    { id: 'intake-form', label: 'Intake Form' },
    { id: 'feed-console', label: 'Feed Console' },
    { id: 'users', label: 'Users' },
    { id: 'institutions', label: 'Institutions' },
    { id: 'events', label: 'Events' },
    { id: 'analytics', label: 'Analytics' },
  ] },
]

function NavRow({ icon, label, active, variant = 'parent', trailing, onClick }) {
  const [hover, setHover] = React.useState(false)
  const isChild = variant === 'child'
  let color
  if (active) color = 'var(--ui-primary, #ff6900)'
  else if (isChild) color = hover ? 'var(--ui-text-highlighted, #020618)' : 'var(--ui-text-muted, #45556c)'
  else color = 'var(--ui-text-highlighted, #020618)'
  const bg = active ? 'var(--color-orange-50, #fff7ed)' : (hover ? 'var(--ui-bg-muted, #f8fafc)' : 'transparent')
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', margin: 0,
        padding: isChild ? '8px 10px 8px 44px' : '9px 10px', border: 'none',
        background: bg, color, borderRadius: 'var(--radius-md, 12px)', cursor: 'pointer',
        fontFamily: 'inherit', transition: 'background .15s ease, color .15s ease',
      }}>
      {icon && <Icon name={icon} size={22} />}
      <span style={{
        flex: 1, fontSize: 15, lineHeight: '20px', fontWeight: isChild ? (active ? 600 : 400) : 700,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{label}</span>
      {trailing}
    </button>
  )
}

const dimmed = (node) => <span style={{ color: 'var(--ui-text-dimmed, #62748e)', display: 'flex', flexShrink: 0 }}>{node}</span>

function UserRow({ user, onClick }) {
  const [hover, setHover] = React.useState(false)
  const initials = (user.name || '?').trim().charAt(0).toUpperCase()
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '8px 10px', border: 'none',
        background: hover ? 'var(--ui-bg-muted, #f8fafc)' : 'transparent',
        borderRadius: 'var(--radius-md, 12px)', cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background .15s ease',
      }}>
      {user.avatar
        ? <img src={user.avatar} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        : <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ui-secondary, #6556f0)', color: '#fff', fontSize: 13, fontWeight: 700 }}>{initials}</span>}
      <span style={{ flex: 1, textAlign: 'left', fontSize: 15, fontWeight: 600, color: 'var(--ui-text-highlighted, #020618)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
      {dimmed(<Icon name="chevronsUpDown" size={18} />)}
    </button>
  )
}

function Sidebar({
  brandName = 'Studio',
  items = DEFAULT_ITEMS,
  activeId,
  user = { name: 'Indie7' },
  notifications = 0,
  notificationsActive = false,
  onNavigate = () => {},
  width = 260,
  style = {},
}) {
  const [open, setOpen] = React.useState(() => {
    const o = {}
    items.forEach(it => { if (it.children) o[it.id] = true })
    return o
  })
  const toggle = id => setOpen(s => ({ ...s, [id]: !s[id] }))
  const rule = { height: 1, background: 'var(--ui-border-muted, #e2e8f0)', margin: '12px 10px', flexShrink: 0 }

  return (
    <nav style={{
      width, minWidth: width, height: '100%', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', background: 'var(--ui-bg, #fff)',
      borderRight: '1px solid var(--ui-border, #dcdce9)',
      fontFamily: 'var(--font-sans, Inter, sans-serif)', color: 'var(--ui-text, #1d293d)',
      padding: '22px 14px 16px', ...style,
    }}>
      {/* brand header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 26 }}>
        <BrandMark size={42} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.04, fontFamily: 'var(--font-heading, Figtree, sans-serif)', color: 'var(--ui-text-highlighted, #020618)' }}>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '.045em' }}>ENDLESS</span>
          <span style={{ fontWeight: 400, fontSize: 19, letterSpacing: '-.01em' }}>{brandName}</span>
        </div>
      </div>

      {/* scrollable nav body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it, idx) => {
          if (it.divider) return <div key={'d' + idx} style={rule} />
          if (it.children) {
            const isOpen = open[it.id]
            return (
              <div key={it.id} style={{ marginBottom: 4 }}>
                <NavRow icon={it.icon} label={it.label} variant="parent" active={activeId === it.id}
                  trailing={dimmed(<Icon name={isOpen ? 'chevronUp' : 'chevronDown'} size={18} strokeWidth={2} />)}
                  onClick={() => toggle(it.id)} />
                {isOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    {it.children.map(ch => (
                      <NavRow key={ch.id} label={ch.label} variant="child" active={activeId === ch.id} onClick={() => onNavigate(ch.id)} />
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <NavRow key={it.id} icon={it.icon} label={it.label} variant="parent" active={activeId === it.id}
              trailing={it.external ? dimmed(<Icon name="external" size={18} />) : null}
              onClick={() => onNavigate(it.id)} />
          )
        })}
      </div>

      {/* pinned footer */}
      <div style={{ flexShrink: 0, marginTop: 8 }}>
        <NavRow icon="bell" label="Notifications" variant="parent" active={notificationsActive}
          trailing={notifications > 0 ? (
            <span style={{ minWidth: 22, textAlign: 'center', padding: '1px 7px', fontSize: 12, fontWeight: 600, color: 'var(--ui-text-muted, #45556c)', background: 'var(--ui-bg, #fff)', border: '1px solid var(--ui-border, #dcdce9)', borderRadius: 999, flexShrink: 0 }}>{notifications}</span>
          ) : null}
          onClick={() => onNavigate('notifications')} />
        <div style={rule} />
        <UserRow user={user} onClick={() => onNavigate('account')} />
      </div>
    </nav>
  )
}

window.EndlessStudiosDesignSystem_579f42 = window.EndlessStudiosDesignSystem_579f42 || {}
window.EndlessStudiosDesignSystem_579f42.Sidebar = Sidebar
window.Sidebar = Sidebar
