import { narrate } from '../narration'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Footprints, Home, Volume2, VolumeX } from 'lucide-react'
import { Milo } from '../Illustrations'
import { ForestAnimal, ForestLandscape, ForestStar } from './ForestArt'
import { FOREST_STORAGE_KEY, journeyStops, readForestProgress } from './forestJourney'
import './forest.css'
import { AnimalActivity } from './AnimalActivity'

type View = { x: number; y: number; width: number; height: number }
const names = { frog: 'Frog', bear: 'Bear', snake: 'Baby Snake', squirrel: 'Squirrel', owl: 'Owl', bird: 'Little Bird' }

function cameraFor(index: number, aspect: number): View {
  const [x, y, size] = journeyStops[index].camera
  const portrait = aspect < .95
  const width = portrait ? size * (index === 0 ? .5 : .57) : size
  return { x: x - width / 2, y: y - width / aspect / 2, width, height: width / aspect }
}

/** Continuous forest environment with child-paced animal encounters. */
export function ForestWorld({ sound, onSound, onWorld, onHome, onStory }: { sound: boolean; onSound: () => void; onWorld: () => void; onHome: () => void; onStory: () => void }) {
  const [progress, setProgress] = useState(readForestProgress)
  const [aspect, setAspect] = useState(1.65)
  const moving = false
  const destination: number | null = null
  const view = cameraFor(progress.current, aspect)
  const position = { x: journeyStops[progress.current].point[0], y: journeyStops[progress.current].point[1] }
  const container = useRef<HTMLDivElement>(null)
  const stop = journeyStops[progress.current]
  const currentIndex = progress.current
  const line = stop.lines[progress.line]
  const activityLine = currentIndex === 5 ? 3 : 2
  const needsActivity = currentIndex >= 1 && currentIndex <= 5 && !progress.completed.includes(currentIndex)
  const activityActive = needsActivity && progress.line >= activityLine && !moving
  const atLastLine = progress.line === stop.lines.length - 1
  const finished = progress.current === journeyStops.length - 1 && atLastLine
  const restored = progress.resolved.includes(7)
  const finalVisible = progress.furthest >= 6 || destination === 6 || destination === 7

  const narrationId = line.reveal ? 'milo.clueFound' : `milo.forest.${stop.id}.${progress.line === 0 ? 'intro' : 'line.' + progress.line}`
  function speak(text: string) { if (sound) narrate(text, narrationId) }

  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width && entry.contentRect.height) setAspect(entry.contentRect.width / entry.contentRect.height)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    try { localStorage.setItem(FOREST_STORAGE_KEY, JSON.stringify(progress)) } catch { /* Storage is optional. */ }
  }, [progress])

  useEffect(() => {
    if (sound && !activityActive) return narrate(line.text, narrationId)
  }, [line.text, narrationId, sound, activityActive])

  function travel(index: number) {
    if (index < 0 || index >= journeyStops.length || index === progress.current) return
    if (needsActivity && index > progress.current) return
    if (index > progress.furthest && !(index === progress.current + 1 && atLastLine)) return
    setProgress(old => ({ ...old, current: index, furthest: Math.max(old.furthest, index), line: 0,
      resolved: [...new Set([...old.resolved, ...(atLastLine && !needsActivity ? [old.current] : []), ...(journeyStops[index].lines[0].reveal ? [index] : [])])],
    }))
  }

  function advance() {
    if (activityActive) return
    if (!atLastLine) {
      setProgress(old => {
        const nextLine = old.line + 1
        return { ...old, line: nextLine, resolved: stop.lines[nextLine].reveal ? [...new Set([...old.resolved, old.current])] : old.resolved }
      })
    } else if (finished) onHome()
    else travel(progress.current + 1)
  }

  const nextStop = journeyStops[progress.current + 1]
  const destinationText = destination === null ? '' : journeyStops[destination].place

  return <main className={`forest-world ${restored ? 'forest-sunset' : ''} ${moving ? 'forest-travelling' : ''} ${activityActive ? 'with-animal-play' : ''}`}>
    <header className="forest-header">
      <button className="round-button" aria-label={progress.current === 0 ? 'Back to world' : 'Walk back along the path'} disabled={moving} onClick={() => progress.current === 0 ? onWorld() : travel(progress.current - 1)}><ArrowLeft size={21}/></button>
      <div className="forest-heading"><span>MILO’S LITTLE WORLD</span><h1>{moving ? 'A little further along…' : stop.place}</h1></div>
      <div className="forest-tools"><button className="round-button" aria-label={sound ? 'Turn sound off' : 'Turn sound on'} onClick={onSound}>{sound ? <Volume2 size={21}/> : <VolumeX size={21}/>}</button><button className="round-button" aria-label="Return to world" onClick={onWorld}><Home size={21}/></button></div>
    </header>
    <div className="forest-viewport" ref={container}>
      <svg className="forest-scene" viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`} role="group" aria-label="The winding forest path" data-current-stop={stop.id} data-travelling={moving}>
        <ForestLandscape resolved={progress.resolved} revealFinal={finalVisible} restored={restored} birdHasLantern={progress.resolved.includes(6)}/>
        {journeyStops.map((encounter, index) => {
          if (!encounter.animal || !encounter.animalBox) return null
          const [x, y, width, height] = encounter.animalBox
          const active = index === progress.current
          const visited = index <= progress.furthest
          const available = !moving && !activityActive && (visited || index === progress.current + 1 && atLastLine)
          const visible = index === 6 ? finalVisible : index <= progress.furthest + 3
          const distanceOpacity = visited ? 1 : index === progress.furthest + 1 ? .94 : index === progress.furthest + 2 ? .68 : .4
          const label = `${active ? 'Talk to' : visited ? 'Visit' : 'Walk to'} ${names[encounter.animal]}`
          return <g key={encounter.id} transform={`translate(${x} ${y})`} data-animal={encounter.animal} data-settled={progress.resolved.includes(index)}
            opacity={distanceOpacity} visibility={visible ? 'visible' : 'hidden'} className={`forest-animal ${available ? 'can-visit' : ''} ${active ? 'near-milo' : ''} ${active && encounter.animal === 'frog' && progress.line === 2 ? 'one-frog-hop' : ''}`}
            role={available ? 'button' : 'img'} aria-label={label} tabIndex={available && visible ? 0 : -1}
            onClick={() => { if (available) { if (active) advance(); else travel(index) } }}
            onKeyDown={e => { if (available && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (active) advance(); else travel(index) } }}>
            <svg width={width} height={height} pointerEvents="none"><ForestAnimal kind={encounter.animal} settled={progress.resolved.includes(index)}/></svg>
            <rect x="-16" y="-8" width={width + 32} height={height + 16} rx="18" fill="transparent"/>
            <title>{names[encounter.animal]}</title>
          </g>
        })}
        {progress.resolved.includes(3) && <g transform="translate(645 492) scale(.44)" opacity=".76" pointerEvents="none"><svg width="106" height="64"><ForestAnimal kind="snake" settled/></svg></g>}
        {/* The same original Milo component walks along the actual path geometry. */}
        <g transform={`translate(${position.x} ${position.y})`} data-testid="forest-milo" pointerEvents="none">
          <foreignObject x="-60" y="-129" width="120" height="132"><div className={moving ? 'forest-milo-walk' : 'forest-milo-still'}><Milo mood={restored ? 'happy' : 'curious'}/></div></foreignObject>
          {!progress.resolved.includes(6) && <g transform="translate(54 -37)"><path d="M-8 0h16v20H-8Z" fill="#ddc58e" stroke="#a99a75" strokeWidth="2"/><path d="M-4 0v-5q4-7 8 0v5" stroke="#a99a75" strokeWidth="2" fill="none"/><path d="M0 2v15" stroke="#f0dfa9" strokeWidth="4"/></g>}
          {progress.resolved.includes(6) && !restored && <ForestStar x={48} y={-39} size={12}/>}
        </g>
        {nextStop && atLastLine && !moving && !needsActivity && <g className="forest-path-invitation" role="button" tabIndex={0} aria-label={`Follow the path to ${nextStop.place}`}
          transform={`translate(${nextStop.point[0]} ${nextStop.point[1] + 21})`} onClick={() => travel(progress.current + 1)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); travel(progress.current + 1) } }}>
          <circle r="33" fill="#f5edd6" fillOpacity=".88" stroke="#c5c6a3" strokeWidth="1.5"/><Footprints x="-14" y="-14" width="28" height="28" color="#859474" strokeWidth="1.8"/>
        </g>}
        {progress.current === 0 && !moving && <g transform="translate(871 873) rotate(7)" pointerEvents="none"><path d="M0 0v64" stroke="#a28d6b" strokeWidth="6"/><path d="M-41-3h80l15 17-15 17h-80Z" fill="#d2ba92" stroke="#b29c77" strokeWidth="2"/><path d="M-24 13h46m-8-8 10 8-10 8" stroke="#8e8f6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g>}
      </svg>
      {moving && <p className="forest-travel-caption" aria-live="polite">Following the path…</p>}
    </div>
    {activityActive && stop.animal && stop.animal !== 'bird' && <AnimalActivity key={stop.id} animal={stop.animal} sound={sound} onComplete={() => setProgress(old => ({ ...old, completed: [...new Set([...old.completed, old.current])], resolved: [...new Set([...old.resolved, old.current])], line: activityLine + 1 }))}/>}
    {!activityActive && progress.completed.includes(currentIndex) && stop.animal && <button className="forest-play-again" onClick={() => setProgress(old => ({ ...old, completed: old.completed.filter(n => n !== old.current), line: activityLine }))}>Play with {names[stop.animal]} again</button>}
    {!activityActive && <section className="forest-dialogue" aria-label="Forest story">
      <div className="forest-speech"><span className="forest-speaker">{moving ? 'MILO' : line.speaker.toUpperCase()}</span><p aria-live="polite">{moving ? 'I wonder what we’ll find around this bend.' : line.text}</p></div>
      <button className="replay" disabled={moving} aria-label="Replay forest dialogue" onClick={() => speak(line.text)}><Volume2 size={21}/></button>
      <button className="forest-continue" disabled={moving} onClick={advance}>
        {moving ? 'On our way…' : finished ? 'Walk home' : atLastLine ? progress.current === 6 ? 'To the Story Tree' : 'Follow the path' : 'And then?'}
        {finished ? <Home size={18}/> : <ArrowRight size={18}/>}</button>
    </section>}
    {finished && <button className="forest-play-again" onClick={onStory}>Read beneath the Story Tree</button>}
    <p className="forest-bottom-note">{restored ? 'A little light for everyone.' : 'There’s a little wonder around every bend.'}</p>
    <span className="sr-only" aria-live="polite">{moving ? `Walking toward ${destinationText}` : `Milo is at ${stop.place}`}</span>
  </main>
}
