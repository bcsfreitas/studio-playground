# Animation & Micro-interaction Guidelines

The motion playbook for the Endless Studios design system. Apply when adding
animation, transitions, micro-interactions, motion design, hover effects, or
making the UI feel more alive. The motion tokens in `tokens/motion.css`
implement these rules — reach for those vars rather than ad-hoc values.

## Principles
- **Animate with purpose.** Every animation needs a reason: feedback, smoothing a
  transition, clarifying a relationship, directing attention, or delight. No
  decoration for its own sake.
- **One hero moment beats scattered motion everywhere.** Pick the ONE signature
  animation per surface; layer feedback / transition / delight beneath it.
- **Motion is the accent.** On this brand the playful energy comes mostly from
  color + shape; motion supports it, never dominates.

## Timing
| Purpose | Duration | Token |
|---|---|---|
| Instant feedback (press, toggle) | 120ms | `--es-dur-1` |
| State changes (hover, menu open) | 200ms | `--es-dur-2` |
| Layout changes (accordion, modal, card lift) | 320ms | `--es-dur-3` |
| Entrances (page/content reveal) | 500ms | `--es-dur-4` |
| Exits | ~75% of enter (150ms) | `--es-dur-exit` |

## Easing — confident deceleration only
```
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);   /* smooth, refined */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);  /* slightly snappier */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);   /* confident, decisive */
```
Semantic aliases: `--es-ease` (state change) · `--es-ease-out` (entrance/settle)
· `--es-ease-snappy` (press recoil).

**Never** use bounce `cubic-bezier(0.34,1.56,0.64,1)` or elastic
`cubic-bezier(0.68,-0.6,0.32,1.6)` — they feel dated and draw attention to the
animation itself.

## Layers to consider
- **Entrance:** stagger reveals (100–150ms delays), fade + slide; one dramatic hero entrance; scroll-triggered reveals via IntersectionObserver.
- **Micro-interactions:** button hover (scale 1.02–1.05 / color / shadow) and press (scale 0.95→1); input focus (border + glow); validation (`.es-anim-shake` on error, check on success); toggles (slide + color); like/favorite (scale + color).
- **State transitions:** show/hide fade+slide; expand/collapse height + icon rotate; skeletons; success/error color + icon.
- **Navigation:** route crossfade, tab indicator slide, carousel snap, sticky-header state, scroll progress.
- **Delight:** empty-state float, completion flourish/confetti, contextual touches — used sparingly.

## Technical rules
- **GPU only:** animate `transform` and `opacity`. Never animate layout props
  (`width`, `height`, `top`, `left`) — use `transform`.
- `will-change` sparingly, only for known-expensive animations.
- Target 60fps on the slowest supported device. Durations over 500ms for
  feedback feel laggy.
- Don't block interaction during animation unless intentional.

## Accessibility (required)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Quality checklist
Smooth at 60fps · easing feels organic · timing not too fast/slow · reduced-motion
works · doesn't block interaction · adds clarity or delight. Great animation is
invisible — it just makes everything feel right.
