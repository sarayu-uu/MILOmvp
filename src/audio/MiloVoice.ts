import { miloAudioFiles } from './miloAudioFiles'

export type MiloLine = { id: string; text: string }
export const MILO_VOICE_SETTINGS = { pitch: 1.8, rate: 1.8, volume: .9 } as const

/** Browsers expose names/languages, not age, gender or softness. Prefer familiar gentle English voices. */
export function selectMiloVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const preferred = ['aria', 'jenny', 'sonia', 'samantha', 'zira', 'serena', 'karen', 'tessa', 'moira', 'susan', 'hazel', 'victoria', 'female']
  const adultMale = /\b(david|mark|george|james|daniel|alex|fred|guy|ryan|eric|roger|ravi|male)\b/i
  return voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang) && !adultMale.test(v.name))
    .map(voice => {
      const index = preferred.findIndex(name => voice.name.toLowerCase().includes(name))
      return { voice, score: (index < 0 ? 0 : 200 - index * 5) + (/natural|neural/i.test(voice.name) ? 20 : 0) + (voice.localService ? 2 : 0) }
    }).sort((a, b) => b.score - a.score || a.voice.name.localeCompare(b.voice.name))[0]?.voice
}

/** One owner for recorded audio, voice selection, cancellation, and browser TTS. */
export class MiloVoiceService {
  private generation = 0
  private frame = 0
  private timer = 0
  private audio: HTMLAudioElement | null = null
  private releaseVoiceWait: (() => void) | null = null
  private loadTimer = 0

  private afterPaint(task: () => void) {
    cancelAnimationFrame(this.frame); clearTimeout(this.timer)
    this.frame = requestAnimationFrame(() => {
      this.frame = requestAnimationFrame(() => { this.timer = window.setTimeout(task, 0) })
    })
  }

  private clearAudio() {
    clearTimeout(this.loadTimer)
    if (!this.audio) return
    this.audio.onended = null; this.audio.onerror = null; this.audio.onplaying = null
    this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); this.audio = null
  }

  stop() {
    this.generation++
    this.releaseVoiceWait?.(); this.releaseVoiceWait = null
    this.clearAudio()
    this.afterPaint(() => window.speechSynthesis?.cancel())
  }

  speak({ id, text }: MiloLine): () => void {
    const request = ++this.generation
    this.releaseVoiceWait?.(); this.releaseVoiceWait = null
    this.clearAudio()
    this.afterPaint(() => {
      if (request !== this.generation) return
      window.speechSynthesis?.cancel()
      const clip = miloAudioFiles[id]
      if (clip && clip.text === text) this.playRecording(clip.src, text, request)
      else void this.speakText(text, request)
    })
    // An old component's cleanup must never cancel a newer component's line.
    return () => { if (request === this.generation) this.stop() }
  }

  private playRecording(src: string, text: string, request: number) {
    const audio = new Audio(src)
    this.audio = audio; audio.volume = MILO_VOICE_SETTINGS.volume
    let failed = false
    const fallback = () => {
      if (failed || request !== this.generation || this.audio !== audio) return
      failed = true; this.clearAudio(); void this.speakText(text, request)
    }
    audio.onerror = fallback
    audio.onplaying = () => { if (request === this.generation) clearTimeout(this.loadTimer) }
    audio.onended = () => { if (this.audio === audio) this.clearAudio() }
    this.loadTimer = window.setTimeout(fallback, 4000)
    void audio.play().catch(fallback)
  }

  private async speakText(text: string, request: number) {
    const synth = window.speechSynthesis
    if (!synth) return
    if (!synth.getVoices().length) {
      await new Promise<void>(resolve => {
        const finish = () => { clearTimeout(timeout); synth.removeEventListener('voiceschanged', finish); if (this.releaseVoiceWait === finish) this.releaseVoiceWait = null; resolve() }
        const timeout = window.setTimeout(finish, 750)
        this.releaseVoiceWait = finish
        synth.addEventListener('voiceschanged', finish)
        if (synth.getVoices().length) finish()
      })
    }
    if (request !== this.generation) return
    const voice = selectMiloVoice(synth.getVoices())
    // Do not silently revert to an identified adult-male or non-English system default.
    // Text and recorded audio remain usable on devices without a suitable English voice.
    if (!voice) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice; utterance.lang = voice.lang
    Object.assign(utterance, MILO_VOICE_SETTINGS)
    synth.cancel(); synth.speak(utterance)
  }
}

export const MiloVoice = new MiloVoiceService()

/** Deterministic fallback ID for dialogue not yet assigned a hand-authored ID. */
export function dialogueId(text: string): string {
  if (text === 'You figured it out!') return 'milo.correct'
  if (/^Hmm.*let.s look again\.$/i.test(text)) return 'milo.tryAgain'

  let hash = 2166136261
  for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619) }
  return `milo.line.${(hash >>> 0).toString(16)}`
}
