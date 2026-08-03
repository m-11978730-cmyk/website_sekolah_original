const hero = document.querySelector('.hero');

if (hero) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;

    hero.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y * -1}deg)`;
  });

  window.addEventListener('mouseleave', () => {
    hero.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
}

const btn = document.getElementById('exploreBtn');

if (btn) {
  btn.addEventListener('click', () => {
    btn.textContent = 'Loading...';
    btn.style.transform = 'scale(0.95)';

    setTimeout(() => {
      btn.textContent = 'Welcome!';
      btn.style.transform = 'scale(1)';
    }, 1000);
  });
}