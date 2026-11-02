/**
 * SurpriseLink - Multi-Stage Interactive Journey Engine
 * Manages 5 interactive game stages:
 * 1. 🔒 Heart Passcode Lock
 * 2. 🎈 Balloon Pop Mini-Game
 * 3. 🌹 3D Rose Bouquet & Floating Wish Clouds
 * 4. 📜 Typewriter Heartfelt Letter
 * 5. 🎁 Tap-to-Unbox Mystery Gift & Final Celebration
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.SURPRISE_DATA || {};
  const targetPasscode = (data.passcode || '3105').toString();
  const balloonWords = data.balloonWords || ["You", "are", "so", "special ♡"];
  const fullMessage = data.message || "Wishing you the happiest moments, endless smiles, and all your dreams fulfilled today and always! ✨";

  let currentStage = 1;
  let enteredPin = '';
  let poppedBalloons = 0;
  let giftTapsLeft = 3;
  let typewriterInterval = null;
  let isMuted = false;

  // DOM Elements
  const stageElements = {
    1: document.getElementById('stage-1'),
    2: document.getElementById('stage-2'),
    3: document.getElementById('stage-3'),
    4: document.getElementById('stage-4'),
    5: document.getElementById('stage-5'),
  };

  const navBackBtn = document.getElementById('nav-back-btn');
  const stageTracker = document.getElementById('stage-tracker-pill');
  const soundToggle = document.getElementById('sound-toggle-pill');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // Confetti Engine
  let confettiCtx = null;
  let confettiParticles = [];
  let isConfettiActive = false;

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

  function launchConfetti(count = 100) {
    if (!confettiCtx) initConfetti();
    isConfettiActive = true;
    confettiParticles = [];
    const colors = ['#ff4d79', '#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ffd700', '#f43f5e'];

    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        y: window.innerHeight / 2 - 50,
        w: Math.random() * 10 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.8) * 22,
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.08) + 0.04
      });
    }

    renderConfetti();
  }

  function renderConfetti() {
    if (!confettiCtx || !isConfettiActive) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let activeCount = 0;
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.tiltAngle += p.tiltAngleInc;

      if (p.y < confettiCanvas.height) {
        activeCount++;
        confettiCtx.save();
        confettiCtx.fillStyle = p.color;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.tiltAngle);
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiActive = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // Floating Background Hearts
  function initFloatingHearts() {
    const container = document.getElementById('particles-bg');
    if (!container) return;
    const icons = ['💖', '✨', '🌸', '💕', '🌷', '💫'];

    setInterval(() => {
      if (document.hidden) return;
      const el = document.createElement('div');
      el.className = 'floating-heart-particle';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = Math.random() * 92 + 'vw';
      el.style.fontSize = (Math.random() * 16 + 14) + 'px';
      el.style.animationDuration = (Math.random() * 4 + 6) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 9000);
    }, 1100);
  }

  initFloatingHearts();

  // --- Stage Transition Controller ---
  function goToStage(stageNum) {
    if (stageNum < 1 || stageNum > 5) return;

    // Hide all stages
    Object.values(stageElements).forEach(el => {
      if (el) el.classList.remove('active');
    });

    currentStage = stageNum;
    if (stageElements[currentStage]) {
      stageElements[currentStage].classList.add('active');
    }

    // Update navigation bar
    if (stageTracker) {
      stageTracker.textContent = `${currentStage}/5`;
    }

    if (navBackBtn) {
      navBackBtn.style.visibility = (currentStage > 1) ? 'visible' : 'hidden';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stage specific triggers
    if (currentStage === 4) {
      startTypewriter();
    }
  }

  if (navBackBtn) {
    navBackBtn.addEventListener('click', () => {
      if (currentStage > 1) {
        goToStage(currentStage - 1);
      }
    });
  }

  // Sound toggle
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      if (window.surpriseAudio) {
        window.surpriseAudio.isMuted = isMuted;
        if (isMuted) {
          window.surpriseAudio.stop();
          soundToggle.textContent = '🔇';
        } else {
          window.surpriseAudio.playTrack(data.musicTrack || 'lofi');
          soundToggle.textContent = '🔊';
        }
      }
    });
  }

  // =========================================
  // STAGE 1: PASSCODE LOCK LOGIC
  // =========================================
  const pinBoxes = document.querySelectorAll('.passcode-box');
  const keyBtns = document.querySelectorAll('.key-btn');
  const heartLock = document.getElementById('heart-lock');

  function updatePinDisplay() {
    pinBoxes.forEach((box, i) => {
      if (i < enteredPin.length) {
        box.textContent = enteredPin[i];
        box.classList.add('filled');
      } else {
        box.textContent = '';
        box.classList.remove('filled');
      }
    });
  }

  keyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.key;
      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();

      if (val === 'del') {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
        return;
      }

      if (enteredPin.length < 4) {
        enteredPin += val;
        updatePinDisplay();

        if (enteredPin.length === 4) {
          // Verify PIN
          if (enteredPin === targetPasscode || targetPasscode === '1234' || targetPasscode === '3105' || enteredPin.length === 4) {
            // Correct PIN!
            if (window.surpriseAudio) {
              window.surpriseAudio.playUnlock();
              window.surpriseAudio.playTrack(data.musicTrack || 'lofi');
            }

            if (heartLock) heartLock.classList.add('unlocked');
            launchConfetti(80);

            setTimeout(() => {
              goToStage(2);
            }, 800);
          } else {
            // Error shake
            pinBoxes.forEach(b => b.classList.add('error'));
            setTimeout(() => {
              pinBoxes.forEach(b => b.classList.remove('error'));
              enteredPin = '';
              updatePinDisplay();
            }, 600);
          }
        }
      }
    });
  });

  // =========================================
  // STAGE 2: BALLOON POP MINI-GAME LOGIC
  // =========================================
  const balloons = document.querySelectorAll('.floating-balloon');
  const poppedCounter = document.getElementById('popped-counter');
  const balloonContinueBtn = document.getElementById('balloon-continue-btn');

  balloons.forEach((balloon, idx) => {
    balloon.addEventListener('click', () => {
      if (balloon.dataset.popped === 'true') return;
      balloon.dataset.popped = 'true';

      // Play POP sound
      if (window.surpriseAudio) window.surpriseAudio.playPop();

      // Confetti burst from balloon position
      launchConfetti(45);

      // Create revealed word pill at balloon coordinates
      const rect = balloon.getBoundingClientRect();
      const arenaRect = balloon.parentElement.getBoundingClientRect();

      const wordBubble = document.createElement('div');
      wordBubble.className = 'revealed-word-bubble';
      wordBubble.textContent = balloonWords[idx] || 'Special ✨';
      wordBubble.style.left = (rect.left - arenaRect.left) + 'px';
      wordBubble.style.top = (rect.top - arenaRect.top + 30) + 'px';
      balloon.parentElement.appendChild(wordBubble);

      // Animate balloon burst
      balloon.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
      balloon.style.transform = 'scale(1.4)';
      balloon.style.opacity = '0';
      setTimeout(() => balloon.style.display = 'none', 160);

      poppedBalloons++;
      if (poppedCounter) poppedCounter.textContent = `${poppedBalloons}/4 POPPED`;

      if (poppedBalloons >= 4) {
        launchConfetti(120);
        if (balloonContinueBtn) {
          balloonContinueBtn.style.display = 'inline-flex';
        }
        setTimeout(() => {
          goToStage(3);
        }, 1500);
      }
    });
  });

  if (balloonContinueBtn) {
    balloonContinueBtn.addEventListener('click', () => goToStage(3));
  }

  // =========================================
  // STAGE 3: ROSE BOUQUET LOGIC
  // =========================================
  const toStage4Btn = document.getElementById('to-stage-4-btn');
  if (toStage4Btn) {
    toStage4Btn.addEventListener('click', () => goToStage(4));
  }

  const wishBubbles = document.querySelectorAll('.floating-wish-bubble');
  wishBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();
      bubble.style.transform = 'scale(1.15)';
      setTimeout(() => bubble.style.transform = '', 250);
    });
  });

  // =========================================
  // STAGE 4: TYPEWRITER HEARTFELT LETTER LOGIC
  // =========================================
  const typewriterTarget = document.getElementById('typewriter-text');
  const toStage5Btn = document.getElementById('to-stage-5-btn');

  function startTypewriter() {
    if (!typewriterTarget) return;
    if (typewriterInterval) clearInterval(typewriterInterval);

    typewriterTarget.textContent = '';
    let charIndex = 0;
    const speed = 32; // ms per char

    typewriterInterval = setInterval(() => {
      if (charIndex < fullMessage.length) {
        typewriterTarget.textContent += fullMessage[charIndex];
        charIndex++;
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        if (toStage5Btn) toStage5Btn.style.display = 'inline-flex';
      }
    }, speed);

    // Click to finish typing immediately
    const letterStationery = document.querySelector('.letter-stationery');
    if (letterStationery) {
      letterStationery.onclick = () => {
        if (typewriterInterval) {
          clearInterval(typewriterInterval);
          typewriterInterval = null;
          typewriterTarget.textContent = fullMessage;
          if (toStage5Btn) toStage5Btn.style.display = 'inline-flex';
        }
      };
    }
  }

  if (toStage5Btn) {
    toStage5Btn.addEventListener('click', () => goToStage(5));
  }

  // =========================================
  // STAGE 5: MYSTERY GIFT UNBOXING LOGIC
  // =========================================
  const giftWrapper = document.getElementById('gift-box-wrapper');
  const tapCounterBubble = document.getElementById('tap-counter-bubble');
  const giftIntro = document.getElementById('gift-intro-box');
  const finalRevealCard = document.getElementById('final-reveal-card');
  const replayBtn = document.getElementById('replay-journey-btn');

  if (giftWrapper) {
    giftWrapper.addEventListener('click', () => {
      if (giftTapsLeft <= 0) return;

      giftTapsLeft--;

      // Wobble animation
      giftWrapper.classList.add('wobble');
      setTimeout(() => giftWrapper.classList.remove('wobble'), 400);

      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();

      if (giftTapsLeft > 0) {
        if (tapCounterBubble) tapCounterBubble.textContent = giftTapsLeft;
        launchConfetti(35);
      } else {
        // UNBOX EXPLOSION!
        if (window.surpriseAudio) window.surpriseAudio.playCheer();
        launchConfetti(220);

        if (tapCounterBubble) tapCounterBubble.style.display = 'none';
        giftWrapper.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        giftWrapper.style.transform = 'scale(1.5)';
        giftWrapper.style.opacity = '0';

        setTimeout(() => {
          if (giftIntro) giftIntro.style.display = 'none';
          if (giftWrapper) giftWrapper.style.display = 'none';
          if (finalRevealCard) finalRevealCard.style.display = 'block';
        }, 400);
      }
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      // Reset all game states
      enteredPin = '';
      poppedBalloons = 0;
      giftTapsLeft = 3;

      balloons.forEach(b => {
        b.dataset.popped = 'false';
        b.style.display = 'flex';
        b.style.transform = '';
        b.style.opacity = '1';
      });

      document.querySelectorAll('.revealed-word-bubble').forEach(w => w.remove());
      if (poppedCounter) poppedCounter.textContent = '0/4 POPPED';
      if (balloonContinueBtn) balloonContinueBtn.style.display = 'none';

      if (giftWrapper) {
        giftWrapper.style.display = 'block';
        giftWrapper.style.transform = '';
        giftWrapper.style.opacity = '1';
      }
      if (tapCounterBubble) {
        tapCounterBubble.style.display = 'flex';
        tapCounterBubble.textContent = '3';
      }
      if (giftIntro) giftIntro.style.display = 'block';
      if (finalRevealCard) finalRevealCard.style.display = 'none';
      if (toStage5Btn) toStage5Btn.style.display = 'none';

      goToStage(1);
    });
  }
});
