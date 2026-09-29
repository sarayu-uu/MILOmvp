import { memo } from 'react'
import type { ReactNode } from 'react'
import type { Animal } from './forestJourney'

export function ForestAnimal({ kind, settled = false }: { kind: Animal; settled?: boolean }) {
  let drawing: ReactNode
  let height = 160
  switch (kind) {
    case 'frog':
      height = 140
      drawing = <><ellipse cx="79" cy="119" rx="58" ry="10" fill="#779681" opacity=".2" stroke="none"/><path d="M34 92Q8 86 12 111Q26 123 56 108M117 91q35-7 29 21q-17 11-46-4" fill="#8aa77e"/><ellipse cx="79" cy="89" rx="45" ry="32" fill="#9fb98a"/><path d="M48 103q29 17 61-1" stroke="#bfd1a2" strokeWidth="13"/><circle cx="52" cy="57" r="18" fill="#9fb98a"/><circle cx="108" cy="57" r="18" fill="#9fb98a"/><ellipse cx="52" cy="58" rx="10" ry="12" fill="#e9e8c9"/><ellipse cx="108" cy="58" rx="10" ry="12" fill="#e9e8c9"/><ellipse cx="54" cy="59" rx="3" ry="5" fill="#52614c" stroke="none"/><ellipse cx="106" cy="59" rx="3" ry="5" fill="#52614c" stroke="none"/><path d="M66 84q13 12 26 0" fill="none"/><path d="M42 103l-10 19M118 103l11 19" fill="none" strokeWidth="5"/><ellipse cx="42" cy="83" rx="8" ry="4" fill="#c3bd8f" stroke="none"/><ellipse cx="118" cy="83" rx="8" ry="4" fill="#c3bd8f" stroke="none"/></>
      break
    case 'bear':
      height = 180
      drawing = <><ellipse cx="83" cy="170" rx="49" ry="8" fill="#697760" opacity=".18" stroke="none"/><ellipse cx="80" cy="118" rx="42" ry="45" fill="#b6a080"/><path d="M44 99Q15 99 22 127q14 13 28-1M117 99q29 1 22 28q-16 9-27-1" fill="#b6a080"/><ellipse cx="57" cy="159" rx="21" ry="12" fill="#a68d70"/><ellipse cx="106" cy="159" rx="21" ry="12" fill="#a68d70"/><circle cx="46" cy="36" r="16" fill="#b6a080"/><circle cx="113" cy="36" r="16" fill="#b6a080"/><circle cx="46" cy="36" r="9" fill="#c9b69b" stroke="none"/><circle cx="113" cy="36" r="9" fill="#c9b69b" stroke="none"/><path d="M33 61Q31 29 81 30q48 0 47 37q-1 42-47 43Q35 104 33 61" fill="#c1ab89"/><ellipse cx="80" cy="86" rx="24" ry="18" fill="#ddd0b0" stroke="none"/><circle cx="58" cy="67" r="3" fill="#514f43" stroke="none"/><circle cx="102" cy="67" r="3" fill="#514f43" stroke="none"/><path d="M72 80q8-8 16 0q-7 13-16 0" fill="#74634f"/><path d="M80 86v5m-7 0q7 7 15 0" fill="none"/>{settled && <g><path d="M54 121h53l-3 36q-24 12-47 0Z" fill="#d7bb7c"/><ellipse cx="80" cy="121" rx="27" ry="7" fill="#c2a56a"/><path d="M66 127l5 14 8-7 8 12 8-17" stroke="#e4cb88" fill="none" strokeWidth="6"/></g>}</>
      break
    case 'snake':
      height = 100
      drawing = <><path d="M12 75C35 95 55 59 80 72C129 97 144 78 129 54L111 34" fill="none" stroke="#829875" strokeWidth="20"/><path d="M15 75C35 91 56 59 79 72C127 92 138 80 127 59" fill="none" stroke="#b4c198" strokeWidth="12"/><ellipse cx="111" cy="33" rx="25" ry="21" fill="#9fb68c"/><ellipse cx="99" cy="29" rx="3" ry="4" fill="#52614c" stroke="none"/><ellipse cx="119" cy="26" rx="3" ry="4" fill="#52614c" stroke="none"/><path d="M102 43q10 6 18-1" fill="none"/><path d="M32 79l4-7m21-3 3-8m29 17 3-8" stroke="#8a9d78" strokeWidth="3"/></>
      break
    case 'squirrel':
      height = 170
      drawing = <><path d="M102 125Q148 123 143 61Q146 14 118 12Q81 8 83 43q-2 25 18 31q17 4 13-13Q97 80 124 88q-1 27-28 22" fill="#bd9478" strokeWidth="3"/><ellipse cx="73" cy="121" rx="33" ry="31" fill="#c7a184"/><path d="M56 100L29 119l11 11 25-14" fill="#c7a184"/><ellipse cx="64" cy="148" rx="27" ry="9" fill="#b79378"/><path d="M44 60l-3-33 21 20m24 4 17-28 3 39" fill="#c7a184"/><ellipse cx="73" cy="73" rx="35" ry="30" fill="#c7a184"/><ellipse cx="63" cy="86" rx="20" ry="12" fill="#e1c5a4" stroke="none"/><circle cx="57" cy="66" r="3" fill="#5d5345" stroke="none"/><circle cx="88" cy="64" r="3" fill="#5d5345" stroke="none"/><path d="M52 82l8-3 3 6" fill="#81705a"/><path d="M60 90q9 6 16 0" fill="none"/>{settled && <g transform="translate(28 105)"><path d="M5 12h27q0 29-14 31Q2 35 5 12" fill="#c2a476"/><path d="M0 12q17-26 38 0v7H0Z" fill="#927e5e"/><path d="M19 2l3-8" strokeWidth="3"/></g>}</>
      break
    case 'owl':
      drawing = <><path d="M41 40L26 14l35 13q19-6 35 0l35-14-13 31q24 73-13 98H56Q21 112 41 40Z" fill="#a5aba0"/><path d="M39 60Q4 91 42 126M120 58q34 44-3 70" fill="#8f9a8d"/><path d="M45 49Q71 21 80 49q16-27 38 0v32q-33 36-73 0Z" fill="#e0dfc5" stroke="none"/><ellipse cx="59" cy="64" rx="13" ry="17" fill="#f0ead3" stroke="#b8b99f"/><ellipse cx="100" cy="64" rx="13" ry="17" fill="#f0ead3" stroke="#b8b99f"/><ellipse cx="60" cy="64" rx="4" ry="7" fill="#586054" stroke="none"/><ellipse cx="98" cy="64" rx="4" ry="7" fill="#586054" stroke="none"/><path d="M72 80h15l-8 12Z" fill="#c7ad73"/><path d="M60 110l6 5 5-5m12 1 6 5 5-5m-18 16 5 4 5-4" fill="none" stroke="#cbd0b8" strokeWidth="3"/><path d="M55 143v8m9-8v8m31-8v8m9-8v8" stroke="#a88f68" strokeWidth="4"/></>
      break
    default:
      height = 140
      drawing = <><ellipse cx="77" cy="95" rx="41" ry="29" fill="#a0b8be"/><circle cx="80" cy="60" r="33" fill="#b4c8ca"/><path d="M102 66l23 9-22 10" fill="#d7b181"/><ellipse cx="60" cy="94" rx="19" ry="14" fill="#8ca9b0"/><path d="M54 41q-13-27 5-21q7-26 16-6q17-18 19 12" fill="#b4c8ca"/><circle cx="92" cy="55" r="3" fill="#4e6161" stroke="none"/><ellipse cx="97" cy="70" rx="7" ry="4" fill="#d4b69c" stroke="none"/><path d="M55 118l-5 9m23-7-2 10" stroke="#a78d68" strokeWidth="3"/></>
  }
  return <svg viewBox={`0 0 160 ${height}`} width="100%" height="100%" aria-hidden="true"><g stroke="#77816b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{drawing}</g></svg>
}

export function ForestStar({ x, y, size = 20 }: { x: number; y: number; size?: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r={size * 1.65} fill="#f4e5ac" opacity=".13"/><circle r={size * .95} fill="#f2dfa0" opacity=".22"/><path d="M0-20L6-7 20-4 10 6 12 20 0 13-12 20-10 6-20-4-6-7Z" transform={`scale(${size / 20})`} fill="#ead292" stroke="#c8b275" strokeWidth="1.4"/><path d="M-3-8l-3 6" stroke="#fff1c4" strokeWidth="2" strokeLinecap="round"/></g>
}

function Fir({ x, y, scale = 1, color = '#6e8e77' }: { x: number; y: number; scale?: number; color?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-7 0L-4-135h8L8 0Z" fill="#8a8770"/><path d="M0-210q-6 39-28 63l17-4q-17 36-45 56l27-5Q-56-61-81-46l34-5Q-67-19-94-6q53 15 94-4q45 20 94 4Q64-25 45-52l34 6Q49-69 29-102l27 7Q28-120 13-152l15 5Q9-178 0-210" fill={color}/><path d="M-13-142l-7 15m6 31-15 17m11 24-15 13m41-18 20 18m-15-61 15 17" stroke="#c4d0a3" opacity=".24" strokeWidth="4" fill="none" strokeLinecap="round"/></g>
}

function RoundTree({ x, y, scale = 1, color = '#879d79', old = false }: { x: number; y: number; scale?: number; color?: string; old?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinecap="round" strokeLinejoin="round">
    <path d={old ? 'M-36 15Q-5-51-14-145L-59-191-46-204-4-167L11-230l17 2-9 69 57-39 11 14-67 59Q5-42 46 14Z' : 'M-18 8Q-3-68-10-169l-38-38 11-8 35 31 26-36 9 6-24 48q-7 115 16 174Z'} fill={old ? '#9d8d70' : '#a79b7b'}/>
    {old && <><path d="M-4-12q15-45 3-94M22-40q-4 30 14 47" stroke="#c2ad84" strokeWidth="4" fill="none"/><ellipse cy="-75" rx="15" ry="25" fill="#7c7b60"/><path d="M-7-79q7-11 15-1" stroke="#a29473" fill="none" strokeWidth="3"/></>}
    <path d="M-96-139Q-152-151-116-198Q-132-247-77-260Q-53-309-7-280Q42-318 76-264Q130-264 129-220Q167-176 116-149Q94-117 49-136Q8-104-26-132Q-66-105-96-139Z" fill={color}/>
    <path d="M-90-227q26-39 61-16M14-269q32-11 48 20M58-171q37-26 58-17M-75-161q29 10 43-1" stroke="#c5cfa2" strokeWidth="7" opacity=".25" fill="none"/>
    <path d="M-116-188q38-14 65 20q-34 30-69 2M26-238q24-39 48-16q-7 29-48 16" fill="#d2d8ac" opacity=".09"/>
  </g>
}

function Bush({ x, y, scale = 1, color = '#7e9870' }: { x: number; y: number; scale?: number; color?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-77 6q-19-45 15-40q-5-42 23-30q4-46 29-28q20-45 42-13q38-13 37 24q37-12 35 19q37 8 7 38Z" fill={color}/><path d="M-35-42l14 42m16-65 7 59m28-63L12 0m-62-22 25 27m77-34L26 3" fill="none" stroke="#c2c89b" strokeWidth="2.5" opacity=".45"/></g>
}

function Acorn({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-6 0h13q0 13-7 16Q-7 11-6 0" fill="#bfaa79"/><path d="M-9-1q9-12 18 0v4H-9Z" fill="#8d8462"/><path d="M0-6l2-6" stroke="#8d8462" strokeWidth="2"/></g>
}

/** One continuous original landscape; camera movement never swaps the scene. */
export const ForestLandscape = memo(function ForestLandscape({ resolved, revealFinal, restored, birdHasLantern }: { resolved: number[]; revealFinal: boolean; restored: boolean; birdHasLantern: boolean }) {
  return <g className={`forest-landscape ${restored ? 'forest-restored' : ''}`}>
    <defs>
      <linearGradient id="forest-sky" x1="0" x2="0" y1="0" y2="1"><stop stopColor={restored ? '#e6d9c5' : '#e4eae0'}/><stop offset="1" stopColor="#f5efdd"/></linearGradient>
      <filter id="forest-paper" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".06"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
      <linearGradient id="forest-mist" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#e9ecdd" stopOpacity=".85"/><stop offset="1" stopColor="#e9ecdd" stopOpacity="0"/></linearGradient>
      <linearGradient id="earth-path" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#dccca5"/><stop offset="1" stopColor="#eddbb5"/></linearGradient>
    </defs>
    <g>
      <path d="M-1500-1200H3200V1700H-1500Z" fill="url(#forest-sky)"/>
      <circle cx="1240" cy="115" r="49" fill="#eddfa9" opacity=".55"/>
      <g fill="#faf8ee" opacity=".78"><path d="M246 138q20-22 41-8q21-36 47-10q26-8 42 14Z"/><path d="M703 76q15-19 29-8q13-27 35-6q28-7 33 16Z"/><path d="M1370 165q17-26 38-9q20-43 47-12q27-11 44 23Z"/></g>
      <path d="M-400 438Q-68 221 196 365Q390 304 612 145Q663 111 704 155L1010 371Q1237 256 1647 463L1800 769H-500Z" fill="#b8cebd"/>
      <path d="M224 405Q343 217 510 90Q543 60 581 94Q750 210 902 379L1050 494Z" fill="#a8c4b1"/>
      <path d="M551 83Q493 202 545 221Q602 240 575 304Q655 271 681 306l139 92Q695 217 580 95Z" fill="#91b69f" opacity=".52"/>
      <path d="M802 395Q938 213 1070 170Q1100 158 1133 191Q1267 319 1459 435L1532 513H825Z" fill="#a0bdad"/>
      <path d="M1085 169q-46 62-3 104q37 35 8 66q116-9 184 60q-46-78-142-207Z" fill="#89ae9c" opacity=".46"/>
      <path d="M-191 448Q13 254 94 288Q199 321 352 429L458 528H-253Z" fill="#a9c3ad"/>
      <g stroke="#e2e8cc" strokeWidth="3" strokeLinecap="round" opacity=".58"><path d="M473 146l-18 23m58-57-13 17m-75 62-19 22m101-53-15 21m-95 30-17 17M1027 214l-19 16m46-7-22 27m-2 27-16 18M62 329l-12 15m38-14-10 11"/></g>
      <path d="M-300 538Q155 329 403 442Q595 339 885 399Q1182 331 1506 442L1790 803H-300Z" fill="#a9bea0"/>
      <g opacity=".55">{Array.from({ length: 24 }, (_, i) => <Fir key={i} x={-10 + i * 70} y={430 + Math.sin(i * 1.5) * 28} scale={.37 + (i % 3) * .07} color="#789b84"/>)}</g>
      <path d="M-150 466Q283 387 504 471Q746 409 995 488Q1253 377 1690 486L1850 1145H-300Z" fill="#b7c69f"/>
      <path d="M-220 677Q63 492 384 588Q710 646 1056 492Q1332 420 1782 706L1800 1240H-220Z" fill="#a6bc91"/>
      <path d="M-70 795Q218 637 611 734Q994 789 1266 566Q1575 562 1840 857V1400H-200Z" fill="#b7c397"/>
      <path d="M0 998Q120 819 506 901Q999 928 1322 802Q1556 755 1863 996L1800 1450H-200Z" fill="#a1b589"/>
      {/* A broad foreground path becomes a fine ribbon among the distant trees. */}
      <path d="M638 1130C1040 957 256 914 523 744C725 635 1015 752 887 646C798 598 691 611 839 539C1020 478 655 532 556 469C475 386 700 405 888 365C1000 329 1138 360 1122 320L1100 251L1120 249L1142 320C1155 362 1028 360 913 386C725 433 558 399 597 457C686 508 1069 516 887 561C757 633 860 590 961 635C1090 765 763 761 618 765C431 844 1164 951 933 1130L1200 2000H350L638 1130Z" fill="url(#earth-path)"/>
      <path d="M756 1130C1098 955 341 892 562 754C742 660 1013 758 925 645C835 585 710 621 865 550C1035 486 674 552 575 462C509 383 716 419 900 375C1016 345 1127 370 1130 320L1110 264" fill="none" stroke="#cdb58e" strokeWidth="9" opacity=".34"/>
      <path d="M676 990q-91-26-143-56m-1-108 39-34m172-68 83 0" fill="none" stroke="#f9eaca" strokeWidth="5" opacity=".6" strokeLinecap="round"/>
      <g fill="#b9a47c" opacity=".45">{[[701,963,8],[637,874,6],[531,818,5],[795,728,5],[936,682,4],[822,603,3],[793,541,3],[646,491,3],[691,411,2]].map(([x,y,r]) => <ellipse key={x} cx={x} cy={y} rx={r} ry={r / 2}/>)}</g>
      {/* Distant, quiet trees provide atmospheric depth instead of level markers. */}
      <g opacity=".64"><RoundTree x={738} y={433} scale={.42} color="#8da785"/><Fir x={788} y={394} scale={.7} color="#789781"/><Fir x={1174} y={429} scale={.8} color="#7e9a7e"/><RoundTree x={603} y={375} scale={.42} color="#91aa88"/></g>
      <RoundTree x={1248} y={318} scale={.82} color="#93a987" old/>
      <path d="M1230 283q30 13 81-11" stroke="#9d8d70" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <g className={`forest-final-reveal ${revealFinal ? 'is-revealed' : ''}`}>
        <path d="M1220 282q51 19 99-1q-4 33-48 35q-48-4-51-34Z" fill="#bca381" stroke="#9b876c" strokeWidth="2"/>
        <path d="M1227 290q43 20 85 0m-72 11 52 4m-50-24 53 21m-69-8 30-7" stroke="#d3bb94" strokeWidth="2" fill="none"/>
        {!birdHasLantern && <ForestStar x={1297} y={272} size={13}/>}
        {birdHasLantern && <g transform="translate(1304 273)"><circle r="24" fill="#f0d795" opacity=".19"/><path d="M-10-11h20v26h-20Z" fill="#e7ce91" stroke="#a18f6d" strokeWidth="2"/><path d="M-5-12v-5q5-9 10 0v5M-10-2h20" stroke="#a18f6d" strokeWidth="2" fill="none"/></g>}
      </g>
      <path d="M1197 199q24 9 48-2" stroke="#9b8b6c" strokeWidth="8" strokeLinecap="round" fill="none"/>
      {restored && <ForestStar x={1217} y={185} size={21}/>}
      <RoundTree x={1008} y={382} scale={.64} color="#7f997d" old/>
      <path d="M958 313q49 8 74-14" stroke="#968a6e" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <RoundTree x={440} y={460} scale={.78} color="#8fa37b" old/>
      <Acorn x={414} y={455} scale={.7}/><Acorn x={517} y={452} scale={.6}/>
      <path d="M395 440l14-16 8 19m90-4 17-13 7 18" fill="#a8b783"/>
      <ellipse cx="598" cy="438" rx="28" ry="12" fill="#9b9e86"/><path d="M580 433q21-9 32 3" stroke="#c9c9ae" strokeWidth="3" fill="none"/>
      <g opacity=".7"><Fir x={365} y={607} scale={.95} color="#79916f"/><RoundTree x={1235} y={610} scale={.72} color="#8ca079"/></g>
      {/* Honey tree and branches share the same clearing as Bear. */}
      <RoundTree x={1128} y={651} scale={1.05} color="#809773"/>
      <path d="M1090 549l44 7m-48-51 52 13m-17-52 54 8" stroke="#9b8c6b" strokeWidth="9" strokeLinecap="round"/>
      {!resolved.includes(2) && <g transform="translate(1098 467)"><path d="M0-6v-33" stroke="#a08b66" strokeWidth="2"/><path d="M-17 0h34l-3 29q-14 9-28 0Z" fill="#d4bb7d" stroke="#ae955f" strokeWidth="2"/><ellipse cy="0" rx="18" ry="5" fill="#baa06a"/><path d="M-8 4l5 9 7-4 5 7 5-11" stroke="#e7ce8d" strokeWidth="4" fill="none"/></g>}
      <path d="M723 574q-31-7-49-19m45 20-16 14m8-35 11 21" fill="none" stroke="#a08f6d" strokeWidth="7" strokeLinecap="round"/>
      <Bush x={674} y={565} scale={.45} color="#8ba177"/>
      {/* Puddles and a small stream; the stones become settled after Frog. */}
      <path d="M175 780Q340 694 481 754Q555 780 664 744Q676 763 648 777Q516 827 456 791Q328 747 188 809Z" fill="#9dbdb5"/>
      <path d="M267 774q77-22 125-1m128 20 84-13M185 799l54-18" stroke="#d0ddc8" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".8"/>
      <ellipse cx="477" cy="745" rx="69" ry="24" fill="#b8cfc0"/><ellipse cx="554" cy="749" rx="27" ry="13" fill="#a7b8a3"/>
      {[0,1,2].map(i => <g key={i} transform={`translate(${505 + i * 40} ${770 - i * 9}) rotate(${resolved.includes(1) ? 0 : i % 2 ? -8 : 6})`}><ellipse rx="25" ry="13" fill="#999d82"/><path d="M-15-3q16-8 28 0" stroke="#c3c8aa" strokeWidth="3" fill="none"/></g>)}
      <g stroke="#839b72" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M369 756q-2-58 16-65m-16 65q-24-41-32-36m27 27-17-53M629 786q3-35 14-39m-14 39q-17-36-27-37"/></g>
      <g fill="#9d8b69"><ellipse cx="385" cy="694" rx="5" ry="13" transform="rotate(18 385 694)"/><ellipse cx="346" cy="696" rx="5" ry="13" transform="rotate(-12 346 696)"/></g>
      {resolved.includes(1) && <circle cx="550" cy="749" r="3" fill="#e8d595"/>}
      {resolved.includes(2) && <path d="M1095 554l7 1" stroke="#e8d595" strokeWidth="3" strokeLinecap="round"/>}
      {resolved.includes(3) && <path d="M714 545q41 0 61-8" stroke="#b5a079" strokeWidth="2" fill="none" strokeDasharray="5 4"/>}
      {resolved.includes(5) && <g transform="translate(1046 351) rotate(28)"><path d="M0 0q-21-32 0-36q16 16 0 36" fill="#d4d8bd" stroke="#a9b69c" strokeWidth="1.5"/><path d="M0-29v36" stroke="#a9b69c" strokeWidth="1.4"/></g>}
      {/* Mist separates distant encounters; the final nest starts behind foliage. */}
      <path d="M-100 335Q252 296 477 341Q804 303 1070 330Q1432 281 1740 351v64H-100Z" fill="url(#forest-mist)" opacity={revealFinal ? .12 : .6}/>
      <g className={`forest-nest-cover ${revealFinal ? 'is-revealed' : ''}`}><Bush x={1271} y={315} scale={.68} color="#a5b894"/><Fir x={1361} y={338} scale={.81} color="#89a27f"/></g>
      {!restored && !revealFinal && <g className="distant-star-glimpse"><circle cx="1268" cy="261" r="14" fill="#eddaa0" opacity=".28"/><circle cx="1268" cy="261" r="4" fill="#ecdbab" opacity=".7"/></g>}
      {/* Foreground framing: a readable path, not a wall of busy objects. */}
      <Fir x={206} y={976} scale={1.65} color="#668669"/><RoundTree x={-6} y={934} scale={1.8} color="#89a077"/>
      <Fir x={1474} y={905} scale={1.87} color="#6b896c"/><RoundTree x={1621} y={1011} scale={1.5} color="#89a078"/>
      <Bush x={272} y={1023} scale={1.2}/><Bush x={1310} y={996} scale={1.12} color="#789569"/><Bush x={1124} y={1107} scale={1.8} color="#8b9f72"/>
      <g fill="#dcd3aa">{[[364,898],[404,942],[1145,852],[1300,735],[341,661],[712,802]].map(([x,y],i) => <g key={x} transform={`translate(${x} ${y}) scale(${i > 3 ? .7 : 1})`}><path d="M0 4v19" stroke="#81986b" strokeWidth="3"/><ellipse cy="-4" rx="4" ry="7"/><ellipse cx="-5" rx="7" ry="4"/><ellipse cx="5" rx="7" ry="4"/><ellipse cy="5" rx="4" ry="7"/><circle r="3" fill="#b7a16b"/></g>)}</g>
      <g stroke="#8fa16f" strokeWidth="3" strokeLinecap="round" fill="none">{[[285,848],[1039,784],[675,971],[1375,953],[843,838],[400,543]].map(([x,y]) => <path key={x} d={`M${x} ${y}q-4-17-12-19m12 19q2-25 10-30m-10 30q12-17 20-17`}/>)}</g>
      <g fill="#a4a78a"><ellipse cx="393" cy="868" rx="23" ry="11"/><ellipse cx="423" cy="877" rx="14" ry="8"/><ellipse cx="1215" cy="847" rx="32" ry="16"/></g>
      {restored && <g fill="#efdfac" className="forest-path-lights">{[[697,885,20],[593,752,15],[925,645,14],[855,552,10],[573,463,9],[898,377,8],[1128,318,6]].map(([x,y,r]) => <g key={x}><ellipse cx={x} cy={y} rx={r * 1.5} ry={r * .6} opacity=".42"/><circle cx={x} cy={y - 3} r="2.5"/></g>)}</g>}
    </g>
  </g>
})
