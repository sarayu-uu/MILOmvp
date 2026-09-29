import {useState} from 'react'
import './pictureGuess.css'
import {pictureAnimals} from './pictureData'
export function PictureGuess({target,choices,onComplete}:{target:number;choices:number[];onComplete:()=>void}){
 const [done,setDone]=useState(false),[hint,setHint]=useState(false)
 return <div className="picture-guess"><p className="picture-target">Find the {pictureAnimals[target].name}! <span aria-hidden="true">{pictureAnimals[target].emoji}</span></p><div className="picture-options">{choices.map(i=><button key={i} aria-label={pictureAnimals[i].name} disabled={done} className={hint&&i===target?'picture-clue':''} onClick={()=>{if(i===target){setDone(true);setHint(false);onComplete()}else setHint(true)}}><span aria-hidden="true">{pictureAnimals[i].emoji}</span></button>)}</div><p role="status">{done?'There it is!':hint?'Look for the matching picture.':' '}</p></div>
}
