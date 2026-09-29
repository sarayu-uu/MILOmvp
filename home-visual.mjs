import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4182','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(d.toString().includes('4182'))res()});server.on('error',rej);server.on('exit',c=>rej(new Error('Preview exited '+c)))});
 browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({viewport:{width:1366,height:900}});p.on('pageerror',e=>console.log('ERROR',e.message));await p.goto('http://127.0.0.1:4182');await p.getByRole('button',{name:"Explore Milo's home",exact:true}).click();await p.waitForTimeout(1400);await p.screenshot({path:'home-desktop.png'});
 for(const [name,file] of [['Open the toy box','home-play.png'],['Prepare Milo\'s snack','home-kitchen.png'],['Open the wardrobe','home-wardrobe.png'],["Milo's bed",'home-bed.png'],['Inspect the plant','home-plant.png']]){
 await p.getByRole('button',{name,exact:true}).click();await p.waitForTimeout(800);await p.screenshot({path:file});await p.getByRole('button',{name:'Back to whole house'}).click();await p.waitForTimeout(800);
 }
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:'home-mobile.png'});await p.getByRole('button',{name:'Prepare Milo\'s snack',exact:true}).click();await p.waitForTimeout(800);await p.screenshot({path:'home-mobile-kitchen.png'});
 console.log('Home screenshots saved.');
}finally{await browser?.close();server.kill()}
