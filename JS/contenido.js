const cards = document.querySelectorAll('.card-surf');

cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped'); 
  });
});