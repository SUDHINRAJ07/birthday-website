/**
 * SurpriseLink - Audio Synthesizer (Web Audio API)
 * Generates gentle romantic, birthday, and acoustic background melodies
 * without requiring external MP3 hosting or heavy downloads.
 */

class SurpriseAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.timerId = null;
    this.gainNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Frequency mapping for musical notes
  getNoteFreq(note) {
    const notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };
    return notes[note] || 440.00;
  }

  playTone(freq, type = 'sine', duration = 0.5, startTime = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    env.gain.setValueAtTime(0.01, this.ctx.currentTime + startTime);
    env.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + startTime + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

    osc.connect(env);
    env.connect(this.gainNode);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration + 0.1);
  }

  getMelody(trackName) {
    // Return note sequences [note, duration, type]
    if (trackName === 'birthday') {
      return [
        ['C4', 0.4], ['C4', 0.2], ['D4', 0.6], ['C4', 0.6], ['F4', 0.6], ['E4', 1.0],
        ['C4', 0.4], ['C4', 0.2], ['D4', 0.6], ['C4', 0.6], ['G4', 0.6], ['F4', 1.0],
        ['C4', 0.4], ['C4', 0.2], ['C5', 0.6], ['A4', 0.6], ['F4', 0.6], ['E4', 0.6], ['D4', 0.8],
        ['B4', 0.4], ['B4', 0.2], ['A4', 0.6], ['F4', 0.6], ['G4', 0.6], ['F4', 1.2]
      ];
    } else if (trackName === 'musicbox') {
      return [
        ['E5', 0.5], ['G5', 0.5], ['B5', 0.5], ['C6', 0.8],
        ['B5', 0.4], ['G5', 0.4], ['E5', 0.8], ['A5', 0.5],
        ['G5', 0.5], ['E5', 0.5], ['D5', 0.8], ['E5', 1.0]
      ];
    } else if (trackName === 'romantic') {
      return [
        ['C4', 0.8], ['E4', 0.8], ['G4', 0.8], ['B4', 0.8],
        ['A4', 0.8], ['F4', 0.8], ['D4', 0.8], ['G4', 1.2],
        ['E4', 0.8], ['G4', 0.8], ['C5', 1.0], ['B4', 0.8], ['A4', 1.2]
      ];
    } else if (trackName === 'ukulele') {
      return [
        ['G4', 0.3], ['C4', 0.3], ['E4', 0.3], ['A4', 0.5],
        ['G4', 0.3], ['C4', 0.3], ['E4', 0.3], ['A4', 0.5],
        ['F4', 0.3], ['A4', 0.3], ['C5', 0.5], ['G4', 0.8]
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

// Global instance
window.surpriseAudio = new SurpriseAudioSynth();
