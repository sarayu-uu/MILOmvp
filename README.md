# Milo - a little world of wonder

Frontend-only storybook play prototype built with React, TypeScript, Vite and Tailwind CSS. All illustrations of Milo and the world are original SVG artwork. No accounts, backend, APIs, or database.

## Run

```sh
npm install
npm run dev
```

Build with `npm run build`, then `npm run preview`. Run `npm run lint` for static checks.

## Explore

Tap the forest path for the main adventure: plant clues, pattern bridge and flower transfer, a real-world soft-object mission, a predictive story, story sequencing, and bedtime. Tap the cottage for care interactions. The small settings icon opens the grown-up corner, optional activities, difficulty setting, local session summary and restart.

Drag activities also support tapping an object and then its destination, including on touchscreens. Narration uses the browser's available speech synthesis voice; sound playback requires a user gesture. The listening activity uses a synthesized bird chirp. Text always remains available. Reduced motion is respected.

Session notes persist only in this browser's localStorage. Restart clears the current session. Fonts use Google Fonts with a local sans-serif fallback; gameplay has no network dependency once loaded. Optional activity objects currently use platform emoji, so their appearance varies by device. Narration and listening sounds are prototype audio, not studio recordings. There is no microphone, camera, or motion tracking.

## Browser smoke check

Start a production preview at port 4173, then run `node smoke.mjs`. The script uses installed Microsoft Edge through Playwright, completes the core adventure, checks browser errors and mobile overflow, and saves desktop and mobile screenshots. Session duration is observed, not enforced; validate actual pacing with children.

Picnic recall is child-paced: tap Ready to hide the food. Both settings recall all three foods: any order in the younger setting, original order in the harder setting. The activity completes only after three distinct correct selections. Look again resets both the blanket and its instruction. Run `node picnic-smoke.mjs` after building for the targeted regression check; it starts and stops its own preview server. Storytelling can be shared with a person or imagined quietly; Milo does not listen to speech or respond to it.
## Interactive home

The cottage and Home icon open a separate cutaway dollhouse. Tap a room or its objects to zoom in; Back returns to the whole house. On narrow screens, swipe the whole house sideways. Zoomed rooms disable browser panning so touch dragging remains reliable.

The five priority interactions are built into the illustrated rooms:

- Toy chest: drag five toys into the box, revealing Milo's boots.
- Kitchen counter: drag exactly four individual berries to the plate, or any combination of five fruits in the harder setting.
- Plant: inspect the dry soil, then drag the watering can over it. Later visits reveal a new leaf and a flower.
- Wardrobe: notice the rainy window, open the doors, and drag a raincoat onto Milo. The boots lead naturally to the play corner.
- Bed: drag the four routine objects onto the quilt in order, then watch teeth brushing, pajamas, a story, and sleep. The home darkens.

The existing Milo component is unchanged; clothing is a separate SVG accessory layer. Toys, food, clothing, plant growth, and bedtime persist in `milo-home-v1` in localStorage. The grown-up Restart session control resets both the home and session notes. The illustrated picnic basket still opens the three-food memory activity, and the bookshelf opens the existing story with a route back home. The round ball offers a short real-world mission. Bathroom and laundry artwork are scenery for this first home release, not additional finished activities.

Pointer dragging supports mouse, pen, and touch. Keyboard users can focus an object, press Enter to pick it up, move it with arrow keys, and press Enter to drop; Escape cancels. Reduced-motion preferences skip camera animation and decorative motion.

After `npm run build`, run `node home-smoke.mjs` to check all five interactions, invalid drops, keyboard and real touch input, both counting difficulties, persistence, restart, and mobile layout. This check starts and stops its own preview server. `node home-visual.mjs` captures the home and zoomed rooms for visual review.
