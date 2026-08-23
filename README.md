# Tianyu Han — NASA/SpaceX-style Academic Website

Complete static GitHub Pages website.

## Structure
- `index.html` — homepage
- `research.html` — research page
- `publications.html` — compact academic publication list
- `papers/` — individual paper pages
- `assets/site.css` — full visual design and animated universe
- `assets/site.js` — subtle pointer parallax
- `assets/profile.svg` — temporary portrait image

## Replace the portrait
Put your portrait in `assets/`, e.g. `assets/profile.jpg`, then change this line in `index.html`:

`<img class="portrait" src="assets/profile.svg" alt="Portrait of Tianyu Han">`

to:

`<img class="portrait" src="assets/profile.jpg" alt="Portrait of Tianyu Han">`

## GitHub Pages
Upload the CONTENTS of this folder to the repository root.
`index.html` must remain directly in the repository root.

No npm, React, build tools, or backend are required.


## Animated universe background

The final version now uses `assets/space.js`, which renders a real full-screen HTML5 Canvas animation:
- moving star field
- drifting nebulae
- animated planet and rings
- occasional shooting stars

This is intentionally much more visible than the previous subtle CSS-only animation.
