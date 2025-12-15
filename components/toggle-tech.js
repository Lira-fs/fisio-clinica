/*
  toggleTech: abre/fecha um único card tech
  Regras adicionais:
  - cada card abre individualmente sem forçar altura da linha (CSS controla align-items:start)
  - manter no máximo `MAX_OPEN` cards abertos; ao abrir novo, fecha o mais antigo automaticamente
*/
const __techOpenQueue = [];
const MAX_OPEN = 3; // máximo de cards abertos simultaneamente

function toggleTech(header) {
  const item = header.closest('.tech-item');
  if (!item) return;

  const img = item.querySelector('.tech-lazy-image');
  const isActive = item.classList.contains('active');

  if (!isActive) {
    // Se precisamos liberar espaço, fechar o mais antigo
    if (__techOpenQueue.length >= MAX_OPEN) {
      const oldest = __techOpenQueue.shift();
      if (oldest && oldest.classList) {
        oldest.classList.remove('active');
      }
    }

    // Abre este card e coloca no fim da fila
    item.classList.add('active');
    // remover se já existia na fila por algum motivo
    const existingIndex = __techOpenQueue.indexOf(item);
    if (existingIndex !== -1) __techOpenQueue.splice(existingIndex, 1);
    __techOpenQueue.push(item);

    // Lazy load da imagem (só carrega uma vez)
    if (img && !img.classList.contains('loaded')) {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.onload = function() {
          img.classList.add('loaded');
        };
        img.removeAttribute('data-src');
      }
    }
    // após abrir, atualizar margens por coluna para empurrar apenas a coluna
    requestAnimationFrame(() => updateColumnMargins());
  } else {
    // Fecha este card e remove da fila
    item.classList.remove('active');
    const idx = __techOpenQueue.indexOf(item);
    if (idx !== -1) __techOpenQueue.splice(idx, 1);
    // após fechar, atualizar margens
    requestAnimationFrame(() => updateColumnMargins());
  }
}

// Recalcula margens por coluna: cada coluna empurra apenas seus próprios itens
function updateColumnMargins() {
  const grid = document.querySelector('.tech-grid');
  if (!grid) return;
  // se estivermos no modo colunas (DOM reorganizado em .tech-col), não aplicar margins JS
  if (grid.classList.contains('tech-grid--columns')) {
    // limpar margins residuais caso existam
    const all = grid.querySelectorAll('.tech-item');
    all.forEach(el => el.style.marginTop = '');
    return;
  }
  const children = Array.from(grid.children).filter(n => n.classList && n.classList.contains('tech-item'));
  if (!children.length) return;

  // Determinar número de colunas via grid-template-columns
  const cs = window.getComputedStyle(grid);
  let cols = 0;
  const gtc = cs.getPropertyValue('grid-template-columns');
  if (gtc) {
    cols = gtc.split(' ').length;
  }
  if (!cols || cols < 1) cols = 4; // fallback

  // Para cada coluna, percorre as linhas e acumula offsets
  for (let c = 0; c < cols; c++) {
    let cumulative = 0;
    for (let r = 0; ; r++) {
      const idx = c + r * cols;
      if (idx >= children.length) break;
      const el = children[idx];

      // aplicar margem-top igual ao acumulado (só empurra dentro da coluna)
      el.style.marginTop = cumulative ? cumulative + 'px' : '';

      // se esse el estiver ativo, aumenta o acumulado com a altura do conteúdo expandido
      if (el.classList.contains('active')) {
        const content = el.querySelector('.tech-item-content');
        if (content) {
          // usar scrollHeight para obter altura real do conteúdo visível quando expandido
          const h = content.scrollHeight;
          cumulative += h;
        }
      }
    }
  }
}

// Recalcula ao redimensionar (debounced)
let __resizeTimerTech;
window.addEventListener('resize', () => {
  clearTimeout(__resizeTimerTech);
  __resizeTimerTech = setTimeout(() => updateColumnMargins(), 120);
});

// === COLUMN MODE: reorganiza DOM em colunas independentes (cada .tech-col = uma coluna)
let __columnsActive = false;
let __originalOrder = null;

function getGridCols(grid) {
  const cs = window.getComputedStyle(grid);
  const gtc = cs.getPropertyValue('grid-template-columns') || '';
  const cols = gtc.trim() ? gtc.split(/\s+/).length : 4;
  return Math.max(1, cols);
}

function enableColumnMode() {
  const grid = document.querySelector('.tech-grid');
  if (!grid) return;
  const cols = getGridCols(grid);
  const items = Array.from(grid.querySelectorAll('.tech-item'));
  if (items.length === 0) return;

  // se já ativo e cols não mudou, nada a fazer
  if (__columnsActive && grid.classList.contains('tech-grid--columns')) return;

  // salvar ordem original apenas uma vez
  if (!__originalOrder) __originalOrder = items.slice();

  // construir colunas
  const colsNodes = [];
  for (let c = 0; c < cols; c++) {
    const col = document.createElement('div');
    col.className = 'tech-col';
    colsNodes.push(col);
  }

  // distribuir itens por coluna (preserva ordem por linhas)
  items.forEach((it, i) => {
    const colIndex = i % cols;
    colsNodes[colIndex].appendChild(it);
  });

  // limpar grid e inserir colunas
  grid.innerHTML = '';
  colsNodes.forEach(col => grid.appendChild(col));
  grid.classList.add('tech-grid--columns');
  __columnsActive = true;
}

function disableColumnMode() {
  const grid = document.querySelector('.tech-grid');
  if (!grid || !__columnsActive) return;
  // restaurar ordem original
  grid.classList.remove('tech-grid--columns');
  grid.innerHTML = '';
  if (__originalOrder) {
    __originalOrder.forEach(it => grid.appendChild(it));
  }
  // limpar margins residuais
  grid.querySelectorAll('.tech-item').forEach(el => el.style.marginTop = '');
  __columnsActive = false;
}

// Ajusta coluna ao carregar/redimensionar para manter colunas independentes
function refreshColumnLayout() {
  const grid = document.querySelector('.tech-grid');
  if (!grid) return;
  const cols = getGridCols(grid);
  // ativar modo coluna apenas se houver mais que 1 coluna
  if (cols > 1) {
    enableColumnMode();
  } else {
    disableColumnMode();
  }
}

// inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  refreshColumnLayout();
});

// recalcular em resize (debounced)
window.addEventListener('resize', () => {
  clearTimeout(__resizeTimerTech);
  __resizeTimerTech = setTimeout(() => {
    refreshColumnLayout();
    // limpar margins caso existam
    updateColumnMargins();
  }, 160);
});

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