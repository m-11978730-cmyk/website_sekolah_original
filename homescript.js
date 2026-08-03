import { animate, stagger, splitText } from 'animejs';

// Memastikan kod hanya berjalan jika ada tag h2 di dalam HTML
const { chars } = splitText('h2', { words: false, chars: true });

if (chars && chars.length > 0) {
  animate(chars, {
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    rotate: {
      from: '-1turn',
      delay: 0
    },
    delay: stagger(50),
    ease: 'inOutCirc',
    loopDelay: 1000,
    loop: true
  });
}
