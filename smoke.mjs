import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://localhost:4173');await page.getByRole('button',{name:'Follow the forest path'}).waitFor();await page.screenshot({path:'images/world-desktop.png'});
await page.getByRole('button',{name:'Grown-up settings'}).click();
await page.getByRole('button',{name:'Original plant and bridge adventure'}).click();
await page.getByRole('button',{name:'Under a cloud'}).click();await page.getByRole('button',{name:'Sunlight'}).click();
await page.getByRole('button',{name:'A dry little patch'}).click();await page.getByRole('button',{name:'Water'}).click();await page.getByRole('button',{name:'Let’s wander on'}).click();
for(let stage=0;stage<2;stage++){const stones=page.locator('.bridge .stone:not(.gap)');const target=await stones.nth(stage===0?1:0).evaluate(el=>el.style.background);const option=page.locator('.choice-stone');const options=await option.evaluateAll(nodes=>nodes.map(n=>({color:n.style.background,name:n.getAttribute('aria-label')})));await page.getByRole('button',{name:options.find(n=>n.color===target).name,exact:true}).click();await page.getByRole('button',{name:'Missing piece'}).click()}await page.getByRole('button',{name:'Let’s wander on'}).click();
await page.getByRole('button',{name:'I found it!'}).click();await page.getByRole('button',{name:'Soft'}).click();await page.getByRole('button',{name:'Let’s wander on'}).click();
for(let i=0;i<3;i++)await page.getByRole('button',{name:'Then what happened?'}).click();
await page.getByRole('button',{name:'Mouse'}).click();await page.getByRole('button',{name:'Tiny footprints'}).click();await page.getByRole('button',{name:'Remember our story'}).click();
for(const name of ['Find footprints','Follow footprints','Find mouse'])await page.getByRole('button',{name,exact:false}).click();await page.getByRole('button',{name:'Walk home with Milo'}).click();
await page.getByRole('heading',{name:'See you next adventure.'}).waitFor();
console.log('Main adventure completed',errors);
await page.getByRole('button',{name:'Milo\'s world'}).click();await page.setViewportSize({width:390,height:844});await page.screenshot({path:'images/world-mobile.png'});
console.log('Overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await browser.close();


