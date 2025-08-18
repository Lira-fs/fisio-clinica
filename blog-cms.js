// ================================
// INTEGRAÇÃO BLOG COM NETLIFY CMS
// ================================

class BlogCMS {
    constructor() {
        this.postsContainer = null;
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
        // Salvar o HTML original como fallback
        const containers = [
            '.section:has(.section-title h3:contains("Notícias da Clínica")) .grid',
            '.section:has(.section-title h3:contains("Novidades Fisioterapia")) .grid',
            '.section:has(.section-title h3:contains("Notícias Tratamentos")) .grid'
        ];

        // Usar seletor mais simples e robusto
        const grids = document.querySelectorAll('.grid.grid-3');
        if (grids.length > 0) {
            this.fallbackCards = grids[0].innerHTML;
            console.log('💾 Cards fallback salvos');
        }
    }

    async loadPosts() {
        try {
            console.log('📡 Carregando posts do CMS...');
            
            // Tentar diferentes endpoints
            const endpoints = [
                '/_data/blog/',
                './admin/posts.json',
                './_data/blog.json'
            ];

            // Método 1: Tentar buscar lista de arquivos
            const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/blog');
            
            if (response.ok) {
                const files = await response.json();
                console.log('📂 Arquivos encontrados:', files.length);
                
                // Carregar cada arquivo de post
                for (const file of files) {
                    if (file.name.endsWith('.json') || file.name.endsWith('.md')) {
                        try {
                            const postResponse = await fetch(file.download_url);
                            const postContent = await postResponse.text();
                            
                            let post;
                            if (file.name.endsWith('.json')) {
                                post = JSON.parse(postContent);
                            } else {
                                // Parse markdown (simplificado)
                                post = this.parseMarkdown(postContent);
                            }
                            
                            post.filename = file.name;
                            this.posts.push(post);
                        } catch (error) {
                            console.warn('⚠️ Erro ao carregar post:', file.name, error);
                        }
                    }
                }
                
                console.log('✅ Posts carregados:', this.posts.length);
            } else {
                throw new Error('Não foi possível acessar o repositório');
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts do CMS:', error);
            console.log('📝 Usando conteúdo estático como fallback');
            this.posts = [];
        }
    }

    parseMarkdown(content) {
        // Parse básico de markdown/frontmatter
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (match) {
            const frontmatter = match[1];
            const body = match[2];
            
            const post = {};
            frontmatter.split('\n').forEach(line => {
                const [key, ...values] = line.split(':');
                if (key && values.length > 0) {
                    post[key.trim()] = values.join(':').trim().replace(/['"]/g, '');
                }
            });
            
            post.conteudo = body;
            return post;
        }
        
        return null;
    }

    renderPosts() {
        // Encontrar containers das seções
        const sections = document.querySelectorAll('.section .grid.grid-3');
        
        if (this.posts.length === 0) {
            console.log('📄 Nenhum post do CMS, mantendo conteúdo estático');
            return;
        }

        // Ordenar posts por data (mais recentes primeiro)
        const sortedPosts = this.posts
            .filter(post => post.publicado !== false)
            .sort((a, b) => new Date(b.data) - new Date(a.data));

        console.log('📝 Renderizando', sortedPosts.length, 'posts');

        // Categorizar posts
        const categorizedPosts = {
            clinica: sortedPosts.filter(p => p.categoria === 'novidades' || p.categoria === 'clinica'),
            fisioterapia: sortedPosts.filter(p => p.categoria === 'esportiva' || p.categoria === 'dicas'),
            tratamentos: sortedPosts.filter(p => p.categoria === 'reabilitacao' || p.categoria === 'pilates' || p.categoria === 'tecnologia')
        };

        // Renderizar cada seção
        sections.forEach((section, index) => {
            let posts;
            let badgeClass = 'badge-primary';
            
            switch(index) {
                case 0: // Notícias da Clínica
                    posts = categorizedPosts.clinica.slice(0, 6);
                    badgeClass = 'badge-primary';
                    break;
                case 1: // Novidades Fisioterapia
                    posts = categorizedPosts.fisioterapia.slice(0, 3);
                    badgeClass = 'badge-accent';
                    break;
                case 2: // Notícias Tratamentos
                    posts = categorizedPosts.tratamentos.slice(0, 3);
                    badgeClass = 'badge-outline';
                    break;
                default:
                    posts = sortedPosts.slice(0, 3);
            }

            if (posts.length > 0) {
                section.innerHTML = posts.map(post => this.createPostCard(post, badgeClass)).join('');
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
        const imageUrl = post.imagem || '/imagens/blog-default.jpg';
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
                <div class="card-image" style="background-image: url('${imageUrl}');">
                    <img src="${imageUrl}" alt="${titulo}" onerror="this.style.display='none'; this.parentElement.setAttribute('data-placeholder', 'Imagem do Post');">
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

    // Método para recarregar posts (útil para desenvolvimento)
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

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM carregado, inicializando BlogCMS...');
    
    const blogCMS = new BlogCMS();
    blogCMS.init();
    
    // Expor globalmente para debug
    window.blogCMS = blogCMS;
    
    console.log('💡 Para recarregar posts: window.blogCMS.reload()');
});

// ================================
// CSS ADICIONAL PARA POSTS CMS
// ================================

// Adicionar estilos dinâmicos
const style = document.createElement('style');
style.textContent = `
    .post-meta {
        color: var(--gray-600, #666);
        font-size: 0.85rem;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .post-meta i {
        color: var(--primary-light, #3498db);
    }
    
    .card-image[data-placeholder] {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-weight: 500;
    }
    
    .card-image[data-placeholder]:before {
        content: attr(data-placeholder);
    }
    
    .badge.badge-primary { background: var(--primary-color, #2c5aa0); }
    .badge.badge-accent { background: var(--accent-color, #e67e22); }
    .badge.badge-outline { 
        background: transparent; 
        border: 2px solid var(--primary-color, #2c5aa0);
        color: var(--primary-color, #2c5aa0);
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