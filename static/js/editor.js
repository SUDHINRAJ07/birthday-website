/**
 * SurpriseLink - Real-Time Card Editor & Live Preview Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const recipientInput = document.getElementById('recipient_name');
  const senderInput = document.getElementById('sender_name');
  const headlineInput = document.getElementById('headline');
  const messageInput = document.getElementById('message');
  const passcodeInput = document.getElementById('passcode');
  const fontSelect = document.getElementById('font_family');
  const textColorInput = document.getElementById('text_color');
  const musicSelect = document.getElementById('music_track');

  // Preview Targets
  const previewRecipientLock = document.getElementById('preview-recipient-lock');
  const previewRecipientLetter = document.getElementById('preview-recipient-letter');
  const previewSender = document.getElementById('preview-sender');
  const previewHeadline = document.getElementById('preview-headline');
  const previewMessage = document.getElementById('preview-message');
  const previewScreen = document.getElementById('preview-screen');
  const previewMockupP1Msg = document.getElementById('preview-mockup-p1-msg');
  const previewMockupDate = document.getElementById('preview-mockup-date');
  const passcodeBoxes = document.querySelectorAll('#preview-passcode-display .pass-box');
  const classicTraitsChips = document.getElementById('preview-classic-traits-chips');

  // ===================================================
  // Template Selection & Mode Switching
  // ===================================================
  const tplToggles = document.querySelectorAll('.btn-template-toggle');
  const tplInput = document.getElementById('selected_template_slug');

  const photosClassicContainer = document.getElementById('photos-classic-container');
  const photosPenguinContainer = document.getElementById('photos-penguin-container');
  const previewTabsClassic = document.getElementById('preview-tabs-classic');
  const previewTabsPenguin = document.getElementById('preview-tabs-penguin');
  const classicPreviewContainer = document.getElementById('classic-preview-container');
  const penguinPreviewContainer = document.getElementById('penguin-preview-container');

  function setTemplateMode(tplSlug) {
    const isPenguin = (tplSlug === 'penguin-scrapbook' || tplSlug === 'penguin');

    if (tplInput) tplInput.value = isPenguin ? 'penguin-scrapbook' : tplSlug;

    // 1. Update Switcher Buttons
    tplToggles.forEach(b => {
      const bTpl = b.dataset.tpl;
      const bIsPenguin = (bTpl === 'penguin-scrapbook' || bTpl === 'penguin');
      if (bIsPenguin === isPenguin) {
        b.classList.remove('btn-outline');
        b.classList.add('btn-primary');
      } else {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      }
    });

    // 2. Toggle Photo Inputs in Editor
    if (photosClassicContainer && photosPenguinContainer) {
      if (isPenguin) {
        photosClassicContainer.style.display = 'none';
        photosPenguinContainer.style.display = 'block';
        // Enable penguin file inputs, disable classic to avoid form conflicts
        document.querySelectorAll('.slot-classic-input').forEach(i => i.disabled = true);
        document.querySelectorAll('.slot-penguin-input').forEach(i => i.disabled = false);
      } else {
        photosClassicContainer.style.display = 'block';
        photosPenguinContainer.style.display = 'none';
        document.querySelectorAll('.slot-classic-input').forEach(i => i.disabled = false);
        document.querySelectorAll('.slot-penguin-input').forEach(i => i.disabled = true);
      }
    }

    // 3. Toggle Preview Header Tabs & Screen Containers
    if (previewTabsClassic && previewTabsPenguin && classicPreviewContainer && penguinPreviewContainer) {
      if (isPenguin) {
        previewTabsClassic.style.display = 'none';
        previewTabsPenguin.style.display = 'flex';
        classicPreviewContainer.style.display = 'none';
        penguinPreviewContainer.style.display = 'block';
        // Activate first Penguin screen (Cake)
        switchPenguinView('cake');
      } else {
        previewTabsClassic.style.display = 'flex';
        previewTabsPenguin.style.display = 'none';
        classicPreviewContainer.style.display = 'block';
        penguinPreviewContainer.style.display = 'none';
        // Activate first Classic screen (Lock)
        switchClassicView('lock');
      }
    }
  }

  // Template toggle button clicks
  tplToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = btn.dataset.tpl;
      setTemplateMode(tpl);
      if (window.showToast) {
        showToast(`Switched to: ${btn.textContent.trim()} ✨`);
      }
    });
  });

  // ===================================================
  // Preview Screen Tab Navigation
  // ===================================================
  // Classic View Buttons & Screens
  const classicBtns = {
    lock: document.getElementById('btn-view-classic-lock'),
    balloons: document.getElementById('btn-view-classic-balloons'),
    cake: document.getElementById('btn-view-classic-cake'),
    traits: document.getElementById('btn-view-classic-traits'),
    letter: document.getElementById('btn-view-classic-letter')
  };

  const classicViews = {
    lock: document.getElementById('preview-classic-lock-view'),
    balloons: document.getElementById('preview-classic-balloons-view'),
    cake: document.getElementById('preview-classic-cake-view'),
    traits: document.getElementById('preview-classic-traits-view'),
    letter: document.getElementById('preview-classic-letter-view')
  };

  function switchClassicView(activeKey) {
    Object.keys(classicBtns).forEach(k => {
      if (classicBtns[k]) {
        classicBtns[k].classList.toggle('active', k === activeKey);
      }
    });
    Object.keys(classicViews).forEach(k => {
      if (classicViews[k]) {
        classicViews[k].style.display = (k === activeKey) ? 'flex' : 'none';
      }
    });
  }

  if (classicBtns.lock) classicBtns.lock.addEventListener('click', () => switchClassicView('lock'));
  if (classicBtns.balloons) classicBtns.balloons.addEventListener('click', () => switchClassicView('balloons'));
  if (classicBtns.cake) classicBtns.cake.addEventListener('click', () => switchClassicView('cake'));
  if (classicBtns.traits) classicBtns.traits.addEventListener('click', () => switchClassicView('traits'));
  if (classicBtns.letter) classicBtns.letter.addEventListener('click', () => switchClassicView('letter'));

  // Penguin View Buttons & Screens
  const penguinBtns = {
    cake: document.getElementById('btn-view-penguin-cake'),
    scrapbook: document.getElementById('btn-view-penguin-scrapbook'),
    collage: document.getElementById('btn-view-penguin-collage'),
    date: document.getElementById('btn-view-penguin-date')
  };

  const penguinViews = {
    cake: document.getElementById('preview-penguin-cake-view'),
    scrapbook: document.getElementById('preview-penguin-scrapbook-view'),
    collage: document.getElementById('preview-penguin-collage-view'),
    date: document.getElementById('preview-penguin-date-view')
  };

  function switchPenguinView(activeKey) {
    Object.keys(penguinBtns).forEach(k => {
      if (penguinBtns[k]) {
        penguinBtns[k].classList.toggle('active', k === activeKey);
      }
    });
    Object.keys(penguinViews).forEach(k => {
      if (penguinViews[k]) {
        penguinViews[k].style.display = (k === activeKey) ? 'flex' : 'none';
      }
    });
  }

  if (penguinBtns.cake) penguinBtns.cake.addEventListener('click', () => switchPenguinView('cake'));
  if (penguinBtns.scrapbook) penguinBtns.scrapbook.addEventListener('click', () => switchPenguinView('scrapbook'));
  if (penguinBtns.collage) penguinBtns.collage.addEventListener('click', () => switchPenguinView('collage'));
  if (penguinBtns.date) penguinBtns.date.addEventListener('click', () => switchPenguinView('date'));

  // ===================================================
  // Bond Traits Selection
  // ===================================================
  const traitBtns = document.querySelectorAll('.bond-trait-btn');
  const bondTraitsInput = document.getElementById('bond_traits');
  let selectedTraits = ['Sweet', 'Loyal', 'My rock'];

  // Parse existing from input if present
  if (bondTraitsInput && bondTraitsInput.value) {
    try {
      const parsed = JSON.parse(bondTraitsInput.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        selectedTraits = parsed;
      }
    } catch (e) {}
  }

  function renderClassicTraits() {
    if (!classicTraitsChips) return;
    classicTraitsChips.innerHTML = '';
    selectedTraits.forEach(trait => {
      const pill = document.createElement('span');
      pill.className = 'preview-trait-pill';
      pill.textContent = `💖 ${trait}`;
      classicTraitsChips.appendChild(pill);
    });
  }

  function updateTraitButtonsUI() {
    traitBtns.forEach(btn => {
      const trait = btn.dataset.trait;
      const isSelected = selectedTraits.includes(trait);
      btn.classList.toggle('active', isSelected);
    });
    if (bondTraitsInput) {
      bondTraitsInput.value = JSON.stringify(selectedTraits);
    }
    renderClassicTraits();
  }

  traitBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const trait = btn.dataset.trait;
      if (selectedTraits.includes(trait)) {
        // Deselect if already selected (keep at least 1)
        if (selectedTraits.length > 1) {
          selectedTraits = selectedTraits.filter(t => t !== trait);
        } else {
          if (window.showToast) showToast('Please select at least 1 trait! 💕');
          return;
        }
      } else {
        // If already 3 selected, remove oldest so clicking ANY trait ALWAYS selects it
        if (selectedTraits.length >= 3) {
          selectedTraits.shift();
        }
        selectedTraits.push(trait);
      }
      updateTraitButtonsUI();
      if (window.showToast) {
        showToast(`Selected traits: ${selectedTraits.join(', ')} 💕`);
      }
    });
  });

  // Initialize UI on load
  updateTraitButtonsUI();

  // ===================================================
  // Special Date Selector
  // ===================================================
  const monthSelect = document.getElementById('special_date_month');
  const daySelect = document.getElementById('special_date_day');
  const specialDateInput = document.getElementById('special_date');

  function updateSpecialDate() {
    if (monthSelect && daySelect && specialDateInput) {
      const dateVal = `${monthSelect.value} ${daySelect.value}`;
      specialDateInput.value = dateVal;
      if (previewMockupDate) {
        previewMockupDate.textContent = dateVal;
      }
    }
  }
  if (monthSelect) monthSelect.addEventListener('change', updateSpecialDate);
  if (daySelect) daySelect.addEventListener('change', updateSpecialDate);

  // ===================================================
  // Passcode Real-time Sync
  // ===================================================
  if (passcodeInput) {
    passcodeInput.addEventListener('input', (e) => {
      const raw = e.target.value.trim().padEnd(4, '•');
      passcodeBoxes.forEach((box, i) => {
        box.textContent = raw[i] || '•';
      });
    });
  }

  // ===================================================
  // Tab Switching inside Left Form
  // ===================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add('active');
      }
    });
  });

  // ===================================================
  // Real-time Text Updates
  // ===================================================
  if (recipientInput) {
    recipientInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      const txt = val ? `FOR ${val.toUpperCase()}` : 'FOR SOMEONE SPECIAL';
      if (previewRecipientLock) previewRecipientLock.textContent = txt;
      if (previewRecipientLetter) previewRecipientLetter.textContent = val ? `FOR ${val.toUpperCase()} ♡` : 'FOR YOU ♡';
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

  if (messageInput) {
    messageInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (previewMessage) {
        previewMessage.textContent = val || 'Wishing you the happiest moments, endless smiles, and all your dreams fulfilled today and always! ✨';
      }
      if (previewMockupP1Msg) {
        previewMockupP1Msg.textContent = val.substring(0, 140) + (val.length > 140 ? '...' : '');
      }
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
          if (window.showToast) showToast('You can select up to 5 stickers!', 'error');
        }
      }
      if (selectedStickersInput) selectedStickersInput.value = JSON.stringify(activeStickers);
    });
  });

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
      if (window.showToast) showToast(`Selected music: ${card.querySelector('h4').textContent} 🎵`);
    });

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.surpriseAudio) {
          const isPlaying = window.surpriseAudio.toggle(track);
          playBtn.innerHTML = isPlaying ? '⏸' : '▶';
          if (isPlaying) {
            if (window.showToast) showToast(`Playing preview: ${track} 🎶`);
          } else {
            if (window.showToast) showToast('Music paused');
          }
        }
      });
    }
  });

  // ===================================================
  // Slot-Based Photo Upload & Live Sync
  // ===================================================
  const slotInputs = document.querySelectorAll('.slot-file-input');

  function updateSlotPreview(slotNum, dataUrl) {
    // 1. Update Thumbnail in Classic or Penguin Editor
    const classicBox = document.getElementById(`slot-preview-classic-${slotNum}`);
    if (classicBox) {
      classicBox.innerHTML = `<img src="${dataUrl}" alt="Photo ${slotNum}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    const penguinBox = document.getElementById(`slot-preview-${slotNum}`);
    if (penguinBox) {
      penguinBox.innerHTML = `<img src="${dataUrl}" alt="Photo ${slotNum}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    // 2. Update Phone Mockup Target Images
    if (slotNum === 1) {
      const polaroidImg = document.getElementById('preview-classic-polaroid-img');
      if (polaroidImg) polaroidImg.src = dataUrl;

      const p1Img = document.getElementById('preview-mockup-p1-img');
      if (p1Img) p1Img.src = dataUrl;
    } else if (slotNum === 2) {
      const img = document.getElementById('preview-mockup-p2-img1');
      if (img) img.src = dataUrl;
    } else if (slotNum === 3) {
      const img = document.getElementById('preview-mockup-p2-img2');
      if (img) img.src = dataUrl;
    } else if (slotNum === 4) {
      const img = document.getElementById('preview-mockup-p2-img3');
      if (img) img.src = dataUrl;
    } else if (slotNum === 5) {
      const img = document.getElementById('preview-mockup-p2-img4');
      if (img) img.src = dataUrl;
    } else if (slotNum === 6) {
      const img = document.getElementById('preview-mockup-p2-img5');
      if (img) img.src = dataUrl;
    } else if (slotNum === 7) {
      const img = document.getElementById('preview-mockup-p3-img');
      if (img) img.src = dataUrl;
    }

    if (window.showToast) showToast(`Photo ${slotNum} updated in Live Preview! 📸`);
  }

  slotInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        if (window.showToast) showToast('Please upload a valid image (JPG, PNG, WEBP)', 'error');
        return;
      }

      const slotNum = parseInt(input.dataset.slot, 10);
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSlotPreview(slotNum, event.target.result);
      };
      reader.readAsDataURL(file);
    });
  });

  // Multi-Photo Upload Dropzone
  const photoInput = document.getElementById('photo_upload');
  const photoPreviewList = document.getElementById('photo-preview-list');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      if (photoPreviewList) photoPreviewList.innerHTML = '';

      files.forEach((file, index) => {
        if (!file.type.startsWith('image/')) return;
        const slotNum = index + 1;

        const reader = new FileReader();
        reader.onload = (event) => {
          if (slotNum <= 7) {
            updateSlotPreview(slotNum, event.target.result);
          }

          if (photoPreviewList) {
            const item = document.createElement('div');
            item.className = 'photo-preview-item';
            item.innerHTML = `<img src="${event.target.result}" alt="Preview ${index + 1}" />`;
            photoPreviewList.appendChild(item);
          }
        };
        reader.readAsDataURL(file);
      });

      if (window.showToast) showToast(`Loaded ${files.length} photos! 📸`);
    });
  }

  // ===================================================
  // Initial Mode Setup
  // ===================================================
  const initialTpl = tplInput ? (tplInput.value || 'classic-birthday') : 'classic-birthday';
  setTemplateMode(initialTpl);
  renderClassicTraits();
});
