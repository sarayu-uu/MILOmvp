import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4187','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try {
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4187'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({viewport:{width:390,height:844}});
 await p.addInitScript(()=>{window.spoken=[];speechSynthesis.speak=u=>window.spoken.push({text:u.text,visible:document.body.innerText,time:performance.now()});speechSynthesis.cancel=()=>{};});
 await p.goto('http://127.0.0.1:4187');await p.evaluate(()=>localStorage.setItem('milo-forest-world-v1',JSON.stringify({current:1,furthest:1,resolved:[],completed:[],line:2})));await p.reload();await p.getByRole('button',{name:'Follow the forest path',exact:true}).click();await p.locator('.jump-pictures').waitFor();await p.screenshot({path:'forest-static-frog.png'});
 const latency=await p.evaluate(async()=>{window.spoken=[];const start=performance.now();[...document.querySelectorAll('button')].find(b=>b.textContent==='Done').click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return {ms:performance.now()-start,text:document.querySelector('.play-intro p').textContent,spoken:window.spoken.length,animations:document.getAnimations().length};});
 assert.match(latency.text,/three jumps/);assert.equal(latency.spoken,0);assert.equal(latency.animations,0);assert.ok(latency.ms<500,JSON.stringify(latency));await p.waitForTimeout(150);const speech=await p.evaluate(()=>window.spoken);assert.ok(speech.length);assert.ok(speech.every(s=>s.visible.includes(s.text)));
 // Rapid actions coalesce narration to the latest visible instruction.
 await p.evaluate(()=>{window.spoken=[];[...document.querySelectorAll('button')].find(b=>b.textContent==='Done').click()});await p.getByRole('button',{name:'Done',exact:true}).click();await p.waitForTimeout(150);const last=await p.evaluate(()=>window.spoken.at(-1));assert.match(last.text,/teeny-tiny/);assert.ok(last.visible.includes(last.text));
 console.log('PASS: text paints before narration, no active animations, static pictures, latest-only speech. Click-to-two-frames: '+Math.round(latency.ms)+'ms');
}finally{await browser?.close();server.kill()}
