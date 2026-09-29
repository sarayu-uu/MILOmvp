/**
 * Approved story scripts and future activity plans.
 * The forest environment uses selected dialogue through forestJourney.ts.
 * Activity plans are reference data; playable encounters live in AnimalActivity.tsx.
 */
type Speaker = 'milo' | 'frog' | 'bear' | 'baby-snake' | 'squirrel' | 'owl' | 'baby-bird'
type ChapterId = 'entrance' | 'frog' | 'bear' | 'baby-snake' | 'squirrel' | 'owl' | 'discovery' | 'ending'
type ClueId = 'empty-cradle' | 'puddle-dust' | 'branch-smear' | 'rolling-groove' | 'oak-takeoff' | 'feather' | 'bird-explanation'
type ActivityId = 'frog-movement' | 'bear-reach' | 'bear-branches' | 'snake-movement' | 'snake-pattern' | 'snake-imagination' | 'squirrel-memory' | 'owl-sounds' | 'owl-deduction' | 'two-lights'
type SoundId = 'leaves' | 'wings' | 'water'
type Line = { speaker: Speaker; text: string }
type Beat =
  | { kind: 'dialogue'; lines: Line[] }
  | { kind: 'action'; direction: string }
  | { kind: 'activity'; activityId: ActivityId }
  | { kind: 'clue'; clueId: ClueId }
  | { kind: 'travel'; destination: string; line: Line }

type PlannedStep = {
  id: string
  mode: 'movement' | 'choice' | 'memory' | 'listen' | 'imagine'
  prompt: Line
  staging: string
  options?: { id: string; label: string; gentleResponse?: string }[]
  expected?: string | string[]
  completion: string
  alternative?: string
}
type ActivityPlan = {
  id: ActivityId
  storyPurpose: string
  steps: PlannedStep[]
  worldChange: string
  assistance: { first: string; next: string; showMe: string }
  continuation: string
}
type Chapter = {
  id: ChapterId
  title: string
  place: string
  light: 'late-afternoon' | 'softening-daylight' | 'early-dusk' | 'sunset'
  personality: string
  problem: string
  mysteryAdvance: string
  beats: Beat[]
  continuity: { requires: string[]; establishes: string[] }
  next: ChapterId | null
}

export const forestAdventure = {
  id: 'milo-and-the-missing-forest-star',
  version: 1,
  status: 'story-design-only',
  title: 'Milo and the Missing Forest Star',
  premise: 'The light that guides everyone to the Story Tree is missing. Milo follows its trail and discovers that a little bird needs a light too.',
  plannedMinutes: { min: 15, max: 25, note: 'A playtest hypothesis, not an enforced session length.' },
  chapterOrder: ['entrance', 'frog', 'bear', 'baby-snake', 'squirrel', 'owl', 'discovery', 'ending'] satisfies ChapterId[],
  movementPolicy: {
    input: 'Explicit Done control; never infer movement from a camera or microphone.',
    demonstration: 'One slow demonstration for the current invitation, then hold still and wait.',
    alternative: 'Seated movements or finger/hand play count as participation.',
    space: 'Invite the child to find a little clear space; jumps stay comfortably in place.',
    skip: 'Let Milo try with the animal. The story and clue still continue.',
  },
  presentation: {
    character: 'Reuse the exact existing Milo component. No new character design.',
    reference: 'Use the provided image only to imagine bends and landmarks along one continuous path. No asset import or forest redesign.',
    dialogue: 'One brief line at a time, matching text and optional narration, with replay.',
    attention: 'One current action or clue; unrelated characters wait quietly.',
    feedback: 'The world changes. No points, coins, confetti, buzzers or timed pressure.',
    speech: 'No spoken commands, microphone, recognition, or claim that Milo hears the child.',
  },
  geography: {
    startingLandmark: 'The Story Tree and its low Star cradle sit beside the forest entrance.',
    path: ['Story Tree clearing', 'muddy puddles', 'tall trees', 'winding roots', 'big oak', 'old hollow tree', 'sheltered nest', 'return bend to the Story Tree'],
    distinction: 'The big oak, old hollow tree and Story Tree are separate landmarks.',
    return: 'A gentle loop brings Milo back; the ending does not require replaying every activity.',
  },
  authorOnlyTruth: [
    'A gust rocks the cradle. The small seed-like Forest Star falls out.',
    'It bounces beside the puddles and brushes a low twig beside Bear.',
    'It rolls past Baby Snake, down the winding trail, and stops beside the oak.',
    'A young bird able to make short flights finds it and carries it to a dark nest.',
    'Squirrel hears the takeoff. Owl hears the wingbeats passing the hollow tree.',
    'The bird thinks it found a lost glowing seed, not a light the whole forest needs.',
    'The bird willingly returns the Star when Milo offers another light.',
  ],
  objects: {
    forestStar: 'A small, cool-to-touch, seed-shaped light. Its faint gold dust can mark things it brushes.',
    starCradle: 'A low cradle on the Story Tree, visible at the entrance and revisited at the end.',
    lantern: 'Milo brings a small cool-glowing lantern in the opening. No flame or fuel interaction.',
    honey: 'Bear’s own lidded picnic pot hanging from a branch; no hive or bees.',
  },
  clues: {
    'empty-cradle': { evidence: 'An empty cradle, golden scuff and faint dotted trail.', inference: 'The Star moved away from the tree.', notYetKnown: 'How it moved or whether anyone carried it.' },
    'puddle-dust': { evidence: 'A little gold dust on a stepping stone; Frog saw a glow pass toward the tall trees.', inference: 'The trail continues beyond the puddles.', notYetKnown: 'The identity of a carrier.' },
    'branch-smear': { evidence: 'A golden smear on a low twig facing the winding trail.', inference: 'The Star brushed this place as it passed.', notYetKnown: 'Why it left the cradle.' },
    'rolling-groove': { evidence: 'A curved groove; Snake saw a glowing thing roll toward the oak.', inference: 'At least this part of the journey happened on the ground.', notYetKnown: 'Whether it kept rolling.' },
    'oak-takeoff': { evidence: 'The groove ends at the oak. Squirrel heard a whoosh and saw something fly toward the old tree.', inference: 'Something may have picked the Star up here.', notYetKnown: 'What flew, what it carried, or why.' },
    feather: { evidence: 'Owl recalls wingbeats. A small feather lies beside the onward path.', inference: 'A bird could have carried the Star toward the nest.', notYetKnown: 'The bird’s reason for taking it.' },
    'bird-explanation': { evidence: 'The Star lights a young bird’s nest. The bird explains that it looked like a lost seed.', inference: 'The bird wanted light and did not understand the forest’s need.', notYetKnown: 'Nothing essential remains unexplained after the short recollection.' },
  } satisfies Record<ClueId, { evidence: string; inference: string; notYetKnown: string }>,
  chapters: [
    {
      id: 'entrance', title: 'The empty cradle', place: 'Story Tree clearing at the forest entrance', light: 'late-afternoon',
      personality: 'Milo is curious and concerned, never alarmed.',
      problem: 'The Forest Star is missing from its cradle.',
      mysteryAdvance: 'Establish the shared light, the missing object and a trace leading away.',
      beats: [
        { kind: 'action', direction: 'Milo arrives with his small lantern for the walk home. Establish it quietly before showing the empty cradle.' },
        { kind: 'dialogue', lines: [{ speaker: 'milo', text: 'That’s strange…' }, { speaker: 'milo', text: 'The Forest Star was right here.' }] },
        { kind: 'clue', clueId: 'empty-cradle' },
        { kind: 'dialogue', lines: [{ speaker: 'milo', text: 'Maybe someone in the forest saw where it went.' }] },
        { kind: 'travel', destination: 'A bend beside muddy puddles', line: { speaker: 'milo', text: 'This little trail goes into the forest.' } },
        { kind: 'action', direction: 'A small boing is heard ahead. Do not show an activity-selection screen.' },
      ],
      continuity: { requires: [], establishes: ['Star missing', 'Milo has lantern', 'faint golden trail', 'Story Tree location'] }, next: 'frog',
    },
    {
      id: 'frog', title: 'Across the puddles', place: 'Muddy stepping stones', light: 'late-afternoon',
      personality: 'Playful, welcoming, pleased by every different kind of hop.',
      problem: 'Milo needs to learn a way across the mud; Frog knows the stones.',
      mysteryAdvance: 'Confirm that the glow passed this way and point toward the tall trees.',
      beats: [
        { kind: 'dialogue', lines: [{ speaker: 'frog', text: 'Boing! Boing!' }, { speaker: 'milo', text: 'How are you getting across?' }, { speaker: 'frog', text: 'Like this!' }] },
        { kind: 'action', direction: 'Frog makes one slow hop, then settles and waits.' },
        { kind: 'dialogue', lines: [{ speaker: 'frog', text: 'Can you jump like me?' }] },
        { kind: 'activity', activityId: 'frog-movement' },
        { kind: 'action', direction: 'Milo reaches the last stone. It tips slightly and reveals a tiny golden mark.' },
        { kind: 'dialogue', lines: [{ speaker: 'frog', text: 'You’re pretty good at being a frog.' }, { speaker: 'frog', text: 'Oh! I saw something glowing go past here!' }, { speaker: 'frog', text: 'It went toward the tall trees.' }] },
        { kind: 'clue', clueId: 'puddle-dust' },
        { kind: 'travel', destination: 'The tall trees', line: { speaker: 'milo', text: 'A little glow, just like our Star. Let’s look.' } },
      ],
      continuity: { requires: ['faint golden trail'], establishes: ['Milo crossed the mud', 'Frog is a friend', 'glow passed toward tall trees'] }, next: 'bear',
    },
    {
      id: 'bear', title: 'A little higher', place: 'Tall trees with three low, sturdy branches', light: 'late-afternoon',
      personality: 'Gentle and patient; pauses to think before speaking.',
      problem: 'Bear’s picnic honey pot is hanging beyond reach.',
      mysteryAdvance: 'A low golden smear connects the puddles to the winding trail.',
      beats: [
        { kind: 'dialogue', lines: [{ speaker: 'bear', text: 'I can smell it…' }, { speaker: 'milo', text: 'Your honey?' }, { speaker: 'bear', text: 'Too high.' }] },
        { kind: 'activity', activityId: 'bear-reach' },
        { kind: 'dialogue', lines: [{ speaker: 'milo', text: 'Could those branches help?' }] },
        { kind: 'activity', activityId: 'bear-branches' },
        { kind: 'action', direction: 'Bear brings down the honey. A bent twig springs back, exposing a golden smear on the path-facing side.' },
        { kind: 'dialogue', lines: [{ speaker: 'bear', text: 'You helped me reach it!' }, { speaker: 'bear', text: 'Wait…' }, { speaker: 'bear', text: 'I saw something shiny near the winding trail.' }] },
        { kind: 'clue', clueId: 'branch-smear' },
        { kind: 'travel', destination: 'The winding roots', line: { speaker: 'milo', text: 'Another golden mark. It went around that bend.' } },
      ],
      continuity: { requires: ['glow passed toward tall trees'], establishes: ['Bear has honey', 'branch mark found', 'winding trail indicated'] }, next: 'baby-snake',
    },
    {
      id: 'baby-snake', title: 'Zig, then zag', place: 'A winding path between roots', light: 'softening-daylight',
      personality: 'Earnest, slightly muddled, delighted to find a rhythm.',
      problem: 'Baby Snake needs help following the bends to its nearby waiting family.',
      mysteryAdvance: 'Confirm rolling movement and follow its groove to the oak.',
      beats: [
        { kind: 'action', direction: 'Show a parent snake calmly waiting beyond the roots. Baby Snake tries a turn and looks back, unafraid.' },
        { kind: 'dialogue', lines: [{ speaker: 'baby-snake', text: 'They went zig…' }, { speaker: 'baby-snake', text: '…or was it zag?' }, { speaker: 'milo', text: 'Let’s follow the bends together.' }] },
        { kind: 'activity', activityId: 'snake-movement' },
        { kind: 'activity', activityId: 'snake-pattern' },
        { kind: 'activity', activityId: 'snake-imagination' },
        { kind: 'action', direction: 'Snake reaches its family beside the bend. The shared turn brings a faint rolling groove into view.' },
        { kind: 'dialogue', lines: [{ speaker: 'baby-snake', text: 'I remember something!' }, { speaker: 'baby-snake', text: 'A glowing thing rolled past me.' }, { speaker: 'baby-snake', text: 'It went toward the big oak tree.' }] },
        { kind: 'clue', clueId: 'rolling-groove' },
        { kind: 'travel', destination: 'The big oak', line: { speaker: 'milo', text: 'So it rolled! Let’s follow that little line.' } },
      ],
      continuity: { requires: ['winding trail indicated'], establishes: ['Snake reunited with nearby family', 'Star rolled toward oak'] }, next: 'squirrel',
    },
    {
      id: 'squirrel', title: 'The places we remember', place: 'The big oak and four natural hiding places', light: 'softening-daylight',
      personality: 'Busy and forgetful, with a gentle sense of humour.',
      problem: 'Squirrel cannot remember where the acorns are hidden.',
      mysteryAdvance: 'The rolling trail stops here; a whoosh suggests an airborne departure.',
      beats: [
        { kind: 'dialogue', lines: [{ speaker: 'squirrel', text: 'Acorn… acorn…' }, { speaker: 'milo', text: 'Did you lose something too?' }, { speaker: 'squirrel', text: 'I hid my acorns.' }] },
        { kind: 'action', direction: 'A short, thoughtful pause.' },
        { kind: 'dialogue', lines: [{ speaker: 'squirrel', text: 'I forgot where.' }] },
        { kind: 'action', direction: 'A breeze lifts loose leaves and briefly uncovers the acorns. The child controls when to let the leaves settle.' },
        { kind: 'activity', activityId: 'squirrel-memory' },
        { kind: 'action', direction: 'At the last hiding place, Milo notices that the rolling groove stops beside the oak.' },
        { kind: 'dialogue', lines: [{ speaker: 'squirrel', text: 'That’s where they were!' }, { speaker: 'squirrel', text: 'Oh! When I was hiding them, I heard WHOOSH!' }, { speaker: 'squirrel', text: 'Something flew toward the old tree.' }] },
        { kind: 'clue', clueId: 'oak-takeoff' },
        { kind: 'travel', destination: 'The old hollow tree', line: { speaker: 'milo', text: 'It rolled here… then something flew away?' } },
      ],
      continuity: { requires: ['Star rolled toward oak'], establishes: ['all hidden acorns recovered', 'rolling trail ends', 'something flew toward old tree'] }, next: 'owl',
    },
    {
      id: 'owl', title: 'A sound in the quiet', place: 'The old hollow tree', light: 'early-dusk',
      personality: 'Unhurried, attentive, precise about what was heard rather than seen.',
      problem: 'Owl heard a visitor behind the leaves and could not see who it was.',
      mysteryAdvance: 'Wingbeats and a feather support the idea of a bird carrying the Star.',
      beats: [
        { kind: 'action', direction: 'The light cools slightly. Keep the path visible and the setting reassuring.' },
        { kind: 'dialogue', lines: [{ speaker: 'owl', text: 'Who goes there?' }, { speaker: 'milo', text: 'We’re looking for the Forest Star.' }, { speaker: 'owl', text: 'I didn’t see it.' }, { speaker: 'owl', text: 'But I heard something.' }] },
        { kind: 'activity', activityId: 'owl-sounds' },
        { kind: 'activity', activityId: 'owl-deduction' },
        { kind: 'dialogue', lines: [{ speaker: 'owl', text: 'Yes, wings. And look—a feather.' }, { speaker: 'owl', text: 'Follow the feathers.' }] },
        { kind: 'clue', clueId: 'feather' },
        { kind: 'travel', destination: 'The sheltered nest beyond the tree', line: { speaker: 'milo', text: 'Maybe someone carried our Star.' } },
      ],
      continuity: { requires: ['something flew toward old tree'], establishes: ['wingbeats identified or demonstrated', 'feather trail to nest'] }, next: 'discovery',
    },
    {
      id: 'discovery', title: 'Two places need a light', place: 'A sheltered nest with a young bird and its nearby family', light: 'early-dusk',
      personality: 'The young bird is timid about the dark, relieved to be understood.',
      problem: 'Returning the Star alone would leave the bird without a light.',
      mysteryAdvance: 'Reveal the innocent motive and resolve both needs.',
      beats: [
        { kind: 'action', direction: 'The Forest Star is nestled beside the bird. The family is nearby. No chase, confrontation or villain reveal.' },
        { kind: 'dialogue', lines: [{ speaker: 'milo', text: 'There it is!' }, { speaker: 'milo', text: 'Oh… you wanted a little light.' }, { speaker: 'baby-bird', text: 'It looked like a lost seed. My nest was dark.' }, { speaker: 'baby-bird', text: 'I didn’t know it lit the forest path.' }] },
        { kind: 'action', direction: 'Short recollection: a gust dislodges the Star; it bounces, brushes the twig, rolls to the oak, and is picked up by the young bird. Show only these known events.' },
        { kind: 'clue', clueId: 'bird-explanation' },
        { kind: 'activity', activityId: 'two-lights' },
        { kind: 'dialogue', lines: [{ speaker: 'baby-bird', text: 'A little light for me?' }, { speaker: 'milo', text: 'And the Forest Star for everyone.' }] },
        { kind: 'action', direction: 'Milo offers his lantern. The bird willingly places the Star in his hands. Both lights remain gentle.' },
        { kind: 'travel', destination: 'The return bend to the Story Tree', line: { speaker: 'milo', text: 'Let’s bring this little light home.' } },
      ],
      continuity: { requires: ['feather trail to nest', 'Milo has lantern'], establishes: ['bird has lantern', 'Milo has Forest Star', 'complete journey of the Star understood'] }, next: 'ending',
    },
    {
      id: 'ending', title: 'The way back glows', place: 'The Story Tree and the familiar path', light: 'sunset',
      personality: 'Milo is quietly pleased and grateful.', problem: 'The Star needs to return to its shared place.',
      mysteryAdvance: 'Close the loop: the forest and the nest both have light.',
      beats: [
        { kind: 'action', direction: 'Milo returns the Star to its cradle. Warm pools of light reveal the forest path. The nest retains its own small light.' },
        { kind: 'action', direction: 'A quiet procession of acknowledgements along the path: Frog hops once; Bear waves; Snake wiggles beside its family; Squirrel holds an acorn; Owl watches. Only one moves at a time.' },
        { kind: 'dialogue', lines: [{ speaker: 'milo', text: 'We found it.' }, { speaker: 'milo', text: 'We couldn’t have done it without everyone.' }] },
        { kind: 'action', direction: 'Hold on the Forest Star above the Story Tree. End the adventure here; a quiet route home is optional, with no autoplay, reward currency or keep-playing prompt.' },
      ],
      continuity: { requires: ['bird has lantern', 'Milo has Forest Star'], establishes: ['Star restored', 'forest path softly lit', 'bird still comforted', 'adventure complete'] }, next: null,
    },
  ] satisfies Chapter[],
} as const

export const forestActivityPlans: Record<ActivityId, ActivityPlan> = {
  'frog-movement': {
    id: 'frog-movement', storyPurpose: 'Frog helps Milo cross the mud; the crossing reveals the golden mark.',
    steps: [
      { id: 'two-hops', mode: 'movement', prompt: { speaker: 'frog', text: 'Jump two times like me!' }, staging: 'Demonstrate two slow hops once, then wait.', completion: 'Child chooses Done; no motion verification.', alternative: 'Two finger hops or two seated bounces.' },
      { id: 'three-hops', mode: 'movement', prompt: { speaker: 'frog', text: 'Now jump three times!' }, staging: 'Show only this invitation. Milo waits beside Frog.', completion: 'Child chooses Done.', alternative: 'Three finger hops or three seated bounces.' },
      { id: 'big-hop', mode: 'imagine', prompt: { speaker: 'frog', text: 'Imagine your BIGGEST frog jump!' }, staging: 'Big is pretend, not a demand for height or distance. Stay in a comfortable clear space.', completion: 'Child chooses Done; every interpretation counts.', alternative: 'Make a big leap with one hand.' },
      { id: 'tiny-hop', mode: 'imagine', prompt: { speaker: 'frog', text: 'Can you make the tiniest frog jump?' }, staging: 'One tiny demonstration, then a still waiting pose.', completion: 'Child chooses Done.', alternative: 'Move one finger a tiny distance.' },
    ],
    worldChange: 'Milo crosses; the last stone reveals gold dust.',
    assistance: { first: 'A little hop is enough.', next: 'Your fingers can be frogs too.', showMe: 'Milo tries the hops with Frog. Continue to the same mark and clue.' },
    continuation: 'Participation, an alternative or assisted demonstration all lead to Frog noticing the mark.',
  },
  'bear-reach': {
    id: 'bear-reach', storyPurpose: 'Let the child experience why reaching alone will not solve Bear’s problem.',
    steps: [
      { id: 'reach', mode: 'movement', prompt: { speaker: 'bear', text: 'Reach your hands up high!' }, staging: 'Feet stay on the floor, or stretch from sitting. No climbing invitation.', completion: 'Child chooses Done.', alternative: 'Lift one hand as comfortably as you like.' },
      { id: 'taller', mode: 'movement', prompt: { speaker: 'bear', text: 'Can you stretch a little taller?' }, staging: 'Comfortable reach only; Bear still cannot reach the honey.', completion: 'Done or Let Milo try.', alternative: 'Make a toy or hand reach upward.' },
    ],
    worldChange: 'Milo notices the branches as another possible solution.',
    assistance: { first: 'A small stretch is lovely too.', next: 'Let’s look for another way.', showMe: 'Bear demonstrates a comfortable reach and Milo notices the branches.' },
    continuation: 'Proceed to branch reasoning without scoring the physical reach.',
  },
  'bear-branches': {
    id: 'bear-branches', storyPurpose: 'Help Bear retrieve the honey naturally; returning exposes the next clue.',
    steps: [
      { id: 'first-branch', mode: 'choice', prompt: { speaker: 'milo', text: 'Which branch should Bear climb first?' }, staging: 'Three sturdy branches; only the lowest is reachable from the ground.', options: [{ id: 'low', label: 'Low branch' }, { id: 'middle', label: 'Middle branch' }, { id: 'high', label: 'High branch' }], expected: 'low', completion: 'Bear moves to the selected reachable branch.' },
      { id: 'next-branch', mode: 'choice', prompt: { speaker: 'milo', text: 'Which branch can Bear reach now?' }, staging: 'Bear stands on the low branch. Emphasize the next reachable gap, not an arbitrary answer order.', options: [{ id: 'middle', label: 'Middle branch' }, { id: 'high', label: 'High branch' }], expected: 'middle', completion: 'Bear reaches the middle branch.' },
      { id: 'last-branch', mode: 'choice', prompt: { speaker: 'bear', text: 'One more little climb?' }, staging: 'The high branch and honey are now within Bear’s reach.', options: [{ id: 'high', label: 'High branch' }], expected: 'high', completion: 'Bear reaches the honey and returns to the ground.' },
    ],
    worldChange: 'Bear has the pot; the bent twig springs back and reveals its gold smear.',
    assistance: { first: 'That one is a long way from Bear’s paws.', next: 'Look for the branch just above Bear.', showMe: 'Milo points to each reachable branch while Bear climbs. The child is never asked to climb.' },
    continuation: 'The smear prompts Bear’s memory; it is not a prize offered for climbing.',
  },
  'snake-movement': {
    id: 'snake-movement', storyPurpose: 'Make the path’s alternating bends something the child can feel.',
    steps: [{ id: 'sway', mode: 'movement', prompt: { speaker: 'milo', text: 'Can you sway like Baby Snake?' }, staging: 'One slow left–right–left–right demonstration from the child’s perspective, then wait.', expected: ['left', 'right', 'left', 'right'], completion: 'Child chooses Done; directions are not motion-tracked.', alternative: 'Sway a hand or a finger, seated if preferred.' }],
    worldChange: 'Baby Snake starts following the winding path.',
    assistance: { first: 'A little wiggle is enough.', next: 'Your hand can be a tiny snake.', showMe: 'Milo traces the bends while Snake follows.' },
    continuation: 'Move to one simple prediction at the next bend.',
  },
  'snake-pattern': {
    id: 'snake-pattern', storyPurpose: 'Predict the next turn so Snake can reach its nearby family.',
    steps: [{ id: 'next-turn', mode: 'choice', prompt: { speaker: 'milo', text: 'Left, right, left… which way next?' }, staging: 'Keep the previous three bends visible; the waiting parent is just beyond the next one.', options: [{ id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }], expected: 'right', completion: 'Snake takes the right bend; preserve the prior turns during a retry.' }],
    worldChange: 'The next bend opens the route toward Snake’s family and the rolling groove.',
    assistance: { first: 'The bends take turns.', next: 'Follow left, then right, then left with your finger.', showMe: 'Milo traces the right turn and Snake follows, without a wrong-answer signal.' },
    continuation: 'Invite one invented wiggle before Snake notices the groove.',
  },
  'snake-imagination': {
    id: 'snake-imagination', storyPurpose: 'Let the child share an idea rather than only copy an instruction.',
    steps: [{ id: 'own-wiggle', mode: 'imagine', prompt: { speaker: 'baby-snake', text: 'Now make your own snake movement!' }, staging: 'Snake waits calmly. No repeating animation and no claim to copy the child’s actual motion.', completion: 'Done; no correct answer.', alternative: 'Invent a finger wiggle or imagine one quietly.' }],
    worldChange: 'Snake reaches its family, sees the groove and remembers the glowing object.',
    assistance: { first: 'It can be any little wiggle.', next: 'You can imagine it quietly too.', showMe: 'Snake offers one little wiggle, then joins its family.' },
    continuation: 'Snake shares the rolling observation regardless of the chosen participation mode.',
  },
  'squirrel-memory': {
    id: 'squirrel-memory', storyPurpose: 'Search the oak’s hiding places together and notice where the rolling trail ends.',
    steps: [{
      id: 'remember-hiding-places', mode: 'memory', prompt: { speaker: 'squirrel', text: 'Where did those acorns hide?' },
      staging: 'First show the acorns uncovered by a breeze. Hide only when the child chooses Ready. Younger: rock and flowers. Harder: rock, flowers and bush. The stump is a distractor.',
      options: [{ id: 'rock', label: 'Rock' }, { id: 'stump', label: 'Tree stump' }, { id: 'flowers', label: 'Flowers' }, { id: 'bush', label: 'Bush' }],
      expected: ['rock', 'flowers'],
      completion: 'Find every distinct target for the chosen variation: two or three. One found acorn is partial progress, never completion. Disable or acknowledge repeated selections without counting twice.',
      alternative: 'Look again freely, or leave one acorn tip visible. No timer or speed condition.',
    }],
    worldChange: 'Squirrel gathers the recovered acorns. The final hiding place brings the end of the groove into view.',
    assistance: { first: 'Look for a little acorn tip under a leaf.', next: 'Shall we lift the leaves and look again?', showMe: 'Squirrel and Milo lift each remaining cover together; the trail discovery still follows.' },
    continuation: 'After all required places are visited, independently or with help, Squirrel recalls the whoosh.',
  },
  'owl-sounds': {
    id: 'owl-sounds', storyPurpose: 'Compare Owl’s remembered sound to possible forest sounds.',
    steps: [
      { id: 'hear-examples', mode: 'listen', prompt: { speaker: 'owl', text: 'Let’s listen, one sound at a time.' }, staging: 'Play leaves, wings and water separately, each with a quiet pause. Lower any environment audio; allow individual replay.', expected: ['leaves', 'wings', 'water'], completion: 'Child chooses to continue after hearing or replaying examples.', alternative: 'Use the looking version with leaf movement, wing movement and water ripples; label this as observation, not listening.' },
      { id: 'match-memory', mode: 'choice', prompt: { speaker: 'milo', text: 'Which sound did Owl hear?' }, staging: 'Play the remembered wing sound again. Its replay is always available and never overlaps an option replay.', options: [{ id: 'leaves', label: 'Rustling leaves' }, { id: 'wings', label: 'Flapping wings' }, { id: 'water', label: 'Rippling water' }], expected: 'wings', completion: 'Match wings, or compare with Owl through assistance.', alternative: 'Show Owl describing a flutter and the feather; compare the illustrated movements.' },
    ],
    worldChange: 'Owl and Milo agree that the visitor made wingbeats.',
    assistance: { first: 'Let’s listen to those two sounds again.', next: 'Hear the little flutter, flutter?', showMe: 'Owl pairs the sound with one slow wing movement; continue without marking a failure.' },
    continuation: 'Use the evidence to consider an animal; do not reveal the nest yet.',
  },
  'owl-deduction': {
    id: 'owl-deduction', storyPurpose: 'Connect the wing sound to a plausible carrier without assigning blame.',
    steps: [{ id: 'possible-carrier', mode: 'choice', prompt: { speaker: 'milo', text: 'Who could have made that sound?' }, staging: 'Show rabbit, bird and fish, with no threatening or guilty expressions.', options: [{ id: 'rabbit', label: 'Rabbit' }, { id: 'bird', label: 'Bird' }, { id: 'fish', label: 'Fish' }], expected: 'bird', completion: 'Identify the animal with wings, independently or with help.' }],
    worldChange: 'A feather is noticed beside the path leading to the sheltered nest.',
    assistance: { first: 'Which animal has wings?', next: 'Look at the bird’s little wings.', showMe: 'Owl names the bird as a possibility and points out the feather.' },
    continuation: 'Follow the evidence, not an accusation that someone stole the Star.',
  },
  'two-lights': {
    id: 'two-lights', storyPurpose: 'Understand the bird’s need and solve both the nest and forest lighting problems.',
    steps: [{
      id: 'light-for-the-nest', mode: 'choice', prompt: { speaker: 'milo', text: 'The forest needs its Star. What could light your nest?' },
      staging: 'Show the Star beside Bird, Milo’s already-established lantern, and an apple. Both the dark path and the nest remain understandable.',
      options: [
        { id: 'forest-star', label: 'Forest Star', gentleResponse: 'The Star does make light. But the forest path needs it too.' },
        { id: 'lantern', label: 'Milo’s little lantern' },
        { id: 'apple', label: 'Apple', gentleResponse: 'An apple is something to eat. What gives a little light?' },
      ], expected: 'lantern', completion: 'Offer the lantern and let Bird willingly return the Star. Do not snatch or remove it before the second light is offered.',
    }],
    worldChange: 'The lantern comforts the bird; Milo can restore the Star to the forest.',
    assistance: { first: 'Can we make a little light in both places?', next: 'Remember the lantern Milo brought for the walk home?', showMe: 'Milo holds up the lantern and asks Bird if it would help; Bird agrees and shares the Star back.' },
    continuation: 'Return to the Story Tree with both needs acknowledged and met.',
  },
}

export const forestStoryAudio: Record<SoundId, { description: string; source: null; recordingNote: string }> = {
  leaves: { description: 'A soft rustle of dry leaves.', source: null, recordingNote: 'Short, crisp and gentle; distinguish it clearly from repeated wingbeats.' },
  wings: { description: 'Two or three clear, soft wing flaps.', source: null, recordingNote: 'The target sound. No loud whoosh, alarm or startling onset.' },
  water: { description: 'A little stream rippling over stones.', source: null, recordingNote: 'Short watery trickle, clearly different from rustling and flapping.' },
}

export const forestMemoryVariations = {
  younger: { locations: ['rock', 'stump', 'flowers', 'bush'], hiddenAt: ['rock', 'flowers'], requiredDistinctFinds: 2 },
  harder: { locations: ['rock', 'stump', 'flowers', 'bush'], hiddenAt: ['rock', 'flowers', 'bush'], requiredDistinctFinds: 3 },
  observationEnds: 'Only when the child chooses Ready; no automatic hide.',
  retry: 'Retain found acorns on a wrong location. Look again restores the view without penalizing the child.',
} as const
