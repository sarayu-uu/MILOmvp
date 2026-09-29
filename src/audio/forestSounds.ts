/** Shared local environmental sound synthesis used by Owl and the storybooks. */
export function scheduleForestSound(ctx: AudioContext, soundIndex: number) {
 const now=ctx.currentTime
 if(soundIndex===2||soundIndex===4){
  for(let i=0;i<3;i++){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=soundIndex===4?'sine':'sawtooth';osc.frequency.setValueAtTime(soundIndex===4?430:170,now+i*.65);osc.frequency.exponentialRampToValueAtTime(soundIndex===4?330:85,now+i*.65+.22);gain.gain.setValueAtTime(0,now+i*.65);gain.gain.linearRampToValueAtTime(.07,now+i*.65+.04);gain.gain.exponentialRampToValueAtTime(.001,now+i*.65+.3);osc.connect(gain).connect(ctx.destination);osc.start(now+i*.65);osc.stop(now+i*.65+.32)}
 }else{
  const buffer=ctx.createBuffer(1,ctx.sampleRate*2.4,ctx.sampleRate),data=buffer.getChannelData(0)
  for(let i=0;i<data.length;i++){const t=i/ctx.sampleRate,envelope=soundIndex===3?Math.pow(Math.max(0,Math.sin(t*19)),4):soundIndex===1?.35+.3*Math.sin(t*8):.6+.2*Math.sin(t*32);data[i]=(Math.random()*2-1)*envelope*Math.min(t*6,1,(2.4-t)*5)}
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type=soundIndex===0?'bandpass':'lowpass';filter.frequency.value=soundIndex===0?1100:soundIndex===1?2600:450;gain.gain.value=.32;source.connect(filter).connect(gain).connect(ctx.destination);source.start()
 }
}
