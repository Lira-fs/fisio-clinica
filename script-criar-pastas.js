// SCRIPT PARA CRIAR ESTRUTURA DE PASTAS DO NETLIFY CMS
// Execute este script no terminal: node script-criar-pastas.js

const fs = require('fs');
const path = require('path');

function criarPasta(caminho) {
    if (!fs.existsSync(caminho)) {
        fs.mkdirSync(caminho, { recursive: true });
        console.log(`✅ Pasta criada: ${caminho}`);
    } else {
        console.log(`📁 Pasta já existe: ${caminho}`);
    }
}

console.log('🚀 CRIANDO ESTRUTURA DE PASTAS PARA NETLIFY CMS');
console.log('='.repeat(50));

// Criar pasta _data principal
criarPasta('_data');

// Criar subpastas conforme config.yml
const pastas = [
    '_data/blog',
    '_data/estrutura',
    '_data/fisioterapeutas',
    '_data/tratamentos',
    '_data/unidades',
    '_data/configuracoes'
];

pastas.forEach(pasta => {
    criarPasta(pasta);
});

// Criar arquivo de configuração da clínica (necessário para o CMS)
const configClinica = {
    nome: "Clínica FISIO",
    slogan: "Excelência em Fisioterapia Esportiva",
    telefone: "(11) 99999-9999",
    email: "contato@fisioclinica.com.br",
    whatsapp: "5511999999999",
    descricao: "Clínica especializada em fisioterapia esportiva e reabilitação com 4 unidades na região.",
    endereco_principal: "Rua Principal, 123 - Centro - Jundiaí/SP",
    horario_funcionamento: "Segunda a Sexta: 6h às 22h | Sábado: 7h às 13h",
    redes_sociais: {
        facebook: "https://facebook.com/fisioclinica",
        instagram: "https://instagram.com/fisioclinica",
        youtube: "",
        linkedin: "",
        twitter: ""
    },
    seo: {
        keywords: "fisioterapia, fisioterapia esportiva, reabilitação, pilates, jundiaí, itatiba",
        meta_description: "Clínica FISIO - Especializada em fisioterapia esportiva e reabilitação com 4 unidades. Profissionais experientes e tecnologia de ponta.",
        google_analytics: ""
    }
};

// Salvar arquivo de configuração
fs.writeFileSync('_data/clinica.json', JSON.stringify(configClinica, null, 2), 'utf8');
console.log('✅ Arquivo _data/clinica.json criado');

// Criar exemplos de dados para testar o CMS
const exemploPost = {
    titulo: "Bem-vindos ao nosso novo blog!",
    data: new Date().toISOString(),
    autor: "Equipe FISIO",
    imagem: "/imagens/blog-exemplo.jpg",
    resumo: "Confira nosso novo blog com dicas de fisioterapia e novidades da clínica.",
    conteudo: "# Bem-vindos ao nosso blog!\n\nEste é um exemplo de post. Você pode editar ou deletar este conteúdo através do painel administrativo.\n\n## O que você encontrará aqui\n\n- Dicas de fisioterapia\n- Novidades da clínica\n- Tratamentos inovadores\n- Exercícios para casa\n\n**Fique sempre atualizado!**",
    categoria: "novidades",
    tags: ["blog", "novidades", "fisioterapia"],
    publicado: true,
    destaque: true
};

fs.writeFileSync('_data/blog/2025-01-01-bem-vindos.json', JSON.stringify(exemploPost, null, 2), 'utf8');
console.log('✅ Post exemplo criado em _data/blog/');

// Criar exemplo de estrutura
const exemploEstrutura = {
    titulo: "Sala de Pilates",
    descricao: "Espaço amplo e equipado para pilates clínico e terapêutico",
    imagem: "/imagens/sala-pilates.jpg",
    icone: "fa-spa",
    ordem: 1,
    ativo: true
};

fs.writeFileSync('_data/estrutura/sala-pilates.json', JSON.stringify(exemploEstrutura, null, 2), 'utf8');
console.log('✅ Exemplo de estrutura criado');

// Criar exemplo de fisioterapeuta
const exemploFisio = {
    nome: "Dr. João Silva",
    especialidade: "Fisioterapia Esportiva",
    crefito: "CREFITO-3/123456-F",
    unidade: "jundiai",
    foto: "/imagens/dr-joao-silva.jpg",
    bio: "Especialista em fisioterapia esportiva com mais de 10 anos de experiência. Formado pela USP com especializações em lesões esportivas.",
    experiencia: 10,
    telefone: "(11) 98888-8888",
    email: "joao.silva@fisioclinica.com.br",
    formacao: [
        {
            instituicao: "USP",
            curso: "Fisioterapia",
            ano: 2014
        },
        {
            instituicao: "UNIFESP",
            curso: "Especialização em Fisioterapia Esportiva",
            ano: 2016
        }
    ],
    ativo: true
};

fs.writeFileSync('_data/fisioterapeutas/dr-joao-silva.json', JSON.stringify(exemploFisio, null, 2), 'utf8');
console.log('✅ Exemplo de fisioterapeuta criado');

console.log('\n🎉 ESTRUTURA CRIADA COM SUCESSO!');
console.log('📝 Próximos passos:');
console.log('1. Execute: git add . && git commit -m "Estrutura CMS" && git push');
console.log('2. Acesse: https://fisioclinica.netlify.app/admin/');
console.log('3. Faça login e teste as edições!');