// COMPONENTS.JS - SISTEMA DE IMPORTAÇÑƒO
// ================================

class SiteComponents {
  constructor() {
    this.init();
  }

  init() {
    // Aguarda o DOM carregar
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.loadComponents()
      );
    } else {
      this.loadComponents();
    }
  }

  loadComponents() {
    this.loadHeader();
    this.loadFooter();
    this.initDropdown();
    this.initMobileMenu();
    this.initProfissionaisToggle();
    this.initScrollEffects();
    this.initSmoothScrolling();
  }

  loadHeader() {
    const headerHTML = `
       <header class="header">
            <div class="container">
                <div class="header-container">
                    <div class="logo">
                        <div class="logo-placeholder">
                            <a href="/"><img src="/imagens/logo.png" alt="Logo FISIO"></a>
                        </div>
                        <div class="logo-text">
                            <h1>FISIO</h1>
                            <p>Excelência em Fisioterapia</p>
                        </div>
                    </div>
                    
                    <nav class="nav">
                        <a href="/index.html">Início</a>
                        <a href="/quem-somos.html">Quem Somos</a>
                        
                        <!-- Dropdown Unidades -->
                        <div class="nav-item">
                            <a href="#" class="nav-dropdown-toggle">Unidades</a>
                            <div class="nav-dropdown">
                                <a href="/unidades/jundiai.html" class="dropdown-item">
                                    <span class="unit-name">Jundiaí</span>
                                </a>
                                <a href="/unidades/itatiba.html" class="dropdown-item">
                                    <span class="unit-name">Itatiba</span>
                                </a>
                                <a href="/unidades/varzea.html" class="dropdown-item">
                                    <span class="unit-name">Várzea Paulista</span>
                                </a>
                                <a class="dropdown-item no-click">
                                    <span class="unit-name">Itupeva <i>(em breve)</i></span>
                                </a>
                            </div>
                        </div>

                         <a href="/tratamentos.html">Tratamentos</a>
                        
                        <a href="/contato.html">Contato</a>
                    </nav>

                    
                    <button class="mobile-menu-toggle" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
            
            <!-- Menu Mobile -->
            <div class="mobile-menu">
                <button class="mobile-menu-close" aria-label="Fechar menu">
                    <i class="fas fa-times"></i>
                </button>
                    <a href="/index.html">Início</a>
                    <a href="/quem-somos.html">Quem Somos</a>
                    <div class="mobile-submenu">
                        <button class="mobile-submenu-toggle">Unidades <i class="fas fa-chevron-down"></i></button>
                        <div class="mobile-submenu-content">
                            <a href="/unidades/jundiai.html">Jundiaí</a>
                            <a href="/unidades/itatiba.html">Itatiba</a>
                            <a href="/unidades/varzea.html">Várzea Paulista</a>
                        </div>
                    </div>
                    <a href="/tratamentos.html">Tratamentos</a>
                    <a href="/contato.html">Contato</a>
                    <a href="#" class="btn btn-primary">
                        <i class="fas fa-calendar-alt"></i>
                        Agendar Consulta
                    </a>
            </div>
        </header>
    `;

    // Injeta o header no início do body
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
     this.applyHeaderSpacing();
  }
     // ADICIONAR: Novo método
    applyHeaderSpacing() {
         setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            const headerHeight = header.offsetHeight;
            document.body.style.paddingTop = `${headerHeight}px`;
            
            // ADICIONAR: Fix para Safari mobile
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const heroSections = document.querySelectorAll('.hero-unidade, .hero');
            
            heroSections.forEach(hero => {
                hero.style.marginTop = '0';
                hero.style.transform = 'translateZ(0)'; // Force GPU
                
                if (isIOS) {
                    // Fix para viewport do iOS
                    hero.style.minHeight = window.innerHeight < 600 ? '400px' : '500px';
                }
            });
        }
    }, 200);
}


    loadFooter() {
        const footerHTML = `
           
              <footer class="footer-new">
                <div class="container">
                  <div class="footer-content">
                    
                    <!-- Coluna Esquerda: Logo + Especialidade -->
                    <div class="footer-col footer-brand">
                      <div class="footer-logo">
                        <a href="/">
                          <img src="/imagens/logo.png" alt="Logo FISIO">
                        </a>
                        <div class="footer-logo-text">
                          <h3>FISIO</h3>
                          <p>Excelência em Fisioterapia</p>
                        </div>
                      </div>
                      <p class="footer-specialty">Traumato-Ortopédica & Desportiva</p>
                    </div>

                    <!-- Coluna Centro: Unidades -->
                    <div class="footer-col footer-units">
                      <h4>Nossas Unidades</h4>
                      <ul>
                        <li><a href="/jundiai.html">Jundiaí</a></li>
                        <li><a href="/itatiba.html">Itatiba</a></li>
                        <li><a href="/varzea.html">Várzea Paulista</a></li>
                      </ul>
                    </div>

                    <!-- Coluna Direita: Social -->
                    <div class="footer-col footer-social">
                      <h4>Siga-nos</h4>
                      <div class="footer-social-icons">
                        <a href="https://instagram.com/fisioclinica" target="_blank" rel="noopener" aria-label="Instagram">
                          <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="js-open-whatsapp-modal" aria-label="WhatsApp">
                          <i class="fab fa-whatsapp"></i>
                        </a>
                      </div>
                    </div>

                  </div>

                  <!-- Bottom -->
                  <div class="footer-bottom">
                    <p>&copy; 2025 FISIO - Todos os direitos reservados.</p>
                  </div>
                </div>
              </footer>

              <!-- WhatsApp Flutuante -->
              <a href="#" class="whatsapp-float js-open-whatsapp-modal" aria-label="Falar no WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a>

        `;

    // Injeta o footer no final do body
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  }

  initDropdown() {
    setTimeout(() => {
      const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
      const navItems = document.querySelectorAll(".nav-item");

      dropdownToggles.forEach((toggle, index) => {
        const navItem = navItems[index];

        // Prevenir link padrão
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          navItem.classList.toggle("active");
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener("click", (e) => {
          if (!navItem.contains(e.target)) {
            navItem.classList.remove("active");
          }
        });
      });
    }, 100);
  }

  initMobileMenu() {
    setTimeout(() => {
      const mobileToggle = document.querySelector(".mobile-menu-toggle");
      const mobileMenu = document.querySelector(".mobile-menu");
      const mobileLinks = document.querySelectorAll(".mobile-menu a");

      if (!mobileToggle || !mobileMenu) return;

      // Botão de fechar
      const closeButton = document.querySelector(".mobile-menu-close");

      if (closeButton) {
        closeButton.addEventListener("click", () => {
          mobileToggle.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      }

      // Toggle do submenu mobile
      const submenuToggle = document.querySelector(".mobile-submenu-toggle");
      const submenu = document.querySelector(".mobile-submenu");

      if (submenuToggle) {
        submenuToggle.addEventListener("click", () => {
          submenu.classList.toggle("active");
          const icon = submenuToggle.querySelector("i");
          icon.classList.toggle("fa-chevron-down");
          icon.classList.toggle("fa-chevron-up");
        });
      }

      // Toggle do menu mobile
      mobileToggle.addEventListener("click", () => {
        mobileToggle.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });

      // Fechar menu ao clicar em um link
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileToggle.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      });

      // Fechar menu ao redimensionar janela
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          mobileToggle.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.classList.remove("menu-open");
        }
      });
    }, 100);
  }

  initProfissionaisToggle() {
    // Toggle 'ver mais' para cards de profissionais
    setTimeout(() => {
      const toggles = document.querySelectorAll('.profissional-toggle');
      if (!toggles.length) return;

      toggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const info = btn.closest('.profissional-info');
          if (!info) return;

          // Fechar outros cards abertos — garantir apenas um expandido por vez
          const allInfos = document.querySelectorAll('.profissional-info.expanded');
          allInfos.forEach(other => {
            if (other === info) return;
            other.classList.remove('expanded');
            const otherBtn = other.querySelector('.profissional-toggle');
            if (otherBtn) {
              otherBtn.setAttribute('aria-expanded', 'false');
              otherBtn.textContent = 'Ver mais';
            }
          });

          const expanded = btn.getAttribute('aria-expanded') === 'true';
          info.classList.toggle('expanded', !expanded);
          btn.setAttribute('aria-expanded', String(!expanded));
          btn.textContent = expanded ? 'Ver mais' : 'Ver menos';
        });
      });
    }, 100);
  }

  initScrollEffects() {
    setTimeout(() => {
      const header = document.querySelector(".header");
      if (!header) return;

      let lastScrollTop = 0;

      window.addEventListener("scroll", () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        // Efeito de transparência no header
        if (scrollTop > 100) {
          header.style.background =
            "linear-gradient(135deg, rgba(26, 54, 93, 0.95) 0%, rgba(43, 119, 173, 0.95) 50%, rgba(77, 166, 217, 0.95) 100%)";
          header.style.backdropFilter = "blur(10px)";
        } else {
          header.style.background =
            "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-medium) 50%, var(--primary-light) 100%)";
          header.style.backdropFilter = "none";
        }

        lastScrollTop = scrollTop;
      });
    }, 100);
  }

  initSmoothScrolling() {
    setTimeout(() => {
      // Smooth scrolling para links internos
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
    }, 100);
  }
}

// Inicializa os componentes
new SiteComponents();

(function() {
  const script = document.createElement('script');
  script.src = 'components/whatsapp-modal.js';
  script.async = true;
  document.head.appendChild(script);
})();