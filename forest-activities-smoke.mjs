import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {solveForestActivity} from './forest-test-helpers.mjs';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4185','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try {
 await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(d.toString().includes('4185'))res()});server.on('error',rej)});
 browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({viewport:{width:1180,height:820}});p.setDefaultTimeout(8000);const errors=[];p.on('pageerror',e=>errors.push(e.message));const click=name=>p.getByRole('button',{name,exact:true}).click();
 await p.goto('http://127.0.0.1:4185');await click('Turn sound off');
 const variants=[];
 for(let pass=0;pass<3;pass++){
  const signatures=[];
  for(let index=1;index<=5;index++){
   await p.evaluate(index=>localStorage.setItem('milo-forest-world-v1',JSON.stringify({current:index,furthest:index,resolved:[],completed:[],line:index===5?3:2})),index);await p.reload();await click('Follow the forest path');await p.locator('.animal-play').waitFor();if(await p.getByRole('button',{name:'Turn sound off',exact:true}).count())await click('Turn sound off');
   signatures.push(await p.locator('.animal-play').innerHTML());assert.equal(await p.getByRole('button',{name:'Follow the path',exact:true}).count(),0);
   if(index===3){const first=(await p.locator('.direction-trail').getAttribute('aria-label')).split(', ')[0];await click(first);await p.getByText("Let's look again.",{exact:false}).waitFor()}
   if(index===4){const before=await p.locator('.acorn-clearing button').evaluateAll(bs=>bs.filter(b=>b.querySelector('g[transform="translate(51 57)"]')).map(b=>b.getAttribute('aria-label')).join(','));const empty=await p.locator('.acorn-clearing button').evaluateAll(bs=>bs.find(b=>!b.querySelector('g[transform="translate(51 57)"]')).getAttribute('aria-label'));await click('Hide the acorns');await click(empty);await click('Look again');assert.equal(await p.locator('.acorn-clearing button').evaluateAll(bs=>bs.filter(b=>b.querySelector('g[transform="translate(51 57)"]')).map(b=>b.getAttribute('aria-label')).join(',')),before,'Retry preserves hiding places')}
   if(index===5){await click('bird');assert.equal(await p.locator('[data-animal="owl"]').getAttribute('data-settled'),'false')}
   await solveForestActivity(p);const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('milo-forest-world-v1')));assert.ok(saved.completed.includes(index));assert.equal(await p.evaluate(()=>document.getAnimations().length),0);
   if(pass===0&&index===1){await click('Play with Frog again');await p.locator('.animal-play').waitFor();assert.notEqual(await p.locator('.animal-play').innerHTML(),signatures[0]);await solveForestActivity(p)}
   await click('Return to world');
  }
  variants.push(signatures.join('|'));
 }
 assert.equal(new Set(variants).size,3,'Repeated visits produce fresh encounter sets');
 // Frog and Bear failures must preserve the same puzzle and allow correction.
 await p.evaluate(()=>localStorage.setItem('milo-forest-world-v1',JSON.stringify({current:1,furthest:1,resolved:[],completed:[],line:2})));await click('Follow the forest path');for(let i=0;i<4;i++)await click('I did it!');const pattern=await p.locator('.jump-pattern').textContent();const answer=Number(await p.locator('.jump-pattern b').first().textContent());await click((answer===1?2:1)+' jumps');assert.equal(await p.locator('.jump-pattern').textContent(),pattern);await click(answer+' jumps');await click('Keep exploring');await click('Return to world');
 await p.evaluate(()=>localStorage.setItem('milo-forest-world-v1',JSON.stringify({current:2,furthest:2,resolved:[],line:5})));await click('Follow the forest path');await click('I did it!');await click('I did it!');await click('High branch');await p.getByText('Hmm... that is a long reach.',{exact:false}).waitFor();await click('Low branch');await p.getByRole('button',{name:'Middle branch',exact:true}).focus();await p.keyboard.press('Enter');await click('High branch');await click('Keep exploring');
 await p.reload();await click('Follow the forest path');assert.equal(await p.locator('.animal-play').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS: 15 randomized encounters, replay, stable retries, solvable puzzles, gentle hints, keyboard route, completion persistence, legacy-save gating, and no animation.');
}finally{await browser?.close();server.kill()}
