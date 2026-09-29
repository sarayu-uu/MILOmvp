import type {ReactNode} from 'react'
import {Milo} from '../Illustrations'
import {ForestAnimal} from '../forest/ForestArt'
import type {BookId} from './storyData'
export type Icon='star'|'moon'|'firefly'|'tree'|'cloud'|'sun'|'water'|'wind'|'rock'|'flowers'|'bird'|'owl'|'frog'|'jar'|'feather'|'rainbow'|'nest'
export function StoryIcon({kind,color='#dfc879',dim=false,variant=0}:{kind:Icon;color?:string;dim?:boolean;variant?:number}){
 const ink='#7b8067'
 return <g stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={dim?.42:1}>
  {kind==='star'&&<path d="M50 9l12 26 29 4-21 21 5 30-25-14-26 14 5-30L8 39l30-4Z" fill={color}/>}
  {kind==='moon'&&<><circle cx="50" cy="50" r="36" fill={dim?'#a9afc3':'#e9d8a0'}/><path d="M30 55q7 7 13 0m15 0q7 7 13 0M44 70q7 5 13-1" fill="none"/><circle cx="29" cy="34" r="6" fill="#c5bea1" stroke="none"/></>}
  {kind==='firefly'&&<><ellipse cx="34" cy="41" rx="18" ry="10" fill="#e7e4c7"/><ellipse cx="66" cy="41" rx="18" ry="10" fill="#e7e4c7"/><ellipse cx="50" cy="59" rx="15" ry="24" fill={color}/><circle cx="50" cy="34" r="12" fill="#8a9977"/><path d="M43 24l-7-9m20 9 7-9"/><circle cx="46" cy="33" r="2"/><circle cx="55" cy="33" r="2"/></>}
  {kind==='tree'&&<><path d="M44 93l4-63h11l5 63Z" fill="#ad9275"/><path d="M53 58L29 43m25 9 23-19" fill="none" strokeWidth="5"/><path d="M11 44Q-1 20 25 15Q35-8 56 9Q84-3 90 24q24 31-9 39Q58 80 42 60Q11 71 11 44" fill="#91aa83"/></>}
  {kind==='cloud'&&<><path d={variant===1?'M9 64Q4 36 29 35L34 8q17-14 20 14l2 15q34-14 39 15q12 29-20 30H29Z':variant===2?'M6 61q-2-25 24-20q-1-39 28-21q15-6 17 17q30-1 23 31q-8 23-38 12H25Z':'M10 67Q-3 40 25 37Q28 5 58 23q29-5 27 26q29 25-5 33H28Z'} fill={color==='#dfc879'?'#f1ecdc':color}/><path d="M43 58v3m18-3v3m-15 11q7 5 13-1" fill="none"/></>}
  {kind==='sun'&&<><g stroke="#d8ba76" strokeWidth="4"><path d="M50 3v12m0 70v12M3 50h12m70 0h12M16 16l9 9m50 50 9 9M16 84l9-9m50-50 9-9"/></g><circle cx="50" cy="50" r="26" fill="#e5ca87"/></>}
  {kind==='water'&&<><path d="M50 9Q34 36 27 48Q9 81 50 92q40-10 24-42Z" fill="#9abfc6"/><path d="M36 63q-3 12 9 16" fill="none" stroke="#e0ebe3" strokeWidth="5"/></>}
  {kind==='wind'&&<g fill="none" stroke="#a2bfc2" strokeWidth="6"><path d="M7 38h60q28 0 19-20q-8-13-19-1M3 53h47q24 0 22 17q-6 18-21 5M13 70h15"/></g>}
  {kind==='rock'&&<path d="M9 82l13-40 33-18 31 24 10 34Z" fill="#a4afa0"/>}
  {kind==='flowers'&&<>{(variant===1?[50]:[25,51,77]).map((x,i)=><g key={x}><path d={dim?`M${x} 93q-8-30 10-32`:`M${x} 93v-${45+i%2*18}`} stroke="#8c9e71" strokeWidth="4" fill="none"/><g transform={`translate(${dim?x+10:x} ${dim?61:48-i%2*18})`} fill={color}><circle cx="-7" r="9"/><circle cx="7" r="9"/><circle cy="-7" r="9"/><circle cy="7" r="9"/><circle r="5" fill="#e8d8a0"/></g></g>)}</>}
  {(['bird','owl','frog'] as string[]).includes(kind)&&<svg width="100" height="100"><ForestAnimal kind={kind as 'bird'|'owl'|'frog'}/></svg>}
  {kind==='jar'&&<><path d="M29 17h42v18q15 6 15 22v30H14V57q0-16 15-22Z" fill="#b8ccd2" fillOpacity=".55"/><path d="M27 18h46v12H27Z" fill="#c5ad86"/>{[30,50,70].map((x,i)=><circle key={x} cx={x} cy={60+i%2*16} r="7" fill="#f1d993" stroke="none"/>)}</>}
  {kind==='feather'&&<><path d="M22 84Q2 29 73 8q29 56-51 76" fill="#adc9c9"/><path d="M18 96L71 19M35 64l-9-24m19 10 26-6" fill="none"/></>}
  {kind==='rainbow'&&<g fill="none" strokeWidth="10"><path d="M7 85a43 60 0 0 1 86 0" stroke="#cfa792"/><path d="M19 85a31 46 0 0 1 62 0" stroke="#e0c686"/><path d="M31 85a19 32 0 0 1 38 0" stroke="#a3b99e"/></g>}
  {kind==='nest'&&<><ellipse cx="50" cy="52" rx="43" ry="19" fill="#bca07c"/><path d="M8 52q8 40 44 39q33-1 41-39" fill="#cdb48d"/><path d="M17 61l63 13m-61 0 55-15M32 85l51-21" stroke="#e1cda7" strokeWidth="4"/></>}
 </g>
}
export function StoryObject({kind,label,x,y,size=125,onClick,disabled=false,color,dim,variant,children}:{kind:Icon;label:string;x:number;y:number;size?:number;onClick?:()=>void;disabled?:boolean;color?:string;dim?:boolean;variant?:number;children?:ReactNode}){
 return <g transform={`translate(${x} ${y})`} role={onClick?'button':'img'} aria-label={label} aria-disabled={disabled||undefined} tabIndex={onClick&&!disabled?0:undefined} className={onClick?'story-object':''} onClick={()=>{if(!disabled)onClick?.()}} onKeyDown={e=>{if(!disabled&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onClick?.()}}}>
  <rect x="-8" y="-8" width={size+16} height={size+16} rx="18" fill="transparent"/>
  <svg width={size} height={size} viewBox="0 0 100 100" pointerEvents="none"><StoryIcon kind={kind} color={color} dim={dim} variant={variant}/></svg>{children}
 </g>
}
export function StoryScene({book,children,ending=false,label}:{book:BookId;children?:ReactNode;ending?:boolean;label:string}){
 const night=book==='moon'
 return <svg className="storybook-scene" viewBox="0 0 1000 560" role="group" aria-label={label}>
  <rect width="1000" height="560" rx="28" fill={night?ending?'#77879d':'#66788e':book==='cloud'?'#d7e5e1':'#e5ead7'}/>
  <path d="M0 325Q230 216 473 337Q740 227 1000 312V560H0Z" fill={night?'#6d8390':'#c4d2af'}/><path d="M0 420Q276 341 529 429Q743 336 1000 387V560H0Z" fill={night?'#819598':'#b3c7a1'}/>
  <path d="M164 560Q131 418 385 443Q544 451 545 390" fill="none" stroke={night?'#a5aaa1':'#e5d6b6'} strokeWidth="60"/>
  <g opacity=".35"><StoryObject kind="tree" label="Distant tree" x={-20} y={190} size={200}/><StoryObject kind="tree" label="Distant tree" x={840} y={170} size={220}/></g>
  {!night&&<path d="M42 67q4-40 50-28q28-33 51 4q37-2 39 29Z" fill="#f5f0df"/>}
  {night&&[90,190,330,560,740,900].map((x,i)=><circle key={x} cx={x} cy={35+i%3*38} r="3" fill="#ede0b3"/>)}
  {ending&&book==='cloud'&&<><path d="M340 290a170 200 0 0 1 340 0" fill="none" stroke="#d4ae97" strokeWidth="12" opacity=".5"/><path d="M355 290a155 180 0 0 1 310 0" fill="none" stroke="#d9c789" strokeWidth="12" opacity=".5"/></>}
  {children}
  <foreignObject x="30" y="408" width="115" height="125" pointerEvents="none"><Milo mood={ending?'happy':'curious'}/></foreignObject>
 </svg>
}
export function LibraryTree(){return <svg className="library-tree" viewBox="0 0 1000 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="1000" height="660" fill="#e6ead8"/><path d="M0 100Q210-47 463 46Q798-60 1000 96v158H0Z" fill="#a7ba98"/><path d="M289 650Q381 519 357 195L261 42l66-26 143 192L493 0h74l-12 208L743 30l62 38-172 208q-11 238 130 374Z" fill="#b5a080"/><path d="M390 580V296q-1-151 121-154q139-5 138 154v284Z" fill="#7e8267"/><path d="M414 534V299q-1-116 100-125q105 11 107 124v236Z" fill="#c9c8a7"/><path d="M0 653q196-165 426-40q206-66 574 13v34H0Z" fill="#b4c49e"/><path d="M187 522q164-39 304 30q138-26 320-52M303 650q112-91 180-105m227 105q-94-88-145-108" fill="none" stroke="#a69072" strokeWidth="30" strokeLinecap="round"/><g fill="#ece0b4">{[180,315,675,811].map((x,i)=><circle key={x} cx={x} cy={130+i%2*85} r="5"/>)}</g><path d="M450 211h140" stroke="#a38e70" strokeWidth="10"/><StoryObject kind="moon" label="Reading light" x={465} y={220} size={72}/></svg>}
export function BookCover({book,title}:{book:BookId;title:string}){return <svg viewBox="0 0 190 260" className="story-book-cover" aria-hidden="true"><path d="M14 10h158q10 0 10 12v226H17q-12-2-12-15V25q0-15 9-15" fill={book==='moon'?'#8191ab':book==='bird'?'#9eaf86':'#99bac1'} stroke="#7a8068" strokeWidth="3"/><path d="M19 14v220M16 239h162" stroke="#e6dbc0" strokeWidth="5"/><path d="M29 25h137v199H29Z" fill="none" stroke="#d8d2af" strokeWidth="2"/><svg viewBox="0 0 100 100" x="48" y="40" width="99" height="103"><StoryIcon kind={book==='moon'?'moon':book==='bird'?'bird':'cloud'}/></svg><foreignObject x="34" y="151" width="126" height="73"><div className="book-cover-title">{title}</div></foreignObject></svg>}
