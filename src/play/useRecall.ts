import { useState } from 'react'
/** Shared by forest acorns and story stars/directions. Retries retain the same targets. */
export function useRecall(targets: readonly number[], ordered = false) {
 const [show,setShow]=useState(true),[found,setFound]=useState<number[]>([]),[hint,setHint]=useState<number|null>(null)
 const done=found.length===targets.length
 function choose(index:number){
  if(show||done||found.includes(index))return
  if(ordered?targets[found.length]===index:targets.includes(index)){setFound(v=>[...v,index]);setHint(null)}else setHint(index)
 }
 function again(){setShow(true);setFound([]);setHint(null)}
 return {show,setShow,found,setFound,hint,setHint,done,choose,again}
}
