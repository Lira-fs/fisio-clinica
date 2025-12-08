// ================================
        // SLIDESHOW REUTILIZÁVEL
        // ================================
        function initSlideshow(slideshowId, dotsContainerId, autoplayInterval = 3000) {
            const slideshowElement = document.getElementById(slideshowId);
            const dotsContainer = document.getElementById(dotsContainerId);
            
            if (!slideshowElement) return;

            const slides = slideshowElement.querySelectorAll('.slideshow-item');
            if (slides.length === 0) return;

            let currentSlide = 0;

            // Criar dots
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `slideshow-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.slideshow-dot');

            function goToSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                slides[index].classList.add('active');
                dots[index].classList.add('active');
                currentSlide = index;
            }

            function nextSlide() {
                const next = (currentSlide + 1) % slides.length;
                goToSlide(next);
            }

            // Auto-play
            setInterval(nextSlide, autoplayInterval);
        }

        // Inicializar slideshows
        document.addEventListener('DOMContentLoaded', () => {
            initSlideshow('pilates-slideshow', 'pilates-dots');
            // slideshow da seção de avaliação (desktop)
            initSlideshow('avaliacao-slideshow', 'avaliacao-dots', 3500);
            // slideshow para mobile (slot dentro do conteúdo)
            initSlideshow('avaliacao-slideshow-mobile', 'avaliacao-dots-mobile', 3500);
        });

        // Animações de scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Aplicar animações a elementos fade-in
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Scroll suave para âncoras
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animação de hover nos cards de profissionais
        document.querySelectorAll('.profissional-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Funcionalidade da galeria (placeholder para lightbox)
        document.querySelectorAll('.galeria-item').forEach(item => {
            item.addEventListener('click', function() {
                // Aqui seria implementado um lightbox
                console.log('Abrir imagem em lightbox');
            });
        });

        // Funcionalidade do vídeo (placeholder)
        document.querySelector('.video-placeholder')?.addEventListener('click', function() {
            // Aqui seria implementado o player de vídeo
            console.log('Reproduzir vídeo institucional');
        });