import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4201','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4201'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});
 for(const [width,height] of [[1440,748],[320,568],[844,390]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true});const p=await context.newPage();p.setDefaultTimeout(6000);const errors=[];p.on('pageerror',e=>errors.push(e.message));const click=name=>p.getByRole('button',{name,exact:true}).click();
  async function tap(selector){const r=await p.locator(selector).first().boundingBox();assert.ok(r);await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2)}
  const stage=()=>p.locator('[data-kitchen-stage]').getAttribute('data-kitchen-stage');
  await p.goto('http://127.0.0.1:4201');await click('Turn sound off');await click("Visit Milo's Food Garden");await click('Make Carrot Soup');await tap('.kitchen-table-milo');assert.equal(await stage(),'0');
  await tap('.kitchen-instruction h2');assert.equal(await stage(),'0','Background must not answer an unfinished puzzle');
  for(let i=1;i<=3;i++)await click('carrot '+i);assert.equal(await stage(),'0','Final answer must not also advance');
  await click('Hear cooking instruction');assert.equal(await stage(),'0','Sound does not advance');
  const heading=await p.locator('.kitchen-instruction h2').boundingBox();await p.mouse.move(heading.x+10,heading.y+8);await p.mouse.down();await p.mouse.move(heading.x+55,heading.y+8,{steps:5});await p.mouse.up();assert.equal(await stage(),'0','Swiping does not advance');
  await tap('.kitchen-instruction h2');await p.locator('[data-meal-break="0"]').waitFor();if(width===1440){await p.getByRole('button',{name:'Keep cooking',exact:true}).focus();await p.keyboard.press('Enter')}else await tap('.kitchen-table-milo');assert.equal(await stage(),'1','Second fresh tap advances exactly once');
  assert.match(await p.locator('.kitchen-instruction h2').textContent(),/Tap the water, then each carrot/);await p.screenshot({path:`images/clear-instructions-${width}.png`});await click('Back to food garden');await click('Back to world');
  await click("Visit Milo's Pond");await click('Color fish');const color=(await p.locator('.pond-prompt h2').textContent()).match(/Tap the (.+) fish/)[1];await click(color+' fish');await p.getByRole('button',{name:'Play again',exact:true}).waitFor();await p.getByRole('button',{name:color+' fish',exact:true}).tap({force:true});assert.equal(await p.getByRole('button',{name:'Play again',exact:true}).count(),0,'Disabled completed picture accepts a fresh continue tap');await click('Back to pond');await click('Back to world');
  await p.evaluate(()=>localStorage.setItem('milo-forest-world-v1',JSON.stringify({current:1,furthest:1,resolved:[],completed:[],line:2})));await click('Follow the forest path');
  for(let i=0;i<4;i++)await tap('.jump-pictures');await p.locator('.jump-pattern').waitFor();await tap('.play-intro h2');assert.equal(await p.locator('.jump-pattern').count(),1);const answer=await p.locator('.jump-pattern b').first().textContent();await click(answer+' jumps');assert.equal(await p.locator('.animal-play').count(),1);await tap('.play-intro h2');assert.equal(await p.locator('.animal-play').count(),0);if(await p.getByRole('button',{name:'Return to world',exact:true}).isVisible())await click('Return to world');else{await click('Walk back along the path');await click('Back to world')}
  await click('Visit the Story Tree');await click('Read The Moon That Lost Its Glow');await tap('.story-dialogue p');assert.equal(await p.locator('[data-scene]').getAttribute('data-scene'),'stars');const targets=await p.locator('.story-object').evaluateAll(ns=>ns.filter(n=>n.querySelector('path[fill="#f2df9b"]')).map(n=>n.getAttribute('aria-label')));await tap('.story-dialogue p');for(const target of targets)await click(target);assert.equal(await p.locator('[data-scene]').getAttribute('data-scene'),'stars');await tap('.story-dialogue p');assert.equal(await p.locator('[data-scene]').getAttribute('data-scene'),'fireflies');await click('Close book');await click('Leave Story Tree');
  assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${width}x${height}: background/touch continuation, no answer skipping, no swipe advance, sound/navigation isolation, and clear instructions.`);
 }
}finally{await browser?.close();server.kill()}
