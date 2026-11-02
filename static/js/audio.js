/**
 * SurpriseLink - Audio Synthesizer & Sound FX Engine (Web Audio API)
 * Generates gentle romantic, birthday, and acoustic background melodies
 * as well as interactive Game Sound Effects (Pop, Click, Unlock, Party Popper)
 * without requiring external MP3 hosting or heavy downloads.
 */

class SurpriseAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.timerId = null;
    this.gainNode = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Sound Effects (SFX) ---

  // Keypad click tap
  playKeyClick() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Balloon Pop Sound!
  playPop() {
    if (this.isMuted) return;
    this.init();
    // Burst noise + pitch drop
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Candle Blow Sound
  playBlowCandle() {
    if (this.isMuted) return;
    this.init();
    try {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {
      console.warn('Candle audio error:', e);
    }
  }

  // Sweet lock unlock chime
  playUnlock() {
    if (this.isMuted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      }, idx * 70);
    });
  }

  // Party unbox cheer sound!
  playCheer() {
    if (this.isMuted) return;
    this.init();
    // Arpeggio fanfare
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
      }, idx * 60);
    });
  }

  // --- Background Melody Synthesizer ---
  getNoteFreq(note) {
    const notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };
    return notes[note] || 440.00;
  }

  playTone(freq, type = 'sine', duration = 0.5, startTime = 0) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    env.gain.setValueAtTime(0.01, this.ctx.currentTime + startTime);
    env.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + startTime + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

    osc.connect(env);
    env.connect(this.gainNode);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration + 0.1);
  }

  getMelody(trackName) {
    if (trackName === 'birthday') {
      return [
        ['C4', 0.4], ['C4', 0.2], ['D4', 0.6], ['C4', 0.6], ['F4', 0.6], ['E4', 1.0],
        ['C4', 0.4], ['C4', 0.2], ['D4', 0.6], ['C4', 0.6], ['G4', 0.6], ['F4', 1.0],
        ['C4', 0.4], ['C4', 0.2], ['C5', 0.6], ['A4', 0.6], ['F4', 0.6], ['E4', 0.6], ['D4', 0.8],
        ['B4', 0.4], ['B4', 0.2], ['A4', 0.6], ['F4', 0.6], ['G4', 0.6], ['F4', 1.2]
      ];
    } else if (trackName === 'romantic') {
      return [
        ['C4', 0.8], ['E4', 0.8], ['G4', 0.8], ['B4', 0.8],
        ['A4', 0.8], ['F4', 0.8], ['D4', 0.8], ['G4', 1.2],
        ['E4', 0.8], ['G4', 0.8], ['C5', 1.0], ['B4', 0.8], ['A4', 1.2]
      ];
    } else if (trackName === 'musicbox') {
      return [
        ['E5', 0.5], ['G5', 0.5], ['B5', 0.5], ['C6', 0.8],
        ['B5', 0.4], ['G5', 0.4], ['E5', 0.8], ['A5', 0.5],
        ['G5', 0.5], ['E5', 0.5], ['D5', 0.8], ['E5', 1.0]
      ];
    } else {
      // Default: Lo-Fi Piano
      return [
        ['C4', 0.6], ['G4', 0.6], ['E4', 0.6], ['B4', 0.8],
        ['A4', 0.6], ['E4', 0.6], ['C4', 0.6], ['F4', 0.8],
        ['D4', 0.6], ['A4', 0.6], ['F4', 0.6], ['C5', 1.2]
      ];
    }
  }

  playTrack(trackName) {
    this.init();
    this.stop();
    this.isPlaying = true;
    this.currentTrack = trackName;

    const melody = this.getMelody(trackName);
    const loopMelody = () => {
      if (!this.isPlaying) return;
      let timeOffset = 0;
      melody.forEach(([note, duration]) => {
        const type = trackName === 'musicbox' ? 'triangle' : 'sine';
        this.playTone(this.getNoteFreq(note), type, duration, timeOffset);
        timeOffset += duration * 0.75;
      });

      this.timerId = setTimeout(loopMelody, (timeOffset + 1.5) * 1000);
    };

    loopMelody();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggle(trackName = 'lofi') {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playTrack(trackName);
      return true;
    }
  }
}

window.surpriseAudio = new SurpriseAudioSynth();
