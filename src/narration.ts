/** Keep native speech work off the interaction/paint path. Only the latest request survives. */
let generation = 0
let frame = 0
let timer = 0
function afterPaint(task: () => void) {
  cancelAnimationFrame(frame); clearTimeout(timer)
  frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { timer = window.setTimeout(task, 0) }) })
}
export function stopNarration() {
  generation++
  afterPaint(() => window.speechSynthesis?.cancel())
}
export function narrate(text: string) {
  const request = ++generation
  afterPaint(() => {
    if (request !== generation || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const voice = new SpeechSynthesisUtterance(text)
    voice.rate = .82; voice.pitch = 1.08
    window.speechSynthesis.speak(voice)
  })
  return () => { if (request === generation) stopNarration() }
}
