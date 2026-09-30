import {useEffect,useRef,useState} from 'react'
import type {PointerEvent as ReactPointerEvent} from 'react'
import {Volume2} from 'lucide-react'
import {Milo} from '../Illustrations'
import {Action} from '../forest/AnimalActivity'
import {narrate} from '../narration'
import {FoodArt,KitchenBackdrop} from './KitchenArt'
import type {FoodKind} from './KitchenArt'
/** Mouse/touch dragging and tap-then-target use the same drop action. */
export function Carry({kind,label,onPick,onDrop,selected=false,filled=false}:{kind:FoodKind;label:string;onPick:()=>void;onDrop:(target:string)=>void;selected?:boolean;filled?:boolean}){
 const [position,setPosition]=useState<{x:number;y:number}|null>(null)
 const start=useRef<{x:number;y:number}|null>(null),moved=useRef(false)
 function point(e:ReactPointerEvent<HTMLButtonElement>){return{x:e.clientX,y:e.clientY}}
 return <><button className={`kitchen-food kitchen-carry ${selected?'kitchen-picked':''}`} aria-label={label} aria-pressed={selected} onClick={e=>{if(e.detail===0||!moved.current)onPick()}} onPointerDown={e=>{if(e.button!==0)return;start.current=point(e);moved.current=false;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(start.current&&Math.hypot(e.clientX-start.current.x,e.clientY-start.current.y)>6){moved.current=true;setPosition(point(e))}}} onPointerUp={e=>{if(!start.current)return;if(moved.current){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-kitchen-drop]')?.getAttribute('data-kitchen-drop');if(target)onDrop(target)}start.current=null;setPosition(null);e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{start.current=null;setPosition(null)}}><FoodArt kind={kind} filled={filled}/></button>{position&&<div className="kitchen-drag-picture" style={{left:position.x,top:position.y}}><FoodArt kind={kind} filled={filled}/></div>}</>
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
export function MealMoment({intro=false,afterStep=0,sound,onContinue,bowl="bowl"}:{bowl?:"bowl"|"ricebowl";intro?:boolean;afterStep?:number;sound:boolean;onContinue:()=>void}){
 const text=intro?"We're going to eat and play together now.":mealPrompts[afterStep]
 const detail=intro?'Bring your food and your grown-up.':text.includes('5')?"Keep chewing until you're ready. No hurry.":'The game can wait. Take your time.'
 useEffect(()=>{if(sound)return narrate(text+' '+detail)},[sound,text,detail])
 return <><section className="kitchen-instruction kitchen-meal-message"><span>{intro?'BEFORE WE COOK':'MEALTIME PAUSE'}</span><h2 aria-live="polite">{text}</h2><p>{detail}</p><button className="replay" aria-label="Hear mealtime invitation" onClick={()=>{if(sound)narrate(text+' '+detail)}}><Volume2 size={22}/></button></section><div className="kitchen-stage kitchen-quiet" data-meal-break={intro?'intro':afterStep}><KitchenBackdrop/><div className="kitchen-worktop"><div className="kitchen-table-together"><div className="kitchen-table-milo"><Milo mood="happy"/></div><div className="kitchen-table-bowl"><FoodArt kind={bowl} filled/></div><div className="kitchen-table-spoon"><FoodArt kind="spoon"/></div></div></div></div><footer className="kitchen-footer"><Action onClick={onContinue}>{intro?"Let's eat and play":'Keep cooking'}</Action></footer></>
}
