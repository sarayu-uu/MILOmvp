import { forestAdventure } from '../data/forestAdventure'

export type Animal = 'frog' | 'bear' | 'snake' | 'squirrel' | 'owl' | 'bird'
export type JourneyLine = { speaker: string; text: string; reveal?: boolean }
export type JourneyStop = {
  id: string
  place: string
  point: [number, number]
  camera: [number, number, number]
  animal?: Animal
  animalBox?: [number, number, number, number]
  lines: JourneyLine[]
}

// Reuse approved dialogue around playable animal encounters.
function line(chapterId: string, speaker: string, startsWith: string): JourneyLine {
  const chapter = forestAdventure.chapters.find(chapter => chapter.id === chapterId)
  const dialogue = chapter?.beats.flatMap(beat => beat.kind === 'dialogue' ? [...beat.lines] : [])
  const found = dialogue?.find(line => line.speaker === speaker && line.text.startsWith(startsWith))
  if (!found) throw new Error(`Missing forest dialogue: ${chapterId}/${startsWith}`)
  return { speaker: speaker === 'milo' ? 'Milo' : speaker === 'baby-snake' ? 'Baby Snake' : speaker === 'baby-bird' ? 'Little Bird' : speaker[0].toUpperCase() + speaker.slice(1), text: found.text }
}

export const journeyStops: JourneyStop[] = [
  {
    id: 'entrance', place: 'The winding woods', point: [770, 895], camera: [800, 510, 1800],
    lines: [
      line('entrance', 'milo', 'That’s strange'),
      // The new visual brief places the Story Tree deeper in the landscape.
      { speaker: 'Milo', text: 'The Forest Star is missing from the Story Tree.' },
      line('entrance', 'milo', 'Maybe someone'),
    ],
  },
  {
    id: 'frog', place: 'A little hop across', point: [595, 747], camera: [690, 650, 1150],
    animal: 'frog', animalBox: [475, 654, 108, 95],
    lines: [
      line('frog', 'frog', 'Boing'), line('frog', 'milo', 'How are'), line('frog', 'frog', 'Like this'),
      { speaker: 'The forest', text: 'Frog shows Milo the way across the stones.', reveal: true },
      line('frog', 'frog', 'Oh!'), line('frog', 'frog', 'It went'),
    ],
  },
  {
    id: 'bear', place: 'Under the honey tree', point: [925, 645], camera: [880, 530, 1050],
    animal: 'bear', animalBox: [996, 519, 129, 143],
    lines: [
      line('bear', 'bear', 'I can'), line('bear', 'milo', 'Your honey'), line('bear', 'bear', 'Too high'),
      { speaker: 'The forest', text: 'Milo spots a low branch. Bear finds a way to his honey.', reveal: true },
      line('bear', 'bear', 'Wait'), line('bear', 'bear', 'I saw'),
    ],
  },
  {
    id: 'baby-snake', place: 'Around the winding roots', point: [865, 550], camera: [810, 475, 1000],
    animal: 'snake', animalBox: [708, 485, 106, 64],
    lines: [
      line('baby-snake', 'baby-snake', 'They went'), line('baby-snake', 'baby-snake', '…or'),
      line('baby-snake', 'milo', 'Let’s follow'),
      { speaker: 'The forest', text: 'Zig, then zag. Baby Snake reaches the next bend.', reveal: true },
      line('baby-snake', 'baby-snake', 'A glowing'), line('baby-snake', 'baby-snake', 'It went'),
    ],
  },
  {
    id: 'squirrel', place: 'Little secrets by the oak', point: [575, 462], camera: [660, 360, 1000],
    animal: 'squirrel', animalBox: [446, 366, 83, 91],
    lines: [
      line('squirrel', 'squirrel', 'Acorn'), line('squirrel', 'milo', 'Did you'), line('squirrel', 'squirrel', 'I forgot'),
      { speaker: 'The forest', text: 'A breeze lifts the leaves. Squirrel spots the hidden acorns.', reveal: true },
      line('squirrel', 'squirrel', 'Oh!'), line('squirrel', 'squirrel', 'Something flew'),
    ],
  },
  {
    id: 'owl', place: 'A sound in the quiet', point: [900, 375], camera: [945, 280, 950],
    animal: 'owl', animalBox: [955, 232, 76, 83],
    lines: [
      line('owl', 'owl', 'Who goes'), line('owl', 'milo', 'We’re looking'), line('owl', 'owl', 'I didn’t'),
      line('owl', 'owl', 'But I heard'),
      { ...line('owl', 'owl', 'Yes, wings'), reveal: true }, line('owl', 'owl', 'Follow'),
    ],
  },
  {
    id: 'discovery', place: 'A light for a little nest', point: [1130, 320], camera: [1110, 230, 900],
    animal: 'bird', animalBox: [1223, 219, 85, 79],
    lines: [
      line('discovery', 'milo', 'There it'), line('discovery', 'milo', 'Oh…'),
      line('discovery', 'baby-bird', 'It looked'), line('discovery', 'baby-bird', 'I didn’t'),
      { speaker: 'The forest', text: 'Milo offers his lantern. Little Bird gently gives the Star back.', reveal: true },
      line('discovery', 'milo', 'And the Forest'),
    ],
  },
  {
    id: 'ending', place: 'The Story Tree', point: [1110, 264], camera: [1110, 205, 1000],
    lines: [
      { speaker: 'The forest', text: 'The Forest Star is home. A little light for everyone.', reveal: true },
      line('ending', 'milo', 'We found'), line('ending', 'milo', 'We couldn’t'),
    ],
  },
]

/** Every stop lies on this single continuous curve; used for artwork AND walking. */
export const pathSegments = [
  'M770 895 C490 890 415 820 595 747',
  'M595 747 C730 687 995 751 925 645',
  'M925 645 C835 585 710 621 865 550',
  'M865 550 C1035 486 674 552 575 462',
  'M575 462 C509 383 716 419 900 375',
  'M900 375 C1016 345 1127 370 1130 320',
  'M1130 320 C1130 290 1110 286 1110 264',
]
export const walkingPath = pathSegments.map((segment, i) => i === 0 ? segment : segment.replace(/^M[\d ]+ C/, 'C')).join(' ')
export const FOREST_STORAGE_KEY = 'milo-forest-world-v1'

export type ForestProgress = { current: number; furthest: number; resolved: number[]; completed: number[]; line: number }
export function readForestProgress(): ForestProgress {
  const initial = { current: 0, furthest: 0, resolved: [], completed: [], line: 0 }
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(FOREST_STORAGE_KEY) || 'null')
    if (!stored || typeof stored !== 'object') return initial
    const value = stored as Partial<ForestProgress>
    if (!Number.isInteger(value.current) || !Number.isInteger(value.furthest) || !Array.isArray(value.resolved)) return initial
    const furthest = Math.max(0, Math.min(journeyStops.length - 1, value.furthest!))
    const current = Math.max(0, Math.min(furthest, value.current!))
    const resolved = [...new Set(value.resolved.filter(n => Number.isInteger(n) && n >= 0 && n <= furthest))]
    const completed = Array.isArray(value.completed) ? [...new Set(value.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= 5 && n <= furthest))] : []
    return { current, furthest, resolved: resolved.filter(n => n < 1 || n > 5 || completed.includes(n)), completed, line: Math.max(0, Math.min(journeyStops[current].lines.length - 1, Number.isInteger(value.line) ? value.line! : 0)) }
  } catch { return initial }
}
