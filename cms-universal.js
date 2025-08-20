// ================================
// UNIVERSAL CMS - VERSÃO COMPLETA CORRIGIDA
// Sistema que conecta Netlify CMS ao site HTML
// ================================

class UniversalCMS {
    constructor() {
        this.data = {
            blog: [],
            estrutura: [],
            unidades: [],
            tratamentos: [],
            paginas: {},
            configuracoes: {}
        };
        this.isPreviewMode = false;
        this.previewPost = null;
        this.isLoaded = false;
    }

    async init() {
        console.log('🚀 Iniciando Universal CMS...');
        
        this.detectPreviewMode();
        await this.loadData();
        this.processPlaceholders();
        this.isLoaded = true;
        
        console.log('✅ Universal CMS iniciado!');
        this.showSuccessMessage();
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
            setTimeout(() => {
                indicator.classList.add('show');
            }, 100);
        }
    }

    showSuccessMessage() {
        if (this.data.blog.length > 0) {
            console.log(`✅ CMS Carregado: ${this.data.blog.length} posts encontrados`);
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

        console.log('📊 Resumo carregado:', this.getStats());
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/blog');
            
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
                                post.slug = this.generateSlug(post.titulo);
                                posts.push(post);
                                console.log(`✅ Post: "${post.titulo}" (${post.categoria})`);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Erro ao carregar ${file.name}:`, error);
                        }
                    }
                }
                
                this.data.blog = posts;
                console.log(`✅ ${posts.length} posts carregados`);
                
            } else {
                throw new Error(`GitHub API retornou ${response.status}`);
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts:', error);
            this.data.blog = [];
        }
    }

    async loadEstrutura() {
        try {
            const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/estrutura');
            
            if (response.ok) {
                const files = await response.json();
                const cards = [];
                
                for (const file of files) {
                    if (file.name.endsWith('.md')) {
                        try {
                            const fileResponse = await fetch(file.download_url);
                            const content = await fileResponse.text();
                            const card = this.parseMarkdownPost(content);
                            
                            if (card && card.titulo && card.ativo !== false) {
                                cards.push(card);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Erro ao carregar estrutura ${file.name}:`, error);
                        }
                    }
                }
                
                // Ordenar por ordem definida
                cards.sort((a, b) => (a.ordem || 999) - (b.ordem || 999));
                this.data.estrutura = cards;
                console.log(`✅ ${cards.length} cards de estrutura carregados`);
                
            } else {
                console.log('📁 Pasta estrutura não encontrada');
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar estrutura:', error);
            this.data.estrutura = [];
        }
    }

    async loadUnidades() {
        try {
            const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/unidades');
            
            if (response.ok) {
                const files = await response.json();
                const unidades = [];
                
                for (const file of files) {
                    if (file.name.endsWith('.md')) {
                        try {
                            const fileResponse = await fetch(file.download_url);
                            const content = await fileResponse.text();
                            const unidade = this.parseMarkdownPost(content);
                            
                            if (unidade && unidade.nome && unidade.ativa !== false) {
                                unidades.push(unidade);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Erro ao carregar unidade ${file.name}:`, error);
                        }
                    }
                }
                
                this.data.unidades = unidades;
                console.log(`✅ ${unidades.length} unidades carregadas`);
                
            } else {
                console.log('📁 Pasta unidades não encontrada');
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar unidades:', error);
            this.data.unidades = [];
        }
    }

    async loadTratamentos() {
        try {
            const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/tratamentos');
            
            if (response.ok) {
                const files = await response.json();
                const tratamentos = [];
                
                for (const file of files) {
                    if (file.name.endsWith('.md')) {
                        try {
                            const fileResponse = await fetch(file.download_url);
                            const content = await fileResponse.text();
                            const tratamento = this.parseMarkdownPost(content);
                            
                            if (tratamento && tratamento.titulo && tratamento.ativo !== false) {
                                tratamentos.push(tratamento);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Erro ao carregar tratamento ${file.name}:`, error);
                        }
                    }
                }
                
                // Ordenar por ordem definida
                tratamentos.sort((a, b) => (a.ordem || 999) - (b.ordem || 999));
                this.data.tratamentos = tratamentos;
                console.log(`✅ ${tratamentos.length} tratamentos carregados`);
                
            } else {
                console.log('📁 Pasta tratamentos não encontrada');
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar tratamentos:', error);
            this.data.tratamentos = [];
        }
    }

    parseMarkdownPost(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            console.warn('⚠️ Conteúdo sem frontmatter válido');
            return null;
        }
        
        const [, frontmatter, body] = match;
        const item = { body: body.trim() };
        
        // Parse do frontmatter YAML simplificado
        const lines = frontmatter.split('\n');
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                item[key] = this.parseYamlValue(value);
            }
        }
        
        // Validações específicas para posts do blog
        if (item.categoria) {
            const categoriasValidas = ['novidades', 'esportiva', 'reabilitacao'];
            if (!categoriasValidas.includes(item.categoria)) {
                console.warn(`⚠️ Categoria "${item.categoria}" inválida, alterando para "novidades"`);
                item.categoria = 'novidades';
            }
        }
        
        // Normalizar data
        if (item.data) {
            item.data = this.normalizarData(item.data);
        }
        
        return item;
    }

    parseYamlValue(value) {
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
        try {
            let date;
            
            if (typeof data === 'string') {
                // Formato do Netlify CMS: "08/17/2025 12:00 AM"
                if (data.includes('/') && data.includes(' ')) {
                    const [datePart] = data.split(' ');
                    const [mes, dia, ano] = datePart.split('/');
                    date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                }
                // Formato ISO
                else if (data.includes('T')) {
                    date = new Date(data);
                }
                // Formato simples
                else {
                    date = new Date(data);
                }
            } else {
                date = new Date(data);
            }
            
            if (date && !isNaN(date.getTime())) {
                return date.toISOString();
            }
            
        } catch (e) {
            console.error('❌ Erro ao normalizar data:', e);
        }
        
        return new Date().toISOString();
    }

    generateSlug(titulo) {
        return titulo
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    processPlaceholders() {
        console.log('🔄 Processando placeholders...');

        // Processar placeholders de blog
        const blogPlaceholders = document.querySelectorAll('[data-cms="blog-posts"]');
        console.log(`📍 ${blogPlaceholders.length} placeholders de blog encontrados`);
        
        blogPlaceholders.forEach((placeholder, index) => {
            console.log(`🔍 Processando placeholder ${index + 1}/${blogPlaceholders.length}`);
            this.processBlogPlaceholder(placeholder);
        });

        // Processar placeholders de estrutura
        const estruturaPlaceholders = document.querySelectorAll('[data-cms="estrutura-cards"]');
        estruturaPlaceholders.forEach(placeholder => this.processEstruturaPlaceholder(placeholder));

        // Processar placeholders de unidades
        const unidadesPlaceholders = document.querySelectorAll('[data-cms="unidades-cards"]');
        unidadesPlaceholders.forEach(placeholder => this.processUnidadesPlaceholder(placeholder));

        // Processar placeholders de tratamentos
        const tratamentosPlaceholders = document.querySelectorAll('[data-cms="tratamentos-cards"]');
        tratamentosPlaceholders.forEach(placeholder => this.processTratamentosPlaceholder(placeholder));
    }

    processBlogPlaceholder(placeholder) {
        const category = placeholder.getAttribute('data-cms-category');
        const limit = parseInt(placeholder.getAttribute('data-cms-limit')) || 3;
        const badgeClass = placeholder.getAttribute('data-cms-badge') || 'badge-primary';
        const section = placeholder.getAttribute('data-cms-section');

        console.log(`📝 Seção: ${section}`);
        console.log(`🏷️ Categoria: ${category}`);
        console.log(`📊 Limite: ${limit}`);

        // Filtrar posts publicados
        let posts = this.data.blog.filter(post => post.publicado !== false);
        console.log(`📋 Posts disponíveis: ${posts.length}`);

        // Modo preview
        if (this.isPreviewMode && this.previewPost) {
            const previewPostData = posts.find(post => 
                post.titulo.toLowerCase().includes(this.previewPost.toLowerCase()) ||
                post.slug === this.previewPost
            );
            
            if (previewPostData) {
                posts = [previewPostData];
                console.log('👁️ Modo preview:', previewPostData.titulo);
            }
        }

        // Filtrar por categoria
        if (category) {
            const categories = category.split(',').map(c => c.trim());
            console.log(`🔍 Filtrando por: [${categories.join(', ')}]`);
            
            posts = posts.filter(post => {
                const postCategory = post.categoria || 'novidades';
                const match = categories.includes(postCategory);
                if (match) {
                    console.log(`✅ "${post.titulo}" -> ${postCategory}`);
                }
                return match;
            });
            
            console.log(`🎯 Posts filtrados: ${posts.length}`);
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
            
            // Adicionar classes de animação
            setTimeout(() => {
                placeholder.querySelectorAll('.cms-generated-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 150);
                });
            }, 100);
            
            console.log(`✅ ${section}: ${posts.length} posts renderizados`);
        } else {
            console.log(`📄 ${section}: mantendo conteúdo fallback`);
            // Adicionar indicador de que é conteúdo de exemplo
            const fallbackCards = placeholder.querySelectorAll('.cms-fallback-card');
            fallbackCards.forEach(card => {
                if (!card.querySelector('.cms-fallback-notice')) {
                    const notice = document.createElement('div');
                    notice.className = 'cms-fallback-notice';
                    notice.innerHTML = '<i class="fas fa-info-circle"></i> Conteúdo de exemplo - Adicione posts no painel admin';
                    card.querySelector('.card-body').appendChild(notice);
                }
            });
        }
    }

    processEstruturaPlaceholder(placeholder) {
        console.log('🏠 Processando placeholder de estrutura...');
        
        if (this.data.estrutura.length > 0) {
            placeholder.innerHTML = this.data.estrutura.map(card => 
                this.createEstruturaCard(card)
            ).join('');
            
            console.log(`✅ ${this.data.estrutura.length} cards de estrutura renderizados`);
        } else {
            console.log('📄 Estrutura: mantendo conteúdo fallback');
        }
    }

    processUnidadesPlaceholder(placeholder) {
        console.log('🏥 Processando placeholder de unidades...');
        
        if (this.data.unidades.length > 0) {
            placeholder.innerHTML = this.data.unidades.map(unidade => 
                this.createUnidadeCard(unidade)
            ).join('');
            
            console.log(`✅ ${this.data.unidades.length} unidades renderizadas`);
        } else {
            console.log('📄 Unidades: mantendo conteúdo fallback');
        }
    }

    processTratamentosPlaceholder(placeholder) {
        console.log('💊 Processando placeholder de tratamentos...');
        
        const categoria = placeholder.getAttribute('data-cms-categoria');
        let tratamentos = this.data.tratamentos;
        
        // Filtrar por categoria se especificado
        if (categoria) {
            tratamentos = tratamentos.filter(t => t.categoria === categoria);
        }
        
        if (tratamentos.length > 0) {
            placeholder.innerHTML = tratamentos.map(tratamento => 
                this.createTratamentoCard(tratamento)
            ).join('');
            
            console.log(`✅ ${tratamentos.length} tratamentos renderizados`);
        } else {
            console.log('📄 Tratamentos: mantendo conteúdo fallback');
        }
    }

    createBlogCard(post, badgeClass = 'badge-primary') {
        const categoryLabels = {
            'novidades': 'Clínica',
            'esportiva': 'Fisioterapia',
            'reabilitacao': 'Tratamentos'
        };

        const categoryLabel = categoryLabels[post.categoria] || 'Notícias';
        const imageUrl = post.imagem || 'https://via.placeholder.com/600x400/3498db/ffffff?text=Sem+Imagem';
        const titulo = post.titulo || 'Post sem título';
        
        // Gerar resumo
        let resumo;
        if (post.resumo && post.resumo.trim()) {
            resumo = post.resumo;
        } else if (post.body && post.body.trim()) {
            resumo = post.body
                .replace(/[#*`]/g, '')
                .replace(/\n+/g, ' ')
                .trim();
            
            if (resumo.length > 150) {
                resumo = resumo.substring(0, 150) + '...';
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

        // Classes de destaque
        const destaqueClass = post.destaque ? 'post-destaque' : '';
        const destaqueIcon = post.destaque ? 
            '<div class="post-destaque-icon"><i class="fas fa-star"></i></div>' : '';

        return `
            <article class="card cms-generated-card ${destaqueClass}">
                ${destaqueIcon}
                <div class="card-image">
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

    createEstruturaCard(card) {
        const imageUrl = card.imagem || 'https://via.placeholder.com/600x400/3498db/ffffff?text=Estrutura';
        const icone = card.icone || 'fas fa-building';
        
        return `
            <div class="card media-card cms-generated-card fade-in">
                <div class="media-thumb">
                    <img src="${imageUrl}" alt="${card.titulo}" loading="lazy">
                    <div class="placeholder-overlay">
                        <i class="${icone}"></i>
                        <span>${card.titulo}</span>
                    </div>
                </div>
                <div class="media-caption">
                    <i class="fas fa-camera"></i>
                    ${card.descricao}
                </div>
            </div>
        `;
    }

    createUnidadeCard(unidade) {
        const imageUrl = unidade.imagem_hero || 'https://via.placeholder.com/800x600/3498db/ffffff?text=Unidade';
        
        return `
            <div class="card unidade-card cms-generated-card fade-in">
                <div class="card-image">
                    <img src="${imageUrl}" alt="${unidade.nome}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3>${unidade.nome}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${unidade.cidade}</p>
                    <p>${unidade.descricao}</p>
                    <div class="unidade-info">
                        <p><i class="fas fa-phone"></i> ${unidade.telefone}</p>
                        <p><i class="fas fa-clock"></i> ${unidade.horario}</p>
                    </div>
                    <a href="unidades/${unidade.nome.toLowerCase().replace(/\s+/g, '-')}.html" class="btn btn-primary">
                        Ver Detalhes
                    </a>
                </div>
            </div>
        `;
    }

    createTratamentoCard(tratamento) {
        const imageUrl = tratamento.imagem || 'https://via.placeholder.com/600x400/3498db/ffffff?text=Tratamento';
        const corClass = tratamento.cor || 'bg-primary';
        const link = tratamento.link || '#';
        
        return `
            <div class="tratamento-card cms-generated-card fade-in">
                <div class="tratamento-image">
                    <img src="${imageUrl}" alt="${tratamento.titulo}" loading="lazy">
                    ${tratamento.destaque ? '<div class="tratamento-destaque"><i class="fas fa-star"></i></div>' : ''}
                </div>
                <div class="tratamento-content ${corClass}">
                    <h3>${tratamento.titulo}</h3>
                    <p>${tratamento.descricao}</p>
                    ${tratamento.duracao ? `<p class="tratamento-duracao"><i class="fas fa-clock"></i> ${tratamento.duracao}</p>` : ''}
                    ${tratamento.preco ? `<p class="tratamento-preco">${tratamento.preco}</p>` : ''}
                    <a href="${link}" class="btn btn-white">
                        <i class="fas fa-info-circle"></i>
                        Saiba Mais
                    </a>
                </div>
            </div>
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
            estrutura: this.data.estrutura.length,
            unidades: this.data.unidades.length,
            tratamentos: this.data.tratamentos.length,
            categorias: [...new Set(this.data.blog.map(p => p.categoria))],
            isPreviewMode: this.isPreviewMode,
            previewPost: this.previewPost,
            isLoaded: this.isLoaded
        };
    }

    // Métodos para debug
    debug() {
        console.table(this.getStats());
        console.log('📊 Dados completos:', this.data);
    }

    testCategories() {
        const categorias = this.data.blog.reduce((acc, post) => {
            acc[post.categoria] = (acc[post.categoria] || 0) + 1;
            return acc;
        }, {});
        console.table(categorias);
    }
}

// ================================
// INICIALIZAÇÃO AUTOMÁTICA
// ================================

let universalCMS;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 DOM carregado, iniciando Universal CMS...');
    
    universalCMS = new UniversalCMS();
    universalCMS.init();
    
    // Expor globalmente para debug
    window.universalCMS = universalCMS;
    
    console.log('💡 Comandos disponíveis:');
    console.log('   universalCMS.reload() - Recarregar dados');
    console.log('   universalCMS.getStats() - Ver estatísticas');
    console.log('   universalCMS.debug() - Ver dados completos');
    console.log('   universalCMS.testCategories() - Testar categorias');
});

// ================================
// CSS DINÂMICO PARA CMS
// ================================

const style = document.createElement('style');
style.textContent = `
    /* Indicador de Preview */
    .cms-preview-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 8px;
        text-align: center;
        z-index: 10000;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .cms-preview-indicator.show {
        transform: translateY(0);
    }
    
    .cms-preview-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-weight: 600;
    }
    
    .cms-refresh-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .cms-refresh-btn:hover {
        background: rgba(255,255,255,0.3);
    }

    /* Posts gerados pelo CMS */
    .cms-generated-card {
        border-left: 3px solid #3498db;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    }
    
    .cms-generated-card.fade-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Indicador de post em destaque */
    .post-destaque {
        border-left-color: #f39c12 !important;
        box-shadow: 0 4px 20px rgba(243, 156, 18, 0.2);
    }
    
    .post-destaque-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #f39c12;
        color: white;
        padding: 6px;
        border-radius: 50%;
        font-size: 12px;
        z-index: 5;
    }

    /* Meta informações dos posts */
    .post-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: #666;
        margin-top: 10px;
        flex-wrap: wrap;
    }
    
    .preview-tag {
        background: #e74c3c;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.8rem;
        font-weight: bold;
    }

    /* Badges de categoria */
    .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
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

    /* Indicadores de seção editável */
    .cms-section-indicator {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(52, 152, 219, 0.1);
        border: 1px solid #3498db;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        color: #3498db;
        margin-left: 10px;
    }

    /* Avisos de conteúdo fallback */
    .cms-fallback-notice {
        margin-top: 10px;
        padding: 8px;
        background: #f8f9fa;
        border-left: 3px solid #3498db;
        font-size: 0.8rem;
        color: #666;
        border-radius: 0 4px 4px 0;
    }

    /* Cards de tratamentos */
    .tratamento-destaque {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #f39c12;
        color: white;
        padding: 8px;
        border-radius: 50%;
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
        
        .cms-section-indicator {
            display: none;
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
    
    window.netlifyIdentity.on('logout', () => {
        console.log('👋 Usuário deslogado do CMS');
    });
}

// Hook para recarregar quando posts forem salvos
window.addEventListener('message', (event) => {
    if (event.data.type === 'netlify-cms-post-saved') {
        console.log('📝 Post salvo pelo CMS, recarregando...');
        if (universalCMS && universalCMS.isLoaded) {
            setTimeout(() => universalCMS.reload(), 1000);
        }
    }
});

// Detectar mudanças na URL (para preview links)
window.addEventListener('popstate', () => {
    if (universalCMS && universalCMS.isLoaded) {
        universalCMS.detectPreviewMode();
        universalCMS.processPlaceholders();
    }
});

// Auto-reload periódico em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setInterval(() => {
        if (universalCMS && universalCMS.isLoaded) {
            console.log('🔄 Auto-reload em desenvolvimento...');
            universalCMS.reload();
        }
    }, 30000); // 30 segundos
}