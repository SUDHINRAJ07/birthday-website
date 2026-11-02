/**
 * SurpriseLink - Main Application Helper Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle if exists
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Auto hide flash alerts
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });
});

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)';
  toast.style.cssText = `
    background: ${bg};
    color: #fff;
    padding: 12px 24px;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    pointer-events: auto;
    animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.innerHTML = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/**
 * Copy to Clipboard Utility
 */
function copyToClipboard(text, successMsg = 'Copied to clipboard! 📋') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
  textArea.remove();
}

/**
 * WhatsApp Share helper
 */
function shareOnWhatsApp(url, title = 'I made a special surprise for you!') {
  const text = encodeURIComponent(`${title} ✨ Click to open: ${url}`);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}
