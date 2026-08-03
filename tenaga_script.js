const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// Mute toggle dengan tekan 'M'
const bgAudio = document.getElementById('bg-audio');
let isMuted = false;

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    isMuted = !isMuted;
    if (bgAudio) bgAudio.muted = isMuted;
    showToast(isMuted ? '🔇 Audio dimatikan' : '🔊 Audio dinyatakan');
  }
});