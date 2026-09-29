export async function solveForestActivity(p) {
 const click=name=>p.getByRole('button',{name,exact:true}).click();
 const activity=p.locator('.animal-play');if(!await activity.count())return;
 const name=await activity.getAttribute('aria-label');
 if(name==='frog activity'){for(let i=0;i<4;i++)await click('Done');const answer=(await p.locator('.jump-pattern b').first().textContent()).trim();await click(answer+' jumps');await click('On across the stones')}
 if(name==='bear activity'){await click('Done');await click('Done');for(const n of ['Low branch','Middle branch','High branch','Enjoy your honey, Bear'])await click(n)}
 if(name==='snake activity'){const directions=await p.locator('.direction-trail').getAttribute('aria-label');await click(directions.split(', ')[1]);await click('Done');await click('I invented a different movement');await click('Follow the bend')}
 if(name==='squirrel activity'){for(let round=0;round<2;round++){const places=await p.locator('.acorn-clearing button').evaluateAll(buttons=>buttons.filter(b=>b.querySelector('g[transform="translate(51 57)"]')).map(b=>b.getAttribute('aria-label')));await click('Ready to remember');for(const place of places)await click(place);await click(round===0?'Hide three acorns':'Safe and snug, Squirrel')}}
 if(name==='owl activity'){for(let i=0;i<4;i++){const target=(await p.locator('.picture-target').textContent()).match(/Find the (\w+)!/)[1];await click(target);await click(i===3?'Follow the feathers':'Another picture')}}
}
