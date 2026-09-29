import { dialogueId, MiloVoice } from './audio/MiloVoice'

/** Compatibility facade: every activity uses the same Milo audio owner. */
export function narrate(text: string, id = dialogueId(text)) {
  return MiloVoice.speak({ id, text })
}
export function stopNarration() { MiloVoice.stop() }
