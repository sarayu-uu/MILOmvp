import {useCallback,useEffect,useRef,useState} from 'react'
import type {PointerEvent as ReactPointerEvent} from 'react'
import {Action} from '../forest/AnimalActivity'
import {useRecall} from '../play/useRecall'
import {scheduleForestSound} from '../audio/forestSounds'
import {stopNarration} from '../narration'
import {StoryIcon,StoryObject,StoryScene} from './StoryArt'
import type {Icon} from './StoryArt'
import type {SceneKind,StoryVariation} from './storyData'
type Props={v:StoryVariation;onComplete:(text?:string)=>void;onHint:(text:string)=>void;sound:boolean}
const landmarks:Icon[]=['tree','rock','flowers']
const landmarkNames=['Tree','Rock','Flowers']
const flowerColors:Record<string,string>={red:'#c38d81',blue:'#91adbf',yellow:'#ddc581'}
const starPositions=[[180,105],[395,75],[655,100],[300,270],[650,285]]

function Stars({v,onComplete,onHint}:Props){
 const recall=useRecall(v.stars)
 useEffect(()=>{if(recall.done)onComplete('The stars are back! One points toward the forest.')},[recall.done,onComplete])
 return <><StoryScene book="moon" label="Remember the two shining stars">{v.order.map((slot,i)=><StoryObject key={i} kind="star" label={`Star ${i+1}`} x={starPositions[slot][0]} y={starPositions[slot][1]} color={recall.found.includes(i)||recall.show&&v.stars.includes(i)?'#f2df9b':'#a7b6c7'} onClick={()=>{recall.choose(i);if(!v.stars.includes(i)&&!recall.show)onHint('Look again at the two warm golden lights. They will wait for you.')}} disabled={recall.show||recall.done||recall.found.includes(i)}><circle cx="62" cy="62" r="76" fill="none" stroke={recall.hint!==null&&v.stars.includes(i)?'#e7d7a2':'transparent'} strokeWidth="3"/></StoryObject>)}</StoryScene><div className="story-actions">{!recall.done&&<Action onClick={()=>recall.show?recall.setShow(false):recall.again()}>{recall.show?'Ready — dim the stars':'Look again'}</Action>}</div></>
}
function Pattern({v,onComplete,onHint,stones=false}:Props&{stones?:boolean}){
 const [done,setDone]=useState(false)
 const pattern=stones?[v.stoneFirst,v.stoneFirst==='small'?'big':'small',v.stoneFirst,v.stoneFirst==='small'?'big':'small']:v.pattern
 const answer=pattern[0], options=answer==='small'||answer==='big'?['small','big']:['gold','blue']
 const choiceOrder=v.choices.filter(i=>i<2)
 const token=(value:string,x:number,y:number,key:string,onClick?:()=>void)=> <StoryObject key={key} kind={stones?'rock':'firefly'} label={`${value} ${stones?'stone':'firefly'}`} x={x} y={y} size={value==='small'?80:value==='big'?140:100} color={value==='blue'?'#9cbecd':'#e2cb83'} onClick={onClick}/>
 return <><StoryScene book={v.book} label={stones?'Stepping stone pattern':'Firefly pattern'}>{stones&&<path d="M0 303q255-65 482 3t518-5v128q-230-65-510 0T0 421Z" fill="#a9c9c9"/>}{pattern.map((value,i)=>token(value,160+i*(pattern.length===6?110:155),165,String(i)))}{done?stones?<StoryObject kind="bird" label="Bird across the stream" x={820} y={315}/>:<path d="M255 370h460m-70-45 74 45-74 45" stroke="#e9d696" strokeWidth="12" fill="none"/>:<text x="850" y="234" fontSize="52" fill="#eadcb9">?</text>}{!done&&choiceOrder.map((i,j)=>token(options[i],355+j*205,365,'choice'+i,()=>{if(options[i]===answer){setDone(true);onComplete(stones?'A way across! Milo carries Bird to the other bank.':'The fireflies make an arrow. This way!')}else onHint('Look at the repeating group. What begins it again?')}))}</StoryScene></>
}
function NightSound({v,onComplete,onHint,sound}:Props){
 const [heard,setHeard]=useState(false),[caption,setCaption]=useState(false),[done,setDone]=useState(false)
 const audio=useRef<AudioContext|null>(null),timer=useRef(0)
 const stop=useCallback(()=>{clearTimeout(timer.current);if(audio.current){void audio.current.close();audio.current=null}},[])
 useEffect(()=>()=>stop(),[stop]);useEffect(()=>{if(!sound)stop()},[sound,stop])
 const clues:Record<number,string>={0:'Splish, splash... a little stream over stones.',1:'Shhh... leaves rustling in the breeze.',2:'Ribbit... ribbit... from a puddle.',4:'Hoo... hoo... high in a tree.'}
 const items:{id:number;icon:Icon;name:string}[]=[{id:4,icon:'owl',name:'Owl'},{id:2,icon:'frog',name:'Frog'},{id:1,icon:'wind',name:'Wind'},{id:0,icon:'water',name:'Water'}]
 async function listen(){stop();stopNarration();setHeard(true);if(!sound){setCaption(true);return}try{const ctx=new AudioContext();audio.current=ctx;await ctx.resume();if(audio.current!==ctx)return;scheduleForestSound(ctx,v.sound);timer.current=window.setTimeout(stop,2500)}catch{stop();setCaption(true)}}
 return <><StoryScene book="moon" label="Sounds of the night">{v.order.filter(i=>i<4).map((index,j)=>{const item=items[index];return <StoryObject key={item.id} kind={item.icon} label={item.name} x={175+j*195} y={200} disabled={!heard||done} onClick={()=>{if(item.id===v.sound){stop();setDone(true);onComplete('A sound by the old tree! There is a little jar beneath it.')}else{setCaption(true);onHint('Listen once more. What might make that sound?')}}}/>})}</StoryScene><div className="story-actions"><Action onClick={listen}>Listen to the night</Action><Action onClick={()=>{stop();setHeard(true);setCaption(true)}}>Read a sound clue</Action></div>{caption&&<p className="story-small-clue">{clues[v.sound]}</p>}</>
}
function Prediction({v,onComplete}:Props){const [picked,setPicked]=useState(false);return <><StoryScene book="moon" label="A jar of moonlight and three possible explanations"><StoryObject kind="jar" label="Jar of moonlight" x={425} y={295} size={155}/>{(['owl','wind','cloud'] as Icon[]).map((kind,i)=><StoryObject key={kind} kind={kind} label={`Maybe ${kind}`} x={220+v.choices[i]*235} y={85} onClick={()=>{setPicked(true);onComplete('That is an interesting idea! A strong wind blew moon dust down. Fireflies gathered it, thinking it was falling stars. Nobody stole the light.')}}/>)}{picked&&<path d="M470 140q-95 63 30 151" fill="none" stroke="#ead698" strokeWidth="5" strokeDasharray="8 7"/>}</StoryScene></>}
function MoonRoute({onComplete,onHint}:Props){
 const [route,setRoute]=useState(0),[drag,setDrag]=useState<{x:number;y:number}|null>(null)
 const progress=useRef(0),active=useRef<number|null>(null),moved=useRef(false)
 const kinds:Icon[]=['firefly','tree','cloud','moon'],places=[[170,340],[385,265],[600,170],[805,55]]
 function advance(index:number){
  if(index!==progress.current)return
  progress.current=index+1;setRoute(index+1)
  if(index===3)onComplete('A trail of light reaches the moon. Look up!')
  else onHint(`Carry the firefly to the ${kinds[index+1]}. Follow the dotted path, or tap the next stop.`)
 }
 function point(e:ReactPointerEvent<SVGGElement>){const matrix=e.currentTarget.ownerSVGElement?.getScreenCTM();const p=matrix?new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()):new DOMPoint();return{x:p.x,y:p.y}}
 function carry(p:{x:number;y:number}){
  setDrag(p)
  const target=places[progress.current]
  if(target&&Math.hypot(p.x-target[0]-62,p.y-target[1]-62)<105)advance(progress.current)
 }
 const at=Math.max(0,route-1),position=drag||{x:places[at][0]+62,y:places[at][1]+62-(at>0?90:0)}
 return <StoryScene book="moon" label="Carry moonlight up through the forest">
  <path d="M230 400L445 325 660 230 865 115" fill="none" stroke="#b8bfaa" strokeWidth="5" strokeDasharray="8 10"/>
  {kinds.map((kind,i)=>i===0?<circle key={kind} cx="232" cy="402" r="77" fill="none" stroke={route>0?"#ecdc9c":"transparent"} strokeWidth="5"/>:<StoryObject key={kind} kind={kind} label={`Carry light to ${kind}`} x={places[i][0]} y={places[i][1]} dim={i>=route} onClick={i===0?undefined:()=>{if(i===progress.current)advance(i);else if(i>progress.current)onHint(`Carry the firefly to the ${kinds[progress.current]}. You can drag it or tap the next stop.`)}}>
   {i<route&&<circle cx="62" cy="62" r="77" fill="none" stroke="#ecdc9c" strokeWidth="5"/>}
   {i===route&&i>0&&<circle cx="62" cy="62" r="82" fill="none" stroke="#ecdc9c" strokeWidth="3" strokeDasharray="6 8"/>}
  </StoryObject>)}
  <g className="story-object story-carrier" role="button" tabIndex={route<4?0:undefined} aria-label={route===0?'Carry light to firefly':'Move the firefly'}
   onClick={()=>{if(!moved.current)advance(0)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();advance(0)}}}
   onPointerDown={e=>{if(progress.current===4)return;e.preventDefault();active.current=e.pointerId;moved.current=false;e.currentTarget.setPointerCapture(e.pointerId);advance(0);setDrag(point(e))}}
   onPointerMove={e=>{if(active.current!==e.pointerId)return;moved.current=true;carry(point(e))}}
   onPointerUp={e=>{if(active.current!==e.pointerId)return;carry(point(e));active.current=null;e.currentTarget.releasePointerCapture(e.pointerId);setDrag(null)}}
   onPointerCancel={()=>{active.current=null;setDrag(null)}}>
   <rect x={position.x-64} y={position.y-64} width="128" height="128" rx="30" fill="transparent"/>
   <circle cx={position.x} cy={position.y} r="45" fill="#f0da92" fillOpacity=".25" pointerEvents="none"/>
   <svg x={position.x-50} y={position.y-50} width="100" height="100" viewBox="0 0 100 100" pointerEvents="none"><StoryIcon kind="firefly" color="#f0da92"/></svg>
  </g>
 </StoryScene>
}
function Habitat({v,onComplete,onHint,nests=false}:Props&{nests?:boolean}){
 const [selected,setSelected]=useState<number|null>(null),[done,setDone]=useState(false),[clue,setClue]=useState(!nests)
 const other=v.flower==='blue'?'yellow':'blue'
 return <><StoryScene book="bird" label={nests?'Three possible nests':'Explore three clearings'}>{v.choices.map((index,j)=><g key={index} transform={`translate(${155+j*270} 70)`}>
  <g role="button" tabIndex={0} aria-label={`Inspect ${nests?'nest':'clearing'} ${j+1}`} className="story-object" onClick={()=>setSelected(index)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(index)}}}>
   <rect x="-10" y="0" width="245" height="390" rx="35" fill={selected===index?'#dfe5bf':'#d5dfbc'} stroke={selected===index?'#8f9e70':'transparent'} strokeWidth="4"/>
   {index!==2&&<path d="M15 327q67-39 201 4" fill="none" stroke="#a0c4c7" strokeWidth="20"/>}
   <svg viewBox="0 0 100 100" preserveAspectRatio="none" x="28" y={index===1?130:15} width="170" height={index===1?155:265}><StoryIcon kind="tree"/></svg>
   {nests&&<svg viewBox="0 0 100 100" x="68" y={index===1?176:100} width="80" height="80"><StoryIcon kind="nest"/></svg>}
   <svg viewBox="0 0 100 100" x="60" y="271" width="100" height="100"><StoryIcon kind="flowers" color={flowerColors[index===2?other:v.flower]}/></svg>
   <text x="112" y="375" fontSize="22" textAnchor="middle" fill="#667852">{index===1?'Short tree':'Tall tree'}</text>
  </g>
 </g>)}{done&&<StoryObject kind="bird" label="Bird found the way" x={30} y={270}/>}</StoryScene>
 {selected!==null&&<p className="story-small-clue">{selected===1?'A short tree': 'A tall tree'}, {selected===2?other:v.flower} flowers{selected===2?', quiet ground':', and a stream'}.</p>}
 <div className="story-actions"><Action onClick={()=>setClue(true)}>Remember Bird's clues</Action><Action disabled={selected===null||done} onClick={()=>{if(selected===0){setDone(true);onComplete(nests?'Peep! Bird hears family answering from this nest.':'These clues match! A stream runs toward the tall trees.')}else onHint('Let us compare all three clues. The tree, the flowers, and the sound of water.')}}>{nests?"This is Bird's home":'Try this clearing'}</Action></div>{clue&&<p className="story-small-clue">{v.flower} flowers · nearby water · a very tall tree</p>}</>
}
function Directions({v,onComplete,onHint}:Props){const recall=useRecall(v.route,true);useEffect(()=>{onHint(recall.show?'Squirrel says: '+v.route.map(i=>landmarkNames[i]).join(', ')+'. Remember the way.':'Which landmark comes next?')},[recall.show,v.route,onHint]);useEffect(()=>{if(recall.done)onComplete('You remembered the way. Bird spots the tall trees ahead!')},[recall.done,onComplete]);return <><StoryScene book="bird" label="Follow the forest landmarks">{recall.show&&<g aria-label="Squirrel's directions">{v.route.map((index,i)=><g key={index}><StoryObject kind={landmarks[index]} label={landmarkNames[index]} x={345+i*120} y={35} size={65}/>{i<2&&<path d={`M${420+i*120} 66h30m-9-8 9 8-9 8`} fill="none" stroke="#71846b" strokeWidth="3"/>}</g>)}</g>}<path d="M180 510Q600 460 275 390T820 200" fill="none" stroke="#e4d1ad" strokeWidth="28"/>{[0,1,2].map((index,j)=><StoryObject key={index} kind={landmarks[index]} label={`Walk to ${landmarkNames[index]}`} x={190+v.choices[j]*235} y={175} disabled={recall.show||recall.done||recall.found.includes(index)} onClick={()=>{recall.choose(index);if(index!==v.route[recall.found.length])onHint('Let us look at Squirrel’s directions again. There is no hurry.')}}>{recall.found.includes(index)&&<circle cx="62" cy="62" r="75" fill="none" stroke="#e1c57f" strokeWidth="5"/>}</StoryObject>)}</StoryScene>{recall.show&&<p className="story-small-clue direction-memory">{v.route.map(i=>landmarkNames[i]).join(' → ')}</p>}<div className="story-actions">{!recall.done&&<Action onClick={()=>recall.show?recall.setShow(false):recall.again()}>{recall.show?'I remember the way':'Show the way again'}</Action>}</div></>}
function Movement({v,onComplete,onHint,bird=false}:Props&{bird?:boolean}){
 const [step,setStep]=useState(0)
 const moves=bird?['Stretch your wings!',...v.birdMoves,'Can you invent your own bird dance?']:['Blow gently like Wind, or make a breeze with your hands.','Sway like a tree in the wind.',...v.windMoves]
 const prompt=moves[Math.min(step,3)]
 useEffect(()=>{if(step<4)onHint(prompt)},[step,prompt,onHint])
 return <><StoryScene book={v.book} label={bird?'Bird movement pictures':'Wind movement pictures'}>{[0,1,2].map((i)=><g key={i} transform={`translate(${220+i*215} ${190+(i%2)*35})`}><svg viewBox="0 0 100 100" width="140" height="160"><StoryIcon kind={bird?'bird':i===1?'tree':'wind'}/></svg><path d={i%2?'M5 177h130':'M10 160q60-65 120 0'} fill="none" stroke="#c8b584" strokeWidth="5" strokeDasharray="7 6"/></g>)}</StoryScene><p className="story-small-clue">{moves[Math.min(step,3)]}</p><div className="story-actions"><Action disabled={step===4} onClick={()=>{if(step===3)onComplete(bird?'What wonderful wings! Bird tries a little flutter.':'Cloud reaches the next patch of meadow.');setStep(n=>n+1)}}>Done</Action></div></>
}
function Evaporation({onComplete,onHint}:Props){const [stage,setStage]=useState(0);return <StoryScene book="cloud" label="Help water rise from a warm pond"><ellipse cx="465" cy="410" rx="200" ry="65" fill="#9fc6cb"/><StoryObject kind="cloud" label="Cloud grows" x={570} y={25} size={stage>=2?200:130}/><StoryObject kind="sun" label="Warm the pond with the sun" x={150} y={35} onClick={()=>{if(stage===0)setStage(1)}}/>{stage>0&&<path d="M250 150L400 360m-100-225 180 210" stroke="#e3ca84" strokeWidth="8" strokeDasharray="15 10"/>}<StoryObject kind="water" label="Lift water from the warm pond" x={405} y={315} onClick={()=>{if(stage===1){setStage(2);onComplete('Warm sunshine helps water rise. Cloud is growing!')}else if(stage===0)onHint('The pond is cool. Could sunshine warm it first?')}}/><StoryObject kind="wind" label="Try the breeze" x={760} y={215} onClick={()=>onHint('Wind can carry a cloud. First, Cloud needs a little water.')}/><StoryObject kind="rock" label="Investigate the rocks" x={175} y={345} onClick={()=>onHint('These stones stay on the ground. Look at the sun and the pond.')}/>{stage===2&&<><path d="M490 330Q475 219 631 191" fill="none" stroke="#dbe8df" strokeWidth="18" strokeDasharray="12 16"/><StoryObject kind="water" label="Water rising to Cloud" x={475} y={170} size={70}/></>}</StoryScene>}
function Drops({v,onComplete,onHint}:Props){
 const [watered,setWatered]=useState<number[]>([]),[extra,setExtra]=useState(0),[selected,setSelected]=useState(false),[drag,setDrag]=useState<{x:number;y:number}|null>(null)
 const start=useRef<{x:number;y:number}|null>(null)
 const available=v.flowers-v.shortfall+extra-watered.length,done=watered.length===v.flowers
 const slots=v.order.slice(0,v.flowers).map((_,i)=>({x:165+i*(690/Math.max(1,v.flowers-1)),y:320}))
 function water(index:number){if(done||watered.includes(index)||available<=0)return;const next=[...watered,index];setWatered(next);setSelected(false);if(next.length===v.flowers)onComplete('One drink for every flower. Look at their happy petals!')}
 function point(e:ReactPointerEvent<SVGGElement>){const matrix=e.currentTarget.ownerSVGElement?.getScreenCTM();const p=matrix?new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()):new DOMPoint();return{x:p.x,y:p.y}}
 return <><StoryScene book="cloud" label="Carry raindrops to thirsty flowers"><StoryObject kind="cloud" label="Cloud" x={405} y={5} size={170}/>{slots.map((p,i)=><StoryObject key={i} kind="flowers" variant={1} label={`Give flower ${i+1} a drop`} x={p.x-55} y={p.y} dim={!watered.includes(i)} color="#d9b4a4" disabled={done||watered.includes(i)} onClick={()=>selected?water(i):onHint('Pick up a drop, then tap a thirsty flower. You can drag it too.')}>{watered.includes(i)&&<ellipse cx="62" cy="115" rx="49" ry="9" fill="#a1c7ca"/>}</StoryObject>)}
 {Array.from({length:available},(_,i)=><StoryObject key={i} kind="water" label="A drop ready for a flower" x={395+i*43} y={155} size={30}/>)}
 {available>0&&!done&&<g role="button" tabIndex={0} aria-label="Pick up a raindrop" className="story-object story-drop" onClick={()=>setSelected(true)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(true)}}} onPointerDown={e=>{e.preventDefault();start.current=point(e);e.currentTarget.setPointerCapture(e.pointerId);setSelected(true)}} onPointerMove={e=>{if(start.current)setDrag(point(e))}} onPointerCancel={()=>{start.current=null;setDrag(null)}} onPointerUp={e=>{if(!start.current)return;const p=point(e);const moved=Math.hypot(p.x-start.current.x,p.y-start.current.y)>8;e.currentTarget.releasePointerCapture(e.pointerId);if(moved){const index=slots.findIndex(s=>Math.abs(p.x-s.x-7)<85&&Math.abs(p.y-s.y-60)<85);if(index>=0)water(index);else onHint('Carry the drop down to a flower.')}start.current=null;setDrag(null)}}><rect x={drag?drag.x-45:435} y={drag?drag.y-45:180} width="120" height="120" fill="transparent"/><svg viewBox="0 0 100 100" x={drag?drag.x-40:445} y={drag?drag.y-40:180} width="100" height="105" pointerEvents="none"><StoryIcon kind="water"/></svg>{selected&&!drag&&<circle cx="495" cy="235" r="68" fill="none" stroke="#c9b66e" strokeWidth="4" pointerEvents="none"/>}</g>}
 </StoryScene><p className="story-small-clue">{available} drops ready · {v.flowers-watered.length} flowers still waiting</p>{available===0&&!done&&<div className="story-actions"><span>How many flowers still need a drop?</span><Action onClick={()=>setExtra(n=>n+1)}>Ask Cloud for one more drop</Action></div>}</>
}
function Thirsty({v,onComplete,onHint}:Props){const [watered,setWatered]=useState<number[]>([]);return <StoryScene book="cloud" label="Choose the flowers that need water">{v.order.map((index,j)=>{const thirsty=v.thirsty.includes(index),puddle=index===v.order[2];return <StoryObject key={index} kind="flowers" label={`Inspect flower patch ${index+1}`} x={150+j*163} y={250} color="#d3b096" dim={thirsty&&!watered.includes(index)} onClick={()=>{if(thirsty&&!watered.includes(index)){const next=[...watered,index];setWatered(next);if(next.length===v.thirsty.length)onComplete('Just enough rain for the drooping flowers. The others can rest.')}else if(!thirsty)onHint(puddle?'This flower already has a puddle. Find one with drooping leaves.':'This flower stands tall. Who is drooping?')}}>{(puddle||watered.includes(index))&&<ellipse cx="62" cy="120" rx="55" ry="12" fill="#a3c8ce"/>}</StoryObject>})}</StoryScene>}
function Shapes({v,onComplete}:Props){const [picked,setPicked]=useState('');return <><StoryScene book="cloud" label="Imagine a cloud shape"><StoryObject kind="cloud" label="What could this cloud be?" x={325} y={80} size={340} variant={v.shape}/></StoryScene><div className="story-actions">{[...v.choices.map(i=>['A rabbit','A dragon','A boat'][i]),'Something else!'].map(label=><Action key={label} disabled={!!picked} onClick={()=>{setPicked(label);onComplete(label==='Something else!'?'An idea all your own! Cloud has room for every imagination.':`${label}! What a lovely way to see Cloud.`)}}>{label}</Action>)}</div></>}
export function StoryActivity({kind,...props}:Props&{kind:SceneKind}){
 switch(kind){case'stars':return <Stars {...props}/>;case'fireflies':return <Pattern {...props}/>;case'night-sound':return <NightSound {...props}/>;case'prediction':return <Prediction {...props}/>;case'moon-route':return <MoonRoute {...props}/>;case'habitat':return <Habitat {...props}/>;case'stones':return <Pattern {...props} stones/>;case'directions':return <Directions {...props}/>;case'bird-movement':return <Movement {...props} bird/>;case'nests':return <Habitat {...props} nests/>;case'evaporation':return <Evaporation {...props}/>;case'drops':return <Drops {...props}/>;case'wind-movement':return <Movement {...props}/>;case'thirsty':return <Thirsty {...props}/>;case'shapes':return <Shapes {...props}/>;default:return null}
}
