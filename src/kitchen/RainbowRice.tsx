import {useEffect,useRef,useState} from 'react'
import type {PointerEvent} from 'react'
import {ArrowLeft,Volume2,VolumeX} from 'lucide-react'
import {Milo} from '../Illustrations'
import {Action} from '../forest/AnimalActivity'
import {freshShuffle} from '../variation'
import {narrate,stopNarration} from '../narration'
import {FoodArt,KitchenBackdrop} from './KitchenArt'
import type {FoodKind} from './KitchenArt'
import {Carry,MealMoment} from './KitchenShared'

const ingredients=['pepper','corn','pea'] as const
const colors={pepper:'red',corn:'yellow',pea:'green'}
function makeRice(){
 const pattern=freshShuffle('rice-pattern',['corn','pea'] as const)
 return {
  foods:freshShuffle('rice-foods',['rice','pasta','bread'] as FoodKind[]),
  bowls:freshShuffle('rice-bowls',['small','big','medium']),
  kernels:freshShuffle('rice-kernels',['corn-1','pea-1','corn-2','pepper-1','corn-3','pea-2']),
  peas:freshShuffle('rice-peas',[1,2,3,4]),
  twins:freshShuffle('rice-twins',['pepper-1','corn-1','pea-1','pepper-2']),
  pattern,choices:freshShuffle('rice-pattern-choices',['corn','pea'] as const),
  sorting:freshShuffle('rice-sorting',ingredients),
 }
}
function Rainbow({step,finished=false}:{step:number;finished?:boolean}){
 const active=[step>4,step>2,step>3]
 return <svg className={`rice-rainbow ${finished?'rice-rainbow-finished':''}`} viewBox="0 0 300 155" role="img" aria-label={finished?'Milo’s rainbow has all its colors!':'Milo’s rainbow is finding its colors'}>{['#c98473','#e1c56c','#8fa970'].map((color,i)=><path key={color} d={`M${20+i*24} 145 A${130-i*24} ${130-i*24} 0 0 1 ${280-i*24} 145`} fill="none" stroke={active[i]||finished?color:'#d3d2bf'} strokeWidth="19" strokeLinecap="round"/>)}</svg>
}
const prompts=['Which one is rice?','Find the BIG bowl!','Tap all the YELLOW corn!','Catch 4 peas!','Find two that look the same!','What comes next?','Make a rainbow in the bowl!','Round and round!','Look at your food! Find TWO colors with your grown-up.','Let’s taste together!']
const next=['Choose a bowl','Find yellow corn','Catch the peas','Find the twins','Try a pattern','Make a rainbow','Stir our rice','Look at your plate','Taste together']
function RiceStage({step,recipe,sound,onNext}:{step:number;recipe:ReturnType<typeof makeRice>;sound:boolean;onNext:()=>void}){
 const [found,setFound]=useState<string[]>([]),[picked,setPicked]=useState(''),[hint,setHint]=useState(''),[done,setDone]=useState(false),[stirs,setStirs]=useState(0),[finished,setFinished]=useState(false),[angle,setAngle]=useState(-Math.PI/2)
 const last=useRef<number|null>(null),distance=useRef(0),stirCount=useRef(0),dragging=useRef(false)
 const text=hint||(step===9&&finished?'Our rainbow is back! We made it together.':prompts[step])
 useEffect(()=>{if(sound)return narrate(text)},[text,sound])
 useEffect(()=>{if(step!==9)return;const timer=setTimeout(()=>setFinished(true),8000);return()=>clearTimeout(timer)},[step])
 function complete(message:string){setDone(true);setHint(message)}
 function collect(id:string,total:number){if(done||found.includes(id))return;const result=[...found,id];setFound(result);if(result.length===total)complete(step===3?'4 peas! Green is back!':'Yellow is back!');else setHint(step===3?`${result.length}!`:'Keep finding yellow corn.')}
 function match(id:string){if(done)return;if(!picked){setPicked(id);setHint('Find another one just like it.');return}if(id===picked){setPicked('');setHint('Choose a vegetable.');return}if(id.split('-')[0]===picked.split('-')[0]){setFound([picked,id]);complete('Two red peppers! Red is back!')}else{setPicked(id);setHint('Look for two red peppers.')}}
 function sort(target:string,source=picked){if(done||found.includes(source))return;const expected=ingredients[found.length];if(source===expected&&target===expected){const result=[...found,source];setFound(result);setPicked('');if(result.length===3)complete('A bowl full of colors!');else setHint(`Now find ${colors[ingredients[result.length]]}.`)}else setHint(`Put ${colors[expected]} in the shining space.`)}
 function stir(){if(stirCount.current>=2)return;stirCount.current++;setStirs(stirCount.current);if(stirCount.current===2)complete('Our rainbow rice is ready!')}
 function trace(e:PointerEvent<HTMLDivElement>){const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;if(Math.hypot(x,y)<r.width*.15){last.current=null;return}const a=Math.atan2(y,x);setAngle(a);if(last.current!==null){let delta=a-last.current;if(delta>Math.PI)delta-=2*Math.PI;if(delta< -Math.PI)delta+=2*Math.PI;distance.current+=Math.abs(delta);if(distance.current>=Math.PI*2){distance.current-=Math.PI*2;stir()}}last.current=a}
 return <><section className="kitchen-instruction"><h2 aria-live="polite">{text}</h2><button className="replay" aria-label="Hear rice instruction" onClick={()=>{if(sound)narrate(text)}}><Volume2 size={22}/></button></section>
 <div className={`kitchen-stage rice-stage ${step>=8?'kitchen-quiet':''}`} data-rice-stage={step}><KitchenBackdrop/><Rainbow step={step+(done?1:0)} finished={finished}/><div className="rice-worktop">
 {step===0&&<div className="kitchen-foods">{recipe.foods.map(kind=><button key={kind} className="kitchen-food" aria-label={kind} disabled={done} onClick={()=>kind==='rice'?complete('Rice for our rainbow bowl!'):setHint('Look for the little white grains.')}><FoodArt kind={kind}/></button>)}</div>}
 {step===1&&<div className="rice-bowls">{recipe.bowls.map(size=><button key={size} className={`kitchen-food rice-bowl-${size}`} aria-label={`${size} rice bowl`} disabled={done} onClick={()=>size==='big'?complete('Room for all our colors!'):setHint('Look for the biggest bowl.')}><FoodArt kind="bowl"/></button>)}</div>}
 {step===2&&<div className="kitchen-foods">{recipe.kernels.map(id=><button key={id} className={`kitchen-food ${found.includes(id)?'kitchen-found':''}`} aria-label={id.replace('-',' ')} disabled={done||found.includes(id)} onClick={()=>id.startsWith('corn')?collect(id,3):setHint('Yellow, like sunshine. Find the corn.')}><FoodArt kind={id.split('-')[0] as FoodKind}/></button>)}</div>}
 {step===3&&<><div className="rice-count" aria-live="polite">{[1,2,3,4].map(n=><span key={n} className={found.length>=n?'rice-counted':''}>{n}</span>)}</div><div className="kitchen-foods">{recipe.peas.map(n=><button key={n} className={`kitchen-food ${found.includes(String(n))?'kitchen-found':''}`} aria-label={`Catch pea ${n}`} disabled={done||found.includes(String(n))} onClick={()=>collect(String(n),4)}><FoodArt kind="pea"/>{found.includes(String(n))&&<span className="kitchen-clean">{found.indexOf(String(n))+1}</span>}</button>)}</div></>}
 {step===4&&<div className="kitchen-foods">{recipe.twins.map(id=><button key={id} className={`kitchen-food ${picked===id?'kitchen-picked':''} ${found.includes(id)?'kitchen-found':''}`} aria-label={`Match ${id.replace('-',' ')}`} aria-pressed={picked===id} disabled={done} onClick={()=>match(id)}><FoodArt kind={id.split('-')[0] as FoodKind}/></button>)}</div>}
 {step===5&&<><div className="rice-pattern" role="img" aria-label={`${recipe.pattern.join(', ')}, ${recipe.pattern.join(', ')}, what comes next?`}>{[...recipe.pattern,...recipe.pattern].map((kind,i)=><FoodArt key={i} kind={kind}/>)}<span>?</span></div><div className="kitchen-foods">{recipe.choices.map(kind=><button className="kitchen-food" key={kind} aria-label={`Next is ${kind}`} disabled={done} onClick={()=>kind===recipe.pattern[0]?complete('You found the pattern!'):setHint(`Look: ${recipe.pattern[0]}, ${recipe.pattern[1]}. Then again!`)}><FoodArt kind={kind}/></button>)}</div></>}
 {step===6&&<><div className="rice-sort-sources">{recipe.sorting.map(kind=>!found.includes(kind)&&<Carry key={kind} kind={kind} label={`Pick up ${colors[kind]}`} selected={picked===kind} onPick={()=>setPicked(kind)} onDrop={target=>sort(target,kind)}/>)}</div><div className="rice-sort-bowl" role="group" aria-label="Rainbow bowl: red, yellow, green">{ingredients.map((kind,i)=><button key={kind} className={`rice-slot ${i===found.length?'rice-slot-next':''} ${found.includes(kind)?'kitchen-found':''}`} data-kitchen-drop={kind} aria-label={`${colors[kind]} space`} disabled={found.includes(kind)||done} onClick={()=>picked?sort(kind):setHint(`Tap ${colors[ingredients[found.length]]}, then its space.`)}><FoodArt kind={kind}/><span>{colors[kind]}</span></button>)}</div></>}
 {step===7&&<div className="kitchen-stirring"><div className="kitchen-stir-pot rice-stir" role="group" aria-label="Trace a circle around the rice" onPointerDown={e=>{if(done)return;dragging.current=true;last.current=null;e.currentTarget.setPointerCapture(e.pointerId);trace(e)}} onPointerMove={e=>{if(dragging.current&&!done)trace(e)}} onPointerUp={()=>{dragging.current=false;last.current=null}} onPointerCancel={()=>{dragging.current=false;last.current=null}}><FoodArt kind="ricebowl" filled/><svg className="rice-circle" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="65" fill="none" stroke="#8fa970" strokeWidth="3" strokeDasharray="4 7"/></svg><span className="kitchen-spoon" style={{left:`${50+30*Math.cos(angle)}%`,top:`${50+30*Math.sin(angle)}%`}}><FoodArt kind="spoon"/></span></div><Action disabled={done} onClick={stir}>Stir once</Action><p>{stirs} gentle stirs</p></div>}
 {step>=8&&<div className="kitchen-table-together"><div className="kitchen-table-milo"><Milo mood="happy"/></div><div className="kitchen-table-bowl"><FoodArt kind="ricebowl" filled/></div><div className="kitchen-table-spoon"><FoodArt kind="spoon"/></div></div>}
 </div></div><footer className="kitchen-footer">{step<8&&<div className="kitchen-companion"><Milo mood={done||finished?'happy':'curious'}/></div>}<div className="kitchen-status" aria-live="polite">{step===2?`${found.length} of 3 yellow corn`:step===6?'Match the pictures. Red, yellow, green.':step>=8?'Look away. Enjoy your food together.':done?'We did it together!':''}</div>{(done||step>=8)&&<Action onClick={onNext}>{step===9?'Back to the garden':next[step]}</Action>}</footer></>
}
export function RainbowRice({sound,onSound,onBack}:{sound:boolean;onSound:()=>void;onBack:()=>void}){
 const [recipe]=useState(makeRice),[step,setStep]=useState(-2),[pause,setPause]=useState(false)
 useEffect(()=>{if(sound&&step===-2)return narrate('My rainbow lost its colors! Let’s bring them back with rainbow rice.')},[sound,step])
 function advance(){stopNarration();if(step===9){onBack();return}if(step<7)setPause(true);else setStep(step+1)}
 return <main className="kitchen-world"><header className="kitchen-header"><button className="round-button" aria-label="Back to food garden" onClick={()=>{stopNarration();onBack()}}><ArrowLeft size={21}/></button><div><span>MILO'S FOOD GARDEN</span><h1>Rainbow Rice</h1></div><button className="round-button" aria-label={sound?'Turn sound off':'Turn sound on'} onClick={onSound}>{sound?<Volume2 size={21}/>:<VolumeX size={21}/>}</button></header>
 {step===-2?<><section className="kitchen-instruction"><h2>My rainbow lost its colors!<br/>Let’s bring them back with rice.</h2></section><div className="kitchen-stage rice-stage"><KitchenBackdrop/><Rainbow step={0}/><div className="rice-worktop"><div className="kitchen-table-together"><div className="kitchen-table-milo"><Milo mood="curious"/></div><div className="kitchen-table-bowl"><FoodArt kind="ricebowl"/></div></div></div></div><footer className="kitchen-footer"><Action onClick={()=>setStep(-1)}>Let’s make rainbow rice!</Action></footer></>:step===-1?<MealMoment bowl="ricebowl" intro sound={sound} onContinue={()=>setStep(0)}/>:pause?<MealMoment bowl="ricebowl" afterStep={step} sound={sound} onContinue={()=>{setPause(false);setStep(step+1)}}/>:<RiceStage key={step} step={step} recipe={recipe} sound={sound} onNext={advance}/>}
 </main>
}
