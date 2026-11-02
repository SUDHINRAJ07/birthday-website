/**
 * SurpriseLink - Recipient Surprise Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('surprise-envelope');
  const revealedCard = document.getElementById('revealed-card');
  const musicPill = document.getElementById('music-pill-controller');
  const musicDisc = document.getElementById('music-disc');
  const musicLabel = document.getElementById('music-pill-label');
  const confettiCanvas = document.getElementById('confetti-canvas');

  const selectedTrack = window.SURPRISE_MUSIC || 'lofi';

  // Confetti Physics Engine
  let confettiCtx = null;
  let particles = [];
  let isConfettiRunning = false;

  function initConfetti() {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    });
  }

  function fireConfetti() {
    if (!confettiCtx) initConfetti();
    isConfettiRunning = true;
    particles = [];
    const colors = ['#ff4d79', '#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ffd700'];

    for (let i = 0; i < 140; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: Math.random() * 10 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 20,
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.08) + 0.04,
        alpha: 1
      });
    }

    renderConfetti();
  }

  function renderConfetti() {
    if (!confettiCtx || !isConfettiRunning) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let activeParticles = 0;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // friction
      p.tiltAngle += p.tiltAngleInc;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (p.y < confettiCanvas.height) {
        activeParticles++;
        confettiCtx.save();
        confettiCtx.fillStyle = p.color;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.tiltAngle);
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
      }
    });

    if (activeParticles > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // Floating Hearts Background Generator
  function createFloatingHearts() {
    const container = document.getElementById('particles-bg');
    if (!container) return;
    const symbols = ['💖', '✨', '🌸', '💫', '💕', '🌷'];

    setInterval(() => {
      if (document.hidden) return;
      const el = document.createElement('div');
      el.className = 'floating-heart-particle';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = Math.random() * 95 + 'vw';
      el.style.fontSize = (Math.random() * 18 + 14) + 'px';
      el.style.animationDuration = (Math.random() * 4 + 6) + 's';
      container.appendChild(el);

      setTimeout(() => el.remove(), 10000);
    }, 900);
  }

  createFloatingHearts();

  // Envelope Open Interaction
  if (envelope) {
    envelope.addEventListener('click', () => {
      if (envelope.classList.contains('opened')) return;

      envelope.classList.add('opened');

      // Start music automatically on interaction
      if (window.surpriseAudio) {
        window.surpriseAudio.playTrack(selectedTrack);
        if (musicDisc) musicDisc.classList.add('spinning');
        if (musicLabel) musicLabel.textContent = 'Music Playing 🎶';
      }

      // Fire confetti burst!
      fireConfetti();

      // Show revealed card with delayed animation
      setTimeout(() => {
        envelope.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        envelope.style.opacity = '0';
        envelope.style.transform = 'translateY(-20px) scale(0.9)';

        setTimeout(() => {
          envelope.style.display = 'none';
          if (revealedCard) {
            revealedCard.classList.add('show');
          }
        }, 400);
      }, 700);
    });
  }

  // Music Pill Toggle
  if (musicPill) {
    musicPill.addEventListener('click', () => {
      if (window.surpriseAudio) {
        const isPlaying = window.surpriseAudio.toggle(selectedTrack);
        if (isPlaying) {
          musicDisc.classList.add('spinning');
          musicLabel.textContent = 'Music Playing 🎶';
        } else {
          musicDisc.classList.remove('spinning');
          musicLabel.textContent = 'Music Paused ⏸';
        }
      }
    });
  }
});
