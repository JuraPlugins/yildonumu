// Ambient Romantic Audio Synthesizer (Web Audio API)
// Creates a soothing, romantic piano/rhodes progression with subtle warm vinyl & ocean breeze

class RomanticAudioPlayer {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.interval = null;
        this.masterGain = null;
        this.waveGain = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.initOceanAmbience();
    }

    initOceanAmbience() {
        // Pink noise generator for gentle ocean breeze/waves
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.02; // soft volume
            b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);

        this.waveGain = this.ctx.createGain();
        this.waveGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        // LFO for wave swelling
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // slow swell
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

        lfo.connect(this.waveGain.gain);
        whiteNoise.connect(filter);
        filter.connect(this.waveGain);
        this.waveGain.connect(this.masterGain);

        whiteNoise.start();
        lfo.start();
    }

    playNote(freq, time, duration = 2.8, velocity = 0.18) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        // Warm harmonic
        const harmonic = this.ctx.createOscillator();
        const harmGain = this.ctx.createGain();
        harmonic.type = 'triangle';
        harmonic.frequency.setValueAtTime(freq * 2, time);
        harmGain.gain.setValueAtTime(velocity * 0.25, time);
        harmGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.8);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, time);
        filter.frequency.exponentialRampToValueAtTime(300, time + duration);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(velocity, time + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        harmonic.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc.start(time);
        harmonic.start(time);
        osc.stop(time + duration);
        harmonic.stop(time + duration);
    }

    playChord(notes, time, duration = 3.5) {
        notes.forEach((freq, index) => {
            // slight arpeggiation delay for romantic touch
            this.playNote(freq, time + index * 0.08, duration - (index * 0.08));
        });
    }

    start() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isPlaying = true;

        // Romantic Chord Progression (Dbmaj7 - Bbm7 - Gbmaj7 - Ab7 / F#m - Ebm)
        // Warm, dreamy Mediterranean sunset chords
        const chords = [
            [277.18, 349.23, 415.30, 523.25], // Dbmaj7 (Db, F, Ab, C)
            [233.08, 277.18, 349.23, 415.30], // Bbm7 (Bb, Db, F, Ab)
            [185.00, 277.18, 369.99, 440.00], // Gbmaj7 (Gb, Db, Bb, F)
            [207.65, 261.63, 311.13, 392.00], // Abadd9 (Ab, C, Eb, G)
        ];

        let chordIndex = 0;
        const playNext = () => {
            if (!this.isPlaying) return;
            const now = this.ctx.currentTime;
            const currentChord = chords[chordIndex % chords.length];
            this.playChord(currentChord, now, 4.2);

            // Optional high chime/melody
            if (Math.random() > 0.4) {
                const highNote = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
                this.playNote(highNote, now + 1.2, 2.0, 0.08);
            }

            chordIndex++;
            this.interval = setTimeout(playNext, 3800);
        };

        playNext();
    }

    stop() {
        this.isPlaying = false;
        if (this.interval) clearTimeout(this.interval);
        if (this.ctx && this.masterGain) {
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
            return false;
        } else {
            this.start();
            return true;
        }
    }
}

window.romanticAudio = new RomanticAudioPlayer();
