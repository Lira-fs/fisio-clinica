// SCRIPT DE DEBUG PARA CARREGAR POSTS REAIS
// Adicione este script temporariamente ao blog.html para testar

async function debugLoadRealPosts() {
    console.log('🔍 Tentando carregar posts reais do GitHub...');
    
    try {
        // Tentar acessar a API do GitHub
        const response = await fetch('https://api.github.com/repos/Lira-fs/fisio-clinica/contents/_data/blog');
        
        if (response.ok) {
            const files = await response.json();
            console.log('📂 Arquivos encontrados no _data/blog:', files);
            
            // Listar arquivos
            files.forEach(file => {
                console.log(`📄 Arquivo: ${file.name} - Tamanho: ${file.size} bytes`);
            });
            
            // Tentar carregar o primeiro arquivo
            if (files.length > 0) {
                const firstFile = files[0];
                console.log(`📖 Carregando: ${firstFile.name}`);
                
                const fileResponse = await fetch(firstFile.download_url);
                const fileContent = await fileResponse.text();
                
                console.log('📝 Conteúdo do arquivo:');
                console.log(fileContent);
                
                // Tentar fazer parse
                try {
                    if (firstFile.name.endsWith('.json')) {
                        const postData = JSON.parse(fileContent);
                        console.log('✅ Post carregado:', postData);
                        return postData;
                    } else if (firstFile.name.endsWith('.md')) {
                        console.log('📄 Arquivo Markdown detectado');
                        // Parse básico do frontmatter
                        console.log('Conteúdo:', fileContent.substring(0, 500) + '...');
                    }
                } catch (parseError) {
                    console.error('❌ Erro ao fazer parse:', parseError);
                }
            } else {
                console.log('📭 Nenhum arquivo encontrado na pasta _data/blog');
            }
        } else {
            console.error('❌ Erro ao acessar GitHub API:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

// Executar automaticamente
debugLoadRealPosts();

// Também disponibilizar globalmente
window.debugLoadRealPosts = debugLoadRealPosts;