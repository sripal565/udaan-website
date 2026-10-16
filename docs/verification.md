# Verification — UDAAN cinematic site

## Scope
New isolated static site in udaan-cinematic. Existing udaan-next, udaan-site, references, and approved original asset files remain untouched.

## Checks completed
- npm run check: all three JavaScript modules parse.
- npm test: five tests pass, covering window exit, aircraft entrance/recession/drawing transition, boarding-pass exit/footer reveal, overscroll bounds, and video crossfade boundary.
- Desktop browser at 1440 × 900: hero, expanded window, cloud editorial, rising aircraft, blueprint, experience accordion, globe and final contact scene visually inspected.
- Mobile browser at 390 × 844: hero framing, blueprint information, navigation and overflow checked. document scroll width does not exceed viewport width.
- Menu opens, native dialog traps focus, Escape closes it, focus returns to toggle, menu navigation closes dialog.
- Accordion switches panels and updates accessible expanded state and poster.
- Cloud media plays muted inline; two video elements crossfade over 1.5 seconds and reset the hidden decoder. Still image remains underneath if autoplay fails.
- Browser error log empty during checks.

## Review
A separate read-only reviewer found two P2 accessibility defects: opacity-hidden footer links remained focusable, and globe motion did not update with preference changes. Fixed by synchronizing footer inertness / CTA tab order with visibility and passing a live media-query object to the globe renderer.

## Practical limits
Reduced-motion CSS and live preference handling were source-reviewed; operating-system preference switching was not emulated in the browser tool. Contact links use the project-provided email. Event dates, registration links and team roster were not supplied and are not invented. Anurati is used in the private preview; its public website license is noted in assets/ATTRIBUTION.md.

Checkpoint: implementation and review complete; publish owner-private preview via Sites. No existing source or user work removed.

## Cloud-direction correction
Source frames show leftward drift through 5 seconds, a slowdown around 6 seconds, and rightward drift during 6–9 seconds. Exported only 0–5 seconds to cloud-forward-v2.mp4 using AVFoundation; exported duration verified as 5.0 seconds. Website now plays this segment at 0.7× speed, with a 0.8-source-second crossfade. The lower decoder remains opaque during the handoff to avoid a brightness dip. Original reference video remains untouched.
