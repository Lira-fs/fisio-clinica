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
    this.initScrollEffects();
    this.initSmoothScrolling();
    this.fixDevicePixelRatio();
  }

  loadHeader() {
    const headerHTML = `
       <header class="header">
            <div class="container">
                <div class="header-container">
                    <div class="logo">
                        <div class="logo-placeholder">
                            <img src="/imagens/logo.jpeg" alt="Logo FISIO">
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
                            </div>
                        </div>

                         <a href="/tratamentos.html">Tratamentos</a>

                          <a href="/blog.html">Blog</a>
                        
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
                    <a href="/blog.html">Blog</a>
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
           <footer id="contato" class="footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-section">
                            <div class="logo mb-md">
                                <div class="logo-placeholder">
                                    <img src="/imagens/logo.jpeg" alt="Logo FISIO">
                                </div>
                                <div class="logo-text">
                                    <h3>FISIO</h3>
                                    <p>Excelência em Fisioterapia</p>
                                </div>
                            </div>
                            <p>Transformando vidas na região com profissionais qualificados, tecnologia de ponta e as mais modernas técnicas de fisioterapia em nossas 4 unidades especializadas.</p>
                            <div class="social-links">
                                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                                <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Nossas Unidades</h3>
                            <ul>
                                <li><strong>Jundiaí</strong> - Unidade Principal</li>
                                <li><strong>Itatiba</strong> - Esportiva</li>
                                <li><strong>Várzea Paulista</strong> - Reabilitação</li>
                                <li><strong>Nova Unidade</strong> - Em breve</li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Contato</h3>
                            <p><i class="fas fa-phone"></i> (11) 99999-9999</p>
                            <p><i class="fas fa-envelope"></i> contato@fisioclinica.com.br</p>
                            <p><i class="fas fa-clock"></i> Seg-Sex: 7h às 19h<br>Sáb: 8h às 13h</p>
                            <a href="posts.html">
                                <p id="editPosts" style="cursor: pointer;">
                                    <i class="fas fa-edit"></i> Edição de Posts
                                </p>
                            </a>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Especialidades</h3>
                            <ul>
                                <li><a href="#">Fisioterapia Esportiva</a></li>
                                <li><a href="#">Reabilitação Ortopédica</a></li>
                                <li><a href="#">Pilates Clínico</a></li>
                                <li><a href="#">Terapia Manual</a></li>
                                <li><a href="#">Dry Needling</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; 2025 FISIO - Clínica de Fisioterapia Especializada. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
            
            <!-- WhatsApp Flutuante -->
            <a href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os serviços da Clínica FISIO." 
               class="whatsapp-float" 
               target="_blank" 
               aria-label="Falar no WhatsApp">
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

  fixDevicePixelRatio() {
        if (window.devicePixelRatio && window.devicePixelRatio !== 1) {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
            }
            
            // Force CSS pixel consistency
            document.documentElement.style.zoom = `${1 / window.devicePixelRatio}`;
        }
    }
    
}

// Inicializa os componentes
new SiteComponents();
