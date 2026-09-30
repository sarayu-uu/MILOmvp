import {ContinueButton} from '../play/ContinueButton'
import { freshShuffle } from '../variation'
import { narrate, stopNarration } from '../narration'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { ArrowLeft, Globe2, Volume2, VolumeX } from 'lucide-react'
import { HomeMilo, HouseStructure, ObjectArt } from './HomeArt'
import type { Thing } from './HomeArt'
import './home.css'

const STORAGE = 'milo-home-v1'
type Room = 'house' | 'bedroom' | 'bathroom' | 'play' | 'kitchen' | 'garden'
type Activity = 'toys' | 'food' | 'plant' | 'wardrobe' | 'bed' | null
type HomeState = { toys: string[]; plate: string[]; foodGoal: number; watered: number; coat: boolean; boots: boolean; sleeping: boolean; sunnyMorning: boolean }
const emptyHome = (): HomeState => ({ toys: [], plate: [], foodGoal: 4, watered: 0, coat: false, boots: false, sleeping: false, sunnyMorning: false })
function loadHome(): HomeState {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE) || 'null') as Partial<HomeState> | null
    if (!value || !Array.isArray(value.toys) || !Array.isArray(value.plate)) return emptyHome()
    return { ...emptyHome(), ...value, toys: value.toys.filter(x => typeof x === 'string'), plate: value.plate.filter(x => typeof x === 'string'), watered: Math.min(3, Math.max(0, Number(value.watered) || 0)) }
  } catch { return emptyHome() }
}
type Rect = { x: number; y: number; w: number; h: number }
const cameras: Record<Room, number[]> = {
  house: [90, -5, 1030, 840], bedroom: [212, 125, 490, 270], bathroom: [706, 168, 297, 225],
  play: [214, 409, 466, 206], kitchen: [699, 407, 304, 207], garden: [223, 634, 462, 160],
}
const toyList: { id: string; kind: Thing; x: number; y: number; size: number }[] = [
  { id: 'teddy', kind: 'teddy', x: 260, y: 505, size: 58 },
  { id: 'ball', kind: 'ball', x: 437, y: 551, size: 44 },
  { id: 'blocks', kind: 'blocks', x: 333, y: 550, size: 52 },
  { id: 'car', kind: 'car', x: 404, y: 497, size: 53 },
  { id: 'puzzle', kind: 'puzzle', x: 248, y: 563, size: 42 },
]
const routines: { id: Thing; label: string }[] = [
  { id: 'brush', label: 'Brush teeth' }, { id: 'pajamas', label: 'Put on pajamas' },
  { id: 'book', label: 'Read a story' }, { id: 'bed', label: 'Go to sleep' },
]
const chest: Rect = { x: 550, y: 482, w: 113, h: 110 }
const plate: Rect = { x: 813, y: 537, w: 88, h: 58 }
const plantTarget: Rect = { x: 239, y: 655, w: 85, h: 111 }
const coatTarget: Rect = { x: 537, y: 230, w: 118, h: 137 }

function Hotspot({ label, children, onClick, className = '', disabled = false }: { label: string; children: ReactNode; onClick: () => void; className?: string; disabled?: boolean }) {
  return <g role="button" tabIndex={disabled ? -1 : 0} aria-label={label} aria-disabled={disabled || undefined}
    className={`home-hotspot ${className}`} onClick={e => { e.stopPropagation(); if (!disabled) onClick() }}
    onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); onClick() } }}>{children}</g>
}

function DragObject({ id, kind, x, y, size, target, placed, active, onPlace, onMiss, label, destination }: {
  id: string; kind: Thing; x: number; y: number; size: number; target: Rect; placed?: boolean; active: boolean
  onPlace: () => void; onMiss: () => void; label: string; destination: string
}) {
  const ref = useRef<SVGGElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  function point(e: ReactPointerEvent<SVGGElement>) {
    const matrix = ref.current?.ownerSVGElement?.getScreenCTM()
    return matrix ? new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse()) : { x: 0, y: 0 }
  }
  function finish(offset: { x: number; y: number }) {
    const cx = x + size / 2 + offset.x, cy = y + size / 2 + offset.y
    if (cx >= target.x && cx <= target.x + target.w && cy >= target.y && cy <= target.y + target.h) onPlace()
    else onMiss()
    setPosition({ x: 0, y: 0 }); setDragging(false); setKeyboard(false); start.current = null
  }
  return <g ref={ref} data-drag-id={id} role="button" aria-label={label} aria-describedby="home-drag-help"
    aria-disabled={placed || !active || undefined} tabIndex={active && !placed ? 0 : -1}
    className={`home-drag ${dragging || keyboard ? 'being-dragged' : ''} ${placed ? 'object-placed' : ''}`}
    transform={`translate(${placed ? target.x + target.w / 2 - size / 4 : x} ${placed ? target.y + target.h / 2 - size / 4 : y})`}
    onPointerDown={e => {
      if (!active || placed || e.button !== 0) return
      e.preventDefault(); e.stopPropagation(); ref.current?.setPointerCapture(e.pointerId); start.current = point(e); setDragging(true)
    }} onPointerMove={e => {
      if (!start.current) return
      const p = point(e); setPosition({ x: p.x - start.current.x, y: p.y - start.current.y })
    }} onPointerUp={e => {
      if (!start.current) return
      const p = point(e), offset = { x: p.x - start.current.x, y: p.y - start.current.y }
      ref.current?.releasePointerCapture(e.pointerId)
      if (Math.hypot(offset.x, offset.y) < 5) { setDragging(false); start.current = null; onMiss(); return }
      finish(offset)
    }} onPointerCancel={() => { start.current = null; setDragging(false); setPosition({ x: 0, y: 0 }) }}
    onKeyDown={e => {
      if (!active || placed) return
      if (['Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); e.stopPropagation() }
      if (e.key === 'Enter' || e.key === ' ') { if (keyboard) finish(position); else setKeyboard(true) }
      if (e.key === 'Escape') { setPosition({ x: 0, y: 0 }); setKeyboard(false) }
      if (keyboard && e.key.startsWith('Arrow')) setPosition(p => ({ x: p.x + (e.key === 'ArrowRight' ? 15 : e.key === 'ArrowLeft' ? -15 : 0), y: p.y + (e.key === 'ArrowDown' ? 15 : e.key === 'ArrowUp' ? -15 : 0) }))
    }}>
    <title>{label}. Drag to {destination}.</title>
    {(dragging || keyboard) && <rect x={target.x - x} y={target.y - y} width={target.w} height={target.h} rx="9" fill="#d9e2c320" stroke="#82936c" strokeWidth="1.5" strokeDasharray="4 5" pointerEvents="none"/>}
    <g className="drag-object-position" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${placed ? .5 : dragging ? 1.06 : 1})` }}>
      <rect x="-7" y="-7" width={size + 14} height={size + 14} fill="transparent" rx="8"/>
      <svg width={size} height={size} pointerEvents="none"><ObjectArt kind={kind}/></svg>
    </g>
  </g>
}

export function HomeWorld({ hard, sound, onSound, onWorld, onPicnic, onStory, onRecord }: {
  hard: boolean; sound: boolean; onSound: () => void; onWorld: () => void; onPicnic: () => void; onStory: () => void
  onRecord: (activity: string, event: 'attempt' | 'complete' | 'hint') => void
}) {
  const [home, setHome] = useState(loadHome)
  const makeVariation = () => ({ toys: freshShuffle('home-toys',[0,1,2,3,4]), clothing: freshShuffle('home-clothes',[0,1,2]), routine: freshShuffle('home-routine',[0,1,2,3]), food: freshShuffle('home-fruit',[0,1,2,3,4,5,6,7,8]), canX: freshShuffle('home-can',[333,390,420])[0] })
  const [variation, setVariation] = useState(makeVariation)
  const scatteredToys = toyList.map((toy,i) => ({...toy,x:toyList[variation.toys[i]].x,y:Math.min(toyList[variation.toys[i]].y,603-toy.size)}))
  const [room, setRoom] = useState<Room>('house')
  const [activity, setActivity] = useState<Activity>(null)
  const [dialogue, setDialogue] = useState(() => home.sleeping ? 'Milo is resting. Tap a moonlit window when you are ready for morning.' : 'We’re home! What should we do?')
  const [routine, setRoutine] = useState<Thing[]>([])
  const [routineFrame, setRoutineFrame] = useState(-1)
  const [inspected, setInspected] = useState(false)
  const [happy, setHappy] = useState(false)
  const [mission, setMission] = useState(false)
  const [missionWord, setMissionWord] = useState('round')
  const view = cameras[room]
  const viewport = useRef<HTMLDivElement>(null)
  const readRef = useRef<(text: string) => void>(() => {})
  const speak = (text: string) => { if (sound) narrate(text) }
  useEffect(() => { readRef.current = speak })
  useEffect(() => {
    const timer = setTimeout(() => readRef.current(home.sleeping ? 'Milo is resting. Tap a moonlit window when you are ready for morning.' : 'We’re home! What should we do?'), 650)
    return () => { clearTimeout(timer); stopNarration() }
    // Entry greeting is spoken once, not after each interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { try { localStorage.setItem(STORAGE, JSON.stringify(home)) } catch { /* Play still works without storage. */ } }, [home])
  useEffect(() => {
    if (viewport.current) viewport.current.scrollLeft = room === 'house' ? (viewport.current.scrollWidth - viewport.current.clientWidth) / 2 : 0
  }, [room])
  useEffect(() => {
    if (!happy) return
    const t = setTimeout(() => setHappy(false), 1100); return () => clearTimeout(t)
  }, [happy])
  useEffect(() => {
    if (routineFrame < 0) return
    const t = setTimeout(() => {
      if (routineFrame < 3) {
        setRoutineFrame(f => f + 1)
        const text = ['A little brush, brush, brush.', 'Soft pajamas, ready for bed.', 'One last little story.', 'Good night. Sleep well, Milo.'][routineFrame + 1]
        setDialogue(text); readRef.current(text)
      } else {
        setHome(h => ({ ...h, sleeping: true })); setRoutineFrame(-1)
      }
    }, 1700)
    return () => clearTimeout(t)
  }, [routineFrame])

  function tell(text: string) { setDialogue(text); speak(text) }
  function wakeUp() {
    setRoutineFrame(-1); setRoutine([]); setActivity(null); setHappy(false); setMission(false)
    setHome(h => ({ ...h, sleeping: false, sunnyMorning: true }))
    tell('Good morning! The sun is up. What shall we explore today?')
  }
  function help(text: string) { tell(text); if (activity) onRecord(`Home: ${activity}`, 'hint') }
  function completed(which: Activity, text: string) { setHappy(true); tell(text); if (which) onRecord(`Home: ${which}`, 'complete') }
  function enter(nextRoom: Room, nextActivity: Activity = null) {
    if (routineFrame >= 0) return
    setRoom(nextRoom); setActivity(nextActivity); setMission(false); setHappy(false)
    if (nextActivity) onRecord(`Home: ${nextActivity}`, 'attempt')
    if (nextActivity === 'toys') tell(home.toys.length === toyList.length ? 'Everything has a home. There are my boots!' : 'Oops… toys everywhere! Drag them into the toy box.')
    else if (nextActivity === 'food') {
      const goal = home.plate.length ? home.foodGoal : freshShuffle('home-count-'+hard, hard ? [5,6] : [3,4])[0]
      setHome(h => ({ ...h, foodGoal: goal }))
      tell(home.plate.length === goal ? 'Just enough for a lovely snack. Thank you!' : `I’m hungry! Drag ${goal} ${goal < 5 ? 'berries' : 'pieces of fruit'} onto my plate.`)
    } else if (nextActivity === 'plant') {
      setInspected(false)
      if (home.watered) { setHome(h => ({ ...h, watered: Math.min(3, h.watered + 1) })); tell(home.watered >= 2 ? 'A flower! Our little plant is growing.' : 'Look, a new leaf! Our plant remembers your care.') }
      else tell('Tap the plant to check the soil. Then drag the watering can to it.')
    } else if (nextActivity === 'wardrobe') { setHome(h => ({ ...h, sunnyMorning: false })); tell(home.coat ? 'My raincoat keeps me dry. Where are my boots?' : 'Drag the raincoat from the wardrobe onto Milo.') }
    else if (nextActivity === 'bed') { setRoutine([]); tell(home.sleeping ? 'Milo is tucked in. Tap the moonlit window to start a new day.' : 'Drag each bedtime picture into the next empty space. Start with the toothbrush.') }
    else if (nextRoom === 'bathroom') tell('A cosy bath and a towel, ready for another day.')
    else if (nextRoom === 'bedroom') tell(home.sleeping ? 'Tap the moonlit window when you are ready for morning.' : home.sunnyMorning ? 'Sunshine through the window. Good morning!' : 'Listen... raindrops on the window.')
    else tell(home.sleeping ? 'Milo is resting. Tap a moonlit window when you are ready for morning.' : 'Make yourself at home.')
  }
  const fullyTidy = home.toys.length === toyList.length
  const isActive = (r: Room) => room === 'house' || room === r
  const sleeping = home.sleeping || routineFrame === 3
  const foodKinds: Thing[] = home.foodGoal >= 5 ? ['apple', 'apple', 'apple', 'banana', 'banana', 'banana', 'banana', 'strawberry', 'strawberry'] : Array(6).fill('berry')
  const miloPosition = room === 'bedroom' ? activity === 'bed' ? { x: 345, y: 229, w: 110 } : { x: 537, y: 234, w: 115 }
    : room === 'play' ? { x: 468, y: 489, w: 77 } : room === 'kitchen' ? { x: 895, y: 511, w: 81 }
    : room === 'bathroom' ? { x: 811, y: 280, w: 77 } : room === 'garden' ? { x: 470, y: 647, w: 102 }
    : { x: 496, y: 650, w: 111 }
  const displayMilo = home.sleeping || routineFrame >= 2 ? { x: 342, y: 244, w: 102 } : miloPosition
  const showWardrobe = room === 'bedroom' && activity === 'wardrobe'
  const showBed = room === 'bedroom' && activity === 'bed' && !sleeping
  const cloths = variation.clothing.map((id,i) => ({id: ['raincoat','shirt','swimsuit'][id] as Thing,x:243+i*46,y:227}))
  const roomNames = { house: 'Milo’s little home', bedroom: 'A cosy little bedroom', bathroom: 'Splish, splash', play: 'A place for little treasures', kitchen: 'Something lovely to share', garden: 'A little corner of green' }

  return <main className={`home-world ${room === 'house' ? 'whole-house' : 'room-closeup'} ${sleeping ? 'home-evening' : ''} ${mission ? 'home-away' : ''}`}>
    <header className="home-header">
      <button className="round-button" aria-label={room === 'house' ? 'Back to world' : 'Back to whole house'} disabled={routineFrame >= 0} onClick={() => room === 'house' ? onWorld() : enter('house')}><ArrowLeft size={21}/></button>
      <div className="home-heading"><span>A LITTLE PLACE TO BELONG</span><h1>{roomNames[room]}</h1></div>
      <div className="home-tools"><button className="round-button" aria-label={sound ? 'Turn sound off' : 'Turn sound on'} onClick={onSound}>{sound ? <Volume2 size={21}/> : <VolumeX size={21}/>}</button><button className="round-button" aria-label="Return to world" onClick={onWorld}><Globe2 size={21}/></button></div>
    </header>
    <div className="home-scene-wrap" ref={viewport} aria-label="Explore Milo's dollhouse">
      <svg className="home-scene" viewBox={view.join(' ')} aria-label="Milo's illustrated home" role="group" onClick={e => {
        if (room !== 'house') return
        const matrix = e.currentTarget.getScreenCTM(); if (!matrix) return
        const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse())
        if (point.x < 219 || point.x > 997) return
        if (point.y > 170 && point.y < 380) enter(point.x < 700 ? 'bedroom' : 'bathroom')
        else if (point.y > 410 && point.y < 610) enter(point.x < 690 ? 'play' : 'kitchen', point.x < 690 ? 'toys' : 'food')
        else if (point.y > 640 && point.y < 775) enter('garden', 'plant')
      }}>
        <defs><clipPath id="home-camera"><rect x={view[0]} y={view[1]} width={view[2]} height={view[3]}/></clipPath><pattern id="home-grain" width="180" height="160" patternUnits="userSpaceOnUse"><path d="M12 28h2m16 53h1m41-64h3m-6 98h2m59-57h2m31 71h2m-116 8h1M94 79h2" stroke="#8a826d" strokeWidth="1" opacity=".2"/></pattern></defs>
        <g clipPath="url(#home-camera)">
        <HouseStructure sleeping={sleeping} sunnyMorning={home.sunnyMorning}/>
        {/* Rooms are physical spaces: tapping their open floors moves the camera. */}
        {room === 'house' && <>
          <Hotspot label="Explore the bedroom" onClick={() => enter('bedroom')}><rect x="219" y="184" width="476" height="195" fill="transparent"/></Hotspot>
          <Hotspot label="Explore the bathroom" onClick={() => enter('bathroom')}><rect x="715" y="175" width="283" height="204" fill="transparent"/></Hotspot>
          <Hotspot label="Explore the play corner" onClick={() => enter('play', 'toys')}><rect x="220" y="411" width="459" height="200" fill="transparent"/></Hotspot>
          <Hotspot label="Explore the kitchen" onClick={() => enter('kitchen', 'food')}><rect x="701" y="410" width="297" height="199" fill="transparent"/></Hotspot>
          <Hotspot label="Explore the garden corner" onClick={() => enter('garden', 'plant')}><rect x="220" y="640" width="775" height="131" fill="transparent"/></Hotspot>
        </>}
        {/* Bedroom: wardrobe doors open around actual hanging garments. */}
        <Hotspot label="Open the wardrobe" disabled={!isActive('bedroom') || showWardrobe} onClick={() => enter('bedroom', 'wardrobe')} className={room === 'house' && !home.coat ? 'home-discover' : ''}>
          <path d="M238 356V205Q307 186 379 205v151Z" fill="#b5b898" stroke="#929b7b" strokeWidth="3"/>
          <path d="M231 205q77-21 155 0v10H231Z" fill="#c6c6a4" stroke="#929b7b" strokeWidth="2"/>
          {showWardrobe ? <><path d="M242 215h133v134H242Z" fill="#887e66"/><path d="M248 230h120" stroke="#cbbb96" strokeWidth="3"/>{[264,310,355].map(x => <path key={x} d={`M${x} 222q7-8 8 0l-8 6-11 10h24l-13-10`} stroke="#cdbd99" fill="none" strokeWidth="2"/>)}<path d="M239 214l-24 17v125l24-7M377 214l21 18v122l-21-5" fill="#c2c4a3" stroke="#929b7b" strokeWidth="2"/></> : <><path d="M246 218h55v122h-55Zm64 0h60v122h-60Z" fill="#c3c6a4" stroke="#a5ae8b" strokeWidth="2"/><path d="M292 270v19m26-19v19" stroke="#8d9071" strokeWidth="4"/></>}
          <path d="M248 356v12m119-12v12" stroke="#8f997a" strokeWidth="6"/>
        </Hotspot>
        <Hotspot label="Milo's bed" disabled={!isActive('bedroom')} onClick={() => enter('bedroom', 'bed')}>
          <ellipse cx="467" cy="364" rx="128" ry="12" fill="#b9ad97" opacity=".23"/>
          <path d="M340 360V271q0-17 17-17h15v106M552 361v-66q0-13 14-13h7v79" stroke="#a99070" strokeWidth="5" fill="#c5b18e"/>
          <path d="M353 289h210v55H353Z" fill="#ebe0c5" stroke="#c2b390" strokeWidth="2"/>
          <rect x="359" y="275" width="61" height="30" rx="13" fill="#f4ebd5" stroke="#d3c3a1" strokeWidth="2"/>
          <path d="M418 286h136v65H418Z" fill="#a9b69b"/><path d="M420 302h132M420 327h132M444 288v60m29-60v60m28-60v60m27-60v60" stroke="#c2cbb0" strokeWidth="2" opacity=".6"/>
          <path d="M349 344h214v10H349" fill="#b5a182"/>
        </Hotspot>
        <g transform="translate(628 286)"><path d="M-18 45h45v8h-45M-11 53v23m32-23v23M4 9v34" stroke="#ae987a" strokeWidth="4"/><path d="M-11-17h31l12 31h-53Z" fill={sleeping ? '#bdb393' : '#e7d09a'}/><circle cx="4" cy="8" r="22" fill="#f3dfaa" opacity={sleeping ? 0 : .16}/></g>
        <Hotspot label={home.sunnyMorning ? "Look through the sunny window" : "Look through the rainy window"} disabled={!isActive('bedroom')} onClick={() => home.sunnyMorning ? tell('The sun is up. A new day to explore!') : enter('bedroom', 'wardrobe')}><rect x="458" y="133" width="113" height="131" fill="transparent"/></Hotspot>
        <g transform="translate(615 332)"><path d="M-14 0h50l-5 32h-41Z" fill="#c9b48f" stroke="#ac9777" strokeWidth="2"/><path d="M-11 10h44m-42 9h40m-31-17v28m10-28v28m10-28v28" stroke="#e4d2af" strokeWidth="2"/><path d="M-7 0l5-13 14 6 8-9 15 9-4 7" fill="#a9b7af"/></g>
        {/* Play corner: a woven rug, a chest, and scattered physical toys. */}
        <ellipse cx="406" cy="563" rx="154" ry="36" fill="#d4c396"/><ellipse cx="406" cy="563" rx="141" ry="29" fill="none" stroke="#e5d5af" strokeWidth="3"/><path d="M256 552l-17-2m16 10-17 0m19 11-17 3m317-21 18-1m-17 9h18m-19 10 17 3" stroke="#c4b080" strokeWidth="3"/>
        <Hotspot label="Open the toy box" disabled={!isActive('play')} onClick={() => enter('play', 'toys')}>
          <path d="M548 531l7-39q52-19 110 0l-4 39" fill="#b6bea0" stroke="#939d7e" strokeWidth="3"/>
          <path d="M557 500q48-13 101 0l-3 16h-97Z" fill="#a5af90"/>
          <path d="M544 532h122l-8 57H552Z" fill="#b5bda0" stroke="#939d7e" strokeWidth="3"/>
          <ellipse cx="605" cy="532" rx="61" ry="11" fill="#8e9477"/>
          <path d="M552 542h106v43H552Z" fill="#bfc6aa"/><path d="M589 560h30" stroke="#8a9675" strokeWidth="5"/>
          <path d="M574 551l4 6 7 1-6 5 2 7-7-4-6 4 2-7-5-5 7-1Z" fill="#e4d8ac" stroke="none"/>
        </Hotspot>
        <g transform="translate(241 435)"><path d="M0 39h117" stroke="#ac987a" strokeWidth="5"/>{[0,1,2,3,4].map(i => <rect key={i} x={i * 15} y={i % 2 ? 5 : 0} width="11" height={i % 2 ? 33 : 38} rx="2" fill={['#98b0a5','#c5a088','#b3a4b8','#d6c18c','#98aaa1'][i]}/>)}<path d="M86 7h23v31H86Z" fill="#c6b898"/><path d="M91 10l-2-13m9 13V-8m7 18 5-13" stroke="#a28670" strokeWidth="4"/></g>
        {fullyTidy && !home.boots && <Hotspot label="Put on the boots" disabled={!isActive('play')} onClick={() => {
          if (!home.coat) { tell('There are my boots! A raincoat will keep the rest of me dry.'); return }
          setHome(h => ({ ...h, boots: true })); tell('Raincoat and boots. Ready for a rainy-day wander!')
        }}><svg x="309" y="528" width="66" height="67"><ObjectArt kind="boots"/></svg><rect x="309" y="528" width="66" height="67" fill="transparent"/></Hotspot>}
        {scatteredToys.filter(t => !home.toys.includes(t.id)).map(t => room === 'play' ? <DragObject key={t.id} {...t} label={`Drag ${t.id} to the toy box`} target={chest} active={activity === 'toys'} destination="the toy box"
          onPlace={() => {
            const toys = [...new Set([...home.toys, t.id])]; setHome(h => ({ ...h, toys }))
            if (toys.length === toyList.length) completed('toys', home.coat ? 'All tidy! My boots were underneath. Shall we put them on?' : 'Everything has a home. And look—my little boots!')
            else tell('Into the box. What else can we put away?')
          }} onMiss={() => tell('Hold a toy and slide it into the open box.')}/> : <Hotspot key={t.id} label={`Explore the ${t.id}`} disabled={room !== 'house'} onClick={() => enter('play', 'toys')}><svg x={t.x} y={t.y} width={t.size} height={t.size}><ObjectArt kind={t.kind}/></svg></Hotspot>)}
        {home.toys.map((id, i) => <svg key={id} x={552 + i * 18} y={515 - i % 2 * 7} width="32" height="32" className="put-away-toy"><ObjectArt kind={id as Thing}/></svg>)}
        {/* Kitchen: food lives on the counter and moves onto Milo's plate. */}
        <Hotspot label="Prepare Milo's snack" disabled={!isActive('kitchen')} onClick={() => enter('kitchen', 'food')}>
          <path d="M719 488h72q-5 26-35 26t-37-26" fill="#d7b59a" stroke="#ae9279" strokeWidth="2"/>
          {(room !== 'kitchen' || activity !== 'food') && <><svg x="727" y="463" width="32" height="32"><ObjectArt kind="apple"/></svg><svg x="750" y="460" width="33" height="33"><ObjectArt kind="banana"/></svg></>}
          <rect x="713" y="460" width="84" height="58" fill="transparent"/>
        </Hotspot>
        <path d="M791 557q70-28 130 0l-9 15H800Z" fill="#c7b394" stroke="#ad9678" strokeWidth="2"/><path d="M805 572l-4 32m101-32 7 32" stroke="#a99070" strokeWidth="5"/>
        <ellipse data-testid="fruit-plate" cx="857" cy="557" rx="43" ry="19" fill="#f0ead6" stroke="#afbdab" strokeWidth="3"/>
        <ellipse cx="857" cy="557" rx="32" ry="12" fill="none" stroke="#d3d9c2" strokeWidth="2"/>
        {home.plate.map((id, i) => <svg key={id} x={828 + i % 3 * 19} y={539 + Math.floor(i / 3) * 12} width="26" height="26" className="put-away-toy"><ObjectArt kind={foodKinds[Number(id)] || 'berry'}/></svg>)}
        {room === 'kitchen' && activity === 'food' && home.plate.length < home.foodGoal && foodKinds.map((kind, i) => !home.plate.includes(String(i)) && <DragObject key={i} id={`fruit-${i}`} kind={kind} x={718 + variation.food[i] % 3 * 28} y={457 + Math.floor(variation.food[i] / 3) * 27} size={30} active target={plate} label={`Drag ${kind} ${i + 1} onto the plate`} destination="Milo's plate" onPlace={() => {
          const selected = [...new Set([...home.plate, String(i)])]; setHome(h => ({ ...h, plate: selected }))
          if (selected.length === home.foodGoal) completed('food', `${home.foodGoal} pieces. Just enough! Thank you for my snack.`)
          else tell(`${selected.length} on my plate. ${home.foodGoal - selected.length} more to go.`)
        }} onMiss={() => help('Slide the fruit onto my little plate.')}/>)}
        <Hotspot label="Picnic surprise" disabled={!isActive('kitchen')} onClick={onPicnic}><g transform="translate(854 480)"><path d="M0 0h49l-5 29H5Z" fill="#ccb48c" stroke="#aa9373" strokeWidth="2"/><path d="M8 1q16-32 33 0M5 10h40M7 20h36m-25-18v24m12-24v24" fill="none" stroke="#ad9776" strokeWidth="2"/><path d="M5-2q13-6 38 0l-4 11-18-3-10 4Z" fill="#b1bba0"/></g><rect x="849" y="463" width="58" height="49" fill="transparent"/></Hotspot>
        {/* Sunny garden corner; soil and leaves provide the clues. */}
        <Hotspot label="Inspect the plant" className={`home-plant home-plant-${home.watered}`} disabled={!isActive('garden')} onClick={() => {
          if (room !== 'garden' || activity !== 'plant') enter('garden', 'plant')
          else { setInspected(true); tell(home.watered ? 'The soil feels damp. Our plant has enough water.' : 'The soil feels dry. What could give it a drink?') }
        }}>
          <path d="M259 717h53l-8 44h-37Z" fill="#c39b7e" stroke="#a68469" strokeWidth="2"/><ellipse cx="286" cy="718" rx="27" ry="8" fill={home.watered ? '#8e8064' : '#b49b76'}/>
          <path d={home.watered ? 'M286 717Q283 686 287 652' : 'M286 717Q286 681 303 685'} fill="none" stroke="#84956a" strokeWidth="4"/>
          <path d={home.watered ? 'M286 689Q251 686 264 664Q289 672 286 689M287 674Q315 649 321 669Q317 689 287 688' : 'M290 697Q257 680 263 705Q270 715 290 697M296 687Q313 671 323 702Q308 708 296 687'} fill={home.watered ? '#9bb17c' : '#b5b58a'} stroke="#8b9b70" strokeWidth="1.5"/>
          {home.watered >= 2 && <path d="M287 708Q312 683 325 699Q314 717 287 708" fill="#a3b987"/>}
          {home.watered >= 3 && <g transform="translate(286 648)" fill="#e5c57f"><ellipse cy="-8" rx="6" ry="10"/><ellipse cx="-8" rx="10" ry="6"/><ellipse cx="8" rx="10" ry="6"/><ellipse cy="8" rx="6" ry="10"/><circle r="5" fill="#bda265"/></g>}
          {home.watered === 1 && <g className="home-water-drops" stroke="#96b9bd" strokeWidth="3" strokeLinecap="round"><path d="M271 684l-2 8m16-14-2 8m17-4-2 8"/></g>}
          <rect x="244" y="643" width="87" height="122" fill="transparent"/>
        </Hotspot>
        {room === 'garden' && activity === 'plant' ? <DragObject id="watering-can" kind="can" x={variation.canX} y={711} size={53} target={plantTarget} active={!home.watered} label="Water the plant with the watering can" destination="the plant's soil" onPlace={() => {
          if (!inspected) { help('Let’s feel the soil first. Tap the plant.'); return }
          setHome(h => ({ ...h, watered: 1 })); completed('plant', 'A little drink. Look, the leaves are standing up!')
        }} onMiss={() => help('Carry the watering can over to the dry soil.')}/> : <svg x={variation.canX} y="711" width="53" height="53"><ObjectArt kind="can"/></svg>}
        <Hotspot label="Look at the plant's sunny window" disabled={!isActive('garden')} onClick={() => {
          if (room === 'house') enter('garden', 'plant'); else tell(home.sleeping ? 'The sun has gone down. Our plant can rest.' : 'Warm sunlight reaches the leaves. Let’s check the soil.')
        }}><rect x="307" y="649" width="77" height="88" fill="transparent"/></Hotspot>
        <Hotspot label="Read the little book" disabled={!isActive('garden')} onClick={onStory}><rect x="850" y="670" width="117" height="95" fill="transparent"/></Hotspot>
        <Hotspot label="Explore the round ball" disabled={!isActive('garden')} onClick={() => { const word=freshShuffle('home-mission',['round','soft','small','blue'])[0];setMissionWord(word);setRoom('garden');setMission(true);tell(`Can you find something ${word} near you?`) }}><svg x="758" y="730" width="42" height="42"><ObjectArt kind="ball"/></svg><rect x="751" y="721" width="57" height="54" fill="transparent"/></Hotspot>
        {/* One original Milo, with only removable clothing layered on top. */}
        <foreignObject x={displayMilo.x} y={displayMilo.y} width={displayMilo.w} height={displayMilo.w * 1.1} className={`home-milo-in-scene ${room === 'house' && !sleeping ? 'milo-comes-home' : ''}`} pointerEvents="none">
          <HomeMilo mood={sleeping ? 'sleepy' : happy ? 'happy' : 'normal'} coat={home.coat && !sleeping && routineFrame < 1} pajamas={sleeping || routineFrame >= 1} boots={home.boots && !sleeping && routineFrame < 1}/>
        </foreignObject>
        {(sleeping || routineFrame >= 2) && <path d="M350 309h86v38h-86Z" fill="#a9b69b"/>}
        {showWardrobe && !home.coat && cloths.map(cloth => <DragObject key={cloth.id} id={cloth.id} kind={cloth.id} x={cloth.x} y={cloth.y} size={44} target={coatTarget} active label={`Dress Milo in the ${cloth.id}`} destination="Milo" onPlace={() => {
          if (cloth.id !== 'raincoat') { help('Hmm… will this keep me dry? Look at the rain outside.'); return }
          setHome(h => ({ ...h, coat: true })); completed('wardrobe', fullyTidy ? 'A raincoat! My boots are waiting by the toy box.' : 'A raincoat! Now, my boots are hiding under the toys…')
        }} onMiss={() => tell('Carry the clothes from the hanger over to Milo.')}/>)}
        {showWardrobe && home.coat && <Hotspot label="Find boots in the play corner" onClick={() => enter('play', 'toys')}><svg x="624" y="305" width="52" height="54"><ObjectArt kind="boots"/></svg><rect x="624" y="305" width="52" height="54" fill="transparent"/></Hotspot>}
        {showBed && routineFrame < 0 && <>
          <path d="M407 320h264v48H407Z" fill="#e4d3b4" opacity=".96"/>
          {routines.map((r, i) => <g key={r.id} data-testid={`bed-slot-${i}`}><rect x={414 + i * 61} y="322" width="53" height="43" rx="8" fill="#eee3ca" stroke="#b9a98c" strokeDasharray="3 4"/><text x={440 + i * 61} y="350" textAnchor="middle" fill="#a29276" fontSize="15">{i + 1}</text>{routine.includes(r.id) && <svg x={421 + i * 61} y="325" width="39" height="39"><ObjectArt kind={r.id}/></svg>}</g>)}
          {variation.routine.map((index, i) => !routine.includes(routines[index].id) && <DragObject key={index} id={`routine-${index}`} kind={routines[index].id} x={428 + i * 61} y={265} size={44} active target={{ x: 414 + routine.length * 61, y: 317, w: 57, h: 53 }} label={`Place ${routines[index].label} next`} destination="the next space on the bedtime quilt" onPlace={() => {
            if (index !== routine.length) { help(['First, let’s get our teeth clean.', 'Clean teeth! What cosy clothes come next?', 'Pajamas on. A little story before sleep?', 'After our story, it’s time to sleep.'][routine.length]); return }
            const next = [...routine, routines[index].id]; setRoutine(next)
            if (next.length === 4) { completed('bed', 'A little brush, brush, brush.'); setRoutineFrame(0) }
            else tell('That comes next. What follows?')
          }} onMiss={() => tell('Slide a picture onto the next empty space on the quilt.')}/>)}
        </>}
        {routineFrame >= 0 && <svg x="419" y="269" width="52" height="52" className="routine-demonstration"><ObjectArt kind={routines[routineFrame].id}/></svg>}
        {sleeping && [
          { id: 'bedroom', x: 448, y: 135, w: 135, h: 132 },
          { id: 'bathroom', x: 742, y: 189, w: 88, h: 85 },
          { id: 'kitchen', x: 779, y: 433, w: 79, h: 77 },
          { id: 'garden', x: 301, y: 652, w: 89, h: 87 },
        ].filter(window => room === 'house' || room === window.id).map(window => <Hotspot key={window.id} label={`Wake Milo with the ${window.id} moonlit window`} onClick={wakeUp}>
          <rect x={window.x} y={window.y} width={window.w} height={window.h} rx="12" fill="transparent"/>
        </Hotspot>)}
        <path d="M210 208V775h795V208L593 42Z" fill="url(#home-grain)" pointerEvents="none"/>
        </g>
      </svg>
    </div>
    <div className="home-dialogue" role="status" aria-live="polite">
      <div className="home-dialogue-milo"><HomeMilo mood={sleeping ? 'sleepy' : happy ? 'happy' : 'normal'} coat={home.coat && !sleeping} pajamas={sleeping}/></div>
      <div className="home-speech"><span>MILO</span><p>{dialogue}</p><button className="replay" aria-label="Replay Milo's words" onClick={() => speak(dialogue)}><Volume2 size={20}/></button></div>
    </div>
    {mission && <div className="home-mission"><div><HomeMilo/><h2>Find something {missionWord}!</h2><p>Look around your room. Take your time.</p><ContinueButton className="primary" onClick={() => { setMission(false); tell(`You found something ${missionWord}! What else did you notice?`); onRecord('Home: real-world mission', 'complete') }}>I found it!</ContinueButton><button className="text-button" onClick={() => { setMission(false); tell('Let’s stay here and explore.') }}>Stay with Milo</button></div></div>}
    {activity && (activity==='toys' ? fullyTidy : activity==='food' ? home.plate.length===home.foodGoal : activity==='plant' ? home.watered>0 : activity==='wardrobe' ? home.coat : false) && <button className="home-new-play" onClick={() => {
      setVariation(makeVariation()); setInspected(false); setRoutine([]); setRoutineFrame(-1)
      const goal = freshShuffle('home-count-'+hard, hard ? [5,6] : [3,4])[0]
      setHome(h => ({ ...h, ...(activity==='toys'?{toys:[]}:activity==='food'?{plate:[],foodGoal:goal}:activity==='plant'?{watered:0}:activity==='wardrobe'?{coat:false,boots:false}:{sleeping:false}) }))
      tell(activity==='food'?`Drag ${goal} ${goal<5?'berries':'pieces of fruit'} onto my plate.`:activity==='toys'?'Drag each toy into the toy box.':activity==='plant'?'Tap the plant to check its soil. Then drag the watering can to it.':activity==='wardrobe'?'Drag the raincoat onto Milo.': 'Put our bedtime pictures in order again.')
    }}>Play again</button>}
    <p id="home-drag-help" className="sr-only">Drag an object to its destination with your finger or mouse. With a keyboard, press Enter to pick it up, use arrow keys to move it, and press Enter to place it. Escape puts it back.</p>
    {room === 'house' && <p className="home-explore-note">Tap a room to explore up close.</p>}
  </main>
}
