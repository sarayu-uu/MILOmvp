import {chromium} from '@playwright/test';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4192','--strictPort'],{stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('4192'))r()}));browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true});const p=await context.newPage();p.setDefaultTimeout(7000);const errors=[];p.on('pageerror',e=>errors.push(e.message));const click=name=>p.getByRole('button',{name,exact:true}).click();const next=()=>click('Continue story');const scene=()=>p.locator('[data-scene]').getAttribute('data-scene');
 await p.goto('http://127.0.0.1:4192');await click('Visit the Story Tree');await click('Turn sound off');await p.screenshot({path:'images/story-library-desktop.png'});
 const titles=['The Moon That Lost Its Glow',"The Little Bird Who Couldn't Find Home",'The Cloud That Forgot How to Rain'];
 for(let pass=0;pass<2;pass++){
  if(pass===1){await click('Leave Story Tree');await click('Grown-up settings');await p.getByRole('checkbox').check();await click('Close settings');await click('Visit the Story Tree');await p.setViewportSize({width:390,height:844});}
  for(const [book,title] of titles.entries()){
   await click('Read '+title);await click('Let us find out');let flower='';
   while(await scene()!=='ending'){
    const kind=await scene();assert.equal(await p.getByRole('button',{name:'Continue story',exact:true}).count(),0,kind+' must require interaction');
    if(kind==='stars'){const targets=await p.locator('.story-object').evaluateAll(nodes=>nodes.filter(n=>n.querySelector('path[fill="#f2df9b"]')).map(n=>n.getAttribute('aria-label')));assert.equal(targets.length,2);await click('Hide the stars');const wrong=await p.getByRole('button',{name:/^Star \d/}).evaluateAll((nodes,targets)=>nodes.find(n=>!targets.includes(n.getAttribute('aria-label'))).getAttribute('aria-label'),targets);await click(wrong);await click('Look again');const again=await p.locator('.story-object').evaluateAll(nodes=>nodes.filter(n=>n.querySelector('path[fill="#f2df9b"]')).map(n=>n.getAttribute('aria-label')));assert.deepEqual(again,targets);await click('Hide the stars');for(const target of targets)await click(target)}
    else if(kind==='fireflies'||kind==='stones'){const answer=await p.locator('.storybook-scene [role="img"]').filter({has:p.locator('svg')}).evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')).find(n=>/^(gold|blue|small|big) (firefly|stone)$/.test(n)));await click(answer)}
    else if(kind==='night-sound'){await click((await p.locator('.picture-target').textContent()).match(/Tap the (\w+)!/)[1])}
    else if(kind==='prediction'){await click('Maybe wind');await p.getByText('Nobody stole the light.',{exact:false}).waitFor()}
    else if(kind==='moon-route'){
     await click('Carry light to moon');assert.equal(await p.getByRole('button',{name:'Continue story',exact:true}).count(),0);
     const start=await p.getByRole('button',{name:'Carry light to firefly',exact:true}).boundingBox();let x=start.x+start.width/2,y=start.y+start.height/2;
     const c=pass===1?await context.newCDPSession(p):null;
     if(c)await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});else{await p.mouse.move(x,y);await p.mouse.down()}
     for(const item of ['tree','cloud','moon']){
      const box=await p.getByRole('button',{name:'Carry light to '+item,exact:true}).boundingBox(),tx=box.x+box.width/2,ty=box.y+box.height/2;
      for(let n=1;n<=12;n++){const px=x+(tx-x)*n/12,py=y+(ty-y)*n/12;if(c)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:px,y:py}]});else await p.mouse.move(px,py)}
      x=tx;y=ty;
      await p.waitForFunction(({x,y})=>{const box=document.querySelector('.story-carrier').getBoundingClientRect();return Math.abs(box.x+box.width/2-x)<4&&Math.abs(box.y+box.height/2-y)<4},{x,y},{timeout:1000});const carrier=await p.locator('.story-carrier').boundingBox();assert.ok(Math.abs(carrier.x+carrier.width/2-x)<4&&Math.abs(carrier.y+carrier.height/2-y)<4,`Firefly follows the drag: pass ${pass}, ${item}, wanted ${x},${y}, got ${JSON.stringify(carrier)}`);
     }
     if(c){await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach()}else await p.mouse.up();
    }
    else if(kind==='habitat'||kind==='nests'){if(kind==='habitat')flower=(await p.locator('.story-dialogue p').textContent()).match(/(red|blue|yellow) flowers/)[1];for(let i=1;i<=3;i++){await click(`Inspect ${kind==='nests'?'nest':'clearing'} ${i}`);const inspected=await p.locator('.story-small-clue').first().textContent();if(inspected.includes('A tall tree')&&inspected.includes(flower+' flowers')&&inspected.includes('a stream'))break}await click(kind==='nests'?"This is Bird's home":'Choose this place')}
    else if(kind==='directions'){const landmarks=(await p.locator('.direction-memory').textContent()).split(' → ');await click('Hide the pictures');for(const name of landmarks)await click('Walk to '+name)}
    else if(kind==='bird-movement'||kind==='wind-movement'){for(let i=0;i<4;i++)await click('I did the movement!')}
    else if(kind==='evaporation'){await click('Lift water from the warm pond');assert.equal(await p.getByRole('button',{name:'Continue story',exact:true}).count(),0);await click('Warm the pond with the sun');await click('Lift water from the warm pond')}
    else if(kind==='drops'){const count=await p.getByRole('button',{name:/Give flower \d+ a drop/}).count();for(let i=1;i<=count;i++){if(await p.getByRole('button',{name:'Ask Cloud for one more drop',exact:true}).count())await click('Ask Cloud for one more drop');if(i===1){const a=await p.getByRole('button',{name:'Pick up a raindrop',exact:true}).boundingBox(),b=await p.getByRole('button',{name:'Give flower 1 a drop',exact:true}).boundingBox();const c=await context.newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach()}else{await click('Pick up a raindrop');await click('Give flower '+i+' a drop')}}}
    else if(kind==='thirsty'){const thirsty=await p.locator('.story-object').evaluateAll(nodes=>nodes.filter(n=>n.querySelector('g[opacity="0.42"]')).map(n=>n.getAttribute('aria-label')));assert.equal(thirsty.length,2);for(const name of thirsty)await click(name)}
    else if(kind==='shapes')await click('Something else!');
    await p.getByRole('button',{name:'Continue story',exact:true}).waitFor();if(pass===1)await p.screenshot({path:`images/story-${book}-${kind}-mobile.png`});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await next();
   }
   await click('Back to Story Tree');assert.equal(await p.getByRole('button',{name:/^Read The/}).count(),3);
  }
 }
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('milo-story-library-v1')));assert.deepEqual(saved.sort(),['bird','cloud','moon']);await p.reload();await click('Visit the Story Tree');assert.equal(await p.getByRole('img',{name:/story keepsake/}).count(),3);await p.screenshot({path:'images/story-library-mobile.png'});for(const viewport of [{width:320,height:568},{width:844,height:390}]){await p.setViewportSize(viewport);for(const title of titles){const box=await p.getByRole('button',{name:'Read '+title,exact:true}).boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width+1&&box.y+box.height<=viewport.height,'Book cover stays reachable');}}
 await p.evaluate(()=>localStorage.setItem('milo-forest-world-v1',JSON.stringify({current:7,furthest:7,resolved:[0,1,2,3,4,5,6,7],completed:[1,2,3,4,5],line:2})));await p.reload();await click('Follow the forest path');await click('Read beneath the Story Tree');await p.getByRole('heading',{name:'The Story Tree',exact:true}).waitFor();await click('Leave Story Tree');await p.locator('.forest-world').waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: all 3 storybooks twice, clues and retries, touch drops, story endings, return flow, keepsakes and replay on mobile.');
}finally{await browser?.close();server.kill()}
