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
      src: '/imagens/itatiba/aquario-2.webp',
      alt: 'Aquário da Clínica (itatiba)',
      legenda: 'Espaço de atendimento (Itatiba)'
    },
    {
      src: 'imagens/varzea/aquario-varzea.webp',
      alt: 'Sala de atendimento Várzea',
      legenda: 'Espaço de atendimento (Varzea Paulista)'
    },
    {
      src: '/imagens/itatiba/paciente-2.webp',
      alt: 'Paciente em desenvolvimento',
      legenda: 'Paciente em desenvolvimento na clínica de itatiba'
    },
    {
      src: '/imagens/nossa-historia-jundiai.webp',
      alt: 'Equipamentos modernos',
      legenda: 'Área de exercícios (Jundiaí)'
    },
    {
      src: '/imagens/Itatiba/pilates-2.webp',
      alt: 'Sala de Pilates',
      legenda: 'Área para Pilates (Itatiba)'
    },
    {
      src: '/imagens/Jundiai/galeria-5.webp',
      alt: 'Recepção de Jundiaí',
      legenda: 'Recepção de Jundiaí'
    },
    {
      src: '/imagens/jundiai/tratamento-choque.webp',
      alt: 'Tratamento de Choque',
      legenda: 'Equipamento de eletroterapia em ação'
    },
    {
      src: '/imagens/itatiba/aquario-2.webp',
      alt: 'Aquários com macas',
      legenda: 'Macas para tratamentos individuais (Itatiba)'
    },
    {
      src: '/imagens/itatiba/espaco-exercicio-itatiba.webp',
      alt: 'Arena para exercícios (Itatiba)',
      legenda: 'Arena para exercícios (Itatiba)'
    },
    {
      src: '/imagens/itatiba/arena-exercicio-itatiba.webp',
      alt: 'Arena de treino (Itatiba)',
      legenda: 'Arena de treino (Itatiba)'
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

    // Inicializa thumbs na grid: troca src para thumbnail (se necessário) e adiciona lightbox
    initThumbnails();
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
  // THUMBNAILS / LIGHTBOX SIMPLES
  // ================================
  function makeThumbPathFromFull(fullPath) {
    try {
      // Ex: /full/aquario-2.webp  -> /thumbs/aquario-2-thumb.webp
      const url = new URL(fullPath, window.location.origin);
      const parts = url.pathname.split('/');
      const filename = parts.pop();
      const dir = parts.join('/');
      const dotIndex = filename.lastIndexOf('.');
      const name = dotIndex > -1 ? filename.slice(0, dotIndex) : filename;
      const ext = dotIndex > -1 ? filename.slice(dotIndex) : '';
      // prefer replace a pasta 'full' por 'thumbs' quando existir
      let thumbDir = dir.replace(/\bfull\b/, 'thumbs');
      if (thumbDir === dir) {
        // se não havia 'full', tenta colocar '/thumbs' no mesmo nível
        thumbDir = (dir === '' ? '/thumbs' : dir + '/thumbs');
      }
      const thumbName = `${name}-thumb${ext}`;
      return thumbDir.replace(/\/\/+/, '/') + '/' + thumbName;
    } catch (e) {
      // fallback simples
      return fullPath.replace('/full/', '/thumbs/').replace(/(\.[a-zA-Z0-9]+)$/, '-thumb$1');
    }
  }

  function initThumbnails() {
    const thumbImgs = document.querySelectorAll('img[data-full]');
    if (!thumbImgs || thumbImgs.length === 0) return;

    // Cria lightbox único reaproveitável
    const lightbox = createThumbLightbox();

    thumbImgs.forEach(img => {
      const full = img.getAttribute('data-full');
      if (!full) return;

      // Se o src estiver vazio ou apontando para a imagem full, calcule a thumb automaticamente
      const src = img.getAttribute('src') || '';
      const appearsFull = src && src.indexOf('/full/') !== -1;
      if (!src || appearsFull) {
        const thumb = makeThumbPathFromFull(full);
        img.setAttribute('src', thumb);
      }

      // Garantir lazy load
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');

      // Ao clicar no thumb, abrir lightbox e carregar o full
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', async (e) => {
        e.preventDefault();
        await openThumbLightbox(lightbox, img);
      });
    });
  }

  function createThumbLightbox() {
    // verifica se já existe
    let lb = document.getElementById('thumbLightbox');
    if (lb) return lb;

    lb = document.createElement('div');
    lb.id = 'thumbLightbox';
    lb.className = 'thumb-lightbox';
    lb.innerHTML = `
      <div class="thumb-lightbox__backdrop" tabindex="-1"></div>
      <div class="thumb-lightbox__panel" role="dialog" aria-modal="true">
        <button class="thumb-lightbox__close" aria-label="Fechar">×</button>
        <div class="thumb-lightbox__inner">
          <img class="thumb-lightbox__img" src="" alt="" />
          <div class="thumb-lightbox__caption"></div>
        </div>
      </div>
    `;
    document.body.appendChild(lb);

    // estilos mínimos (escopados para não depender do CSS principal)
    const style = document.createElement('style');
    style.textContent = `
      .thumb-lightbox { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 99999; }
      .thumb-lightbox.active { display: flex; }
      .thumb-lightbox__backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.7); }
      .thumb-lightbox__panel { position: relative; max-width: 96vw; max-height: 92vh; z-index: 2; display:flex; align-items:center; justify-content:center; }
      .thumb-lightbox__inner { max-width: 100%; max-height: 100%; display:flex; flex-direction:column; gap:12px; align-items:center; }
      .thumb-lightbox__img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius:8px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
      .thumb-lightbox__caption { color: #fff; font-size: 0.95rem; text-align:center; max-width: 90vw; }
      .thumb-lightbox__close { position: absolute; top: -10px; right: -10px; background: #222; color:#fff; border-radius:50%; width:36px; height:36px; border:none; font-size:1.2rem; cursor:pointer; }
    `;
    document.head.appendChild(style);

    // eventos de fechamento
    const backdrop = lb.querySelector('.thumb-lightbox__backdrop');
    const closeBtn = lb.querySelector('.thumb-lightbox__close');
    backdrop.addEventListener('click', () => closeThumbLightbox(lb));
    closeBtn.addEventListener('click', () => closeThumbLightbox(lb));
    document.addEventListener('keydown', (ev) => {
      if (!lb.classList.contains('active')) return;
      if (ev.key === 'Escape') closeThumbLightbox(lb);
    });

    return lb;
  }

  async function openThumbLightbox(lb, img) {
    const full = img.getAttribute('data-full');
    const alt = img.getAttribute('alt') || '';
    const caption = img.getAttribute('data-caption') || img.getAttribute('title') || '';
    const panelImg = lb.querySelector('.thumb-lightbox__img');
    const captionEl = lb.querySelector('.thumb-lightbox__caption');

    // mostra overlay e spinner (spinner simples via CSS opacity)
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';

    // enquanto carrega, podemos mostrar a thumb (se existir) e baixar opacidade
    const thumbSrc = img.getAttribute('src') || '';
    panelImg.style.opacity = '0';
    panelImg.src = thumbSrc;
    panelImg.alt = alt;
    captionEl.textContent = '';

    try {
      await preloadImage(full);
      // troca pela full
      panelImg.src = full;
      panelImg.alt = alt;
      captionEl.textContent = caption || alt;
      // pequena transição
      panelImg.style.transition = 'opacity 220ms ease';
      panelImg.style.opacity = '1';
    } catch (e) {
      captionEl.textContent = 'Erro ao carregar imagem';
      panelImg.style.opacity = '1';
      console.error(e);
    }
  }

  function closeThumbLightbox(lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
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