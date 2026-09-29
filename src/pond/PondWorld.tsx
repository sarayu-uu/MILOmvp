import {useEffect,useState} from 'react'
import {ArrowLeft,Volume2,VolumeX} from 'lucide-react'
import {Milo} from '../Illustrations'
import {narrate,stopNarration} from '../narration'
import {freshShuffle} from '../variation'
import {Bubble,Fish,Lily,PondArt,Shape} from './PondArt'
import {fishColors} from './pondData'
import './pond.css'
type Activity='colors'|'numbers'|'alphabet'|'shapes'
const areas:Activity[]=['colors','numbers','alphabet','shapes']
const names={colors:'Color fish',numbers:'Frog lily pads',alphabet:'Letter bubbles',shapes:'Shape shells'}
function makeRound(kind:Activity){
 const colors=freshShuffle('pond-colors',fishColors),letters=freshShuffle('pond-letters',['A','B','C','D','E']),shapes=freshShuffle('pond-shapes',['circle','square','triangle'])
 const target=kind==='colors'?freshShuffle('pond-color-target',fishColors.map(c=>c.name))[0]:kind==='alphabet'?freshShuffle('pond-letter-target',['A','B','C','D','E'])[0]:kind==='shapes'?freshShuffle('pond-shape-target',['circle','square','triangle'])[0]:String(freshShuffle('pond-count',[1,2,3,4,5])[0])
 return{target,colors,letters:letters.filter(l=>l!==target).slice(0,2).concat(target).sort((a,b)=>letters.indexOf(a)-letters.indexOf(b)),shapes}
}
function PondGame({kind,sound}:{kind:Activity;sound:boolean}){
 const [round,setRound]=useState(()=>makeRound(kind)),[done,setDone]=useState(false),[hint,setHint]=useState(false),[counted,setCounted]=useState<number[]>([])
 const instruction=kind==='colors'?`Find the ${round.target} fish!`:kind==='numbers'?'How many frogs? Tap each frog.':kind==='alphabet'?`Find ${round.target}!`:`Find the ${round.target}!`
 const text=done?kind==='numbers'?`${round.target} ${round.target==='1'?'frog':'frogs'}! You counted them all.`:'You found it!':hint?'Let\u2019s look again. '+instruction:instruction
 useEffect(()=>{if(sound)return narrate(text)},[text,sound])
 function choose(value:string){if(done)return;if(value===round.target){setDone(true);setHint(false)}else setHint(true)}
 return <>
  <div className="pond-prompt"><h2 aria-live="polite">{text}</h2><button className="round-button" aria-label="Hear pond instruction" onClick={()=>{if(sound)narrate(text)}}><Volume2 size={20}/></button></div>
  <div className={`pond-play pond-${kind}`}><PondArt/>
   {kind==='colors'&&<><div className="pond-example" aria-label={`${round.target} color clue`} style={{background:fishColors.find(c=>c.name===round.target)?.fill}}/><div className="pond-objects">{round.colors.map(c=><button key={c.name} aria-label={`${c.name} fish`} disabled={done} className={done&&c.name===round.target?'pond-found':''} onClick={()=>choose(c.name)}><Fish color={c.fill}/></button>)}</div></>}
   {kind==='numbers'&&<div className="pond-objects">{Array.from({length:Number(round.target)},(_,i)=><button key={i} aria-label={`Count frog ${i+1}`} disabled={counted.includes(i)} className={counted.includes(i)?'pond-found':''} onClick={()=>{const next=[...counted,i];setCounted(next);if(sound)narrate(String(next.length));if(next.length===Number(round.target))setDone(true)}}><Lily frog/>{counted.includes(i)&&<span className="pond-count">{counted.indexOf(i)+1}</span>}</button>)}</div>}
   {kind==='alphabet'&&<><span className="pond-example-letter" aria-label="Letter to find">{round.target}</span><div className="pond-objects">{round.letters.map(letter=><button key={letter} aria-label={`Bubble ${letter}`} className={done&&letter===round.target?'pond-found':''} disabled={done} onClick={()=>choose(letter)}><Bubble letter={letter}/></button>)}</div></>}
   {kind==='shapes'&&<><div className="pond-example-shape" aria-label={`${round.target} shape clue`}><Shape kind={round.target}/></div><div className="pond-objects">{round.shapes.map(shape=><button key={shape} aria-label={`${shape} shell`} className={done&&shape===round.target?'pond-found':''} disabled={done} onClick={()=>choose(shape)}><Shape kind={shape}/></button>)}</div></>}
  </div>
  <div className="pond-bottom"><div className="pond-milo"><Milo mood={done?'happy':'curious'}/></div>{done?<button className="primary" onClick={()=>{stopNarration();setRound(makeRound(kind));setDone(false);setHint(false);setCounted([])}}>Play again</button>:<p>{kind==='numbers'?`${counted.length} counted`:'Take your time.'}</p>}</div>
 </>
}
export function PondWorld({sound,onSound,onBack}:{sound:boolean;onSound:()=>void;onBack:()=>void}){
 const [activity,setActivity]=useState<Activity|null>(null)
 useEffect(()=>{if(sound&&!activity)return narrate('Hello, little pond! Tap a friend to play.')},[activity,sound])
 return <main className="pond-world"><header className="pond-header"><button className="round-button" aria-label={activity?'Back to pond':'Back to world'} onClick={()=>{stopNarration();if(activity)setActivity(null);else onBack()}}><ArrowLeft size={21}/></button><div><span>MILO'S LITTLE WORLD</span><h1>{activity?names[activity]:"Milo's Pond"}</h1></div><button className="round-button" aria-label={sound?'Turn sound off':'Turn sound on'} onClick={onSound}>{sound?<Volume2 size={21}/>:<VolumeX size={21}/>}</button></header>
 {activity?<PondGame key={activity} kind={activity} sound={sound}/>:<><p className="pond-welcome">Tap a friend to play.</p><div className="pond-ecosystem"><PondArt/>{areas.map(kind=><button key={kind} className={`pond-area pond-area-${kind}`} aria-label={names[kind]} onClick={()=>setActivity(kind)}>{kind==='colors'?<Fish/>:kind==='numbers'?<Lily frog/>:kind==='alphabet'?<Bubble/>:<Shape/>}<span>{names[kind]}</span></button>)}</div><div className="pond-bottom"><div className="pond-milo"><Milo mood="curious"/></div><p>A little splash of discovery.</p></div></>}
 </main>
}
