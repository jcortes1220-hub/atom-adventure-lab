let audio: AudioContext | undefined;
export function playSound(
  kind: 'add' | 'success' | 'challenge',
  muted: boolean,
) {
  if (muted || typeof window === 'undefined') return;
  try {
    audio ??= new AudioContext();
    void audio.resume();
    const tones =
      kind === 'add'
        ? [440]
        : kind === 'success'
          ? [523, 659, 784]
          : [523, 659, 784, 1047];
    tones.forEach((hz, i) => {
      const osc = audio!.createOscillator(),
        gain = audio!.createGain(),
        at = audio!.currentTime + i * 0.11;
      osc.type = 'sine';
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.045, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.18);
      osc.connect(gain);
      gain.connect(audio!.destination);
      osc.start(at);
      osc.stop(at + 0.2);
    });
  } catch {
    /* Sound is optional; blocked audio must never stop play. */
  }
}
