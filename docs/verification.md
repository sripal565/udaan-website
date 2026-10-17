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

## Replacement with new_cloud.mp4
The user supplied assets/approval-batch-01/new_cloud.mp4. Decoded 21 frames over 0–9.95 seconds. Cloud-patch displacement remains leftward in all 20 sampled intervals, unlike the old source's reversal. Full ten-second video copied to dist/assets/cloud-drift-v3.mp4, now played at 0.5× speed with the existing 0.8-source-second crossfade. Original supplied file preserved. Finder metadata excluded from future source uploads; existing .DS_Store left untouched.

## Native frame cadence and vector arrows
Inspected original and deployed video metadata: both 1280×720, 24 fps, ~2.21 Mbps. SHA-256 hashes match, proving the site did not transcode or lower the supplied file resolution. Previous 0.5× playback reduced unique frame cadence to ~12 fps; corrected to 1×. Removed the extra 1.04 CSS enlargement. Source remains 720p and will remain soft on large/high-density displays until replaced by a higher-resolution source. Replaced all diagonal/up/down arrow characters with aria-hidden inline SVG strokes, including the mobile CTA.

## Approved perspective effect integrated into the site
Replaced both cloud video elements with the single approved cloud-perspective.png and a WebGL canvas. dist/clouds.js applies the exact preview depth field: horizon 0.43, depth exponent 1.65, strength 0.7, subtle lateral drift and outward expansion. Motion advances for at most 45 visible seconds and holds its final frame. It does not reverse, loop, or crossfade. No video elements remain in the document. Old media files remain archived but are not requested by the page.

Renderer pauses offscreen and while the document is hidden. Reduced-motion users see the original still; unsupported/lost WebGL also falls back to that still. Resizing measures the visible cloud-media container so a display:none canvas cannot create a 1×1 buffer during preference changes. The opt-back-in path explicitly resizes before resuming.

Verification: timing tests first failed because advanceCloudTime was missing, then passed after implementation. Seven current tests pass; obsolete video-loop tests and helper removed. All four JS modules pass syntax checks. Browser checked desktop and 390×844 mobile: canvas ready, original source loaded, zero video elements, no horizontal overflow, no browser errors. A separate reviewer identified the reduced-motion resize issue; it was fixed before publication. OS-level preference switching was not emulated by the browser tool; its lifecycle paths were reviewed directly.

Checkpoint: approved effect implemented, reviewed and verified; publish owner-private update to the existing Site.

## Continuous, visibly moving cloud correction
User reported no visible motion on both the study and site. Removed the 45-second endpoint and raised foreground drift to 0.004 source-image widths per second, scaled continuously by depth. The sky/horizon remain anchored. Outward expansion settles after 20 seconds instead of growing indefinitely, while sideways drift continues. Texture coordinates wrap horizontally using the approved image. Added a CSS panorama fallback for devices where WebGL fails; reduced-motion preferences still show a still image.

Added v6 cache keys for the entry script, stylesheet, cloud module and shared motion module so browsers cannot reuse the older capped clock. Canvas exposes data-renderer and data-motion-time for direct runtime diagnosis. Updated timing regression first failed at the former 45-second cap, then passed for advancing beyond 45 and 120 seconds. Seven tests and four-module syntax checks pass.

Continuous-motion browser proof: isolated fixed-camera tab at scrollY=0, sampled at 13.63 and 38.28 seconds. Anchored-sky region mean RGB difference was 0.0; foreground region mean RGB difference was 26.447/255. A later sample still reported active WebGL motion time 64.93 seconds, with zero browser errors. Earlier captures taken during page scrolling were excluded from this comparison.
