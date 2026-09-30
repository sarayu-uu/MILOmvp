export async function solveForestActivity(p) {
 const click=name=>p.getByRole('button',{name,exact:true}).click();
 const activity=p.locator('.animal-play');if(!await activity.count())return;
 const name=await activity.getAttribute('aria-label');
 if(name==='frog activity'){for(let i=0;i<4;i++)await click('I did it!');const answer=(await p.locator('.jump-pattern b').first().textContent()).trim();await click(answer+' jumps');await click('Keep exploring')}
 if(name==='bear activity'){await click('I did it!');await click('I did it!');for(const n of ['Low branch','Middle branch','High branch','Keep exploring'])await click(n)}
 if(name==='snake activity'){const directions=await p.locator('.direction-trail').getAttribute('aria-label');await click(directions.split(', ')[1]);await click('I tried the snake moves!');await click('I invented a different movement');await click('Keep exploring')}
 if(name==='squirrel activity'){for(let round=0;round<2;round++){const places=await p.locator('.acorn-clearing button').evaluateAll(buttons=>buttons.filter(b=>b.querySelector('g[transform="translate(51 57)"]')).map(b=>b.getAttribute('aria-label')));await click('Hide the acorns');for(const place of places)await click(place);await click(round===0?'Try 3 acorns':'Keep exploring')}}
 if(name==='owl activity'){for(let i=0;i<4;i++){const target=(await p.locator('.picture-target').textContent()).match(/Tap the (\w+)!/)[1];await click(target);await click(i===3?'Keep exploring':'Find another animal')}}
}
