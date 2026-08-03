document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.member-card');

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 120}ms`;
        card.classList.add('show');
    });
});
