import {ContinueButton} from '../play/ContinueButton'
import {useCallback,useEffect,useState} from 'react'
import {ArrowLeft,ArrowRight,Volume2,VolumeX} from 'lucide-react'
import {Milo} from '../Illustrations'
import {narrate,stopNarration} from '../narration'
import {dialogueId} from '../audio/MiloVoice'
import {bookTitles,makeStoryVariation,scenesFor} from './storyData'
import type {BookId,Scene,StoryVariation} from './storyData'
import {BookCover,LibraryTree,StoryObject,StoryScene} from './StoryArt'
import {StoryActivity} from './StoryActivities'
import './story.css'
export const STORY_STORAGE='milo-story-library-v1'
function loadKeepsakes():BookId[]{try{const value:unknown=JSON.parse(localStorage.getItem(STORY_STORAGE)||'[]');return Array.isArray(value)?value.filter((id):id is BookId=>['moon','bird','cloud'].includes(id)):[]}catch{return []}}
function ScenePage({v,scene,sound,onNext,onFinish}:{v:StoryVariation;scene:Scene;sound:boolean;onNext:()=>void;onFinish:()=>void}){
 const [done,setDone]=useState(false),[note,setNote]=useState('')
 const complete=useCallback((text?:string)=>{setDone(true);if(text)setNote(text)},[])
 const hint=useCallback((text:string)=>setNote(text),[])
 const text=note||scene.text, narrationId=`milo.story.${v.book}.${scene.kind}.${note?dialogueId(note):'intro'}`
 useEffect(()=>{if(sound)return narrate(text,narrationId)},[sound,text,narrationId])
 const ending=scene.kind==='ending',opening=scene.kind==='opening'
 return <>
  <div className="story-play-area" data-scene={scene.kind} data-step-complete={done||undefined}>
   {opening||ending?<StoryScene book={v.book} ending={ending} label={scene.title}>
    {v.book==='moon'?<><StoryObject kind="moon" label={ending?'The moon shines again':'The sleepy moon'} x={650} y={60} size={200} dim={!ending}/><StoryObject kind="firefly" label="A friendly firefly" x={305} y={275} size={130}/>{ending&&<StoryObject kind="owl" label="Owl watching the moon" x={740} y={350}/>}</>:v.book==='bird'?<><StoryObject kind="tree" label="Bird's tree" x={545} y={25} size={360}/><StoryObject kind={ending?'nest':'rock'} label={ending?'A family nest':'A little rock'} x={ending?620:390} y={ending?205:355} size={180}/><StoryObject kind="bird" label="Little Bird" x={ending?658:440} y={ending?175:295} size={110}/>{ending&&<><StoryObject kind="bird" label="Bird's family" x={585} y={175} size={110}/><StoryObject kind="feather" label="A feather for Milo" x={220} y={370} size={100}/></>}</>:<><StoryObject kind="cloud" label="Little Cloud" x={430} y={30} size={240} color={ending?'#aebfc4':undefined}/>{[0,1,2,3].map(i=><StoryObject key={i} kind="flowers" label="Meadow flowers" x={220+i*175} y={370} dim={!ending} color="#d6b396"/>)}{ending&&<><g stroke="#a6c5ce" strokeWidth="4">{[300,390,480,570,660,750].map(x=><path key={x} d={`M${x} 245l-8 24m5 32-8 24`}/>)}</g><ellipse cx="827" cy="478" rx="78" ry="18" fill="#a6c7cb"/><StoryObject kind="frog" label="Frog enjoys a puddle" x={765} y={387}/></>}</>}
   </StoryScene>:<StoryActivity kind={scene.kind} v={v} sound={sound} onComplete={complete} onHint={hint}/>}
  </div>
  <section className="story-dialogue" aria-label="Story dialogue"><div><span>MILO & FRIENDS</span><p aria-live="polite">{text}</p></div><button className="round-button" aria-label="Replay story narration" onClick={()=>{if(sound)narrate(text,narrationId)}}><Volume2 size={21}/></button>
   {(opening||ending||done)&&<ContinueButton className="play-action story-next" onClick={ending?onFinish:onNext}>{ending?'Back to Story Tree':opening?'Let us find out':'Continue story'}<ArrowRight size={18}/></ContinueButton>}
  </section>
 </>
}
function StoryReader({v,sound,onClose,onFinish}:{v:StoryVariation;sound:boolean;onClose:()=>void;onFinish:()=>void}){
 const [index,setIndex]=useState(0),scenes=scenesFor(v),scene=scenes[index]
 return <div className={`story-reader story-${v.book}`}><div className="story-chapter"><button className="text-button" onClick={onClose}>Close book</button><h2>{scene.title}</h2></div><ScenePage key={index} v={v} scene={scene} sound={sound} onNext={()=>setIndex(i=>Math.min(scenes.length-1,i+1))} onFinish={onFinish}/></div>
}
export function StoryTree({sound,onSound,onBack,hard}:{sound:boolean;onSound:()=>void;onBack:()=>void;hard:boolean}){
 const [selected,setSelected]=useState<StoryVariation|null>(null),[keepsakes,setKeepsakes]=useState(loadKeepsakes)
 useEffect(()=>{try{localStorage.setItem(STORY_STORAGE,JSON.stringify(keepsakes))}catch{/* Keepsakes are optional. */}},[keepsakes])
 function close(){stopNarration();setSelected(null)}
 return <main className={`story-tree ${selected?'reading-book':'choosing-book'}`}>
  <header className="story-header"><button className="round-button" aria-label={selected?'Close book and return to Story Tree':'Leave Story Tree'} onClick={selected?close:onBack}><ArrowLeft size={21}/></button><div><span>MILO'S LITTLE WORLD</span><h1>{selected?bookTitles[selected.book]:'The Story Tree'}</h1></div><button className="round-button" aria-label={sound?'Turn sound off':'Turn sound on'} onClick={onSound}>{sound?<Volume2 size={21}/>:<VolumeX size={21}/>}</button></header>
  {selected?<StoryReader key={selected.book} v={selected} sound={sound} onClose={close} onFinish={()=>{setKeepsakes(old=>[...new Set([...old,selected.book])]);close()}}/>:<>
   <div className="story-library"><LibraryTree/>
    {(['moon','bird','cloud'] as BookId[]).map((book,i)=><button key={book} className={`physical-book book-${book}`} aria-label={`Read ${bookTitles[book]}`} onClick={()=>setSelected(makeStoryVariation(book,hard))}><BookCover book={book} title={bookTitles[book]}/>{keepsakes.includes(book)&&<svg className="book-keepsake" viewBox="0 0 130 130" role="img" aria-label={`${book} story keepsake`}><StoryObject kind={i===0?'moon':i===1?'feather':'rainbow'} label="A memory of our story" x={5} y={5} size={110}/></svg>}</button>)}
    <div className="library-milo"><Milo mood="curious"/></div>
   </div><p className="library-invitation">Three stories waiting in the roots. Tap a book to open it.</p>
  </>}
 </main>
}
