import {useEffect,useRef,useState} from 'react'
import type {PointerEvent as ReactPointerEvent} from 'react'
import {ArrowLeft,Volume2,VolumeX} from 'lucide-react'
import {Milo} from '../Illustrations'
import {Action} from '../forest/AnimalActivity'
import {freshShuffle} from '../variation'
import {narrate,stopNarration} from '../narration'
import {FoodArt,KitchenBackdrop} from './KitchenArt'
import type {FoodKind} from './KitchenArt'
import './kitchen.css'
const prompts=['Find 3 carrots!','Wash, wash, wash!','Find the carrot pieces.','Put 3 carrot pieces in the pot.','Add water to the pot.','Stir our soup in a circle.','Our soup needs a little time. Let’s enjoy our meal together.','Choose a round bowl.','Serve Milo a bowl of soup.','What’s on YOUR plate? Tell your grown-up.']
const nextLabels=['Wash the carrots','Find the pieces','Fill the pot','Add water','Stir the soup','Let it rest','Keep cooking','Serve the soup','Sit together']
function makeRecipe(){return{vegetables:freshShuffle('soup-vegetables',['carrot-1','tomato','carrot-2','potato','carrot-3']),pieces:freshShuffle('soup-pieces',['pieces','potato','tomato'] as FoodKind[]),bowls:freshShuffle('soup-bowls',['circle','square','triangle'])}}
/** Mouse/touch dragging and tap-then-target use the same drop action. */
function Carry({kind,label,onPick,onDrop,selected=false,filled=false}:{kind:FoodKind;label:string;onPick:()=>void;onDrop:(target:string)=>void;selected?:boolean;filled?:boolean}){
 const [position,setPosition]=useState<{x:number;y:number}|null>(null)
 const start=useRef<{x:number;y:number}|null>(null),moved=useRef(false)
 function point(e:ReactPointerEvent<HTMLButtonElement>){return{x:e.clientX,y:e.clientY}}
 return <><button className={`kitchen-food kitchen-carry ${selected?'kitchen-picked':''}`} aria-label={label} aria-pressed={selected} onClick={e=>{if(e.detail===0||!moved.current)onPick()}} onPointerDown={e=>{if(e.button!==0)return;start.current=point(e);moved.current=false;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(start.current&&Math.hypot(e.clientX-start.current.x,e.clientY-start.current.y)>6){moved.current=true;setPosition(point(e))}}} onPointerUp={e=>{if(!start.current)return;if(moved.current){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-kitchen-drop]')?.getAttribute('data-kitchen-drop');if(target)onDrop(target)}start.current=null;setPosition(null);e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{start.current=null;setPosition(null)}}><FoodArt kind={kind} filled={filled}/></button>{position&&<div className="kitchen-drag-picture" style={{left:position.x,top:position.y}}><FoodArt kind={kind} filled={filled}/></div>}</>
}
function SoupStage({step,sound,onNext,recipe}:{step:number;sound:boolean;onNext:()=>void;recipe:ReturnType<typeof makeRecipe>}){
 const [found,setFound]=useState<string[]>([]),[picked,setPicked]=useState(''),[done,setDone]=useState(false),[hint,setHint]=useState(''),[stirs,setStirs]=useState(0),[rested,setRested]=useState(false),[angle,setAngle]=useState(-Math.PI/2)
 const stirring=useRef(false),lastAngle=useRef<number|null>(null),distance=useRef(0),stirCount=useRef(0)
 const text=hint||(step===6&&rested?'Ready? Let’s keep cooking!':prompts[step])
 useEffect(()=>{if(sound)return narrate(text)},[sound,text])
 useEffect(()=>{if(step!==6)return;const timer=setTimeout(()=>setRested(true),12000);return()=>clearTimeout(timer)},[step])
 function add(id:string,total:number){if(found.includes(id))return;const next=[...found,id];setFound(next);setHint('');if(next.length===total)setDone(true)}
 function drop(target:string,source=picked){if(done)return;if(step===1&&source==='water'&&target.startsWith('wash-'))add(target,3);else if(step===3&&source.startsWith('piece-')&&target==='pot'){add(source,3);setPicked('')}else if(step===4&&source==='water'&&target==='pot')setDone(true);else if(step===8&&source==='spoon'&&target==='bowl')setDone(true);else setHint('Let’s try it over here.')}
 function stir(){if(stirCount.current>=3)return;stirCount.current+=1;setStirs(stirCount.current);if(stirCount.current===3)setDone(true)}
 function stirPoint(e:ReactPointerEvent<HTMLDivElement>){const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;if(Math.hypot(x,y)<r.width*.12)return;const current=Math.atan2(y,x);setAngle(current);if(lastAngle.current!==null){let delta=current-lastAngle.current;if(delta>Math.PI)delta-=2*Math.PI;if(delta< -Math.PI)delta+=2*Math.PI;distance.current+=Math.abs(delta);if(distance.current>=Math.PI*2){distance.current-=Math.PI*2;stir()}}lastAngle.current=current}
 return <><section className="kitchen-instruction"><h2 aria-live="polite">{text}</h2><button className="replay" aria-label="Hear cooking instruction" onClick={()=>{if(sound)narrate(text)}}><Volume2 size={22}/></button></section><div className={`kitchen-stage ${step===6||step===9?'kitchen-quiet':''}`} data-kitchen-stage={step}><KitchenBackdrop/>
  <div className="kitchen-worktop">
  {step===0&&<div className="kitchen-foods">{recipe.vegetables.map(id=><button className={`kitchen-food ${found.includes(id)?'kitchen-found':''}`} key={id} disabled={found.includes(id)||done} aria-label={id.startsWith('carrot')?id.replace('-',' '):id} onClick={()=>id.startsWith('carrot')?add(id,3):setHint('Look for the long orange carrots.')}><FoodArt kind={id.startsWith('carrot')?'carrot':id as FoodKind}/></button>)}</div>}
  {step===1&&<><Carry kind="water" label="Pick up washing water" selected={picked==='water'} onPick={()=>setPicked('water')} onDrop={target=>drop(target,'water')}/><div className="kitchen-foods">{[0,1,2].map(i=><button key={i} className={`kitchen-food ${found.includes('wash-'+i)?'kitchen-found':''}`} data-kitchen-drop={'wash-'+i} aria-label={`Wash carrot ${i+1}`} disabled={found.includes('wash-'+i)} onClick={()=>picked?drop('wash-'+i):setHint('Tap the water, then a carrot.')}><FoodArt kind="carrot"/>{found.includes('wash-'+i)&&<span className="kitchen-clean">Clean!</span>}</button>)}</div></>}
  {step===2&&<div className="kitchen-foods">{recipe.pieces.map(kind=><button key={kind} className="kitchen-food" aria-label={kind==='pieces'?'Carrot pieces':kind} disabled={done} onClick={()=>{if(kind==='pieces'){setDone(true);setHint('The carrot pieces are ready.')}else setHint('Find the orange pieces, like our carrots.')}}><FoodArt kind={kind}/></button>)}</div>}
  {step===3&&<><div className="kitchen-foods">{[0,1,2].map(i=>!found.includes('piece-'+i)&&<Carry key={i} kind="piece" label={`Pick up carrot piece ${i+1}`} selected={picked==='piece-'+i} onPick={()=>setPicked('piece-'+i)} onDrop={target=>drop(target,'piece-'+i)}/>)}</div><button className="kitchen-vessel" data-kitchen-drop="pot" aria-label="Put carrot pieces in the pot" onClick={()=>picked?drop('pot'):setHint('Pick up the carrot pieces first.')}><FoodArt kind="pot" contents={found.length>0?'pieces':undefined}/></button></>}
  {step===4&&<><Carry kind="water" label="Pick up water" selected={picked==='water'} onPick={()=>setPicked('water')} onDrop={target=>drop(target,'water')}/><button className="kitchen-vessel" data-kitchen-drop="pot" aria-label="Add water to pot" onClick={()=>picked?drop('pot'):setHint('Pick up the water first.')}><FoodArt kind="pot" contents={done?'water':'pieces'}/></button></>}
  {step===5&&<div className="kitchen-stirring"><div className="kitchen-stir-pot" role="group" aria-label="Stir the soup with a circular movement" onPointerDown={e=>{if(done)return;stirring.current=true;lastAngle.current=null;e.currentTarget.setPointerCapture(e.pointerId);stirPoint(e)}} onPointerMove={e=>{if(stirring.current&&!done)stirPoint(e)}} onPointerUp={()=>{stirring.current=false;lastAngle.current=null}} onPointerCancel={()=>{stirring.current=false;lastAngle.current=null}}><FoodArt kind="pot" filled/><span className="kitchen-spoon" style={{left:`${50+23*Math.cos(angle)}%`,top:`${42+12*Math.sin(angle)}%`}}><FoodArt kind="spoon"/></span></div><Action disabled={done} onClick={()=>{setAngle(a=>a+Math.PI/2);stir()}}>Stir once</Action><p>{stirs} gentle stirs</p></div>}
  {(step===6||step===9)&&<div className="kitchen-table-together"><div className="kitchen-table-milo"><Milo mood="happy"/></div><div className="kitchen-table-bowl"><FoodArt kind="bowl" filled/></div><div className="kitchen-table-spoon"><FoodArt kind="spoon"/></div></div>}
  {step===7&&<div className="kitchen-foods">{recipe.bowls.map(shape=><button key={shape} className="kitchen-food" aria-label={`${shape} bowl`} disabled={done} onClick={()=>shape==='circle'?setDone(true):setHint('Find the round bowl, with no corners.')}><FoodArt kind="bowl" shape={shape}/></button>)}</div>}
  {step===8&&<><Carry kind="spoon" filled label="Pick up soup spoon" selected={picked==='spoon'} onPick={()=>setPicked('spoon')} onDrop={target=>drop(target,'spoon')}/><button className="kitchen-vessel" data-kitchen-drop="bowl" aria-label="Serve soup in bowl" onClick={()=>picked?drop('bowl'):setHint('Pick up the soup spoon first.')}><FoodArt kind="bowl" filled={done}/></button></>}
  </div>
 </div><footer className="kitchen-footer">{step!==6&&step!==9&&<div className="kitchen-companion"><Milo mood={done?'happy':'curious'}/></div>}<div className="kitchen-status" aria-live="polite">{[0,1,3].includes(step)?`${found.length} of 3`:done?'Ready for the next part.':step===6?'Look away and enjoy a moment together.':step===9?'Talk together. There is no hurry.':''}</div>{(done||step===6||step===9)&&<Action onClick={onNext}>{step===9?'Back to the garden':nextLabels[step]}</Action>}</footer></>
}
const mealPrompts=[
 'Chew 5 times, slowly.',
 'Enjoy a little food with your grown-up.',
 'Take your time with your food.',
 'Chew 5 times, slowly.',
 'Look away and enjoy your meal together.',
 'Enjoy a quiet moment together.',
 'Chew slowly. There is no hurry.',
 'Chew 5 times, slowly.',
 'Enjoy your food together.',
]
function MealMoment({intro=false,afterStep=0,sound,onContinue}:{intro?:boolean;afterStep?:number;sound:boolean;onContinue:()=>void}){
 const text=intro?"We're going to eat and play together now.":mealPrompts[afterStep]
 const detail=intro?'Bring your food and your grown-up.':text.includes('5')?"Keep chewing until you're ready. No hurry.":'The game can wait. Take your time.'
 useEffect(()=>{if(sound)return narrate(text+' '+detail)},[sound,text,detail])
 return <><section className="kitchen-instruction kitchen-meal-message"><span>{intro?'BEFORE WE COOK':'MEALTIME PAUSE'}</span><h2 aria-live="polite">{text}</h2><p>{detail}</p><button className="replay" aria-label="Hear mealtime invitation" onClick={()=>{if(sound)narrate(text+' '+detail)}}><Volume2 size={22}/></button></section><div className="kitchen-stage kitchen-quiet" data-meal-break={intro?'intro':afterStep}><KitchenBackdrop/><div className="kitchen-worktop"><div className="kitchen-table-together"><div className="kitchen-table-milo"><Milo mood="happy"/></div><div className="kitchen-table-bowl"><FoodArt kind="bowl" filled/></div><div className="kitchen-table-spoon"><FoodArt kind="spoon"/></div></div></div></div><footer className="kitchen-footer"><Action onClick={onContinue}>{intro?"Let's eat and play":'Keep cooking'}</Action></footer></>
}
export function KitchenWorld({sound,onSound,onBack}:{sound:boolean;onSound:()=>void;onBack:()=>void}){
 const [step,setStep]=useState<number|null>(null),[recipe,setRecipe]=useState(makeRecipe),[mealBreak,setMealBreak]=useState<number|null>(null)
 useEffect(()=>{if(sound&&step===null)return narrate('Let’s make carrot soup together!')},[sound,step])
 function advance(){stopNarration();if(step===null)return;if([0,1,2,3,4,7,8].includes(step))setMealBreak(step);else setStep(step===9?null:step+1)}
 return <main className="kitchen-world"><header className="kitchen-header"><button className="round-button" aria-label={step===null?'Back to world':'Back to food garden'} onClick={()=>{stopNarration();setMealBreak(null);if(step===null)onBack();else setStep(null)}}><ArrowLeft size={21}/></button><div><span>MILO'S FOOD GARDEN</span><h1>{step===null?'Something warm to share':'Carrot Soup'}</h1></div><button className="round-button" aria-label={sound?'Turn sound off':'Turn sound on'} onClick={onSound}>{sound?<Volume2 size={21}/>:<VolumeX size={21}/>}</button></header>{step===null?<><p className="kitchen-welcome">Let’s make carrot soup together!</p><div className="kitchen-stage kitchen-recipe"><KitchenBackdrop/><button className="kitchen-recipe-button" aria-label="Make Carrot Soup" onClick={()=>{setRecipe(makeRecipe());setStep(-1)}}><FoodArt kind="pot" filled/><span>Carrot Soup</span></button><div className="kitchen-recipe-carrot"><FoodArt kind="carrot"/></div></div><footer className="kitchen-footer"><div className="kitchen-companion"><Milo mood="curious"/></div><p>A little cooking. A little time together.</p></footer></>:step===-1?<MealMoment intro sound={sound} onContinue={()=>{stopNarration();setStep(0)}}/>:mealBreak!==null?<MealMoment key={mealBreak} afterStep={mealBreak} sound={sound} onContinue={()=>{stopNarration();setStep(mealBreak+1);setMealBreak(null)}}/>:<SoupStage key={step} step={step} recipe={recipe} sound={sound} onNext={advance}/>}</main>
}
