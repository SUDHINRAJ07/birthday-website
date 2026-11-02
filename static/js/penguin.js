/**
 * SurpriseLink - Playful Penguin Interactive Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  const screens = {
    accept: document.getElementById('screen-accept'),
    crying: document.getElementById('screen-crying'),
    choose: document.getElementById('screen-choose'),
    p1Cake: document.getElementById('screen-p1-cake'),
    p1Scrapbook: document.getElementById('screen-p1-scrapbook'),
    p2Collage: document.getElementById('screen-p2-collage'),
    p3Date: document.getElementById('screen-p3-date'),
    p3Hug: document.getElementById('screen-p3-hug'),
    p3Finale: document.getElementById('screen-p3-finale')
  };

  const btnYes = document.getElementById('btn-accept-yes');
  const btnNo = document.getElementById('btn-accept-no');
  const btnTryAgain = document.getElementById('btn-try-again');

  const pickPenguin1 = document.getElementById('pick-penguin-1');
  const pickPenguin2 = document.getElementById('pick-penguin-2');
  const pickPenguin3 = document.getElementById('pick-penguin-3');

  const badgeP1 = document.getElementById('badge-p1');
  const badgeP2 = document.getElementById('badge-p2');
  const badgeP3 = document.getElementById('badge-p3');

  const btnP1ToScrapbook = document.getElementById('btn-p1-to-scrapbook');
  const cakeClickTarget = document.querySelector('.penguin-cake-svg-wrap');
  const candleFlame = document.querySelector('.candle-flame-anim');
  const btnP1Done = document.getElementById('btn-p1-done-click');
  const btnBackP1 = document.getElementById('btn-back-from-p1');

  const btnP2Done = document.getElementById('btn-p2-done-click');
  const btnBackP2 = document.getElementById('btn-back-from-p2');

  const btnP3ToHug = document.getElementById('btn-p3-to-hug');
  const btnP3ToFinale = document.getElementById('btn-p3-to-finale');
  const btnBackP3A = document.getElementById('btn-back-from-p3-a');

  const btnReplayAll = document.getElementById('btn-replay-all');
  const soundPill = document.getElementById('sound-pill');
  const soundPillIcon = document.getElementById('sound-pill-icon');
  const configuredTrack = document.body.dataset.musicTrack || 'custom_song';

  function safePlay(fnName, param) {
    try {
      if (window.surpriseAudio && typeof window.surpriseAudio[fnName] === 'function') {
        window.surpriseAudio[fnName](param);
      }
    } catch (e) {
      console.warn('Audio call failed gracefully:', e);
    }
  }

  function showScreen(screenKey) {
    console.log('Navigating to screen:', screenKey);
    Object.keys(screens).forEach(k => {
      const el = screens[k];
      if (el) el.classList.remove('active');
    });
    if (screens[screenKey]) {
      screens[screenKey].classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind click helper that handles both click and touchend
  function bindAction(el, handler) {
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      handler();
    });
  }

  // Acceptance decisions
  bindAction(btnYes, () => {
    safePlay('playUnlock');
    safePlay('playTrack', configuredTrack);
    showScreen('choose');
  });

  bindAction(btnNo, () => {
    safePlay('playKeyClick');
    showScreen('crying');
  });

  bindAction(btnTryAgain, () => {
    safePlay('playKeyClick');
    showScreen('accept');
  });

  const candleFlameGroup = document.getElementById('candle-flame-group');
  const candleSmoke = document.getElementById('candle-smoke');

  // --- Penguin 1 Sub-flow ---
  bindAction(pickPenguin1, () => {
    safePlay('playKeyClick');
    if (candleFlameGroup) {
      candleFlameGroup.style.display = 'block';
      candleFlameGroup.style.opacity = '1';
      candleFlameGroup.style.transform = 'scale(1)';
    }
    if (candleSmoke) {
      candleSmoke.classList.remove('puff-active');
    }
    showScreen('p1Cake');
    // Stays on Cake screen with animations playing! Waits for user to click "CLICK ME ♡"
  });

  function goToP1Scrapbook() {
    safePlay('playBlowCandle');
    if (candleFlameGroup) {
      candleFlameGroup.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      candleFlameGroup.style.opacity = '0';
      candleFlameGroup.style.transform = 'scale(0.2) translateY(-10px)';
    }
    if (candleSmoke) {
      candleSmoke.classList.add('puff-active');
    }

    const cakeCard = document.querySelector('.cartoon-stage-card');
    if (cakeCard) {
      cakeCard.classList.add('anim-page-turn-out');
    }

    // Smooth page turn sequence
    setTimeout(() => {
      showScreen('p1Scrapbook');
      if (cakeCard) cakeCard.classList.remove('anim-page-turn-out');
      if (candleSmoke) candleSmoke.classList.remove('puff-active');

      const scrapbookCard = document.querySelector('#screen-p1-scrapbook .scrapbook-notebook-card');
      if (scrapbookCard) {
        scrapbookCard.classList.add('anim-notebook-open');
        setTimeout(() => scrapbookCard.classList.remove('anim-notebook-open'), 1800);
      }
    }, 450);
  }

  // Clicking "CLICK ME" on Cake Screen opens scrapbook
  bindAction(btnP1ToScrapbook, goToP1Scrapbook);
  // Also clicking the cake itself blows candle and opens scrapbook
  bindAction(cakeClickTarget, goToP1Scrapbook);

  function markP1Done() {
    safePlay('playKeyClick');
    if (pickPenguin1) pickPenguin1.classList.add('opened');
    if (badgeP1) badgeP1.textContent = '💖';
    showScreen('choose');
  }

  bindAction(btnP1Done, markP1Done);
  bindAction(btnBackP1, markP1Done);

  // --- Penguin 2 Sub-flow ---
  bindAction(pickPenguin2, () => {
    safePlay('playKeyClick');
    showScreen('p2Collage');
  });

  function markP2Done() {
    safePlay('playKeyClick');
    if (pickPenguin2) pickPenguin2.classList.add('opened');
    if (badgeP2) badgeP2.textContent = '💖';
    showScreen('choose');
  }

  bindAction(btnP2Done, markP2Done);
  bindAction(btnBackP2, markP2Done);

  // --- Penguin 3 Sub-flow ---
  bindAction(pickPenguin3, () => {
    safePlay('playKeyClick');
    showScreen('p3Date');
  });

  bindAction(btnP3ToHug, () => {
    safePlay('playUnlock');
    showScreen('p3Hug');
  });

  bindAction(btnP3ToFinale, () => {
    safePlay('playCheer');
    if (pickPenguin3) pickPenguin3.classList.add('opened');
    if (badgeP3) badgeP3.textContent = '💖';
    showScreen('p3Finale');
    launchConfetti();
  });

  bindAction(btnBackP3A, () => {
    safePlay('playKeyClick');
    showScreen('choose');
  });

  // Replay All
  bindAction(btnReplayAll, () => {
    [pickPenguin1, pickPenguin2, pickPenguin3].forEach(p => {
      if (p) p.classList.remove('opened');
    });
    [badgeP1, badgeP2, badgeP3].forEach(b => {
      if (b) b.textContent = '✨';
    });
    showScreen('accept');
  });

  // Audio Toggle Pill
  if (soundPill) {
    soundPill.addEventListener('click', () => {
      if (window.surpriseAudio) {
        const isPlaying = window.surpriseAudio.toggle(configuredTrack);
        if (soundPillIcon) soundPillIcon.textContent = isPlaying ? '🔊' : '🔇';
      }
    });
  }

  // Confetti Animation Engine
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#fbbf24', '#34d399', '#f97316'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 9 + 4,
        h: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 2,
        rot: Math.random() * 360,
        dRot: (Math.random() - 0.5) * 6
      });
    }

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.dRot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frames++;
      if (frames < 300) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animate);
  }
});
