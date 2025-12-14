// Sound Effects Utility using Web Audio API
// Generates sounds programmatically - no external files needed

type SoundType = 'correct' | 'wrong' | 'streak' | 'steal' | 'tick' | 'buzzer' | 'showdown' | 'victory' | 'countdown';

class SoundEngine {
    private audioContext: AudioContext | null = null;
    private enabled: boolean = true;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
        if (!this.enabled) return;

        const ctx = this.getContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }

    private playSequence(notes: { freq: number; dur: number; delay: number }[], type: OscillatorType = 'sine') {
        notes.forEach(note => {
            setTimeout(() => this.playTone(note.freq, note.dur, type), note.delay);
        });
    }

    play(sound: SoundType) {
        if (!this.enabled) return;

        switch (sound) {
            case 'correct':
                // Happy ascending chime
                this.playSequence([
                    { freq: 523, dur: 0.1, delay: 0 },    // C5
                    { freq: 659, dur: 0.1, delay: 80 },   // E5
                    { freq: 784, dur: 0.2, delay: 160 },  // G5
                ], 'sine');
                break;

            case 'wrong':
                // Descending buzz
                this.playSequence([
                    { freq: 200, dur: 0.15, delay: 0 },
                    { freq: 150, dur: 0.2, delay: 100 },
                ], 'sawtooth');
                break;

            case 'streak':
                // Fire whoosh - ascending with intensity
                this.playSequence([
                    { freq: 300, dur: 0.05, delay: 0 },
                    { freq: 400, dur: 0.05, delay: 30 },
                    { freq: 500, dur: 0.05, delay: 60 },
                    { freq: 600, dur: 0.05, delay: 90 },
                    { freq: 800, dur: 0.1, delay: 120 },
                    { freq: 1000, dur: 0.15, delay: 150 },
                ], 'sawtooth');
                break;

            case 'steal':
                // Sneaky descending then ascending
                this.playSequence([
                    { freq: 400, dur: 0.08, delay: 0 },
                    { freq: 350, dur: 0.08, delay: 60 },
                    { freq: 300, dur: 0.08, delay: 120 },
                    { freq: 500, dur: 0.15, delay: 200 },
                    { freq: 700, dur: 0.2, delay: 280 },
                ], 'triangle');
                break;

            case 'tick':
                // Simple tick
                this.playTone(800, 0.05, 'sine', 0.2);
                break;

            case 'buzzer':
                // Team buzzer
                this.playSequence([
                    { freq: 440, dur: 0.1, delay: 0 },
                    { freq: 440, dur: 0.1, delay: 120 },
                ], 'square');
                break;

            case 'showdown':
                // Dramatic siren for final showdown
                this.playSequence([
                    { freq: 600, dur: 0.2, delay: 0 },
                    { freq: 800, dur: 0.2, delay: 200 },
                    { freq: 600, dur: 0.2, delay: 400 },
                    { freq: 800, dur: 0.2, delay: 600 },
                    { freq: 1000, dur: 0.4, delay: 800 },
                ], 'sawtooth');
                break;

            case 'victory':
                // Celebration fanfare
                this.playSequence([
                    { freq: 523, dur: 0.15, delay: 0 },    // C5
                    { freq: 523, dur: 0.15, delay: 150 },  // C5
                    { freq: 523, dur: 0.15, delay: 300 },  // C5
                    { freq: 659, dur: 0.3, delay: 450 },   // E5
                    { freq: 784, dur: 0.15, delay: 750 },  // G5
                    { freq: 659, dur: 0.15, delay: 900 },  // E5
                    { freq: 784, dur: 0.5, delay: 1050 },  // G5
                ], 'sine');
                break;

            case 'countdown':
                // Tension tick for low timer
                this.playTone(600, 0.08, 'square', 0.25);
                break;
        }
    }
}

// Singleton instance
export const soundEngine = new SoundEngine();
