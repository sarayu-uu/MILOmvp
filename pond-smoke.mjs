import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4196','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4196'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({hasTouch:true});p.setDefaultTimeout(7000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.AudioContext=function(){throw new Error('Game tried to play a sound clue')}});
 const click=name=>p.getByRole('button',{name,exact:true}).click();
 for(const [width,height] of [[1440,900],[390,844],[320,568],[844,390]]){
  await p.setViewportSize({width,height});await p.goto('http://127.0.0.1:4196');await click('Turn sound off');await p.getByText('Milo is made for you and your child to explore, talk, move and discover together.',{exact:true}).waitFor();
  await p.screenshot({path:`images/pond-home-${width}.png`,fullPage:true});
  await click("Visit Milo's Pond");await p.getByRole('heading',{name:"Milo's Pond",exact:true}).waitFor();
  await p.screenshot({path:`images/pond-world-${width}.png`,fullPage:true});
  for(const area of ['Color fish','Frog lily pads','Letter bubbles','Shape shells']){
   await click(area);
   const rounds=area==='Frog lily pads'?5:2;for(let replay=0;replay<rounds;replay++){
    const prompt=await p.locator('.pond-prompt h2').textContent();const buttons=p.locator('.pond-objects button');
    if(area==='Frog lily pads'){
     const count=await buttons.count();assert.ok(count>=1&&count<=5);await buttons.first().tap();if(count>1)assert.equal(await p.getByRole('button',{name:'Play again',exact:true}).count(),0);
     for(let i=1;i<count;i++)await buttons.nth(i).tap();assert.ok((await p.locator('.pond-prompt').textContent()).includes(count+(count===1?' frog':' frogs')));
    }else{
     const target=prompt.match(/Find (?:the )?(.+?)(?: fish)?!/)[1];const label=area==='Color fish'?target+' fish':area==='Letter bubbles'?'Bubble '+target:target+' shell';
     const wrong=await buttons.evaluateAll((els,label)=>els.find(el=>el.getAttribute('aria-label')!==label).getAttribute('aria-label'),label);await click(wrong);
     assert.equal(await p.getByRole('button',{name:'Play again',exact:true}).count(),0);assert.ok((await p.locator('.pond-prompt h2').textContent()).includes(prompt));
     await p.getByRole('button',{name:label,exact:true}).focus();await p.keyboard.press('Enter');
    }
    await p.getByRole('button',{name:'Play again',exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(replay<rounds-1)await click('Play again');
   }
   if(width===390)await p.screenshot({path:`images/pond-${area.split(' ')[0].toLowerCase()}-mobile.png`,fullPage:true});
   await click('Back to pond');
  }
  await click('Back to world');await p.getByRole('button',{name:"Explore Milo's home",exact:true}).waitFor();
 }
 // Optional picture game also works with audio unavailable.
 await click('Grown-up settings');await p.getByRole('button',{name:/Pictures in the bushes/}).click();await click((await p.locator('.picture-target').textContent()).match(/Find the (\w+)!/)[1]);await p.locator('.success-note').waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: four pond games, retries, replay, counting 1–5, touch/keyboard, responsive layouts, navigation and visual guessing without audio.');
}finally{await browser?.close();server.kill()}
