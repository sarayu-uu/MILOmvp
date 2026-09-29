import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const memory=new Map();
globalThis.localStorage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
const asModule=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const variation=asModule(readFileSync('src/variation.ts','utf8'));
const {makeStoryVariation,scenesFor}=await import(asModule(readFileSync('src/story/storyData.ts','utf8').replace("'../variation'",JSON.stringify(variation))));
let seed=91823;
Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
for(const book of ['moon','bird','cloud']){
 let previous=null;const patterns=new Set(),sounds=new Set(),flowers=new Set(),counts=new Set();
 for(let i=0;i<60;i++){
  const v=makeStoryVariation(book,i%2===0),snapshot=JSON.stringify(v);
  assert.notDeepEqual(v.order,previous,'Immediate layout repeats are avoided');previous=v.order;
  assert.equal(new Set(v.stars).size,2);assert.equal(new Set(v.route).size,3);
  assert.equal(v.patternAnswer,v.pattern[0]);assert.ok(v.flowers-v.shortfall>0);
  assert.equal(scenesFor(v).length,7);
  if(book==='bird')assert.ok(scenesFor(v)[1].text.includes(v.flower+' flowers'));
  scenesFor(v);assert.equal(JSON.stringify(v),snapshot,'Reading scene data must not reroll a challenge');
  patterns.add(v.pattern.join(','));sounds.add(v.sound);flowers.add(v.flower);counts.add(v.flowers);
 }
 assert.ok(patterns.size>=3);assert.equal(sounds.size,4);assert.equal(flowers.size,3);assert.ok(counts.size>=3);
}
console.log('PASS: 180 seeded story configurations, varied patterns/sounds/clues/counts, valid puzzles and stable scene data.');
