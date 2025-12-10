function toggleTechAccordion(element) {
  const card = element.parentElement;
  const isActive = card.classList.contains('active');
  
  // Opcional: fechar outros cards (remova se quiser permitir múltiplos abertos)
  // document.querySelectorAll('.tech-card').forEach(c => c.classList.remove('active'));
  
  if (!isActive) {
    card.classList.add('active');
  } else {
    card.classList.remove('active');
  }
}