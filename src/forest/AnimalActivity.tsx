import { useRecall } from '../play/useRecall'
import { scheduleForestSound } from '../audio/forestSounds'
import { dialogueId } from '../audio/MiloVoice'
import { freshShuffle } from '../variation'
import { narrate, stopNarration } from '../narration'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ForestAnimal } from './ForestArt'
import type { Animal } from './forestJourney'
import './activities.css'

type Props = { sound: boolean; onComplete: () => void }
type PlayAnimal = Exclude<Animal, 'bird'>
function Friend({ kind, className = '' }: { kind: PlayAnimal; className?: string }) {
  return <svg className={`play-friend ${className}`} viewBox="0 0 160 180" aria-hidden="true"><ForestAnimal kind={kind}/></svg>
}
function Frame({ kind, title, text, children, sound }: { kind: PlayAnimal; title: string; text: string; children: ReactNode; sound: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [])
  useEffect(() => { if (sound) return narrate(text, `milo.forest.${kind}.activity.${dialogueId(text).split(".").pop()}`) }, [sound, text, kind])
  return <section className="animal-play" aria-label={`${kind} activity`}>
    <div className="play-intro"><Friend kind={kind}/><div><h2 ref={heading} tabIndex={-1}>{title}</h2><p aria-live="polite">{text}</p></div></div>
    {children}
  </section>
}
export function Action({ children, onClick, disabled = false }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button className="play-action" onClick={onClick} disabled={disabled}>{children}</button>
}

function Frog({ sound, onComplete }: Props) {
  const [step, setStep] = useState(0), [hint, setHint] = useState(false)
  const [variation] = useState(() => ({ counts: freshShuffle('frog-counts', [1, 2, 3]), sizes: freshShuffle('frog-sizes', ['big', 'tiny']), answers: freshShuffle('frog-answers', [1, 2, 3, 4]) }))
  const [a, b] = variation.counts
  const groups = [a, b, a, b]
  const tiny = step >= 2 && variation.sizes[step - 2] === 'tiny'
  const count = step === 0 ? a : step === 1 ? b : 1
  const messages = [`Boing! Try ${a} jumps with me. You can hop your fingers, too.`, `Now ${b} jumps! Count each landing.`, ...variation.sizes.map(size => size === 'big' ? 'Can you make one BIG frog jump?' : 'And one teeny-tiny jump? Boop!'), `${a} jumps, then ${b}. ${a}, then ${b}. How many jumps next?`, `${a}! You helped me across.`]
  return <Frame kind="frog" title="Hop with Frog" text={messages[step]} sound={sound}>
    {step < 4 && <div className="jump-pictures" aria-label="Frog on the ground, frog in the air, frog landing on the ground">
      <svg viewBox="0 0 510 160" role="img" aria-label={step >= 2 ? tiny ? 'A tiny low jump' : 'A big high jump' : step === 3 ? 'A tiny low jump' : 'Ground, jump, land'}>
        <path d={tiny ? 'M85 125Q250 58 425 125' : 'M85 125Q250 -65 425 125'} fill="none" stroke="#a5b58c" strokeWidth="3" strokeDasharray="7 7"/>
        {[0,1,2].map(i => <g key={i} transform={`translate(${i*170+37} ${i===1 ? tiny ? 49 : 0 : 63})`}><svg width="90" height="80"><ForestAnimal kind="frog"/></svg></g>)}
        <path d="M36 143h96m245 0h96" stroke="#a4b394" strokeWidth="5" strokeLinecap="round"/>
      </svg><div className="picture-labels"><span>Ground</span><span>{step>=2 ? tiny ? 'Tiny jump' : 'BIG jump' : 'In the air'}</span><span>Land</span></div>
      <p>Try {count === 1 ? 'one jump' : `${count} jumps`}, then tap Done.</p>
    </div>}
    {step === 4 && <><div className="jump-pattern" aria-label={`${groups.join(", ")}, what comes next?`}>{groups.map((n, i) => <span key={i} className={hint && i % 2 === 0 ? 'useful-clue' : ''}>{Array.from({ length: n }, (_, j) => <i key={j}/>)}<b>{n}</b></span>)}<span>?</span></div><p className="play-hint" role="status">{hint ? `Hmm... look at the pairs: ${a}, ${b}. ${a}, ${b}. What starts the next pair?` : 'How many jumps next?'}</p><div className="play-actions">{variation.answers.map(n => <Action key={n} onClick={() => n === a ? setStep(5) : setHint(true)}>{n} jumps</Action>)}</div></>}
    <div className="play-actions">{step < 4 ? <Action onClick={() => setStep(v => v + 1)}>Done</Action> : step === 5 ? <Action onClick={onComplete}>On across the stones</Action> : null}</div>
  </Frame>
}

function Bear({ sound, onComplete }: Props) {
  const [step, setStep] = useState(0), [height, setHeight] = useState(0), [hint, setHint] = useState(false)
  const [variation] = useState(() => ({ heights: freshShuffle('bear-heights', [[230,158,86], [242,178,108], [221,147,70]])[0], mirror: freshShuffle('bear-side', [false, true])[0] }))
  const branchY = variation.heights
  const bearY = height ? branchY[height - 1] - 111 : 191
  const messages = ['First, reach your arms up like Bear. Then tap Done. You can sit or stand.', 'Stretch a little higher, then relax and tap Done. Oof, my tummy wobbled!', height === 0 ? 'Now use the picture. Tap the lowest branch Bear can reach first.' : height < 3 ? 'That holds me! Tap the next branch just above my paws.' : 'Sticky paws and a happy tummy. You helped me find a whole way up!']
  return <Frame kind="bear" title="A way to the honey" text={messages[step]} sound={sound}>
    <svg className={`bear-tree ${hint ? 'show-reach' : ''}`} viewBox="0 -40 480 355" role="group" aria-label="Bear and three branches">
      <g transform={variation.mirror ? "translate(480 0) scale(-1 1)" : undefined}><path d="M285 295L295 20h35l12 275" fill="#b2a07c"/><ellipse cx="310" cy="30" rx="110" ry="33" fill="#9aae87"/>
      <path d="M348 48h40l-4 27h-32Z" fill="#dbbc78"/>
      <path d={`M196 ${bearY+89}v-88`} stroke="#bcc69a" strokeWidth="52" strokeLinecap="round" strokeDasharray="3 9" opacity={hint ? .9 : .35}/>
      {branchY.map((y, i) => <g key={y} role={step === 2 && height < 3 ? 'button' : undefined} tabIndex={step === 2 && height < 3 ? 0 : -1} aria-label={`${['Low', 'Middle', 'High'][i]} branch`} className={`tree-branch ${hint && i === height ? 'useful-clue' : ''}`} onClick={() => choose(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(i) } }}>
        <rect x="195" y={y-17} width="170" height="44" rx="18" fill="transparent"/><path d={`M205 ${y}Q270 ${y+8} 335 ${y-4}`} stroke="#8e8264" strokeWidth="12" strokeLinecap="round"/><ellipse cx="218" cy={y-8} rx="13" ry="6" fill={height > i ? '#dcce96' : '#9eaf85'}/>
      </g>)}
      <g className={`climbing-bear ${step < 2 ? 'bear-reaching' : ''}`} style={{ transform: `translate(120px, ${bearY}px)` }}><svg width="105" height="120"><ForestAnimal kind="bear" settled={height === 3}/></svg></g></g>
    </svg>
    <p className="play-hint" role="status">{hint ? 'Hmm... that is a long reach. Look for a branch just above my paws.' : step === 2 && height < 3 ? 'Touch a branch to guide Bear. One careful step at a time.' : 'Reach in your own way, standing or sitting.'}</p>
    <div className="play-actions">{step < 2 ? <Action onClick={() => setStep(v => v + 1)}>Done</Action> : height === 3 ? <Action onClick={onComplete}>Enjoy your honey, Bear</Action> : null}</div>
  </Frame>
  function choose(i: number) { if (step !== 2 || height === 3) return; if (i === height) { setHeight(v => v + 1); setHint(false) } else setHint(true) }
}

function Snake({ sound, onComplete }: Props) {
  const [step, setStep] = useState(0), [hint, setHint] = useState(false), [moves, setMoves] = useState<string[]>([])
  const [variation] = useState(() => ({ directions: freshShuffle('snake-direction', ['Left', 'Right']), moves: freshShuffle('snake-moves', ['← Sway', 'Curl', 'Wiggle', 'Stretch ↑']) }))
  const [first, answer] = variation.directions
  const text = [`${first}... ${answer}... ${first}... I forget! Which way comes next?`, `${answer}! Can you sway with me? ${first}, ${answer}, ${first}, ${answer}. Your hand can be a snake, too.`, 'What would YOUR snake do? Make a little movement trail, then try it with your body or hand.', 'A movement all your own! I wonder where your wiggles will go next.'][step]
  return <Frame kind="snake" title="Wiggles with Baby Snake" text={text} sound={sound}>
    <div className="snake-trail"><Friend kind="snake"/><div className="direction-trail" aria-label={`${first}, ${answer}, ${first}, unknown`}>{step < 2 ? <>{[first,answer,first,step===0?'?':answer].map((direction,i)=><span key={i} className={hint && i===0?'useful-clue':''}>{direction==='Left'?'← Left':direction==='Right'?'Right →':'?'}</span>)}</> : moves.map((m, i) => <span key={i}>{m}</span>)}</div></div>
    {hint && step === 0 && <p className="play-hint" role="status">Let's look again. We switch sides each time. After {first.toLowerCase()} comes...</p>}
    <div className="play-actions">{step === 0 ? <>{['Left', 'Right'].map(direction => <Action key={direction} onClick={() => { if(direction === answer) { setStep(1); setHint(false) } else setHint(true) }}>{direction}</Action>)}</> : step === 1 ? <><Action onClick={() => setStep(2)}>Done</Action></> : step === 2 ? <>{variation.moves.map(m => <Action key={m} disabled={moves.length >= 6} onClick={() => setMoves(v => [...v, m])}>{m}</Action>)}<Action onClick={() => setMoves([])}>Start my trail again</Action><Action disabled={!moves.length} onClick={() => setStep(3)}>I tried my movement</Action><Action onClick={() => setStep(3)}>I invented a different movement</Action></> : <Action onClick={onComplete}>Follow the bend</Action>}</div>
    {step === 2 && <p className="play-hint">Choose up to six movements. Every trail is welcome.</p>}
  </Frame>
}

const hidingPlaces = ['Rock', 'Flowers', 'Stump', 'Bush']
function PlaceArt({ index, acorn }: { index: number; acorn: boolean }) {
  return <svg viewBox="0 0 130 95" aria-hidden="true"><ellipse cx="65" cy="79" rx="54" ry="9" fill="#c3cbaa"/>{index === 0 ? <path d="M20 73L31 43l39-13 33 22 7 24Z" fill="#9ca99b"/> : index === 1 ? <g stroke="#91a16e" strokeWidth="4">{[37,65,91].map(x => <g key={x}><path d={`M${x} 78V35`}/><circle cx={x} cy="34" r="15" fill="#e2cea1"/><circle cx={x} cy="34" r="5" fill="#b9a477"/></g>)}</g> : index === 2 ? <><path d="M34 40h59l10 38H25Z" fill="#ad9775"/><ellipse cx="63" cy="41" rx="30" ry="12" fill="#d8c5a0"/><ellipse cx="63" cy="41" rx="17" ry="6" fill="none" stroke="#b69c76"/></> : <g fill="#8da77b"><circle cx="35" cy="60" r="24"/><circle cx="65" cy="45" r="30"/><circle cx="94" cy="61" r="23"/></g>}{acorn && <g transform="translate(51 57)"><path d="M0 9h26q-1 29-13 30Q0 33 0 9" fill="#c9a574"/><path d="M-3 11q16-22 32 0v6H-3Z" fill="#827153"/><path d="M13 0l3-6" stroke="#827153" strokeWidth="3"/></g>}</svg>
}
function Squirrel({ sound, onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [locations] = useState(() => [freshShuffle('acorns-two', [0,1,2,3]).slice(0,2), freshShuffle('acorns-three', [0,1,2,3]).slice(0,3)])
  const targets = locations[round]
  const {show,setShow,found,setFound,hint,setHint,done,choose} = useRecall(targets)
  useEffect(() => {
    if (!show) return
    const timer = window.setTimeout(() => setShow(false), 6500)
    return () => clearTimeout(timer)
  }, [show, round, setShow])
  return <Frame kind="squirrel" title="Where did I tuck them?" text={done ? round === 0 ? 'My two acorns! Shall we try three little hiding places?' : 'All three! My winter snack is safe. Thank you!' : show ? `Here are ${targets.length} acorns. Have a good look. I always forget where I put things!` : 'Now where were they? Peek beneath the places you remember.'} sound={sound}>
    <div className="acorn-clearing">{hidingPlaces.map((name, i) => <button key={name} className={`${found.includes(i) ? 'acorn-found' : ''} ${hint === i ? 'rustling-place' : ''}`} disabled={show || done || found.includes(i)} aria-label={`Look under ${name}`} onClick={() => choose(i)}><PlaceArt index={i} acorn={(show && targets.includes(i)) || found.includes(i)}/><span>{name}</span>{found.includes(i) && <small>Acorn found</small>}</button>)}</div>
    <p className="play-hint" role="status">{hint !== null ? 'Just a little rustle here. Shall we look at the hiding places again?' : `${found.length} of ${targets.length} acorns tucked safely away.`}</p>
    <div className="play-actions">{done ? <Action onClick={() => { if (round === 0) { setRound(1); setFound([]); setShow(true); setHint(null) } else onComplete() }}>{round === 0 ? 'Hide three acorns' : 'Safe and snug, Squirrel'}</Action> : show ? <Action onClick={() => setShow(false)}>Ready to remember</Action> : <Action onClick={() => { setShow(true); setFound([]); setHint(null) }}>Look again</Action>}</div>
  </Frame>
}

const sounds = ['Water', 'Leaves', 'Frog', 'Wings']
const soundClues = ['Splish, trickle, splash. Water keeps tumbling over little stones.', 'Shhh, rustle, shhh. Dry leaves brush together in the breeze.', 'Ribbit... ribbit. A low croak comes from the puddle.', 'Flap-flap, a pause, then flap-flap. Something moves through the air.']
const causes = [['A stream over stones', 'A sleepy bear'], ['Wind in the branches', 'Acorns sitting still'], ['Frog beside the puddle', 'A quiet rock'], ['A bird flying toward the nest', 'Bear walking on the ground']]
function Owl({ sound, onComplete }: Props) {
  const [round, setRound] = useState(0), [phase, setPhase] = useState(0), [heard, setHeard] = useState(false), [caption, setCaption] = useState(false), [hint, setHint] = useState(false), [playing, setPlaying] = useState(false)
  const [variation] = useState(() => ({ order: [...freshShuffle('owl-sounds', [0,1,2]), 3], choices: freshShuffle('owl-choices', [0,1,2,3]), causes: freshShuffle('owl-causes', [0,1]) }))
  const soundIndex = variation.order[round]
  const context = useRef<AudioContext | null>(null), timer = useRef(0)
  function stopAudio() { if (context.current) { void context.current.close(); context.current = null } clearTimeout(timer.current); setPlaying(false) }
  useEffect(() => () => { if (context.current) void context.current.close(); clearTimeout(timer.current) }, [])
  useEffect(() => { if (!sound) { if (context.current) { void context.current.close(); context.current = null } clearTimeout(timer.current) } }, [sound])
  async function listen() {
    stopAudio(); stopNarration(); setHeard(true)
    if (!sound) { setCaption(true); return }
    try {
      const ctx = new AudioContext(); context.current = ctx; await ctx.resume()
      if (context.current !== ctx) return
      setPlaying(true)
      // Soft synthesized environmental cues, generated locally without downloads.
      scheduleForestSound(ctx, soundIndex)
      timer.current=window.setTimeout(stopAudio,2500)
    } catch { stopAudio(); setCaption(true) }
  }
  const text = phase === 2 ? round === 3 ? 'Wings, and a feather by the tree. A bird may have carried the light! Let us look gently.' : 'You listened, then looked for what could make it. Let us listen once more.' : phase === 1 ? 'What could have made that sound? Picture where it might come from.' : 'Be still with me a moment. What do you hear in our forest?'
  return <Frame kind="owl" title="Listen with Owl" text={text} sound={sound}>
    <div className={`owl-listening ${playing && sound ? 'is-listening' : ''}`}><span aria-hidden="true">{playing && sound ? ')))' : '~ ~ ~'}</span><Action onClick={listen}>{playing && sound ? 'Play sound again' : 'Listen to the forest'}</Action><Action onClick={() => { stopAudio(); setCaption(true); setHeard(true) }}>Read a sound clue</Action></div>
    {caption && <p className="sound-caption">{soundClues[soundIndex]}</p>}
    {phase === 0 && <div className="sound-choices">{variation.choices.map(i => <Action key={i} disabled={!heard} onClick={() => { stopAudio(); if(i===soundIndex) { setPhase(1); setHint(false) } else { setHint(true); setCaption(true) } }}>{sounds[i]}</Action>)}</div>}
    {phase === 1 && <div className="play-actions">{variation.causes.map(i => <Action key={i} onClick={() => { if(i===0) { stopAudio(); setPhase(2); setHint(false) } else { setHint(true); setCaption(true) } }}>{causes[soundIndex][i]}</Action>)}</div>}
    {hint && <p className="play-hint useful-clue" role="status">Hmm... listen again, or read the clue. What moves in that way?</p>}
    {phase === 2 && <div className="play-actions"><Action onClick={() => { stopAudio(); if(round===3) onComplete(); else { setRound(v=>v+1); setPhase(0); setHeard(false); setCaption(false); setHint(false) } }}>{soundIndex===3 ? 'Follow the wing sounds' : 'Another forest sound'}</Action></div>}
  </Frame>
}

export function AnimalActivity({ animal, ...props }: Props & { animal: PlayAnimal }) {
  switch(animal) { case 'frog': return <Frog {...props}/>; case 'bear': return <Bear {...props}/>; case 'snake': return <Snake {...props}/>; case 'squirrel': return <Squirrel {...props}/>; case 'owl': return <Owl {...props}/> }
}
