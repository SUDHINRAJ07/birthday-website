/**
 * SurpriseLink - Playful Penguin Scrapbook Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const screens = {
    accept: document.getElementById('screen-accept'),
    crying: document.getElementById('screen-crying'),
    choose: document.getElementById('screen-choose'),
    scrapbook1: document.getElementById('screen-scrapbook-1'),
    scrapbook2: document.getElementById('screen-scrapbook-2'),
    scrapbook3: document.getElementById('screen-scrapbook-3')
  };

  const btnYes = document.getElementById('btn-accept-yes');
  const btnNo = document.getElementById('btn-accept-no');
  const btnTryAgain = document.getElementById('btn-try-again');

  const pickPenguin1 = document.getElementById('pick-penguin-1');
  const pickPenguin2 = document.getElementById('pick-penguin-2');
  const pickPenguin3 = document.getElementById('pick-penguin-3');

  const btnBack1 = document.getElementById('btn-back-to-penguins-1');
  const btnBack2 = document.getElementById('btn-back-to-penguins-2');
  const btnBack3 = document.getElementById('btn-back-to-penguins-3');
  const btnReplayAll = document.getElementById('btn-replay-all');
  const soundPill = document.getElementById('sound-pill');

  function showScreen(screenKey) {
    Object.values(screens).forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (screens[screenKey]) {
      screens[screenKey].classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Acceptance decision
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      if (window.surpriseAudio) {
        window.surpriseAudio.playUnlock();
        window.surpriseAudio.playTrack('birthday');
      }
      showScreen('choose');
    });
  }

  if (btnNo) {
    btnNo.addEventListener('click', () => {
      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();
      showScreen('crying');
    });
  }

  if (btnTryAgain) {
    btnTryAgain.addEventListener('click', () => {
      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();
      showScreen('accept');
    });
  }

  // Choose penguin tabs
  if (pickPenguin1) {
    pickPenguin1.addEventListener('click', () => {
      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();
      showScreen('scrapbook1');
    });
  }

  if (pickPenguin2) {
    pickPenguin2.addEventListener('click', () => {
      if (window.surpriseAudio) window.surpriseAudio.playKeyClick();
      showScreen('scrapbook2');
    });
  }

  if (pickPenguin3) {
    pickPenguin3.addEventListener('click', () => {
      if (window.surpriseAudio) window.surpriseAudio.playCheer();
      showScreen('scrapbook3');
    });
  }

  // Back buttons
  [btnBack1, btnBack2, btnBack3].forEach(b => {
    if (b) {
      b.addEventListener('click', () => {
        if (window.surpriseAudio) window.surpriseAudio.playKeyClick();
        showScreen('choose');
      });
    }
  });

  if (btnReplayAll) {
    btnReplayAll.addEventListener('click', () => {
      showScreen('accept');
    });
  }

  // Sound toggle
  if (soundPill) {
    soundPill.addEventListener('click', () => {
      if (window.surpriseAudio) {
        window.surpriseAudio.toggle('birthday');
      }
    });
  }
});
