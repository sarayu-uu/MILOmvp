export type MiloAudioClip = { src: string; text: string }
/** Add real recordings here. The transcript must match so randomized lines never play the wrong clip.
 * Example: 'milo.correct': { src: '/audio/milo/correct.mp3', text: 'You figured it out!' }
 * Files placed in public/audio/milo are available at /audio/milo after deployment.
 */
export const miloAudioFiles: Record<string, MiloAudioClip | undefined> = {
  'milo.forest.frog.intro': undefined,
  'milo.forest.bear.intro': undefined,
  'milo.correct': undefined,
  'milo.tryAgain': undefined,
  'milo.clueFound': undefined,
}
