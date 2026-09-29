import {chromium} from '@playwright/test';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4190','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4190'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({hasTouch:true});p.setDefaultTimeout(6000);await p.goto('http://127.0.0.1:4190');await p.getByRole('button',{name:"Explore Milo's home",exact:true}).click();
 for(const [w,h] of [[320,568],[360,640],[390,844],[430,932],[667,375],[844,390],[768,1024],[1366,900]]){
 await p.setViewportSize({width:w,height:h});
 for(const room of ['house','bedroom','bathroom','play corner','kitchen','garden corner']){
 if(room!=='house'){await p.getByRole('button',{name:'Explore the '+room,exact:true}).focus();await p.keyboard.press('Enter')}
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false,`${w}x${h} ${room}`);
 assert.equal(await p.locator('.home-scene-wrap').evaluate(el=>el.scrollWidth>el.clientWidth),false,'No sideways scene overflow');
 if(w===390&&room==='house')await p.screenshot({path:'images/home-fit-mobile.png'});if(w===667&&room==='house')await p.screenshot({path:'images/home-fit-landscape.png'});
 if(room!=='house')await p.getByRole('button',{name:'Back to whole house',exact:true}).click();
 }}
 await p.setViewportSize({width:390,height:844});const point=await p.locator('.home-scene').evaluate(svg=>{const p=new DOMPoint(970,590).matrixTransform(svg.getScreenCTM());return{x:p.x,y:p.y}});await p.touchscreen.tap(point.x,point.y);assert.equal(await p.locator('.room-closeup').count(),1);await p.getByRole('heading',{name:'Something lovely to share'}).waitFor();
 console.log('PASS: all room views at 8 screen sizes, no sideways scrolling, and mobile touch room entry.');
}finally{await browser?.close();server.kill()}
