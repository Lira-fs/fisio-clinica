// ================================
// CMS UNIVERSAL LIMPO - SEM POSTS DE EXEMPLO
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
        console.log('🚀 Iniciando Universal CMS LIMPO...');
        
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
        
        console.log('✅ Dados carregados:', {
            blog: this.data.blog.length
        });
    }

    async loadBlogData() {
        try {
            console.log('📡 Carregando posts reais do GitHub...');
            
            // Carregar posts reais do GitHub
            const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/blog');
            
            if (response.ok) {
                const files = await response.json();
                console.log('📂 Arquivos encontrados:', files.length);
                
                const posts = [];
                
                // Carregar cada arquivo
                for (const file of files) {
                    if (file.name.endsWith('.json') || file.name.endsWith('.md')) {
                        try {
                            console.log(`📖 Carregando: ${file.name}`);
                            const fileResponse = await fetch(file.download_url);
                            const fileContent = await fileResponse.text();
                            
                            let post;
                            if (file.name.endsWith('.json')) {
                                post = JSON.parse(fileContent);
                            } else if (file.name.endsWith('.md')) {
                                post = this.parseMarkdownPost(fileContent);
                            }
                            
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
                console.log(`✅ ${posts.length} posts reais carregados do GitHub`);
                
                // Log das categorias para debug
                const categorias = [...new Set(posts.map(p => p.categoria))];
                console.log('🏷️ Categorias encontradas:', categorias);
                
            } else {
                throw new Error(`GitHub API retornou ${response.status}`);
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar posts reais:', error);
            console.log('📭 Nenhum post carregado - site mostrará conteúdo fallback');
            this.data.blog = [];
        }
    }

    parseMarkdownPost(content) {
        // Parse melhorado de markdown com frontmatter
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (match) {
            const frontmatter = match[1];
            const body = match[2];
            
            const post = {};
            
            // Parse das propriedades do frontmatter - VERSÃO MELHORADA
            const lines = frontmatter.split('\n');
            let currentKey = null;
            let currentValue = '';
            let inMultilineValue = false;
            
            for (let line of lines) {
                line = line.trim();
                
                // Pular linhas vazias
                if (!line) continue;
                
                // Verificar se é uma nova propriedade (tem :)
                const colonIndex = line.indexOf(':');
                
                if (colonIndex > 0 && !inMultilineValue) {
                    // Salvar propriedade anterior se existir
                    if (currentKey) {
                        post[currentKey] = this.parseYamlValue(currentValue.trim());
                    }
                    
                    // Nova propriedade
                    currentKey = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    
                    // Verificar se é valor multilinha (>- ou |)
                    if (value === '>-' || value === '>' || value === '|' || value === '|-') {
                        inMultilineValue = true;
                        currentValue = '';
                    } else {
                        currentValue = value;
                        inMultilineValue = false;
                    }
                } else if (inMultilineValue) {
                    // Adicionar linha ao valor multilinha
                    if (currentValue) {
                        currentValue += ' ' + line;
                    } else {
                        currentValue = line;
                    }
                }
            }
            
            // Salvar última propriedade
            if (currentKey) {
                post[currentKey] = this.parseYamlValue(currentValue.trim());
            }
            
            // Processar body (conteúdo após o frontmatter)
            if (body.trim()) {
                post.conteudo = this.cleanHtmlContent(body.trim());
            }
            
            console.log('🔄 Post parseado:', {
                titulo: post.titulo,
                categoria: post.categoria,
                temConteudo: !!post.conteudo,
                conteudoLength: post.conteudo ? post.conteudo.length : 0
            });
            
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

     cleanHtmlContent(content) {
        // Limpar tags HTML desnecessárias
        return content
            .replace(/<!--StartFragment-->/g, '')
            .replace(/<!--EndFragment-->/g, '')
            .replace(/<!--.*?-->/g, '') // Remover todos os comentários HTML
            .trim();
    }

    processPlaceholders() {
        console.log('🔄 Processando placeholders...');

        // Processar placeholders de blog
        const blogPlaceholders = document.querySelectorAll('[data-cms="blog-posts"]');
        blogPlaceholders.forEach(placeholder => this.processBlogPlaceholder(placeholder));
    }

    processBlogPlaceholder(placeholder) {
        const category = placeholder.getAttribute('data-cms-category');
        const limit = parseInt(placeholder.getAttribute('data-cms-limit')) || 3;
        const badgeClass = placeholder.getAttribute('data-cms-badge') || 'badge-primary';
        const section = placeholder.getAttribute('data-cms-section');

        console.log(`📝 Processando seção: ${section}`);
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
            
            const categorizedPosts = posts.filter(post => {
                const postCategory = post.categoria || 'novidades'; // fallback
                const match = categories.includes(postCategory);
                console.log(`📄 Post "${post.titulo}" - Categoria: "${postCategory}" - Match: ${match}`);
                return match;
            });
            
            posts = categorizedPosts;
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

        console.log(`Debug: postCategory="${postCategory}", categories=[${categories.join(',')}], post completo:`, post);
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
    const imageUrl = post.imagem || 'https://via.placeholder.com/600x400/3498db/ffffff?text=Sem+Imagem';
    const titulo = post.titulo || 'Post sem título';
    
    // RESUMO/CONTEÚDO - VERSÃO CORRIGIDA
    let resumo;
    
    // Debug do que temos disponível
    console.log(`📖 Post "${post.titulo}" - campos disponíveis:`, {
        resumo: post.resumo,
        conteudo: post.conteudo ? post.conteudo.substring(0, 100) + '...' : 'vazio'
    });
    
    // Usar conteúdo se resumo estiver vazio, senão usar resumo
    if (post.conteudo && post.conteudo.trim()) {
    // Limpar markdown básico e truncar
    resumo = post.conteudo
        .replace(/#{1,6}\s/g, '') // Remover # dos títulos
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remover **negrito**
        .replace(/\n+/g, ' ') // Substituir quebras de linha por espaços
        .trim();
    
    // Truncar se muito longo
    if (resumo.length > 200) {
        resumo = resumo.substring(0, 200) + '...';
    }
    
    console.log(`✅ Usando conteúdo: ${resumo.substring(0, 50)}...`);
} else if (post.resumo && post.resumo.trim()) {
    resumo = post.resumo;
    console.log(`✅ Usando resumo: ${resumo.substring(0, 50)}...`);
} else {
    resumo = 'Confira este post em nosso blog.';
    console.log(`⚠️ Usando texto padrão`);
}
    
    // Formatar data - CORREÇÃO PARA FORMATO AMERICANO
    let dataFormatada = 'Recente';
    if (post.data) {
        try {
            console.log(`📅 Data original do post "${post.titulo}":`, post.data);
            
            let date;
            
            if (typeof post.data === 'string') {
                // Formato do Netlify CMS: "08/17/2025 12:00 AM"
                if (post.data.includes('/') && post.data.includes(' ')) {
                    // Separar data e hora
                    const [datePart, timePart] = post.data.split(' ');
                    
                    // Parse da data MM/DD/YYYY
                    const [mes, dia, ano] = datePart.split('/');
                    
                    // Criar data correta (mês é zero-indexado)
                    date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                    
                    console.log(`🔄 Convertendo ${post.data} → ${date.toISOString()}`);
                }
                // Formato ISO padrão
                else if (post.data.includes('T')) {
                    date = new Date(post.data);
                }
                // Formato simples YYYY-MM-DD
                else {
                    date = new Date(post.data);
                }
            } else {
                date = new Date(post.data);
            }
            
            // Verificar se a data é válida
            if (date && !isNaN(date.getTime())) {
                dataFormatada = date.toLocaleDateString('pt-BR');
                console.log(`✅ Data formatada: ${dataFormatada}`);
            } else {
                console.warn(`⚠️ Data inválida para post "${post.titulo}":`, post.data);
                dataFormatada = 'Data inválida';
            }
            
        } catch (e) {
            console.error(`❌ Erro ao formatar data do post "${post.titulo}":`, e);
            dataFormatada = 'Erro na data';
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
    console.log('🌐 DOM carregado, iniciando Universal CMS LIMPO...');
    
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