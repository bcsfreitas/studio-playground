# Certificate section redesign

## Problem

`ProgramCertificateShowcase.vue` currently renders a single card (icon, certificate name, issuing org, Share/Download buttons) plus a row of microcredential badges. It reads flat, and the Share/Download buttons assume the learner already earned the certificate — which contradicts the section's own title (`program.sections.certificate` = "What you'll earn") for anyone not yet enrolled.

## Design

Reference: a Uxcel screenshot showing a certificate mockup on the left and a benefits checklist on the right (image provided by the user, not stored in-repo).

**Layout** — two columns, stacking to one on mobile: a certificate mockup card on the left, a 3-item benefits checklist on the right.

**Mockup card (left)** — eyebrow label "CERTIFICATE" (uppercase, `text-xs`, `text-dimmed`), a seal icon (`lucide:award`), `certificate.name` as the title, `certificate.issuingOrg` as the subtitle, framed with a dashed inner border to read as an actual certificate. No progress bar, no "issued to" line (no per-program learner data exists for that), no CTA — enrollment is already owned by `ProgramEnrollmentCard`.

**Checklist (right)** — 3 bullets, each a colored checkmark icon + bold lead-in + one line of body copy, new i18n strings (not copied from the reference):
1. **Validate your skills** — earn a credential from `{issuingOrg}` showing exactly what you built in this program.
2. **Yours to keep** — once earned, it never expires and stays on your learner profile.
3. **Share it anywhere** — add it to a resume, portfolio, or LinkedIn.

**Below both columns** — keep the existing microcredential badges row unchanged (`certificate.microcredentials`), shown only when present.

**Dropped** — the Share/Download buttons and their i18n keys (`program.certificate.shareButton`, `program.certificate.downloadButton`) — promotional framing only, nothing to share/download yet.

## Out of scope

- Any change to the `ProgramCertificate`/`Microcredential` data model — `issuingOrg` is the only field the new copy depends on, and it already exists.
- Personalizing the mockup with a learner's name.
