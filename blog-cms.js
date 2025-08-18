// ================================
// INTEGRAÇÃO BLOG COM NETLIFY CMS - VERSÃO CORRIGIDA
// ================================

class BlogCMS {
    constructor() {
        this.posts = [];
        this.fallbackCards = null;
    }

    async init() {
        console.log('🚀 Iniciando BlogCMS...');
        
        // Guardar cards originais como fallback
        this.saveFallbackCards();
        
        // Carregar posts do CMS
        await this.loadPosts();
        
        // Renderizar posts
        this.renderPosts();
    }

    saveFallbackCards() {
        const grids = document.querySelectorAll('.grid.grid-3');
        if (grids.length > 0) {
            this.fallbackCards = grids[0].innerHTML;
            console.log('💾 Cards fallback salvos');
        }
    }

    async loadPosts() {
        try {
            console.log('📡 Carregando posts do CMS...');
            
            // Método 1: Tentar carregar posts.json (arquivo consolidado)
            try {
                const response = await fetch('./posts.json');
                if (response.ok) {
                    const data = await response.json();
                    this.posts = data.posts || [];
                    console.log('✅ Posts carregados de posts.json:', this.posts.length);
                    return;
                }
            } catch (e) {
                console.log('📄 posts.json não encontrado, tentando método alternativo...');
            }

            // Método 2: Simular posts para teste
            console.log('🧪 Criando posts de exemplo para teste...');
            
            // Verificar se existem posts no localStorage (criados pelo CMS)
            const savedPosts = localStorage.getItem('netlify-cms-posts');
            if (savedPosts) {
                this.posts = JSON.parse(savedPosts);
                console.log('✅ Posts carregados do localStorage:', this.posts.length);
                return;
            }

            // Método 3: Posts de exemplo para demonstração
            this.posts = [
                {
                    titulo: "Bem-vindos ao nosso novo blog!",
                    data: new Date().toISOString(),
                    autor: "Equipe FISIO",
                    imagem: "./imagens/blog-exemplo.jpg",
                    resumo: "Confira nosso novo blog com dicas de fisioterapia e novidades da clínica.",
                    categoria: "novidades",
                    publicado: true,
                    conteudo: "Este é um exemplo de como os posts do Netlify CMS aparecerão no site."
                },
                {
                    titulo: "Dicas para prevenção de lesões",
                    data: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
                    autor: "Dr. João Silva",
                    imagem: "./imagens/hero-2.jpg",
                    resumo: "Aprenda técnicas simples para evitar lesões durante a prática esportiva.",
                    categoria: "esportiva",
                    publicado: true,
                    conteudo: "Prevenção é sempre melhor que tratamento..."
                },
                {
                    titulo: "Novos equipamentos na clínica",
                    data: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
                    autor: "Equipe FISIO",
                    imagem: "./imagens/hero-3.jpg",
                    resumo: "Investimos em tecnologia de ponta para melhor atendimento aos pacientes.",
                    categoria: "tecnologia",
                    publicado: true,
                    conteudo: "Nossos novos equipamentos permitem tratamentos mais eficazes..."
                }
            ];
            
            console.log('✅ Posts de exemplo criados:', this.posts.length);
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts:', error);
            this.posts = [];
        }
    }

    renderPosts() {
        const sections = document.querySelectorAll('.section .grid.grid-3');
        
        if (this.posts.length === 0) {
            console.log('📄 Nenhum post disponível, mantendo conteúdo estático');
            return;
        }

        // Ordenar posts por data (mais recentes primeiro)
        const sortedPosts = this.posts
            .filter(post => post.publicado !== false)
            .sort((a, b) => new Date(b.data) - new Date(a.data));

        console.log('📝 Renderizando', sortedPosts.length, 'posts');

        // Categorizar posts
        const categorizedPosts = {
            clinica: sortedPosts.filter(p => ['novidades', 'clinica'].includes(p.categoria)),
            fisioterapia: sortedPosts.filter(p => ['esportiva', 'dicas'].includes(p.categoria)),
            tratamentos: sortedPosts.filter(p => ['reabilitacao', 'pilates', 'tecnologia'].includes(p.categoria))
        };

        // Renderizar cada seção
        sections.forEach((section, index) => {
            let posts;
            let badgeClass = 'badge-primary';
            
            switch(index) {
                case 0: // Notícias da Clínica
                    posts = categorizedPosts.clinica.slice(0, 6);
                    if (posts.length === 0) posts = sortedPosts.slice(0, 3); // fallback
                    badgeClass = 'badge-primary';
                    break;
                case 1: // Novidades Fisioterapia
                    posts = categorizedPosts.fisioterapia.slice(0, 3);
                    if (posts.length === 0) posts = sortedPosts.slice(1, 4); // fallback
                    badgeClass = 'badge-accent';
                    break;
                case 2: // Notícias Tratamentos
                    posts = categorizedPosts.tratamentos.slice(0, 3);
                    if (posts.length === 0) posts = sortedPosts.slice(2, 5); // fallback
                    badgeClass = 'badge-outline';
                    break;
                default:
                    posts = sortedPosts.slice(0, 3);
            }

            if (posts.length > 0) {
                section.innerHTML = posts.map(post => this.createPostCard(post, badgeClass)).join('');
                console.log(`✅ Seção ${index + 1} renderizada com ${posts.length} posts`);
            }
        });
    }

    createPostCard(post, badgeClass = 'badge-primary') {
        const categoryLabels = {
            'novidades': 'Clínica',
            'esportiva': 'Fisioterapia',
            'reabilitacao': 'Tratamentos',
            'pilates': 'Pilates',
            'dicas': 'Dicas',
            'tecnologia': 'Tecnologia'
        };

        const categoryLabel = categoryLabels[post.categoria] || 'Notícias';
        const imageUrl = post.imagem || './imagens/hero-1.jpg';
        const resumo = post.resumo || post.conteudo?.substring(0, 120) + '...' || 'Confira este post em nosso blog.';
        const titulo = post.titulo || 'Post sem título';
        
        // Formatar data
        let dataFormatada = 'Recente';
        if (post.data) {
            try {
                const date = new Date(post.data);
                dataFormatada = date.toLocaleDateString('pt-BR');
            } catch (e) {
                dataFormatada = 'Recente';
            }
        }

        return `
            <article class="card fade-in">
                <div class="card-image">
                    <img src="${imageUrl}" alt="${titulo}" 
                         onerror="this.style.display='none'; this.parentElement.setAttribute('data-placeholder', 'Imagem do Post');"
                         onload="this.style.display='block';">
                </div>
                <div class="card-body">
                    <span class="badge ${badgeClass}">${categoryLabel}</span>
                    <h4>${titulo}</h4>
                    <p>${resumo}</p>
                    <small class="post-meta">
                        <i class="fas fa-calendar"></i> ${dataFormatada}
                        ${post.autor ? `• <i class="fas fa-user"></i> ${post.autor}` : ''}
                    </small>
                </div>
            </article>
        `;
    }

    // Método para adicionar post (para ser chamado pelo CMS)
    addPost(post) {
        this.posts.unshift(post);
        localStorage.setItem('netlify-cms-posts', JSON.stringify(this.posts));
        this.renderPosts();
        console.log('✅ Post adicionado:', post.titulo);
    }

    // Método para recarregar posts
    async reload() {
        console.log('🔄 Recarregando posts...');
        this.posts = [];
        await this.loadPosts();
        this.renderPosts();
    }
}

// ================================
// INICIALIZAÇÃO
// ================================

let blogCMS;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM carregado, inicializando BlogCMS...');
    
    blogCMS = new BlogCMS();
    blogCMS.init();
    
    // Expor globalmente para debug
    window.blogCMS = blogCMS;
    
    console.log('💡 Para recarregar posts: window.blogCMS.reload()');
    console.log('💡 Para adicionar post: window.blogCMS.addPost({titulo: "Test", ...})');
});

// ================================
// CSS ADICIONAL
// ================================

const style = document.createElement('style');
style.textContent = `
    .post-meta {
        color: #666;
        font-size: 0.85rem;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .post-meta i {
        color: #3498db;
    }
    
    .card-image[data-placeholder] {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-weight: 500;
        height: 200px;
    }
    
    .card-image[data-placeholder]:before {
        content: attr(data-placeholder);
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// ================================
// NETLIFY CMS INTEGRATION HOOKS
// ================================

// Escutar eventos do Netlify CMS (se disponível)
if (window.netlifyIdentity) {
    window.netlifyIdentity.on('login', () => {
        console.log('👤 Usuário logado no CMS');
    });
}

// Hook para quando posts forem salvos pelo CMS
window.addEventListener('message', (event) => {
    if (event.data.type === 'netlify-cms-post-saved') {
        console.log('📝 Post salvo pelo CMS, recarregando...');
        if (blogCMS) {
            blogCMS.reload();
        }
    }
});