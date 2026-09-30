import {chromium} from '@playwright/test';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4198','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4198'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});
 for(const viewport of [{width:1440,height:748},{width:320,height:568},{width:844,height:390}]){
  const context=await browser.newContext({viewport});await context.addInitScript(()=>{localStorage.setItem('milo-together-intro-v1','complete');window.introWrites=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key.includes('intro'))window.introWrites.push(key);return original.call(this,key,value)}});
  const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));const click=name=>p.getByRole('button',{name,exact:true}).click();
  for(const choice of ['Hug','High five','Gentleman handshake']){
   await p.goto('http://127.0.0.1:4198');await click('Turn sound off');assert.equal(await p.locator('.location:disabled').count(),0);await p.getByText('Milo is made for you and your child to explore, talk, move and discover together.',{exact:true}).waitFor();await click("Let's Go!");await p.getByRole('heading',{name:'Get your parent 👨‍👩‍👧',exact:true}).waitFor();assert.equal(await p.getByRole('button',{name:'Next',exact:true}).count(),0);
   await p.locator('dialog').evaluate(el=>el.dataset.samePopup='yes');await click("We're ready! 🙌");await p.getByRole('heading',{name:'Choose how to say hello!',exact:true}).waitFor();assert.equal(await p.getByRole('button',{name:"We're ready! 🙌",exact:true}).count(),0);
   await click(choice);assert.equal(await p.locator('dialog').getAttribute('data-same-popup'),'yes');assert.equal(await p.getByRole('button',{name:choice,exact:true}).getAttribute('aria-pressed'),'true');assert.ok((await p.locator('.together-instruction').textContent()).length>25);
   const box=await p.getByRole('button',{name:"We're ready! 🙌",exact:true}).boundingBox();assert.ok(box.y>=0&&box.y+box.height<=viewport.height);assert.equal(await p.locator('dialog').evaluate(el=>el.scrollHeight>el.clientHeight+1),false);assert.equal(await p.evaluate(()=>document.documentElement.scrollHeight>innerHeight+1),false);
   if(choice==='Gentleman handshake')await p.screenshot({path:`images/together-popup-${viewport.width}.png`});
   await p.getByRole('button',{name:"We're ready! 🙌",exact:true}).focus();await p.keyboard.press('Enter');assert.equal(await p.locator('dialog').count(),0);assert.equal(await p.getByRole('button',{name:'Follow the forest path',exact:true}).isEnabled(),true);assert.deepEqual(await p.evaluate(()=>window.introWrites),[]);
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: two popup steps, all three greetings, same-popup instructions, no Next screens or intro storage writes, repeated visits, keyboard and desktop/mobile layouts.');
}finally{await browser?.close();server.kill()}
