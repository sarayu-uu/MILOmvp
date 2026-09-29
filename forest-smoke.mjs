import {solveForestActivity} from './forest-test-helpers.mjs';
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4184','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(d.toString().includes('4184'))res()});server.on('error',rej);server.on('exit',c=>rej(new Error('Preview exited '+c)))});
 browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({viewport:{width:1366,height:900}});p.setDefaultTimeout(10000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const click=name=>p.getByRole('button',{name,exact:true}).click();
 const stop=()=>p.locator('.forest-scene').getAttribute('data-current-stop');
 const arrive=async id=>{await p.waitForFunction(id=>document.querySelector('.forest-scene')?.getAttribute('data-current-stop')===id&&document.querySelector('.forest-scene')?.getAttribute('data-travelling')==='false',id)};
 const finishDialogue=async()=>{
  while(await p.getByRole('button',{name:'And then?',exact:true}).count())await click('And then?');
  if(!(await p.locator('.animal-play').count()))return;
  await solveForestActivity(p);
  await finishDialogue();
 };
 await p.goto('http://127.0.0.1:4184');await click('Follow the forest path');await p.locator('.forest-scene').waitFor();await click('Turn sound off');await p.waitForTimeout(200);await p.screenshot({path:'forest-entrance.png'});
 assert.equal(await stop(),'entrance');assert.equal(await p.locator('[data-animal="bird"]').getAttribute('visibility'),'hidden');assert.equal(await p.getByRole('button',{name:'Walk to Owl'}).count(),0);
 await p.locator('.forest-scene').evaluate(el=>el.dataset.testIdentity='same-scene');
 await finishDialogue();const initial=await p.getByTestId('forest-milo').getAttribute('transform');await click('Walk to Frog');assert.equal(await p.locator('.forest-scene').getAttribute('data-travelling'),'false');assert.notEqual(await p.getByTestId('forest-milo').getAttribute('transform'),initial);await arrive('frog');await p.screenshot({path:'forest-frog.png'});
 await finishDialogue();assert.equal(await p.locator('[data-animal="frog"]').getAttribute('data-settled'),'true');await click('Walk to Bear');await arrive('bear');await p.screenshot({path:'forest-bear.png'});
 await click('Return to world');await click('Follow the forest path');await arrive('bear');assert.equal(await p.locator('[data-animal="frog"]').getAttribute('data-settled'),'true');
 await click('Walk back along the path');await arrive('frog');await click('Visit Bear');await arrive('bear');
 for(const [next,animal] of [['baby-snake','Baby Snake'],['squirrel','Squirrel'],['owl','Owl'],['discovery','Little Bird']]){await finishDialogue();if(next==='discovery')await click('Follow the path');else await click('Walk to '+animal);await arrive(next);await p.screenshot({path:'forest-'+next+'.png'})}
 assert.equal(await p.locator('[data-animal="bird"]').getAttribute('visibility'),'visible');await finishDialogue();await click('To the Story Tree');await arrive('ending');assert.equal(await p.locator('.forest-sunset').count(),1);await p.screenshot({path:'forest-ending.png'});await finishDialogue();await click('Walk home');await p.locator('.home-world').waitFor();
 // Reduced motion and narrow viewports retain navigation and avoid overflow.
 await p.getByRole('button',{name:'Back to world',exact:true}).click();await p.getByRole('button',{name:'Grown-up settings'}).click();await click('Restart session');await p.emulateMedia({reducedMotion:'reduce'});await p.setViewportSize({width:390,height:844});await click('Follow the forest path');await p.screenshot({path:'forest-mobile.png'});assert.equal(await stop(),'entrance');await finishDialogue();await click('Follow the path');await arrive('frog');await p.screenshot({path:'forest-mobile-frog.png'});
 for(const [width,height] of [[390,844],[844,390],[768,1024],[1180,820]]){await p.setViewportSize({width,height});await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false,`No overflow at ${width}x${height}`)}
 await p.reload();await click('Follow the forest path');await arrive('frog');assert.deepEqual(errors,[]);console.log('PASS: continuous forest journey, path movement, visited state, backtracking, persistence, hidden nest reveal, ending, restart, reduced motion and responsive layout.');
}finally{await browser?.close();server.kill()}
