import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4202','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4202'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});
 for(const [width,height] of [[320,568],[390,844],[430,932]]){
 const p=await browser.newPage({viewport:{width,height},hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4202');const game=p.frameLocator('[data-milo-viewport]');const click=name=>game.getByRole('button',{name,exact:true}).tap();await click('Turn sound off');assert.equal(await p.getByRole('dialog').count(),0);
 const f=p.frames().find(f=>f.parentFrame());assert.deepEqual(await f.evaluate(()=>[innerWidth,innerHeight]),[height,width]);await p.screenshot({path:`images/sideways-home-${width}.png`});
 await click("Visit Milo's Food Garden");await click('Make Carrot Soup');await click("Let's eat and play");await click('carrot 1');await click('carrot 2');await click('carrot 3');await click('Wash the carrots');await click('Keep cooking');
 const source=game.getByRole('button',{name:'Pick up washing water',exact:true}),target=game.getByRole('button',{name:'Wash carrot 1',exact:true});const a=await source.boundingBox(),b=await target.boundingBox();await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:15});await p.mouse.up();assert.equal(await game.locator('.kitchen-found').count(),1,'Rotated dragging reaches the carrot');await click('Pick up washing water');await click('Wash carrot 2');await click('Wash carrot 3');
 await game.locator('.kitchen-instruction h2').tap();await game.locator('[data-meal-break="1"]').waitFor();await click('Keep cooking');assert.equal(await game.locator('[data-kitchen-stage]').getAttribute('data-kitchen-stage'),'2');
 await p.setViewportSize({width:height,height:width});assert.equal(await game.locator('[data-kitchen-stage]').getAttribute('data-kitchen-stage'),'2');assert.deepEqual(await f.evaluate(()=>[innerWidth,innerHeight]),[height,width]);await p.screenshot({path:`images/sideways-turned-${width}.png`});await p.setViewportSize({width,height});await click('Carrot pieces');await click('Fill the pot');assert.deepEqual(errors,[]);await p.close();console.log(`PASS ${width}x${height}: automatic sideways view, taps, dragging, background continuation, state retained after rotation.`);
 }
}finally{await browser?.close();server.kill()}
