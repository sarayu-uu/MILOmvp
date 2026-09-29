import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4183','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try {
 await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(d.toString().includes('4183'))res()});server.on('error',rej);server.on('exit',c=>rej(new Error('Preview exited '+c)))});
 browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1180,height:820},reducedMotion:'reduce',hasTouch:true});const p=await context.newPage();p.setDefaultTimeout(8000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const click=name=>p.getByRole('button',{name,exact:true}).click();
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('milo-home-v1')));
 async function point(x,y){return p.locator('.home-scene').evaluate((svg,{x,y})=>{const point=new DOMPoint(x,y).matrixTransform(svg.getScreenCTM());return {x:point.x,y:point.y}},{x,y})}
 async function drag(id,x,y,touch=false){
   const b=await p.locator(`[data-drag-id="${id}"]`).boundingBox();assert.ok(b,`Missing draggable ${id}`);
   const from={x:b.x+b.width/2,y:b.y+b.height/2};const to=await point(x,y);
   if(touch){const c=await context.newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});for(let i=1;i<=12;i++)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/12,y:from.y+(to.y-from.y)*i/12}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach()}
   else{await p.mouse.move(from.x,from.y);await p.mouse.down();await p.mouse.move(to.x,to.y,{steps:12});await p.mouse.up()}
   await p.waitForTimeout(80);
 }
 async function back(){await click('Back to whole house');await p.waitForTimeout(80)}
 await p.goto('http://127.0.0.1:4183');await click("Explore Milo's home");await p.locator('.home-world').waitFor();await click('Turn sound off');
 await click('Open the wardrobe');await p.waitForTimeout(80);await drag('swimsuit',590,300);assert.equal((await state()).coat,false);await drag('raincoat',590,300);assert.equal((await state()).coat,true);await click('Find boots in the play corner');await p.waitForTimeout(80);
 await drag('teddy',280,450);assert.equal((await state()).toys.length,0,'Dropping outside chest should reset');
 await p.locator('[data-drag-id="teddy"]').focus();await p.keyboard.press('Enter');for(let i=0;i<21;i++)await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');assert.equal((await state()).toys.length,1,'Keyboard can physically move a toy into the chest');
 for(const id of ['ball','blocks','car','puzzle'])await drag(id,605,543);
 assert.equal((await state()).toys.length,5);await click('Put on the boots');assert.equal((await state()).boots,true);await back();
 await click("Prepare Milo's snack");await p.waitForTimeout(80);for(let i=0;i<3;i++)await drag(`fruit-${i}`,854,561);
 assert.equal((await state()).plate.length,3);assert.equal((await p.evaluate(()=>JSON.parse(localStorage.getItem('milo-session')))).completed.includes('Home: food'),false);
 await drag('fruit-3',854,561);assert.equal((await state()).plate.length,4);assert.equal(await p.locator('[data-drag-id^="fruit-"]').count(),0);await back();
 await click('Inspect the plant');await p.waitForTimeout(80);await drag('watering-can',285,720);assert.equal((await state()).watered,0,'Inspect soil before choosing treatment');await click('Inspect the plant');await drag('watering-can',285,720);assert.equal((await state()).watered,1);await back();await click('Inspect the plant');assert.equal((await state()).watered,2);await back();await click('Inspect the plant');assert.equal((await state()).watered,3);await back();
 await click("Milo's bed");await p.waitForTimeout(80);await drag('routine-3',440,343);assert.equal((await state()).sleeping,false);
 for(let i=0;i<4;i++)await drag(`routine-${i}`,440+i*61,343);
 await p.waitForFunction(()=>JSON.parse(localStorage.getItem('milo-home-v1')).sleeping,{},{timeout:10000});assert.equal(await p.locator('.home-evening').count(),1);
 await click('Return to world');await click("Explore Milo's home");assert.equal((await state()).toys.length,5);assert.equal((await state()).coat,true);assert.equal((await state()).plate.length,4);assert.equal((await state()).sleeping,true);await p.screenshot({path:'home-bedtime.png'});
 await p.reload();await click("Explore Milo's home");assert.equal((await state()).watered,3);assert.equal(await p.locator('.home-evening').count(),1);
 // A fresh mobile session exercises real touch dragging, not HTML drag events.
 await p.evaluate(()=>{localStorage.removeItem('milo-home-v1');localStorage.removeItem('milo-session')});await p.reload();await p.setViewportSize({width:390,height:844});await click("Explore Milo's home");await click("Prepare Milo's snack");await p.waitForTimeout(80);await drag('fruit-0',854,561,true);assert.equal((await state()).plate.length,1,'Touch drag must move a fruit onto the plate');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await p.evaluate(()=>document.documentElement.scrollHeight>innerHeight),false);await p.screenshot({path:'home-touch-kitchen.png'});
 await back();await click('Back to world');await click('Grown-up settings');await p.getByRole('checkbox').check();await click('Restart session');await click("Explore Milo's home");await click("Prepare Milo's snack");await p.waitForTimeout(80);assert.equal((await state()).foodGoal,5);
 for(const i of [0,3,4,7,8])await drag(`fruit-${i}`,854,561,true);assert.equal((await state()).plate.length,5,'Mixed fruit combinations count toward the harder goal');
 await back();await click('Read the little book');await p.getByRole('heading',{name:'The Story Tree',exact:true}).waitFor();await click('Back to house');await p.locator('.home-world').waitFor();
 await click('Read the little book');for(let i=0;i<3;i++)await p.getByRole('button',{name:'Then what happened?'}).click();await p.getByRole('button',{name:'Mouse',exact:false}).click();await p.getByRole('button',{name:'Tiny footprints'}).click();await p.getByRole('button',{name:'Remember our story'}).click();for(const name of ['Find footprints','Follow footprints','Find mouse'])await p.getByRole('button',{name,exact:false}).click();await p.getByRole('button',{name:'Walk home with Milo'}).click();await p.locator('.home-world').waitFor();
 await click('Explore the round ball');await p.getByRole('heading',{name:'Find something round!'}).waitFor();await click('I found it!');await back();
 for(const [width,height] of [[844,390],[768,1024],[1180,820]]){await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false,`No page scrolling at ${width}x${height}`)}
 assert.deepEqual(errors,[]);console.log('PASS: all five home activities, wrong drops, touch drag, mixed fruit counting, persistent state, plant growth, bedtime animation, story return, session reset and mobile layout.');
} finally {await browser?.close();server.kill()}
