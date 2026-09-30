import {useEffect,useRef,useState} from 'react'
import {Volume2,VolumeX} from 'lucide-react'
import {Milo,World} from '../Illustrations'
import {narrate} from '../narration'
import './onboarding.css'
const greetings=[
 {name:'Hug',emoji:'🤗',instruction:'Wrap your arms around each other for a gentle hug.'},
 {name:'High five',emoji:'✋',instruction:'Hold up one hand each. Gently tap your palms together!'},
 {name:'Gentleman handshake',emoji:'🤝',instruction:'Hold each other’s right hand. Give one gentle shake!'},
]
export function TogetherIntro({sound,onSound,onComplete}:{sound:boolean;onSound:()=>void;onComplete:()=>void}){
 const [ready,setReady]=useState(false),[selected,setSelected]=useState<number|null>(null)
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null)
 const title=ready?'Choose how to say hello!':'Get your parent 👨‍👩‍👧'
 const instruction=selected===null?'Choose one together.':greetings[selected].instruction
 const text=ready?selected===null?title:instruction:title
 useEffect(()=>{const element=dialog.current;element?.showModal();return()=>element?.close()},[])
 useEffect(()=>{heading.current?.focus({preventScroll:true})},[ready])
 useEffect(()=>{if(sound)return narrate(text)},[sound,text])
 return <main className="together-intro"><World/><dialog ref={dialog} className="together-popup" aria-labelledby="together-title" onCancel={e=>e.preventDefault()}>
  <div className="together-tools"><button className="replay" aria-label="Hear Milo again" onClick={()=>{if(sound)narrate(text)}}><Volume2 size={22}/></button><button className="round-button" aria-label={sound?'Turn sound off':'Turn sound on'} onClick={onSound}>{sound?<Volume2 size={22}/>:<VolumeX size={22}/>}</button></div>
  <div className="together-milo"><Milo mood={selected===null?'curious':'happy'}/></div>
  <h1 id="together-title" ref={heading} tabIndex={-1}>{title}</h1>
  {ready&&<><div className="together-choices">{greetings.map((g,i)=><button key={g.name} aria-label={g.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span aria-hidden="true">{g.emoji}</span><span>{g.name}</span></button>)}</div><p className="together-instruction" aria-live="polite">{instruction}</p></>}
  {(!ready||selected!==null)&&<button className="primary" onClick={()=>ready?onComplete():setReady(true)}>We're ready! 🙌</button>}
 </dialog></main>
}
