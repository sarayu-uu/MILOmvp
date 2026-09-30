import {useEffect,useRef} from 'react'
import type {ButtonHTMLAttributes} from 'react'
import './continue.css'

/** Opt in only at a child-paced transition, never on an answer or a tool. */
export function ContinueButton({children,onClick,disabled=false,className='play-action',...props}:Omit<ButtonHTMLAttributes<HTMLButtonElement>,'onClick'>&{onClick:()=>void}){
 const button=useRef<HTMLButtonElement>(null)
 const callback=useRef(onClick)
 useEffect(()=>{callback.current=onClick},[onClick])
 useEffect(()=>{
  if(disabled)return
  let start:{x:number;y:number;id:number}|null=null
  let removeClick:(()=>void)|undefined
  const blocked=(target:EventTarget|null)=>{
   if(!(target instanceof Element))return true
   const overlay=document.querySelector('[aria-modal="true"],dialog[open],.modal-backdrop,.home-mission')
   if(overlay&&!overlay.contains(button.current))return true
   if(target.closest('[data-step-complete="true"]'))return false
   return !!target.closest('button:not(:disabled),a,input,select,textarea,[role="button"]:not([aria-disabled="true"]),[data-no-advance]')
  }
  function down(e:PointerEvent){start=e.isPrimary&&e.button===0&&!blocked(e.target)?{x:e.clientX,y:e.clientY,id:e.pointerId}:null}
  function cancel(){start=null}
  function up(e:PointerEvent){
   const origin=start;start=null
   if(e.defaultPrevented||!origin||origin.id!==e.pointerId||blocked(e.target)||Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>12)return
   e.preventDefault();e.stopPropagation()
   // A new screen must not receive the compatibility click from this same tap.
   removeClick?.()
   const swallow=(event:MouseEvent)=>{if(event.detail===0)return;event.preventDefault();event.stopImmediatePropagation();cleanup()}
   const timer=window.setTimeout(cleanup,400)
   function cleanup(){document.removeEventListener('click',swallow,true);document.removeEventListener('pointerdown',cleanup,true);window.clearTimeout(timer)}
   removeClick=cleanup;document.addEventListener('click',swallow,true);document.addEventListener('pointerdown',cleanup,true)
   callback.current()
  }
  document.addEventListener('pointerdown',down,true)
  document.addEventListener('pointerup',up,true)
  document.addEventListener('pointercancel',cancel,true)
  return()=>{document.removeEventListener('pointerdown',down,true);document.removeEventListener('pointerup',up,true);document.removeEventListener('pointercancel',cancel,true)}
 },[disabled])
 return <button ref={button} {...props} className={`${className} continue-button`} disabled={disabled} onClick={onClick}><span>{children}</span></button>
}
