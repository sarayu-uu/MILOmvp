import {freshShuffle} from '../variation'
export type BookId='moon'|'bird'|'cloud'
export const bookTitles:Record<BookId,string>={moon:'The Moon That Lost Its Glow',bird:"The Little Bird Who Couldn't Find Home",cloud:'The Cloud That Forgot How to Rain'}
export type SceneKind='opening'|'stars'|'fireflies'|'night-sound'|'prediction'|'moon-route'|'ending'|'habitat'|'stones'|'directions'|'bird-movement'|'nests'|'evaporation'|'drops'|'wind-movement'|'thirsty'|'shapes'
export type Scene={kind:SceneKind;title:string;text:string}
export function makeStoryVariation(book:BookId,hard:boolean){
 const order=freshShuffle(`story-${book}-positions`,[0,1,2,3,4])
 const pair=freshShuffle(`story-${book}-pattern-pair`,['gold','blue'])
 const type=freshShuffle(`story-${book}-pattern-type`,['AB','AAB','size'])[0]
 const pattern=type==='size'?['small','big','small','big']:type==='AAB'?[pair[0],pair[0],pair[1],pair[0],pair[0],pair[1]]:[pair[0],pair[1],pair[0],pair[1]]
 const flower=freshShuffle('story-bird-flower',['red','yellow','blue'])[0]
 return {book,hard,order,stars:order.slice(0,2),pattern,patternAnswer:pattern[0],choices:freshShuffle(`story-${book}-choices`,[0,1,2]),sound:freshShuffle('story-night-sound',[4,2,1,0])[0],flower,
  route:freshShuffle('story-bird-route',[0,1,2]),stoneFirst:freshShuffle('story-bird-stones',['small','big'])[0],
  birdMoves:freshShuffle('story-bird-moves',['Flap slowly, like a sleepy bird.','Flap quickly, like a little sparrow.']),windMoves:freshShuffle('story-wind-moves',['Make a BIG wind with your arms.','Show a tiny breeze with your hands.']),
  flowers:freshShuffle('story-flower-count',hard?[4,5]:[2,3,4])[0],shortfall:hard?freshShuffle('story-rain-shortfall',[1,2])[0]:0,thirsty:order.slice(0,2),shape:freshShuffle('story-cloud-shape',[0,1,2])[0],
  opening:freshShuffle(`story-${book}-opening`,[0,1])[0]}
}
export type StoryVariation=ReturnType<typeof makeStoryVariation>
export function scenesFor(v:StoryVariation):Scene[]{
 if(v.book==='moon')return [
  {kind:'opening',title:'A sleepy moon',text:v.opening?'The moon is here, but its glow is gone. A firefly whispers, "Will you help us find it?"':'"That is strange," says Milo. "The moon looks sleepy." A firefly whispers, "It lost its glow!"'},
  {kind:'stars',title:'Two little lights',text:'Two stars wink at us. Remember where they are, then help their light return.'},
  {kind:'fireflies',title:'A firefly clue',text:'The fireflies are making a pattern. Can you finish it so they can show us the way?'},
  {kind:'night-sound',title:'A friend by the tree',text:'Find the matching animal picture to help us look for moonlight.'},
  {kind:'prediction',title:'A jar of moonlight',text:'An owl, a windy tree, a sleepy cloud... How do you think the moonlight got into this jar?'},
  {kind:'moon-route',title:'A way back to the sky',text:'Drag the firefly along the dotted path: tree, cloud, then moon. You can tap each stop too.'},
  {kind:'ending',title:'There you are',text:'The moon shines softly over the forest. "There you are," says Milo. The fireflies settle down to rest.'}]
 if(v.book==='bird')return [
  {kind:'opening',title:'A small peep',text:v.opening?'"Peep... I cannot find my tree." Milo sits beside Bird. "We will look together."':'Milo finds a little bird on a rock. "Are you lost? Then we will find your home together."'},
  {kind:'habitat',title:'What home looks like',text:`"I remember ${v.flower} flowers, water nearby, and a VERY tall tree." Tap a place to look with Bird.`},
  {kind:'stones',title:'Across the little stream',text:'The stepping stones take turns. Find the next stone to help us cross.'},
  {kind:'directions',title:'Remember the way',text:'Squirrel knows a path. Look at the landmarks, then follow them in the same order.'},
  {kind:'bird-movement',title:'Try your wings',text:'"I cannot fly very well yet. Can you show me how?" asks Bird.'},
  {kind:'nests',title:'Is this home?',text:'Three nests! Remember what Bird told us. Explore them, then choose a home.'},
  {kind:'ending',title:'Together again',text:'Bird nestles beside family. A tiny feather floats down to Milo. "A little memory of our adventure," he smiles.'}]
 return [
  {kind:'opening',title:'A thirsty meadow',text:v.opening?'"Could you give these flowers rain?" asks Milo. Cloud whispers, "I forgot how." "We can figure it out together."':'The flowers droop. "You look thirsty," says Milo. A little cloud sighs, "I forgot how to rain."'},
  {kind:'evaporation',title:'A little help from the pond',text:'What could help Cloud? Try the sun, pond, breeze, and stones. Watch what changes.'},
  {kind:'drops',title:'A drink for each flower',text:`${v.flowers} flowers are waiting. Carry one drop to each flower.`},
  {kind:'wind-movement',title:'A ride with Wind',text:'"I can carry you to the next meadow!" says Wind. Can you help?'},
  {kind:'thirsty',title:'Who needs rain?',text:'Some flowers stand tall. Some droop. One has a puddle already. Who needs a drink?'},
  {kind:'shapes',title:'A cloud of possibilities',text:'Cloud tries a new shape. What does it look like to you? Every idea is welcome.'},
  {kind:'ending',title:'You remembered',text:'Gentle rain. Happy flowers. Frog finds a puddle! "I think you remembered," says Milo. "I did!" says Cloud.'}]
}
