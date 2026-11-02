/**
 * SurpriseLink - Real-Time Card Editor Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const recipientInput = document.getElementById('recipient_name');
  const senderInput = document.getElementById('sender_name');
  const headlineInput = document.getElementById('headline');
  const messageInput = document.getElementById('message');
  const fontSelect = document.getElementById('font_family');
  const textColorInput = document.getElementById('text_color');
  const musicSelect = document.getElementById('music_track');

  // Preview Targets
  const previewRecipient = document.getElementById('preview-recipient');
  const previewSender = document.getElementById('preview-sender');
  const previewHeadline = document.getElementById('preview-headline');
  const previewMessage = document.getElementById('preview-message');
  const previewScreen = document.getElementById('preview-screen');
  const previewStickersContainer = document.getElementById('preview-stickers');
  const previewPhotoContainer = document.getElementById('preview-photos');

  // Bond Traits Selection
  const traitBtns = document.querySelectorAll('.bond-trait-btn');
  const bondTraitsInput = document.getElementById('bond_traits');
  let selectedTraits = ['Sweet', 'Loyal', 'My rock'];

  traitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const trait = btn.dataset.trait;
      if (selectedTraits.includes(trait)) {
        selectedTraits = selectedTraits.filter(t => t !== trait);
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.color = '#4b5563';
        btn.style.borderColor = '#e5e7eb';
      } else {
        if (selectedTraits.length < 3) {
          selectedTraits.push(trait);
          btn.classList.add('active');
          btn.style.background = 'var(--primary-light)';
          btn.style.color = 'var(--primary)';
          btn.style.borderColor = 'var(--primary)';
        } else {
          showToast('Choose any 3 traits!', 'error');
        }
      }
      if (bondTraitsInput) bondTraitsInput.value = JSON.stringify(selectedTraits);
    });
  });

  // Month & Day change auto updates passcode hint
  const monthSelect = document.getElementById('special_date_month');
  const daySelect = document.getElementById('special_date_day');
  const specialDateInput = document.getElementById('special_date');
  const passcodeInput = document.getElementById('passcode');

  function updateSpecialDate() {
    if (monthSelect && daySelect && specialDateInput) {
      specialDateInput.value = `${monthSelect.value} ${daySelect.value}`;
    }
  }
  if (monthSelect) monthSelect.addEventListener('change', updateSpecialDate);
  if (daySelect) daySelect.addEventListener('change', updateSpecialDate);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Text Updates
  if (recipientInput && previewRecipient) {
    recipientInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      previewRecipient.textContent = val ? `FOR ${val.toUpperCase()}` : 'FOR SOMEONE SPECIAL';
    });
  }

  if (senderInput && previewSender) {
    senderInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      previewSender.textContent = val ? `With love, ${val} ♡` : 'With love ♡';
    });
  }

  if (headlineInput && previewHeadline) {
    headlineInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      previewHeadline.textContent = val || 'Happy Birthday!';
    });
  }

  if (messageInput && previewMessage) {
    messageInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      previewMessage.textContent = val || 'Wishing you the happiest moments, endless smiles, and all your dreams fulfilled today and always! ✨';
    });
  }

  // Theme Swatches
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  const themeInput = document.getElementById('theme_gradient');

  themeSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      themeSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const gradient = swatch.dataset.gradient;
      if (themeInput) themeInput.value = gradient;
      if (previewScreen) previewScreen.style.background = gradient;
    });
  });

  // Font Selection
  const fontBtns = document.querySelectorAll('.font-option-btn');
  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const font = btn.dataset.font;
      if (fontSelect) fontSelect.value = font;
      if (previewHeadline) previewHeadline.style.fontFamily = font;
      if (previewMessage) previewMessage.style.fontFamily = font;
      if (previewSender) previewSender.style.fontFamily = font;
    });
  });

  // Stickers Toggle
  const stickerBtns = document.querySelectorAll('.sticker-btn');
  const selectedStickersInput = document.getElementById('selected_stickers');
  let activeStickers = ['🎂', '✨', '💖'];

  stickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sticker = btn.dataset.sticker;
      if (activeStickers.includes(sticker)) {
        activeStickers = activeStickers.filter(s => s !== sticker);
        btn.classList.remove('selected');
      } else {
        if (activeStickers.length < 5) {
          activeStickers.push(sticker);
          btn.classList.add('selected');
        } else {
          showToast('You can select up to 5 stickers!', 'error');
        }
      }
      if (selectedStickersInput) selectedStickersInput.value = JSON.stringify(activeStickers);
      renderPreviewStickers();
    });
  });

  function renderPreviewStickers() {
    if (!previewStickersContainer) return;
    previewStickersContainer.innerHTML = '';
    activeStickers.forEach(stk => {
      const span = document.createElement('span');
      span.textContent = stk;
      span.style.animation = 'float 3s ease-in-out infinite';
      previewStickersContainer.appendChild(span);
    });
  }

  // Music Selection & Preview
  const musicCards = document.querySelectorAll('.music-card');
  musicCards.forEach(card => {
    const playBtn = card.querySelector('.music-preview-btn');
    const track = card.dataset.track;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.music-preview-btn')) return;
      musicCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      if (musicSelect) musicSelect.value = track;
      showToast(`Selected music: ${card.querySelector('h4').textContent} 🎵`);
    });

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.surpriseAudio) {
          const isPlaying = window.surpriseAudio.toggle(track);
          playBtn.innerHTML = isPlaying ? '⏸' : '▶';
          if (isPlaying) {
            showToast(`Playing preview: ${track} 🎶`);
          } else {
            showToast('Music paused');
          }
        }
      });
    }
  });

  // Photo Upload Simulation / Preview
  const photoInput = document.getElementById('photo_upload');
  const photoPreviewList = document.getElementById('photo-preview-list');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      if (previewPhotoContainer) previewPhotoContainer.innerHTML = '';
      if (photoPreviewList) photoPreviewList.innerHTML = '';

      files.slice(0, 4).forEach((file, index) => {
        if (!file.type.startsWith('image/')) {
          showToast('Please upload valid image files (JPG/PNG)', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          // Add to editor thumbnail list
          if (photoPreviewList) {
            const item = document.createElement('div');
            item.className = 'photo-preview-item';
            item.innerHTML = `<img src="${event.target.result}" alt="Preview ${index + 1}" />`;
            photoPreviewList.appendChild(item);
          }

          // Add to phone mockup preview
          if (previewPhotoContainer) {
            const img = document.createElement('img');
            img.src = event.target.result;
            previewPhotoContainer.appendChild(img);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Preview Toggle between Envelope View & Letter View
  const btnViewEnvelope = document.getElementById('btn-view-envelope');
  const btnViewLetter = document.getElementById('btn-view-letter');
  const envelopeView = document.getElementById('preview-envelope-view');
  const letterView = document.getElementById('preview-letter-view');

  if (btnViewEnvelope && btnViewLetter && envelopeView && letterView) {
    btnViewEnvelope.addEventListener('click', () => {
      btnViewEnvelope.classList.add('active');
      btnViewLetter.classList.remove('active');
      envelopeView.style.display = 'flex';
      letterView.style.display = 'none';
    });

    btnViewLetter.addEventListener('click', () => {
      btnViewLetter.classList.add('active');
      btnViewEnvelope.classList.remove('active');
      envelopeView.style.display = 'none';
      letterView.style.display = 'block';
    });
  }

  // Click on preview envelope opens letter view
  const previewEnvelope = document.getElementById('preview-envelope-tap');
  if (previewEnvelope && btnViewLetter) {
    previewEnvelope.addEventListener('click', () => {
      btnViewLetter.click();
    });
  }
});
