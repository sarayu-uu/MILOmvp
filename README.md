# Milo - a little world of wonder

Frontend-only storybook play prototype built with React, TypeScript, Vite and Tailwind CSS. All illustrations of Milo and the world are original SVG artwork. No accounts, backend, APIs, or database.

## Run

```sh
npm install
npm run dev
```

Build with `npm run build`, then `npm run preview`. Run `npm run lint` for static checks.

## Explore

Tap the forest path for a continuous illustrated journey with Milo, five woodland animals, and the hidden Story Tree. The original plant and bridge adventure remains available in grown-up settings. Tap the cottage for care interactions. The small settings icon opens the grown-up corner, optional activities, difficulty setting, local session summary and restart.

Drag activities also support tapping an object and then its destination, including on touchscreens. Narration uses the browser's available speech synthesis voice; sound playback requires a user gesture. Former sound-guessing activities use visual animal pictures. Text always remains available. Reduced motion is respected.

Session notes persist only in this browser's localStorage. Restart clears the current session. Fonts use Google Fonts with a local sans-serif fallback; gameplay has no network dependency once loaded. Optional activity objects currently use platform emoji, so their appearance varies by device. Narration and listening sounds are prototype audio, not studio recordings. There is no microphone, camera, or motion tracking.

## Browser smoke check

Start a production preview at port 4173, then run `node smoke.mjs`. The script uses installed Microsoft Edge through Playwright, completes the core adventure, checks browser errors and mobile overflow, and saves desktop and mobile screenshots. Session duration is observed, not enforced; validate actual pacing with children.

Picnic recall is child-paced: tap Ready to hide the food. Both settings recall all three foods: any order in the younger setting, original order in the harder setting. The activity completes only after three distinct correct selections. Look again resets both the blanket and its instruction. Run `node picnic-smoke.mjs` after building for the targeted regression check; it starts and stops its own preview server. Storytelling can be shared with a person or imagined quietly; Milo does not listen to speech or respond to it.
## Interactive home

The cottage and Home icon open a separate cutaway dollhouse. Tap a room or its objects to zoom in; Back returns to the whole house. On narrow screens, the whole house scales to fit without sideways scrolling. Tap a room to see its objects up close. Zoomed rooms disable browser panning so touch dragging remains reliable.

The five priority interactions are built into the illustrated rooms:

- Toy chest: drag five toys into the box, revealing Milo's boots.
- Kitchen counter: drag three or four individual berries to the plate, or five or six fruits in the harder setting. The current target appears in Milo’s instruction.
- Plant: inspect the dry soil, then drag the watering can over it. Later visits reveal a new leaf and a flower.
- Wardrobe: notice the rainy window, open the doors, and drag a raincoat onto Milo. The boots lead naturally to the play corner.
- Bed: drag the four routine objects onto the quilt in order, then watch teeth brushing, pajamas, a story, and sleep. The home darkens.

The existing Milo component is unchanged; clothing is a separate SVG accessory layer. Toys, food, clothing, plant growth, and bedtime persist in `milo-home-v1` in localStorage. The grown-up Restart session control resets both the home and session notes. The illustrated picnic basket still opens the three-food memory activity, and the bookshelf opens the three-book Story Tree library with a route back home. The round ball offers a varied real-world finding mission. Bathroom and laundry artwork are scenery for this first home release, not additional finished activities.

Pointer dragging supports mouse, pen, and touch. Keyboard users can focus an object, press Enter to pick it up, move it with arrow keys, and press Enter to drop; Escape cancels. Room views change immediately; decorative motion is disabled.

After `npm run build`, run `node home-smoke.mjs` to check all five interactions, invalid drops, keyboard and real touch input, both counting difficulties, persistence, restart, and mobile layout. This check starts and stops its own preview server. `node home-visual.mjs` captures the home and zoomed rooms for visual review.

## Forest world

An original layered SVG landscape follows a winding path from the entrance to the Story Tree. Milo and the camera now switch immediately between path stops, using static pictures without animation. Visited animals retain small environmental changes; the nest and Forest Star reveal late in the journey. Text and optional narration guide the transitions. Five playable encounters now gate story progress: Frog demonstrates jumps and an alternating number pattern; Bear stretches and climbs three reachable branches in sequence; Baby Snake predicts, imitates and invents movements; Squirrel recalls two then three hidden acorns; Owl helps children find animal pictures, ending with the bird and its feather clue. Incorrect attempts provide gentle clues without penalties. Physical play uses a Done button and can be performed with hands or while seated. Owl uses visual clues; narration is optional. Rabbit and Fox are not added.

Progress and dialogue position persist in `milo-forest-world-v1`. Revisit earlier animals by tapping them or using Back. Restart session clears forest progress alongside home and session notes. Milo uses the existing unchanged character component. Forest animations and transitions are disabled for this version.

After building, run `node forest-smoke.mjs` to check continuous travel, backtracking, persistence, final reveal, restart, reduced motion, and responsive layouts. It starts and stops its own preview server.

Run `node forest-activities-smoke.mjs` after building for the animal activity regression checks, including retries, sequential progression, memory rounds, audio/mute, keyboard controls, mobile layouts, saved completion, and migration of old preview saves. Activity completion persists; leaving an unfinished encounter restarts that encounter on return. Old preview visits do not count as completed activities.

## Static pictures and responsive narration

Frog uses ground / air / landing pictures linked by a dotted jump path. Bear asks children to stretch, tap Done, then select reachable branches in order; branch selections update the picture immediately. Full-scene procedural filters have been disabled to reduce rendering work. Narration is scheduled after two animation frames and a task boundary so the UI can paint first; newer requests replace pending speech. `node forest-responsiveness-smoke.mjs` checks paint-before-speech ordering with a speech test double, rapid clicks, and the absence of active animations. Native speech still depends on the browser and installed voice.

## Fresh activity variations

Activity entry and explicit replay create a fresh configuration. Counts, alternating patterns, answer positions, hiding places, illustrated branch layouts, sound order, object locations, story props, color sequences and finding prompts vary. Each configuration stays fixed during an attempt, including retries and Look again. Picnic keeps the same three familiar foods, with shuffled order and choices. Owl keeps the bird last so its feather clue still leads to the nest. Story chronology and sensible care routines remain coherent; their choices shuffle.

Completed forest encounters offer Play with the animal again. Completed home tasks offer Play again, resetting only that task and keeping the rest of the home progress. No animations or extra rendering loops were introduced. Variation history is stored locally to reduce immediate repeats; no online service is needed.

## Images

All project image files are collected in `images/`, including screenshots and image assets. Browser check scripts save new screenshots there. The favicon is referenced from this folder and bundled by Vite.

## Milo voice

`src/audio/MiloVoice.ts` owns all narration through the existing `narrate` facade. Voice selection prefers gentle English voices such as Aria, Jenny, Sonia, Samantha and Zira, with pitch 1.3, rate 1.05 and volume 0.9. Browsers provide no reliable age or softness metadata; the exact sound depends on installed voices. The service waits briefly for asynchronous voice loading and avoids identified adult-male and non-English defaults. If no suitable English voice is available, dialogue stays readable instead of using an unsuitable default.

To add recordings, place files in `public/audio/milo/` and add `{ src: '/audio/milo/filename.mp3', text: 'Exact spoken transcript' }` entries in `src/audio/miloAudioFiles.ts`. IDs include `milo.forest.frog.intro`, `milo.forest.bear.intro`, `milo.correct`, `milo.tryAgain`, and `milo.clueFound`. Forest dialogue uses chapter/line IDs; other lines receive deterministic text IDs. For randomized dialogue or shared IDs, only an exact transcript match plays the recording. Unmapped lines, transcript mismatches, failed files, rejected playback, and load timeouts fall back to TTS. No recordings are bundled yet.

New requests stop previous audio and replace queued speech. Effect cleanup cannot cancel a newer line, and narration still starts after the UI has painted. Run `node milo-voice-test.mjs` for service checks and `node forest-responsiveness-smoke.mjs` for browser paint-order checks.

## Story Tree library

Tap the Story Tree or the home bookshelf to choose one of three illustrated books resting in the roots. Moon is a nighttime mystery with star recall, firefly patterns, animal pictures, prediction and a path for returning moonlight. Bird follows remembered habitat clues through stones, landmark sequences and playful wing movements to a family nest. Cloud combines cause and effect, draggable raindrops, wind movements, observation and imaginative cloud shapes.

Opening a book creates fresh challenges: star locations, pattern types, sounds, flower colors, landmark routes, answer locations, movement order, quantities, cloud shapes and opening dialogue vary. Clues stay consistent throughout that reading, including retries. Closing and reopening starts a fresh reading. All books remain available; finished stories leave a moon, feather or rainbow keepsake saved in `milo-story-library-v1`. Restart session clears these keepsakes.

Scenes wait for the child. Narration uses the central MiloVoice service and can be replayed; every game can be played without it. Movement is self-reported with Done, and raindrops support touch/mouse dragging, tapping and keyboard selection. The harder setting gives fewer drops than flowers and lets the child request the missing drops. A brief book-opening transition respects reduced motion; scene changes remain immediate. The intended 5?10 minute reading time depends on the child and still needs family playtesting.

After building, run `node story-smoke.mjs` for complete desktop/mobile story playthroughs, touch dragging, stable retry clues, harder counting, endings and persisted keepsakes. It starts and stops its own preview server and saves screenshots in `images/`.

## Pond (ages 3?5)

A small illustrated pond on the homepage opens four areas: Color fish, Frog lily pads, Letter bubbles and Shape shells. These are the only Pond activities. Prompts, fish arrangements, frog quantities (1?5), letters and shapes vary on replay. A wrong choice keeps the same challenge and offers a gentle clue. Children tap each frog once to count; the number appears beside it, with optional spoken counting. Color, letter and shape prompts include visual examples so reading or hearing narration is not required. Targets stay still for easy tapping.

The homepage includes the Play Together message. Existing House, Forest and Story Tree artwork and the original Milo character are preserved. Selected movement and place-selection instructions are shorter. Sound guessing in Owl, the Moon story and the optional bushes game is replaced with emoji animal matching; none requires audio playback. No new backend, accounts, scores, rewards or parent systems are introduced.

After building, `node pond-smoke.mjs` checks all four activities and replays, gentle retries, counting, keyboard and touch input, return navigation and four screen sizes. It also disables the Web Audio API to check the games do not rely on sound effects. Screenshots are saved in `images/`.
