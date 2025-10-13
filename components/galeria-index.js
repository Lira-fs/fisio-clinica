/**
 * GALERIA.JS
 * Sistema de galeria de fotos para a seção "Nosso Espaço"
 * Mobile-first com swipe, navegação por teclado e modal
 */

(function() {
  'use strict';

  // ================================
  // DADOS DAS IMAGENS (EDITÁVEL)
  // ================================
  const IMAGENS_GALERIA = [
    {
      src: '/imagens/Jundiai/galeria-5.webp',
      alt: 'Recepção da clínica',
      legenda: 'Recepção acolhedora e Aparelhos (Jundiaí)'
    },
    {
      src: '/imagens/Jundiai/jundiai-1.webp',
      alt: 'Sala de atendimento',
      legenda: 'Espaço de atendimento (Jundiaí)'
    },
    {
      src: '/imagens/jundiai/galeria-2.webp',
      alt: 'Área de exercícios',
      legenda: 'Espaço de atendimento (Jundiaí)'
    },
    {
      src: '/imagens/Jundiai/jundiai-2.webp',
      alt: 'Equipamentos modernos',
      legenda: 'Aquário com macas para tratamentos individuais (Jundiaí)'
    },
    {
      src: '/imagens/Jundiai/galeria-4.webp',
      alt: 'Sala de Pilates',
      legenda: 'Área de exercícios (Jundiaí)'
    },
    {
      src: '/imagens/Jundiai/jundiai-4.webp',
      alt: 'Área de descanso',
      legenda: 'Fisioterapeuta cuidando de um dos nossos pacientes (Jundiaí)'
    },
    {
      src: '/imagens/itatiba/visao-geral.webp',
      alt: 'Visão Geral Clínica de Itatiba',
      legenda: 'Visão geral da clínica de Itatiba'
    },
    {
      src: '/imagens/itatiba/aquario-2.webp',
      alt: 'Aquários com macas',
      legenda: 'Macas para tratamentos individuais (Itatiba)'
    },
    {
      src: '/imagens/itatiba/paciente-2.webp',
      alt: 'Área de Exercícios (Itatiba)',
      legenda: 'Área de Exercícios (Itatiba)'
    },
    {
      src: '/imagens/itatiba/visao-mezanino.webp',
      alt: 'Visão de cima (Itatiba)',
      legenda: 'Visão de cima (Itatiba)'
    },
    {
      src: '/imagens/itatiba/recepcao-pilates.webp',
      alt: 'Recepção Pilates (Itatiba)',
      legenda: 'Recepção Pilates (Itatiba)'
    },
    {
      src: '/imagens/Itatiba/pilates-2.webp',
      alt: 'Espaço para pilates',
      legenda: 'Espaço dedicado para piltates (Itatiba)'
    },
    {
      src: '/imagens/Itatiba/pilates.webp',
      alt: 'Espaço dedicado para pilates',
      legenda: 'Espaço dedicado para piltates (Itatiba)'
    }
  ];

  // ================================
  // VARIÁVEIS GLOBAIS
  // ================================
  let currentIndex = 0;
  let modal, imagemEl, legendaEl, counterEl;
  let btnClose, btnPrev, btnNext, btnVerGaleria;
  let previewItems;
  let touchStartX = 0;
  let touchEndX = 0;

  // ================================
  // INICIALIZAÇÃO
  // ================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  function setup() {
    // Buscar elementos do DOM
    modal = document.getElementById('galeriaModal');
    imagemEl = document.getElementById('galeriaImagem');
    legendaEl = document.getElementById('galeriaLegenda');
    counterEl = document.getElementById('galeriaCounter');
    
    btnClose = document.getElementById('galeriaClose');
    btnPrev = document.getElementById('galeriaPrev');
    btnNext = document.getElementById('galeriaNext');
    btnVerGaleria = document.getElementById('verGaleriaBtn');
    
    previewItems = document.querySelectorAll('.galeria-preview-item');

    // Verificar se elementos existem
    if (!modal || !imagemEl) {
      console.warn('Galeria: Elementos não encontrados');
      return;
    }

    // Configurar eventos
    bindEvents();
  }

  // ================================
  // EVENT LISTENERS
  // ================================
  function bindEvents() {
    // Botão "Ver Galeria Completa"
    if (btnVerGaleria) {
      btnVerGaleria.addEventListener('click', () => abrirGaleria(0));
    }

    // Clique nos thumbnails
    previewItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        abrirGaleria(index);
      });
    });

    // Botões do modal
    if (btnClose) btnClose.addEventListener('click', fecharGaleria);
    if (btnPrev) btnPrev.addEventListener('click', imagemAnterior);
    if (btnNext) btnNext.addEventListener('click', proximaImagem);

    // Clique no fundo escuro fecha
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          fecharGaleria();
        }
      });
    }

    // Navegação por teclado
    document.addEventListener('keydown', handleKeyboard);

    // Swipe no mobile
    if (modal) {
      modal.addEventListener('touchstart', handleTouchStart, { passive: true });
      modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }

  // ================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ================================
  function abrirGaleria(index) {
    currentIndex = index;
    mostrarImagem(currentIndex);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function fecharGaleria() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function mostrarImagem(index) {
    const imagem = IMAGENS_GALERIA[index];
    
    imagemEl.src = imagem.src;
    imagemEl.alt = imagem.alt;
    legendaEl.textContent = imagem.legenda;
    counterEl.textContent = `${index + 1} / ${IMAGENS_GALERIA.length}`;

    // Trigger animação
    imagemEl.style.animation = 'none';
    setTimeout(() => {
      imagemEl.style.animation = '';
    }, 10);
  }

  function imagemAnterior() {
    currentIndex = (currentIndex - 1 + IMAGENS_GALERIA.length) % IMAGENS_GALERIA.length;
    mostrarImagem(currentIndex);
  }

  function proximaImagem() {
    currentIndex = (currentIndex + 1) % IMAGENS_GALERIA.length;
    mostrarImagem(currentIndex);
  }

  // ================================
  // CONTROLES DE TECLADO
  // ================================
  function handleKeyboard(e) {
    if (!modal.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        fecharGaleria();
        break;
      case 'ArrowLeft':
        imagemAnterior();
        break;
      case 'ArrowRight':
        proximaImagem();
        break;
    }
  }

  // ================================
  // CONTROLES TOUCH (SWIPE)
  // ================================
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    
    // Swipe left (próxima)
    if (touchEndX < touchStartX - swipeThreshold) {
      proximaImagem();
    }
    
    // Swipe right (anterior)
    if (touchEndX > touchStartX + swipeThreshold) {
      imagemAnterior();
    }
  }

  // ================================
  // API PÚBLICA (OPCIONAL)
  // ================================
  window.Galeria = {
    abrir: abrirGaleria,
    fechar: fecharGaleria,
    anterior: imagemAnterior,
    proxima: proximaImagem
  };

  // ================================
  // INICIAR
  // ================================
  init();

})();