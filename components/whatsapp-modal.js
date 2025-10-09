/**
 * WhatsApp Modal - Seleção de Unidades
 * Mobile-first, objetivo e direto
 */

(function() {
  'use strict';

  // Dados das unidades
  const UNIDADES = [
    {
      nome: 'Jundiaí',
      telefone: '5511111111111',
      mensagem: 'Olá! Gostaria de agendar uma consulta na unidade de Jundiaí.'
    },
    {
      nome: 'Itatiba',
      telefone: '5511222222222',
      mensagem: 'Olá! Gostaria de agendar uma consulta na unidade de Itatiba.'
    },
    {
      nome: 'Várzea Paulista',
      telefone: '5511333333333',
      mensagem: 'Olá! Gostaria de agendar uma consulta na unidade de Várzea Paulista.'
    }
  ];

  // Estilos do modal
  const STYLES = `
    <style>
      /* Overlay */
      .whatsapp-modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .whatsapp-modal-overlay.active {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
      }

      /* Container do Modal */
      .whatsapp-modal {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 400px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px 20px;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .whatsapp-modal-overlay.active .whatsapp-modal {
        transform: scale(1);
      }

      /* Botão Fechar */
      .whatsapp-modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: #666;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .whatsapp-modal-close:hover {
        background: #f0f0f0;
        color: #333;
      }

      /* Título */
      .whatsapp-modal-title {
        font-size: 20px;
        font-weight: 700;
        color: #1a237e;
        text-align: center;
        margin: 0 0 24px 0;
        padding-right: 20px;
      }

      /* Grid de Unidades */
      .whatsapp-modal-units {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Card da Unidade */
      .whatsapp-unit-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
      }

      .whatsapp-unit-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
      }

      .whatsapp-unit-card:active {
        transform: translateY(0);
      }

      /* Nome da Unidade */
      .whatsapp-unit-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        text-align: left;
        margin: 0;
      }

      /* Ícone WhatsApp */
      .whatsapp-unit-icon {
        font-size: 32px;
        color: white;
        flex-shrink: 0;
      }

      /* Responsivo Desktop */
      @media (min-width: 768px) {
        .whatsapp-modal {
          max-width: 500px;
          padding: 32px 28px;
        }

        .whatsapp-modal-title {
          font-size: 24px;
          margin-bottom: 28px;
        }

        .whatsapp-unit-card {
          padding: 24px;
        }

        .whatsapp-unit-name {
          font-size: 20px;
        }

        .whatsapp-unit-icon {
          font-size: 36px;
        }
      }

      /* Animação de entrada */
      @keyframes modalFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* Scroll suave */
      .whatsapp-modal::-webkit-scrollbar {
        width: 6px;
      }

      .whatsapp-modal::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .whatsapp-modal::-webkit-scrollbar-thumb {
        background: #25D366;
        border-radius: 10px;
      }

      .whatsapp-modal::-webkit-scrollbar-thumb:hover {
        background: #128C7E;
      }
    </style>
  `;

  // HTML do Modal
  function criarModalHTML() {
    const unidadesHTML = UNIDADES.map(unidade => `
      <a 
        href="https://wa.me/${unidade.telefone}?text=${encodeURIComponent(unidade.mensagem)}" 
        class="whatsapp-unit-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="whatsapp-unit-name">${unidade.nome}</span>
        <i class="fab fa-whatsapp whatsapp-unit-icon"></i>
      </a>
    `).join('');

    return `
      <div class="whatsapp-modal-overlay" id="whatsappModalOverlay">
        <div class="whatsapp-modal">
          <button class="whatsapp-modal-close" id="whatsappModalClose" aria-label="Fechar">
            ×
          </button>
          <h2 class="whatsapp-modal-title">Escolha sua unidade</h2>
          <div class="whatsapp-modal-units">
            ${unidadesHTML}
          </div>
        </div>
      </div>
    `;
  }

  // Injetar estilos e HTML no documento
  function injetarModal() {
    // Adicionar estilos
    document.head.insertAdjacentHTML('beforeend', STYLES);
    
    // Adicionar HTML do modal
    document.body.insertAdjacentHTML('beforeend', criarModalHTML());
  }

  // Abrir modal
  function abrirModal() {
    const overlay = document.getElementById('whatsappModalOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
  }

  // Fechar modal
  function fecharModal() {
    const overlay = document.getElementById('whatsappModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Restaurar scroll
    }
  }

  // Event Listeners
  function bindEvents() {
    const overlay = document.getElementById('whatsappModalOverlay');
    const closeBtn = document.getElementById('whatsappModalClose');

    // Fechar ao clicar no botão X
    if (closeBtn) {
      closeBtn.addEventListener('click', fecharModal);
    }

    // Fechar ao clicar no overlay (fundo escuro)
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          fecharModal();
        }
      });
    }

    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        fecharModal();
      }
    });

    // Adicionar event listener em todos os botões com classe específica
    document.addEventListener('click', function(e) {
      if (e.target.closest('.js-open-whatsapp-modal')) {
        e.preventDefault();
        abrirModal();
      }
    });
  }

  // Inicializar quando DOM estiver pronto
  function inicializar() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        injetarModal();
        bindEvents();
      });
    } else {
      injetarModal();
      bindEvents();
    }
  }

  // Expor funções globalmente (para uso manual se necessário)
  window.abrirModalWhatsApp = abrirModal;
  window.fecharModalWhatsApp = fecharModal;

  // Iniciar
  inicializar();

})();