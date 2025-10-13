/**
 * GALERIA.JS - VERSÃO OTIMIZADA
 * Sistema de galeria com lazy loading e pré-carregamento
 */

(function() {
  'use strict';

  // ================================
  // DADOS DAS IMAGENS
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
  
  // Cache de imagens pré-carregadas
  const imageCache = new Map();
  let isTransitioning = false;

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
    modal = document.getElementById('galeriaModal');
    imagemEl = document.getElementById('galeriaImagem');
    legendaEl = document.getElementById('galeriaLegenda');
    counterEl = document.getElementById('galeriaCounter');
    
    btnClose = document.getElementById('galeriaClose');
    btnPrev = document.getElementById('galeriaPrev');
    btnNext = document.getElementById('galeriaNext');
    btnVerGaleria = document.getElementById('verGaleriaBtn');
    
    previewItems = document.querySelectorAll('.galeria-preview-item');

    if (!modal || !imagemEl) {
      console.warn('Galeria: Elementos não encontrados');
      return;
    }

    bindEvents();
  }

  // ================================
  // PRÉ-CARREGAMENTO INTELIGENTE
  // ================================
  function preloadImage(src) {
    // Se já está no cache, retorna a promessa existente
    if (imageCache.has(src)) {
      return imageCache.get(src);
    }

    // Cria nova promessa de carregamento
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Falha ao carregar: ${src}`));
      
      img.src = src;
    });

    // Salva no cache
    imageCache.set(src, promise);
    return promise;
  }

  function preloadAdjacentImages(index) {
    // Pré-carrega próxima e anterior
    const nextIndex = (index + 1) % IMAGENS_GALERIA.length;
    const prevIndex = (index - 1 + IMAGENS_GALERIA.length) % IMAGENS_GALERIA.length;

    preloadImage(IMAGENS_GALERIA[nextIndex].src).catch(e => console.warn(e));
    preloadImage(IMAGENS_GALERIA[prevIndex].src).catch(e => console.warn(e));
  }

  // ================================
  // EVENT LISTENERS
  // ================================
  function bindEvents() {
    if (btnVerGaleria) {
      btnVerGaleria.addEventListener('click', () => abrirGaleria(0));
    }

    previewItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        abrirGaleria(index);
      });
    });

    if (btnClose) btnClose.addEventListener('click', fecharGaleria);
    if (btnPrev) btnPrev.addEventListener('click', imagemAnterior);
    if (btnNext) btnNext.addEventListener('click', proximaImagem);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharGaleria();
      });
    }

    document.addEventListener('keydown', handleKeyboard);

    if (modal) {
      modal.addEventListener('touchstart', handleTouchStart, { passive: true });
      modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }

  // ================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ================================
  async function abrirGaleria(index) {
    currentIndex = index;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Carrega a imagem atual
    await mostrarImagem(currentIndex);
  }

  function fecharGaleria() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  async function mostrarImagem(index) {
    if (isTransitioning) return;
    
    const imagem = IMAGENS_GALERIA[index];
    
    // Atualiza contador e legenda imediatamente
    counterEl.textContent = `${index + 1} / ${IMAGENS_GALERIA.length}`;
    legendaEl.textContent = imagem.legenda;

    try {
      isTransitioning = true;
      
      // Pré-carrega a imagem ANTES de começar a transição
      await preloadImage(imagem.src);
      
      // Fade out rápido
      imagemEl.style.opacity = '0';
      
      // Aguarda o fade out completar (150ms)
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Troca a imagem enquanto está invisível
      imagemEl.src = imagem.src;
      imagemEl.alt = imagem.alt;
      
      // Força o browser a processar a mudança
      imagemEl.offsetHeight;
      
      // Fade in rápido
      imagemEl.style.opacity = '1';
      
      // Pré-carrega imagens adjacentes em background
      preloadAdjacentImages(index);
      
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
      imagemEl.style.opacity = '1';
    } finally {
      // Libera após a transição completar
      setTimeout(() => {
        isTransitioning = false;
      }, 200);
    }
  }

  function imagemAnterior() {
    if (isTransitioning) return;
    currentIndex = (currentIndex - 1 + IMAGENS_GALERIA.length) % IMAGENS_GALERIA.length;
    mostrarImagem(currentIndex);
  }

  function proximaImagem() {
    if (isTransitioning) return;
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
    
    if (touchEndX < touchStartX - swipeThreshold) {
      proximaImagem();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      imagemAnterior();
    }
  }

  // ================================
  // API PÚBLICA
  // ================================
  window.Galeria = {
    abrir: abrirGaleria,
    fechar: fecharGaleria,
    anterior: imagemAnterior,
    proxima: proximaImagem,
    preloadAll: () => {
      IMAGENS_GALERIA.forEach(img => preloadImage(img.src));
    }
  };

  init();
})();