// Função de Toggle com Lazy Loading
function toggleTech(header) {
  const item = header.parentElement;
  const content = item.querySelector('.tech-item-content');
  const img = item.querySelector('.tech-lazy-image');
  const isActive = item.classList.contains('active');
  
  if (!isActive) {
    // Ativa o card
    item.classList.add('active');
    
    // Lazy load da imagem (só carrega uma vez)
    if (img && !img.classList.contains('loaded')) {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.onload = function() {
          img.classList.add('loaded');
        };
        // Remove data-src para não recarregar
        img.removeAttribute('data-src');
      }
    }
  } else {
    // Desativa o card
    item.classList.remove('active');
  }
}

// Animação de entrada dos cards
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.tech-item').forEach(item => {
    observer.observe(item);
  });
});
