// ================================
// CMS UNIVERSAL - SISTEMA DE PLACEHOLDERS
// Gerencia todos os tipos de conteúdo CMS
// ================================

class UniversalCMS {
    constructor() {
        this.data = {
            blog: [],
            fisioterapeutas: [],
            tratamentos: [],
            estrutura: [],
            unidades: []
        };
        this.isPreviewMode = false;
        this.previewPost = null;
    }

    async init() {
        console.log('🚀 Iniciando Universal CMS...');
        
        // Detectar modo preview
        this.detectPreviewMode();
        
        // Carregar dados
        await this.loadAllData();
        
        // Processar placeholders
        this.processPlaceholders();
        
        // Configurar preview se necessário
        if (this.isPreviewMode) {
            this.setupPreviewMode();
        }
    }

    detectPreviewMode() {
        const urlParams = new URLSearchParams(window.location.search);
        this.isPreviewMode = urlParams.has('preview');
        this.previewPost = urlParams.get('preview');
        
        if (this.isPreviewMode) {
            document.body.classList.add('cms-preview-mode');
            console.log('👁️ Modo Preview ativo:', this.previewPost);
        }
    }

    async loadAllData() {
        console.log('📡 Carregando dados do CMS...');

        // Carregar dados de blog
        await this.loadBlogData();
        
        // TODO: Adicionar outros tipos de dados
        // await this.loadFisioterapeutasData();
        // await this.loadTratamentosData();
        
        console.log('✅ Dados carregados:', {
            blog: this.data.blog.length,
            // fisioterapeutas: this.data.fisioterapeutas.length,
            // tratamentos: this.data.tratamentos.length
        });
    }

    async loadBlogData() {
        try {
            // Método 1: Tentar carregar posts consolidados
            try {
                const response = await fetch('./posts.json');
                if (response.ok) {
                    const data = await response.json();
                    this.data.blog = data.posts || [];
                    console.log('✅ Posts carregados de posts.json:', this.data.blog.length);
                    return;
                }
            } catch (e) {
                console.log('📄 posts.json não encontrado');
            }

            // Método 2: Posts de exemplo + localStorage
            const savedPosts = localStorage.getItem('netlify-cms-blog');
            if (savedPosts) {
                this.data.blog = JSON.parse(savedPosts);
                console.log('✅ Posts carregados do localStorage:', this.data.blog.length);
                return;
            }

            // Método 3: Posts de exemplo
            this.data.blog = this.createExamplePosts();
            console.log('✅ Posts de exemplo criados:', this.data.blog.length);
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts:', error);
            this.data.blog = [];
        }
    }

    createExamplePosts() {
        const now = new Date();
        return [
            {
                titulo: "🎉 Bem-vindos ao nosso novo blog!",
                data: now.toISOString(),
                autor: "Equipe FISIO",
                imagem: "./imagens/hero-1.jpg",
                resumo: "Confira nosso novo blog com dicas de fisioterapia e novidades da clínica.",
                categoria: "novidades",
                publicado: true,
                conteudo: "Este é um exemplo de como os posts do Netlify CMS aparecerão no site. Você pode editar este conteúdo através do painel administrativo.",
                destaque: true
            },
            {
                titulo: "💪 Dicas para prevenção de lesões esportivas",
                data: new Date(now.getTime() - 86400000).toISOString(),
                autor: "Dr. João Silva",
                imagem: "./imagens/hero-2.jpg",
                resumo: "Aprenda técnicas simples para evitar lesões durante a prática esportiva.",
                categoria: "esportiva",
                publicado: true,
                conteudo: "A prevenção é sempre melhor que o tratamento. Confira nossas dicas especializadas."
            },
            {
                titulo: "🔬 Novos equipamentos de última geração",
                data: new Date(now.getTime() - 172800000).toISOString(),
                autor: "Equipe FISIO",
                imagem: "./imagens/hero-3.jpg",
                resumo: "Investimos em tecnologia de ponta para melhor atendimento aos pacientes.",
                categoria: "tecnologia",
                publicado: true,
                conteudo: "Nossos novos equipamentos permitem tratamentos mais eficazes e rápidos."
            },
            {
                titulo: "🧘 Pilates clínico: benefícios e indicações",
                data: new Date(now.getTime() - 259200000).toISOString(),
                autor: "Dra. Maria Santos",
                imagem: "./imagens/hero-4.jpg",
                resumo: "Entenda como o pilates clínico pode transformar sua qualidade de vida.",
                categoria: "pilates",
                publicado: true,
                conteudo: "O pilates clínico é uma ferramenta poderosa na reabilitação e prevenção."
            },
            {
                titulo: "🏥 Reabilitação pós-cirúrgica: o que esperar",
                data: new Date(now.getTime() - 345600000).toISOString(),
                autor: "Dr. Carlos Mendes",
                imagem: "./imagens/hero-1.jpg",
                resumo: "Guia completo sobre o processo de recuperação após cirurgias ortopédicas.",
                categoria: "reabilitacao",
                publicado: true,
                conteudo: "A reabilitação adequada é fundamental para uma recuperação completa."
            }
        ];
    }

    processPlaceholders() {
        console.log('🔄 Processando placeholders...');

        // Processar placeholders de blog
        const blogPlaceholders = document.querySelectorAll('[data-cms="blog-posts"]');
        blogPlaceholders.forEach(placeholder => this.processBlogPlaceholder(placeholder));

        // TODO: Adicionar outros tipos de placeholders
        // const fisioPlaceholders = document.querySelectorAll('[data-cms="fisioterapeutas"]');
        // fisioPlaceholders.forEach(placeholder => this.processFisioPlaceholder(placeholder));
    }

    processBlogPlaceholder(placeholder) {
        const category = placeholder.getAttribute('data-cms-category');
        const limit = parseInt(placeholder.getAttribute('data-cms-limit')) || 3;
        const badgeClass = placeholder.getAttribute('data-cms-badge') || 'badge-primary';
        const section = placeholder.getAttribute('data-cms-section');

        console.log(`📝 Processando seção: ${section}`);

        // Filtrar posts
        let posts = this.data.blog.filter(post => post.publicado !== false);

        // Se estivermos em modo preview de um post específico
        if (this.isPreviewMode && this.previewPost) {
            // Procurar o post específico
            const previewPostData = posts.find(post => 
                post.titulo.toLowerCase().includes(this.previewPost.toLowerCase()) ||
                post.slug === this.previewPost
            );
            
            if (previewPostData) {
                // Mostrar apenas o post em preview
                posts = [previewPostData];
                console.log('👁️ Mostrando preview do post:', previewPostData.titulo);
            }
        }

        // Filtrar por categoria se especificado
        if (category) {
            const categories = category.split(',').map(c => c.trim());
            const categorizedPosts = posts.filter(post => 
                categories.includes(post.categoria)
            );
            
            // Se não há posts da categoria, usar qualquer post como fallback
            posts = categorizedPosts.length > 0 ? categorizedPosts : posts;
        }

        // Ordenar por data (mais recente primeiro)
        posts.sort((a, b) => new Date(b.data) - new Date(a.data));

        // Limitar quantidade
        posts = posts.slice(0, limit);

        // Renderizar posts
        if (posts.length > 0) {
            placeholder.innerHTML = posts.map(post => 
                this.createBlogCard(post, badgeClass)
            ).join('');
            
            console.log(`✅ ${section}: ${posts.length} posts renderizados`);
        } else {
            console.log(`📄 ${section}: mantendo conteúdo fallback`);
        }
    }

    createBlogCard(post, badgeClass = 'badge-primary') {
        const categoryLabels = {
            'novidades': 'Clínica',
            'clinica': 'Clínica',
            'esportiva': 'Fisioterapia',
            'reabilitacao': 'Tratamentos',
            'pilates': 'Pilates',
            'dicas': 'Dicas',
            'tecnologia': 'Tecnologia',
            'tratamentos': 'Tratamentos'
        };

        const categoryLabel = categoryLabels[post.categoria] || 'Notícias';
        const imageUrl = post.imagem || './imagens/hero-1.jpg';
        const resumo = post.resumo || this.truncateText(post.conteudo, 120) || 'Confira este post em nosso blog.';
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

        // Indicador de destaque
        const destaqueClass = post.destaque ? 'post-destaque' : '';
        const destaqueIcon = post.destaque ? '<i class="fas fa-star post-destaque-icon"></i>' : '';

        return `
            <article class="card fade-in cms-generated-card ${destaqueClass}">
                <div class="card-image">
                    <img src="${imageUrl}" alt="${titulo}" 
                         onerror="this.style.display='none'; this.parentElement.setAttribute('data-placeholder', 'Imagem do Post');"
                         onload="this.style.display='block';">
                    ${destaqueIcon}
                </div>
                <div class="card-body">
                    <span class="badge ${badgeClass}">${categoryLabel}</span>
                    <h4>${titulo}</h4>
                    <p>${resumo}</p>
                    <small class="post-meta">
                        <i class="fas fa-calendar"></i> ${dataFormatada}
                        ${post.autor ? `• <i class="fas fa-user"></i> ${post.autor}` : ''}
                        ${this.isPreviewMode ? '<span class="preview-tag">PREVIEW</span>' : ''}
                    </small>
                </div>
            </article>
        `;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    setupPreviewMode() {
        console.log('👁️ Configurando modo preview...');
        
        // Mostrar indicador de preview
        const indicator = document.getElementById('cms-preview-indicator');
        if (indicator) {
            indicator.style.display = 'block';
        }

        // Destacar seções editáveis
        const sections = document.querySelectorAll('[data-cms]');
        sections.forEach(section => {
            section.style.position = 'relative';
        });

        // Adicionar botão de voltar ao admin
        this.addBackToAdminButton();
    }

    addBackToAdminButton() {
        const backButton = document.createElement('div');
        backButton.className = 'cms-back-to-admin';
        backButton.innerHTML = `
            <a href="/admin/" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i>
                Voltar ao Painel
            </a>
        `;
        backButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(backButton);
    }

    // Métodos para desenvolvedores
    addPost(post) {
        this.data.blog.unshift(post);
        localStorage.setItem('netlify-cms-blog', JSON.stringify(this.data.blog));
        this.processPlaceholders();
        console.log('✅ Post adicionado:', post.titulo);
    }

    async reload() {
        console.log('🔄 Recarregando CMS...');
        this.data = { blog: [], fisioterapeutas: [], tratamentos: [], estrutura: [], unidades: [] };
        await this.loadAllData();
        this.processPlaceholders();
        console.log('✅ CMS recarregado');
    }

    getStats() {
        return {
            posts: this.data.blog.length,
            postsPublicados: this.data.blog.filter(p => p.publicado !== false).length,
            categorias: [...new Set(this.data.blog.map(p => p.categoria))],
            isPreviewMode: this.isPreviewMode,
            previewPost: this.previewPost
        };
    }
}

// ================================
// INICIALIZAÇÃO AUTOMÁTICA
// ================================

let universalCMS;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM carregado, iniciando Universal CMS...');
    
    universalCMS = new UniversalCMS();
    universalCMS.init();
    
    // Expor globalmente para debug
    window.universalCMS = universalCMS;
    
    console.log('💡 Comandos disponíveis:');
    console.log('   window.universalCMS.reload() - Recarregar dados');
    console.log('   window.universalCMS.getStats() - Ver estatísticas');
    console.log('   window.universalCMS.addPost({...}) - Adicionar post');
});

// ================================
// CSS DINÂMICO PARA CMS
// ================================

const style = document.createElement('style');
style.textContent = `
    /* Posts gerados pelo CMS */
    .cms-generated-card {
        border-left: 3px solid #3498db;
        transition: all 0.3s ease;
    }

    .cms-generated-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    /* Posts em destaque */
    .post-destaque {
        border-left-color: #f39c12 !important;
        position: relative;
    }

    .post-destaque-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #f39c12;
        background: white;
        padding: 5px;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-size: 12px;
    }

    /* Meta informações dos posts */
    .post-meta {
        color: #666;
        font-size: 0.85rem;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }
    
    .post-meta i {
        color: #3498db;
    }

    .preview-tag {
        background: #e74c3c;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: bold;
    }

    /* Placeholders para imagens */
    .card-image[data-placeholder] {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-weight: 500;
        height: 200px;
        border-radius: 8px 8px 0 0;
    }
    
    .card-image[data-placeholder]:before {
        content: attr(data-placeholder);
        font-size: 14px;
    }

    /* Animações */
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

    /* Badges das categorias */
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .badge-primary { 
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
    }
    
    .badge-accent { 
        background: linear-gradient(135deg, #e67e22, #d35400);
        color: white;
    }
    
    .badge-outline { 
        background: transparent; 
        border: 2px solid #3498db;
        color: #3498db;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .post-meta {
            font-size: 0.8rem;
            gap: 6px;
        }
        
        .cms-generated-card {
            margin-bottom: 20px;
        }
        
        .post-destaque-icon {
            top: 8px;
            right: 8px;
            padding: 4px;
            font-size: 10px;
        }
    }
`;

document.head.appendChild(style);

// ================================
// HOOKS PARA NETLIFY CMS
// ================================

// Escutar eventos do Netlify CMS
if (window.netlifyIdentity) {
    window.netlifyIdentity.on('login', () => {
        console.log('👤 Usuário logado no CMS');
    });
}

// Hook para recarregar quando posts forem salvos
window.addEventListener('message', (event) => {
    if (event.data.type === 'netlify-cms-post-saved') {
        console.log('📝 Post salvo pelo CMS, recarregando...');
        if (universalCMS) {
            setTimeout(() => universalCMS.reload(), 1000);
        }
    }
});

// Detectar mudanças na URL (para preview links)
window.addEventListener('popstate', () => {
    if (universalCMS) {
        universalCMS.detectPreviewMode();
        universalCMS.processPlaceholders();
    }
});