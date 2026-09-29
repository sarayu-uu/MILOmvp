import type { ReactNode } from 'react'
import { Milo } from '../Illustrations'

export type Thing = 'teddy' | 'ball' | 'blocks' | 'car' | 'puzzle' | 'book' | 'berry' | 'apple' | 'banana' | 'strawberry' | 'raincoat' | 'shirt' | 'swimsuit' | 'can' | 'brush' | 'pajamas' | 'bed' | 'boots'

/** Small original objects, drawn in the same muted storybook palette. */
export function ObjectArt({ kind }: { kind: Thing }) {
  let drawing: ReactNode
  switch (kind) {
    case 'teddy': drawing = <><circle cx="25" cy="20" r="11"/><circle cx="57" cy="20" r="11"/><ellipse cx="41" cy="53" rx="21" ry="23"/><circle cx="41" cy="30" r="22"/><ellipse cx="41" cy="40" rx="10" ry="8" fill="#e6cfad"/><circle cx="33" cy="28" r="2" fill="#65594b"/><circle cx="49" cy="28" r="2" fill="#65594b"/><path d="M38 36h6l-3 4Z" fill="#65594b"/><ellipse cx="21" cy="65" rx="11" ry="9"/><ellipse cx="60" cy="65" rx="11" ry="9"/><path d="M31 49l20 2" stroke="#8a9c77" strokeWidth="7"/></>; break
    case 'ball': drawing = <><circle cx="40" cy="40" r="29" fill="#dcc17c"/><path d="M39 12Q7 40 39 68M43 12Q70 40 43 68" fill="#a1bab5"/><path d="M12 42h56" fill="none"/></>; break
    case 'blocks': drawing = <><rect x="6" y="43" width="29" height="28" rx="3" fill="#a3b9b6"/><rect x="41" y="43" width="29" height="28" rx="3" fill="#c59784"/><rect x="24" y="12" width="29" height="28" rx="3" fill="#dbc483"/><path d="M34 33l5-13 5 13m-8-5h6M16 49v16h10M50 52h11v12H50Z" fill="none" stroke="#f2e9cf" strokeWidth="3"/></>; break
    case 'car': drawing = <><path d="M8 40l16-3 9-17h23l10 18 8 4v20H8Z" fill="#a1b8b1"/><path d="M37 24h14l8 14H30Z" fill="#e9e7d4"/><circle cx="23" cy="62" r="10" fill="#7f8071"/><circle cx="60" cy="62" r="10" fill="#7f8071"/><circle cx="23" cy="62" r="4" fill="#e9d6ad"/><circle cx="60" cy="62" r="4" fill="#e9d6ad"/></>; break
    case 'puzzle': drawing = <><path d="M15 18h20q-6-15 7-15t7 15h18v20q15-6 15 7t-15 7v19H48q6-15-7-15t-7 15H15V52q15 6 15-7t-15-7Z" fill="#b9acc5"/><path d="M30 32l16 19 12-16" fill="none" stroke="#ece3d3" strokeWidth="4"/></>; break
    case 'book': drawing = <><path d="M8 15q18-6 32 4q15-10 32-4v48q-18-5-32 5q-14-10-32-5Z" fill="#e9dfbb"/><path d="M40 19v49M15 28q11-3 18 3M15 39q11-3 18 3M49 30h16M49 41h16" fill="none"/><path d="M5 18v48q22-2 35 8q16-10 35-8V18" stroke="#8d9e8c" strokeWidth="4" fill="none"/></>; break
    case 'berry': drawing = <><circle cx="40" cy="43" r="28" fill="#929db5"/><path d="M40 23l5 9 10 2-8 7 2 11-9-6-9 6 2-11-8-7 10-2Z" fill="#687c8d" stroke="none"/><path d="M22 45q-2 10 6 14" fill="none" stroke="#b7bfcc" strokeWidth="4"/></>; break
    case 'apple': drawing = <><path d="M40 21C9 4 3 42 16 60Q29 78 41 68Q58 78 69 56C80 29 61 9 40 21Z" fill="#bd8c79"/><path d="M39 21q-1-13 7-18" fill="none" strokeWidth="4"/><path d="M43 15q17-20 25-8q-9 17-25 8" fill="#8da176"/><path d="M20 31q-4 10-1 17" fill="none" stroke="#dfb29b" strokeWidth="5"/></>; break
    case 'banana': drawing = <><path d="M14 12C8 62 44 83 69 33L62 24Q39 56 23 21L23 10Z" fill="#dfc87e"/><path d="M18 21Q25 76 64 32" stroke="#baa46a" fill="none"/><path d="M14 12l9-2M63 25l7 6" strokeWidth="5"/></>; break
    case 'strawberry': drawing = <><path d="M14 27Q40 12 65 27Q73 40 41 73Q9 48 14 27Z" fill="#bf8a7c"/><path d="M40 27L19 11l15 4 5-12 8 13 15-5-8 18Z" fill="#8f9e71"/>{[25,40,54].map((x,i)=><path key={x} d={`M${x} ${36+i%2*8}v4m-6 7v4`} stroke="#f4dfb3"/>)}</>; break
    case 'raincoat': drawing = <><path d="M26 17Q40-8 54 17L71 32L63 46L56 41L61 72H19L24 41L17 46L9 32Z" fill="#dac075"/><path d="M26 18l14 14 14-14M40 32v39M25 52v10h10M46 52v10h10" fill="none"/><circle cx="44" cy="41" r="2" fill="#928361"/></>; break
    case 'shirt': case 'pajamas': drawing = <><path d="M25 12l15 7 15-7 20 20-13 13-8-7v34H25V38l-9 7L4 32Z" fill={kind === 'pajamas' ? '#a8b8c1' : '#b7bfa0'}/><path d="M29 15q11 17 23 0" fill="none"/>{kind === 'pajamas' ? <path d="M34 35h13m-13 13h13m-13 13h13" stroke="#e8e3ce" strokeWidth="4"/> : <path d="M34 42l5-10 5 10 11 1-9 7 3 11-10-6-9 6 3-11-9-7Z" fill="#e7cf89" stroke="none"/>}</>; break
    case 'swimsuit': drawing = <><path d="M22 10h12v17h13V10h12l-3 32 8 25-16 6-8-16-8 16-16-6 8-25Z" fill="#b5a4bc"/><path d="M25 37h30M23 46h34" stroke="#e8d8d5" strokeWidth="6"/></>; break
    case 'can': drawing = <><ellipse cx="56" cy="34" rx="18" ry="22" fill="none" stroke="#7e9a90" strokeWidth="7"/><path d="M20 36L2 20 0 30 20 59M19 28h34l8 43H16Z" fill="#95b2a6"/><ellipse cx="36" cy="28" rx="17" ry="5" fill="#7e9a90"/><path d="M23 37v25" stroke="#bdcbb1" strokeWidth="4"/></>; break
    case 'brush': drawing = <><rect x="34" y="23" width="11" height="51" rx="5" fill="#91aca9"/><rect x="29" y="6" width="24" height="25" rx="6" fill="#eae3cd"/><path d="M34 9v17m6-17v17m6-17v17" stroke="#b2b6a2"/></>; break
    case 'bed': drawing = <><path d="M9 19v55M70 30v44" strokeWidth="6"/><rect x="12" y="31" width="57" height="31" rx="6" fill="#abb9a0"/><rect x="15" y="25" width="21" height="17" rx="6" fill="#f0e4c7"/><path d="M38 34v25" stroke="#d4dbc1" strokeWidth="3"/></>; break
    default: drawing = <><path d="M14 16h20v34l8 7v13H9V56l5-7ZM46 16h20v34l8 7v13H41V56l5-7Z" fill="#a0ac85"/><path d="M13 25h21m12 0h20M9 65h33m-1 0h33" fill="none"/></>
  }
  return <svg viewBox="0 0 80 80" width="100%" height="100%" aria-hidden="true"><g fill="#c0a582" stroke="#827661" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{drawing}</g></svg>
}

/** Outfit is a separate accessory layer. The existing Milo is reused verbatim. */
export function HomeMilo({ mood = 'normal', coat = false, pajamas = false, boots = false }: { mood?: string; coat?: boolean; pajamas?: boolean; boots?: boolean }) {
  return <div className="home-character"><Milo mood={mood}/>{(coat || pajamas || boots) && <svg className="milo-outfit" viewBox="0 0 200 220" aria-hidden="true"><g stroke="#887a5e" strokeWidth="2" strokeLinejoin="round">{(coat || pajamas) && <><path d="M50 141l19 7 31 11 32-12 20-7 5 38q-49 22-110 0Z" fill={pajamas ? '#a8b8c1' : '#dac075'}/><path d="M100 158v30M62 164v12h17M124 164v12h17" fill="none"/>{pajamas && <path d="M57 159l26 7m28 0l34-9" stroke="#e8e3ce" strokeWidth="4"/>}</>}{boots && <><path d="M51 185h35v16H48q-5-9 3-16ZM119 185h30l8 14q-16 9-38 1Z" fill="#9ea982"/></>}</g></svg>}</div>
}

export function WindowArt({ night = false, rain = false }: { night?: boolean; rain?: boolean }) {
  return <g stroke="#b5a488" strokeWidth="4"><path d="M0 130V35Q0 0 55 0q55 0 55 35v95Z" fill={night ? '#798999' : '#c7d8d0'}/><g stroke="none">{night ? <path d="M70 13q-25 25 8 31q-33 17-36-9q-1-18 28-22" fill="#ead7a2"/> : rain ? <><path d="M15 39q-3-20 17-19q15-23 30-3q27-7 32 24Z" fill="#a9b9b8"/>{[20,41,65,86].map(x=><path key={x} d={`M${x} 55l-5 12m3 16l-5 12`} stroke="#8eaeb7" strokeWidth="3"/>)}</> : <circle cx="73" cy="29" r="16" fill="#e7ce8f"/>}<path d="M3 108q30-30 54-13q35-22 51-6v40H3Z" fill={night ? '#81928a' : '#a5b990'}/></g><path d="M55 3v126M2 65h106M-8 132h127" fill="none"/><path d="M-12 7q22 58 5 118h24Q32 60 10 5M101 5q-20 48-5 120h24q-17-73 6-118" stroke="none" fill="#d6bd9a" opacity=".8"/></g>
}

export function HouseStructure({ sleeping, sunnyMorning = false }: { sleeping: boolean; sunnyMorning?: boolean }) {
  return <g className="house-structure" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="602" cy="801" rx="510" ry="22" fill="#9faa8b" opacity=".23"/>
    <path d="M108 779q-62-24-74 6q-31-51-50 10h150M1079 788q38-68 60-18q42-31 70 26h-143" fill="#a4b495"/>
    <path d="M195 201L591 29L1021 200V782H195Z" fill="#c7b392" stroke="#a18c70" strokeWidth="5"/>
    <path d="M143 201L578 1q15-7 30 0l467 199-20 30L594 39L161 228Z" fill="#b58e73" stroke="#9a7c62" strokeWidth="4"/>
    <path d="M189 191L594 16l440 188M303 144l94 5m-15-40 120 1m-5-43 147 0m-1 30h133m-58 40h136m-55 39h138" fill="none" stroke="#cda78a" strokeWidth="5" opacity=".65"/>
    <path d="M868 124V43h61v109" fill="#b3a186" stroke="#9a8a71" strokeWidth="4"/><path d="M859 39h79v16h-79" fill="#bba98c"/>
    <path d="M219 205L591 53L997 205V379H219Z" fill="#efe3ca"/>
    <path d="M718 119l279 86v174H718Z" fill="#dae0ce"/>
    <path d="M219 412h460v199H219Z" fill="#e9dcc3"/><path d="M701 412h296v199H701Z" fill="#dedfca"/>
    <path d="M219 641h778v132H219Z" fill="#ede5cd"/>
    <g opacity=".24" fill="#a9af8a">{Array.from({length:17},(_,i)=><g key={i}><path d={`M${235+i*25} 435v7m0 14v7m0 14v7m0 14v7`}/><circle cx={237+i*25} cy={449} r="2"/></g>)}</g>
    <g stroke="#d5c29e" strokeWidth="2" opacity=".8"><path d="M222 344h772M222 361h772M220 577h777M220 595h777M220 736h777M220 756h777"/><path d="M337 344v35m208-35v35m214-35v35m124-35v35M345 577v35m210-35v35m220-35v35m112-35v35M333 736v37m201-37v37m226-37v37m124-37v37"/></g>
    <path d="M211 380h794v28H211ZM211 612h794v25H211Z" fill="#c1a887" stroke="#ac9475" strokeWidth="3"/><path d="M697 120v260M688 411v200" fill="none" stroke="#c2ad8b" strokeWidth="17"/>
    <path d="M210 775h797l12 13H199Z" fill="#b9a081"/>
    <path d="M205 215v558M1010 215v558" stroke="#b29a7b" strokeWidth="19"/>
    <g transform="translate(460 135)"><WindowArt night={sleeping} rain={!sleeping && !sunnyMorning}/></g>
    <g transform="translate(750 189) scale(.64)"><WindowArt night={sleeping}/></g>
    <g transform="translate(786 433) scale(.58)"><WindowArt night={sleeping}/></g>
    <g transform="translate(309 652) scale(.65)"><WindowArt night={sleeping}/></g>
    <g transform="translate(559 74)"><circle cx="32" cy="32" r="29" fill="#eae0c5" stroke="#b49d7e" strokeWidth="4"/><path d="M32 15v18l13 5" fill="none" stroke="#899379" strokeWidth="3"/><circle cx="32" cy="32" r="3" fill="#899379"/></g>
    <g transform="translate(865 240)"><ellipse cx="28" cy="-5" rx="27" ry="35" fill="#c4d3cc" stroke="#bca889" strokeWidth="6"/><path d="M14-23l20-10m-19 22 14-7" stroke="#e9eee0" strokeWidth="4"/><path d="M-5 44h66l-8 26H4Z" fill="#eee8d6" stroke="#b8baa4" strokeWidth="3"/><path d="M27 42V26q0-11 12-11h9" stroke="#96a89f" strokeWidth="7" fill="none"/><path d="M2 72v29h53V72" fill="#b0bca4"/><rect x="60" y="40" width="19" height="35" rx="3" fill="#d2b496"/><path d="M-8 43h13" stroke="#c9a789" strokeWidth="8"/></g>
    <g transform="translate(754 309)"><path d="M-5 0h106l-9 49q-44 12-85 0Z" fill="#e7e7d6" stroke="#b8b9a3" strokeWidth="3"/><path d="M-11 0h117" stroke="#f4efdf" strokeWidth="10"/><path d="M16 52l-4 11m67-11 5 11" stroke="#a79c83" strokeWidth="5"/><circle cx="25" cy="-8" r="11" fill="#d8e2d9"/><circle cx="46" cy="-5" r="8" fill="#e9ecdd"/></g>
    <g transform="translate(935 454)"><rect width="43" height="120" rx="8" fill="#bac8b7" stroke="#97a591" strokeWidth="3"/><path d="M2 43h39m-31-27v17m0 22v22" stroke="#8e9e88" strokeWidth="3"/></g>
    <path d="M721 512h198v63H721Z" fill="#b0baa0" stroke="#94a287" strokeWidth="3"/><path d="M714 508h209v11H714Z" fill="#c8b28f"/><path d="M782 521v51m69-51v51" stroke="#94a287" strokeWidth="2"/><path d="M749 538h13m36 0h13m58 0h13" stroke="#e3dbc2" strokeWidth="4"/>
    <g stroke="#ae9678" strokeWidth="4"><path d="M725 447h56M856 447h63"/><path d="M733 447v-23h13v23m118 0v-20h20v20" fill="#d1bd9b"/><path d="M753 447v-26h17v26" fill="#9eb2a6"/></g>
    <g transform="translate(391 690)"><path d="M0 26q-5-54 30-54t36 54v44H0Z" fill="#b9bea0" stroke="#949e7f" strokeWidth="3"/><path d="M-10 26h84v18H-10Z" fill="#c6c8a9"/><path d="M3 70v9m59-9v9" stroke="#92836d" strokeWidth="5"/><path d="M15-8q16-9 32 1v27H15Z" fill="#e3d2ae"/></g>
    <g transform="translate(851 671)"><rect width="114" height="96" rx="3" fill="#c2aa87" stroke="#a48f70" strokeWidth="3"/><path d="M2 47h109" stroke="#927e60" strokeWidth="5"/>{[0,1,2,3,4].map(i=><rect key={i} x={10+i*19} y={i%2?10:16} width="13" height={i%2?35:29} rx="1" fill={['#95aaa2','#c6a18b','#acb490','#cbbb8d','#b6a7b9'][i]}/>)}<path d="M11 64h65v12H11Zm0 16h79v12H11Z" fill="#93a99c"/><path d="M84 62h18v28H84Z" fill="#d4c194"/></g>
    <g transform="translate(597 698)"><ellipse cx="33" cy="17" rx="56" ry="21" fill="#cdb695"/><path d="M2 32l-4 44m65-44 5 44" stroke="#a38a6c" strokeWidth="6"/><path d="M22 7h23v15H22Z" fill="#dce1c9" stroke="#b5bfa5" strokeWidth="2"/><path d="M44 10q14-3 11 8H44" fill="none" stroke="#b5bfa5" strokeWidth="3"/></g>
    <ellipse cx="535" cy="767" rx="122" ry="15" fill="#c7b99a" opacity=".4"/>
    <path d="M539 118l9 14 17 2-12 11 2 17-16-8-15 8 3-17-13-11 17-2Z" fill="#d9c185" opacity=".65"/>
  </g>
}
