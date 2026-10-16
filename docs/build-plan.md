# UDAAN cinematic site — approved design and implementation plan

User approved the design, generated asset direction, cloud loop treatment, and immediate website build in this conversation. Execute inline; preserve the two existing prototypes and all original references. This independent new directory has no Git history and does not overlap pre-existing source files.

## Design
Recreate the Jesko reference's sequence with UDAAN colors: #260E46, #3A0681, #CCC1EF, #D6D5D7. Upright Caviar typography, short geometric display marks. Hero window zooms into moving clouds, introduction reveals over clouds, pale aircraft sequence rises and recedes into a blueprint, expandable experience rows, dark closing globe. Fixed navigation and floating CTA. Do not publish unconfirmed dates, counts, ticket availability, or team roster.

## Plan
1. Prepare assets and typography. Preserve originals. Use code-native clipping masks to composite the approved images with clean silhouettes. Retain font attribution. Copy supplied cloud video; crossfade two video elements to hide reset.
2. Implement semantic static HTML sections and responsive CSS. Header anchors, accessible menu overlay, three working accordion rows, contact CTA, reduced-motion layout, keyboard focus and mobile touch targets.
3. Implement scroll-distance-driven camera timelines: window expansion over two viewport heights; cloud editorial reveal; aircraft upward entrance, scale reduction, blueprint transition. Animation uses requestAnimationFrame and CSS transforms/opacity, no scroll blocking. Pointer response is subtle and disabled on touch/reduced motion.
4. Implement canvas globe using Natural Earth land outlines; routes converge on Urbana-Champaign. Avoid implying actual participating teams.
5. Verify: JavaScript syntax, resource/link validation, desktop screenshots for hero and every sequence, mobile overflow and navigation, accordion and keyboard behavior, video boundary crossfade, reduced-motion path. Fix observed issues before completion. Publish private via Sites if available; preserve exact returned Site identity.

## Evidence and exceptions
Visual implementation has no useful pre-existing automated test baseline. Red exception: original prototypes lack the approved window/cloud choreography. Alternative proof: live browser checks at explicit scroll positions, interaction checks, resource requests, screenshots, and JS syntax validation.

## Review focus
- Small screens must retain readable copy and unclipped CTAs.
- Reduced motion must reveal content and avoid video playback.
- Failed autoplay must retain a still background.
- Quick scrolls and resize must not strand sections in invisible states.
- Menu must close on Escape and return keyboard focus.

Next: implement assets and page, then browser verification and review.
