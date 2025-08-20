// blog.js - Sistema de carregamento de posts do blog
// ====================================================

class BlogManager {
    constructor() {
        this.posts = [];
        this.baseUrl = window.location.origin;
        this.postsFolder = '/posts';
        this.maxPostsPerCategory = 3;
        
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando Blog Manager...');
        try {
            await this.loadPosts();
            this.renderAllCategories();
        } catch (error) {
            console.error('❌ Erro ao carregar posts:', error);
            this.showErrorMessage();
        }
    }

    async loadPosts() {
        try {
            // Tentar carregar posts do GitHub/Netlify
            const posts = await this.fetchPostsFromNetlify();
            
            if (posts && posts.length > 0) {
                this.posts = posts;
                console.log(`✅ ${posts.length} posts carregados com sucesso`);
            } else {
                // Fallback para posts de exemplo
                console.log('⚠️ Nenhum post encontrado, carregando posts de exemplo');
                this.posts = this.getFallbackPosts();
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts, usando fallback:', error);
            this.posts = this.getFallbackPosts();
        }
    }

    async fetchPostsFromNetlify() {
        try {
            // Usar a API do Netlify para buscar arquivos da pasta posts
            const response = await fetch(`${this.baseUrl}/.netlify/functions/get-posts`);
            
            if (response.ok) {
                const posts = await response.json();
                return this.processPosts(posts);
            }
            
            // Fallback: tentar buscar diretamente os arquivos (se estiverem públicos)
            return await this.fetchPostsDirectly();
            
        } catch (error) {
            console.warn('Erro ao buscar posts via Netlify:', error);
            return await this.fetchPostsDirectly();
        }
    }

    async fetchPostsDirectly() {
        // Lista de posts conhecidos (pode ser expandida dinamicamente)
        const knownPosts = [
            '2025-01-15-nova-tecnica-reabilitacao',
            '2025-01-14-fisioterapia-esportiva-avancada',
            '2025-01-13-pilates-clinico-beneficios',
            '2025-01-12-tratamentos-personalizados',
            '2025-01-11-tecnologia-fisioterapia',
            '2025-01-10-prevencao-lesoes-esportivas'
        ];

        const posts = [];

        for (const postSlug of knownPosts) {
            try {
                const response = await fetch(`${this.postsFolder}/${postSlug}.md`);
                if (response.ok) {
                    const content = await response.text();
                    const post = this.parseMarkdownPost(content, postSlug);
                    if (post) {
                        posts.push(post);
                    }
                }
            } catch (error) {
                console.warn(`Erro ao carregar post ${postSlug}:`, error);
            }
        }

        return posts;
    }

    parseMarkdownPost(content, slug) {
        try {
            // Separar frontmatter do conteúdo
            const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
            
            if (!frontmatterMatch) {
                console.warn('Formato de post inválido:', slug);
                return null;
            }

            const frontmatter = this.parseFrontmatter(frontmatterMatch[1]);
            const body = frontmatterMatch[2];

            return {
                slug,
                ...frontmatter,
                body,
                date: new Date(frontmatter.data || Date.now())
            };
        } catch (error) {
            console.error('Erro ao fazer parse do post:', error);
            return null;
        }
    }

    parseFrontmatter(yamlContent) {
        const data = {};
        const lines = yamlContent.split('\n');
        
        for (const line of lines) {
            const match = line.match(/^([^:]+):\s*(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                
                // Remover aspas se existirem
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }
                
                data[key] = value;
            }
        }
        
        return data;
    }

    processPosts(rawPosts) {
        return rawPosts
            .map(post => ({
                ...post,
                date: new Date(post.data || post.date || Date.now())
            }))
            .sort((a, b) => b.date - a.date); // Mais recentes primeiro
    }

    getFallbackPosts() {
        return [
            {
                slug: 'nova-tecnica-reabilitacao',
                titulo: 'Nova Técnica de Reabilitação Acelera Recuperação',
                resumo: 'Descubra como nossa nova abordagem terapêutica está revolucionando o processo de reabilitação de nossos pacientes.',
                categoria: 'clinica',
                data: new Date('2025-01-15'),
                autor: 'Dr. Ricardo Silva',
                imagem: '/imagens/blog/reabilitacao-nova.jpg',
                body: 'Conteúdo completo do post sobre nova técnica...'
            },
            {
                slug: 'fisioterapia-esportiva-avancada',
                titulo: 'Fisioterapia Esportiva: Técnicas Avançadas para Atletas',
                resumo: 'Conheça as técnicas mais modernas utilizadas no tratamento e prevenção de lesões esportivas em nossa clínica.',
                categoria: 'fisioterapia',
                data: new Date('2025-01-14'),
                autor: 'Dra. Ana Costa',
                imagem: '/imagens/blog/fisioterapia-esportiva.jpg',
                body: 'Conteúdo completo sobre fisioterapia esportiva...'
            },
            {
                slug: 'pilates-clinico-beneficios',
                titulo: 'Pilates Clínico: Benefícios Comprovados',
                resumo: 'Entenda como o Pilates Clínico pode transformar sua postura, fortalecer seu core e melhorar sua qualidade de vida.',
                categoria: 'tratamentos',
                data: new Date('2025-01-13'),
                autor: 'Dra. Patricia Mendes',
                imagem: '/imagens/blog/pilates-clinico.jpg',
                body: 'Conteúdo completo sobre Pilates Clínico...'
            },
            {
                slug: 'unidade-itatiba-expansao',
                titulo: 'Expansão: Nova Unidade em Itatiba',
                resumo: 'Nossa clínica cresce! Conheça nossa nova unidade em Itatiba, equipada com tecnologia de ponta para seu tratamento.',
                categoria: 'clinica',
                data: new Date('2025-01-12'),
                autor: 'Equipe FISIO',
                imagem: '/imagens/blog/unidade-itatiba.jpg',
                body: 'Conteúdo sobre a nova unidade...'
            },
            {
                slug: 'exercicios-prevencao-lesoes',
                titulo: 'Exercícios para Prevenção de Lesões',
                resumo: 'Série de exercícios simples que você pode fazer em casa para prevenir lesões e fortalecer seu corpo.',
                categoria: 'fisioterapia',
                data: new Date('2025-01-11'),
                autor: 'Dr. Marcos Lima',
                imagem: '/imagens/blog/exercicios-prevencao.jpg',
                body: 'Conteúdo sobre exercícios preventivos...'
            },
            {
                slug: 'tratamentos-personalizados',
                titulo: 'Tratamentos Personalizados: O Futuro da Fisioterapia',
                resumo: 'Como desenvolvemos planos de tratamento únicos para cada paciente, considerando suas necessidades específicas.',
                categoria: 'tratamentos',
                data: new Date('2025-01-10'),
                autor: 'Dra. Lucia Santos',
                imagem: '/imagens/blog/tratamentos-personalizados.jpg',
                body: 'Conteúdo sobre tratamentos personalizados...'
            }
        ];
    }

    renderAllCategories() {
        this.renderCategoryPosts('clinica', 'clinica-posts');
        this.renderCategoryPosts('fisioterapia', 'fisioterapia-posts');
        this.renderCategoryPosts('tratamentos', 'tratamentos-posts');
    }

    renderCategoryPosts(category, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }

        // Filtrar posts da categoria e pegar os 3 mais recentes
        const categoryPosts = this.posts
            .filter(post => post.categoria === category)
            .slice(0, this.maxPostsPerCategory);

        // Limpar container
        container.innerHTML = '';

        if (categoryPosts.length === 0) {
            container.innerHTML = this.getNoPostsHTML(category);
            return;
        }

        // Renderizar posts
        categoryPosts.forEach(post => {
            const postElement = this.createPostCard(post);
            container.appendChild(postElement);
        });
    }

    createPostCard(post) {
        const article = document.createElement('article');
        article.className = 'post-card fade-in';
        article.addEventListener('click', () => this.openPost(post));

        article.innerHTML = `
            <div class="post-content">
                <span class="post-category ${post.categoria}">${this.getCategoryLabel(post.categoria)}</span>
                <h3 class="post-title">${post.titulo}</h3>
                <p class="post-summary">${post.resumo}</p>
                <div class="post-date">
                    <i class="fas fa-calendar"></i>
                    ${this.formatDate(post.data)}
                </div>
            </div>
        `;

        return article;
    }

    getCategoryLabel(category) {
        const labels = {
            'clinica': 'Clínica',
            'fisioterapia': 'Fisioterapia',
            'tratamentos': 'Tratamentos'
        };
        return labels[category] || category;
    }

    formatDate(date) {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    getNoPostsHTML(category) {
        const categoryLabels = {
            'clinica': 'da Clínica',
            'fisioterapia': 'de Fisioterapia',
            'tratamentos': 'de Tratamentos'
        };

        return `
            <div class="no-posts">
                <i class="fas fa-newspaper"></i>
                <h4>Nenhum post encontrado</h4>
                <p>Ainda não há notícias ${categoryLabels[category]} publicadas.</p>
                <small>Novos conteúdos serão adicionados em breve!</small>
            </div>
        `;
    }

    openPost(post) {
        // Criar modal ou página de post
        this.showPostModal(post);
    }

    showPostModal(post) {
        // Criar modal overlay
        const modal = document.createElement('div');
        modal.className = 'post-modal-overlay';
        modal.innerHTML = `
            <div class="post-modal">
                <button class="post-modal-close" aria-label="Fechar">
                    <i class="fas fa-times"></i>
                </button>
                <div class="post-modal-content">
                    <div class="post-modal-header">
                        ${post.imagem ? 
                            `<img src="${post.imagem}" alt="${post.titulo}" class="post-modal-image">` : 
                            `<div class="post-modal-image-placeholder"><i class="fas fa-image"></i></div>`
                        }
                        <div class="post-modal-meta">
                            <span class="post-category ${post.categoria}">${this.getCategoryLabel(post.categoria)}</span>
                            <h1>${post.titulo}</h1>
                            <div class="post-modal-info">
                                <span class="post-author">
                                    <i class="fas fa-user"></i>
                                    ${post.autor || 'Equipe FISIO'}
                                </span>
                                <span class="post-date">
                                    <i class="fas fa-calendar"></i>
                                    ${this.formatDate(post.data)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="post-modal-body">
                        <div class="post-summary-modal">${post.resumo}</div>
                        <div class="post-content-modal">${this.parseMarkdown(post.body)}</div>
                    </div>
                    <div class="post-modal-footer">
                        <a href="https://wa.me/5511999999999?text=Olá! Li o post '${post.titulo}' e gostaria de saber mais." 
                           class="btn btn-success" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            Fale Conosco
                        </a>
                        <button class="btn btn-secondary" onclick="this.closest('.post-modal-overlay').remove()">
                            <i class="fas fa-arrow-left"></i>
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Adicionar eventos
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        modal.querySelector('.post-modal-close').addEventListener('click', () => {
            modal.remove();
        });

        // Adicionar ao DOM
        document.body.appendChild(modal);
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        // Restaurar scroll quando modal for removido
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const modalExists = document.querySelector('.post-modal-overlay');
                    if (!modalExists) {
                        document.body.style.overflow = '';
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true });
    }

    parseMarkdown(markdown) {
        if (!markdown) return '<p>Conteúdo em breve...</p>';
        
        // Conversão básica de Markdown para HTML
        let html = markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img src="$2" alt="$1" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');
        
        return `<p>${html}</p>`;
    }

    showErrorMessage() {
        const containers = ['clinica-posts', 'fisioterapia-posts', 'tratamentos-posts'];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Erro ao carregar posts</h4>
                        <p>Não foi possível carregar o conteúdo do blog.</p>
                        <button onclick="location.reload()" class="btn btn-primary btn-sm">
                            <i class="fas fa-sync-alt"></i>
                            Tentar Novamente
                        </button>
                    </div>
                `;
            }
        });
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// CSS adicional para o modal e outros elementos
const additionalStyles = `
<style>
/* Modal do Post */
.post-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    box-sizing: border-box;
}

.post-modal {
    background: var(--white);
    border-radius: var(--radius-xl);
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: var(--shadow-xl);
}

.post-modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.post-modal-close:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
}

.post-modal-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.post-modal-image-placeholder {
    width: 100%;
    height: 300px;
    background: var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-400);
    font-size: 3rem;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.post-modal-meta {
    padding: var(--space-xl);
    border-bottom: 1px solid var(--gray-200);
}

.post-modal-meta h1 {
    font-size: var(--text-2xl);
    color: var(--primary-dark);
    margin: var(--space-md) 0;
}

.post-modal-info {
    display: flex;
    gap: var(--space-lg);
    color: var(--gray-600);
    font-size: var(--text-sm);
}

.post-modal-info span {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
}

.post-modal-body {
    padding: var(--space-xl);
}

.post-summary-modal {
    font-size: var(--text-lg);
    color: var(--gray-700);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-xl);
    padding: var(--space-lg);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    border-left: 4px solid var(--primary-light);
}

.post-content-modal {
    line-height: 1.7;
    color: var(--gray-700);
}

.post-content-modal h1,
.post-content-modal h2,
.post-content-modal h3 {
    color: var(--primary-dark);
    margin-top: var(--space-xl);
    margin-bottom: var(--space-md);
}

.post-content-modal p {
    margin-bottom: var(--space-md);
}

.post-content-modal img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    margin: var(--space-lg) 0;
}

.post-modal-footer {
    padding: var(--space-xl);
    border-top: 1px solid var(--gray-200);
    display: flex;
    gap: var(--space-md);
    justify-content: center;
}

/* Mensagens de erro */
.error-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem 2rem;
    color: var(--gray-600);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    border: 2px dashed var(--gray-300);
}

.error-message i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--accent-orange);
}

.error-message h4 {
    color: var(--gray-800);
    margin-bottom: 0.5rem;
}

/* Responsividade do modal */
@media (max-width: 768px) {
    .post-modal-overlay {
        padding: 10px;
    }
    
    .post-modal {
        max-height: 95vh;
    }
    
    .post-modal-meta,
    .post-modal-body,
    .post-modal-footer {
        padding: var(--space-lg);
    }
    
    .post-modal-footer {
        flex-direction: column;
    }
    
    .post-modal-info {
        flex-direction: column;
        gap: var(--space-sm);
    }
}
</style>
`;