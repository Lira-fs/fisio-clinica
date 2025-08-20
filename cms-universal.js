// ================================
// UNIVERSAL CMS - VERSÃO LIMPA E CORRIGIDA
// Sistema que conecta Netlify CMS ao site HTML
// ================================

class UniversalCMS {
    constructor() {
        this.data = {
            blog: [],
            estrutura: [],
            unidades: [],
            tratamentos: []
        };
        this.isPreviewMode = false;
        this.previewPost = null;
    }

    async init() {
        console.log('🚀 Iniciando Universal CMS...');
        
        this.detectPreviewMode();
        await this.loadData();
        this.processPlaceholders();
        
        console.log('✅ Universal CMS iniciado!');
    }

    detectPreviewMode() {
        const urlParams = new URLSearchParams(window.location.search);
        this.previewPost = urlParams.get('preview');
        this.isPreviewMode = !!this.previewPost;
        
        if (this.isPreviewMode) {
            console.log('👁️ Modo preview ativo para:', this.previewPost);
            this.showPreviewIndicator();
        }
    }

    showPreviewIndicator() {
        const indicator = document.getElementById('cms-preview-indicator');
        if (indicator) {
            indicator.style.display = 'block';
        }
    }

    async loadData() {
        console.log('📡 Carregando dados do GitHub...');
        
        await Promise.all([
            this.loadBlogPosts(),
            this.loadEstrutura(),
            this.loadUnidades(),
            this.loadTratamentos()
        ]);
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('https://api.github.com/repos/[USUARIO]/[REPOSITORIO]/contents/_data/blog');
            
            if (response.ok) {
                const files = await response.json();
                const posts = [];
                
                for (const file of files) {
                    if (file.name.endsWith('.md')) {
                        try {
                            const fileResponse = await fetch(file.download_url);
                            const content = await fileResponse.text();
                            const post = this.parseMarkdownPost(content);
                            
                            if (post && post.titulo) {
                                post.filename = file.name;
                                posts.push(post);
                                console.log(`✅ Post carregado: "${post.titulo}" - Categoria: "${post.categoria}"`);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Erro ao carregar ${file.name}:`, error);
                        }
                    }
                }
                
                this.data.blog = posts;
                console.log(`✅ ${posts.length} posts carregados do GitHub`);
                
            } else {
                throw new Error(`GitHub API retornou ${response.status}`);
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts reais:', error);
            console.log('🔭 Nenhum post carregado - site mostrará conteúdo fallback');
            this.data.blog = [];
        }
    }

    async loadEstrutura() {
        // Similar ao loadBlogPosts, mas para estrutura
        console.log('🏠 Carregando dados de estrutura...');
        // Implementar quando necessário
    }

    async loadUnidades() {
        // Similar ao loadBlogPosts, mas para unidades
        console.log('🏥 Carregando dados de unidades...');
        // Implementar quando necessário
    }

    async loadTratamentos() {
        // Similar ao loadBlogPosts, mas para tratamentos
        console.log('💊 Carregando dados de tratamentos...');
        // Implementar quando necessário
    }

    parseMarkdownPost(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            console.warn('⚠️ Post sem frontmatter válido');
            return null;
        }
        
        const [, frontmatter, body] = match;
        const post = { body: body.trim() };
        
        // Parse do frontmatter YAML
        const lines = frontmatter.split('\n');
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                post[key] = this.parseYamlValue(value);
            }
        }
        
        // Validações e correções
        if (post.titulo && post.categoria) {
            // Garantir que a categoria está nas opções válidas
            const categoriasValidas = ['novidades', 'esportiva', 'reabilitacao'];
            if (!categoriasValidas.includes(post.categoria)) {
                console.warn(`⚠️ Categoria "${post.categoria}" inválida, alterando para "novidades"`);
                post.categoria = 'novidades';
            }
            
            // Garantir formato de data correto
            if (post.data) {
                post.data = this.normalizarData(post.data);
            }
            
            return post;
        }
        
        return null;
    }

    parseYamlValue(value) {
        // Limpar valor YAML
        if (!value) return '';
        
        // Remover aspas
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        
        // Converter tipos
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value) && !isNaN(parseFloat(value))) {
            return parseFloat(value);
        }
        
        return value;
    }

    normalizarData(data) {
        // Normalizar diferentes formatos de data para ISO
        try {
            let date;
            
            if (typeof data === 'string') {
                // Formato Netlify CMS: "08/17/2025 12:00 AM"
                if (data.includes('/') && data.includes(' ')) {
                    const [datePart] = data.split(' ');
                    const [mes, dia, ano] = datePart.split('/');
                    date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                }
                // Formato ISO
                else if (data.includes('T')) {
                    date = new Date(data);
                }
                // Formato simples YYYY-MM-DD
                else {
                    date = new Date(data);
                }
            } else {
                date = new Date(data);
            }
            
            // Retornar em formato ISO se válida
            if (date && !isNaN(date.getTime())) {
                return date.toISOString();
            }
            
        } catch (e) {
            console.error('❌ Erro ao normalizar data:', e);
        }
        
        // Fallback: data atual
        return new Date().toISOString();
    }

    processPlaceholders() {
        console.log('🔄 Processando placeholders...');

        // Processar placeholders de blog
        const blogPlaceholders = document.querySelectorAll('[data-cms="blog-posts"]');
        blogPlaceholders.forEach(placeholder => this.processBlogPlaceholder(placeholder));

        // Processar outros placeholders conforme necessário
        // this.processEstruturaPlaceholders();
        // this.processUnidadesPlaceholders();
        // this.processTratamentosPlaceholders();
    }

    processBlogPlaceholder(placeholder) {
        const category = placeholder.getAttribute('data-cms-category');
        const limit = parseInt(placeholder.getAttribute('data-cms-limit')) || 3;
        const badgeClass = placeholder.getAttribute('data-cms-badge') || 'badge-primary';
        const section = placeholder.getAttribute('data-cms-section');

        console.log(`🔍 Processando seção: ${section}`);
        console.log(`🏷️ Filtro de categoria: ${category}`);

        // Filtrar posts publicados
        let posts = this.data.blog.filter(post => post.publicado !== false);
        console.log(`📊 Posts publicados disponíveis: ${posts.length}`);

        // Se estivermos em modo preview de um post específico
        if (this.isPreviewMode && this.previewPost) {
            const previewPostData = posts.find(post => 
                post.titulo.toLowerCase().includes(this.previewPost.toLowerCase()) ||
                post.slug === this.previewPost
            );
            
            if (previewPostData) {
                posts = [previewPostData];
                console.log('👁️ Mostrando preview do post:', previewPostData.titulo);
            }
        }

        // Filtrar por categoria SE especificado
        if (category) {
            const categories = category.split(',').map(c => c.trim());
            console.log(`🔍 Categorias aceitas para ${section}: [${categories.join(', ')}]`);
            
            posts = posts.filter(post => {
                const postCategory = post.categoria || 'novidades';
                const match = categories.includes(postCategory);
                console.log(`📄 Post "${post.titulo}" - Categoria: "${postCategory}" - Match: ${match}`);
                return match;
            });
            
            console.log(`📊 Posts filtrados para ${section}: ${posts.length}`);
        }

        // Ordenar por data (mais recente primeiro)
        posts.sort((a, b) => new Date(b.data) - new Date(a.data));

        // Limitar quantidade
        posts = posts.slice(0, limit);

        // Renderizar posts OU manter fallback
        if (posts.length > 0) {
            placeholder.innerHTML = posts.map(post => 
                this.createBlogCard(post, badgeClass)
            ).join('');
            
            console.log(`✅ ${section}: ${posts.length} posts renderizados`);
        } else {
            console.log(`📄 ${section}: nenhum post encontrado - mantendo conteúdo fallback`);
        }
    }

    createBlogCard(post, badgeClass = 'badge-primary') {
        const categoryLabels = {
            'novidades': 'Clínica',
            'esportiva': 'Fisioterapia',
            'reabilitacao': 'Tratamentos',
            'tecnologia': 'Tecnologia'
        };

        const categoryLabel = categoryLabels[post.categoria] || 'Notícias';
        const imageUrl = post.imagem || 'https://via.placeholder.com/600x400/3498db/ffffff?text=Sem+Imagem';
        const titulo = post.titulo || 'Post sem título';
        
        // RESUMO/CONTEÚDO - Versão corrigida
        let resumo;
        
        if (post.resumo && post.resumo.trim()) {
            resumo = post.resumo;
        } else if (post.body && post.body.trim()) {
            // Gerar resumo do conteúdo
            resumo = post.body
                .replace(/[#*`]/g, '') // Remover markdown
                .replace(/\n+/g, ' ') // Substituir quebras de linha
                .trim();
            
            // Truncar se muito longo
            if (resumo.length > 200) {
                resumo = resumo.substring(0, 200) + '...';
            }
        } else {
            resumo = 'Confira este post em nosso blog.';
        }
        
        // Formatar data
        let dataFormatada = 'Recente';
        if (post.data) {
            try {
                const date = new Date(post.data);
                if (date && !isNaN(date.getTime())) {
                    dataFormatada = date.toLocaleDateString('pt-BR');
                }
            } catch (e) {
                console.error('❌ Erro ao formatar data:', e);
            }
        }

        // Indicador de destaque
        const destaqueClass = post.destaque ? 'post-destaque' : '';
        const destaqueIcon = post.destaque ? 
            '<div class="post-destaque-icon"><i class="fas fa-star"></i></div>' : '';

        return `
            <article class="card cms-generated-card ${destaqueClass} fade-in">
                ${destaqueIcon}
                <div class="card-image" style="background-image: url('${imageUrl}');">
                    <img src="${imageUrl}" alt="${titulo}" loading="lazy">
                </div>
                <div class="card-body">
                    <span class="badge ${badgeClass}">${categoryLabel}</span>
                    <h4>${titulo}</h4>
                    <p>${resumo}</p>
                    <div class="post-meta">
                        <i class="fas fa-calendar"></i>
                        <span>${dataFormatada}</span>
                        ${post.autor ? `<i class="fas fa-user"></i><span>${post.autor}</span>` : ''}
                        ${this.isPreviewMode ? '<span class="preview-tag">PREVIEW</span>' : ''}
                    </div>
                </div>
            </article>
        `;
    }

    async reload() {
        console.log('🔄 Recarregando CMS...');
        await this.loadData();
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

    /* Indicador de preview do CMS */
    .cms-preview-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 8px;
        text-align: center;
        z-index: 1000;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .cms-preview-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .cms-refresh-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .cms-refresh-btn:hover {
        background: rgba(255,255,255,0.3);
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