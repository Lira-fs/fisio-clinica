#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import chardet
from pathlib import Path
import shutil

def detectar_e_corrigir_arquivo(caminho_arquivo):
    """
    Detecta a codificação atual e converte para UTF-8
    """
    print(f"\n--- Processando: {caminho_arquivo.name} ---")
    
    try:
        # Ler arquivo em modo binário para detectar codificação
        with open(caminho_arquivo, 'rb') as f:
            conteudo_bruto = f.read()
        
        # Detectar codificação
        resultado = chardet.detect(conteudo_bruto)
        codificacao_detectada = resultado['encoding']
        confianca = resultado['confidence']
        
        print(f"Codificação detectada: {codificacao_detectada} (confiança: {confianca:.2%})")
        
        # Lista de codificações para tentar
        codificacoes_para_testar = [
            codificacao_detectada,
            'iso-8859-1',
            'windows-1252',
            'cp1252',
            'latin1',
            'utf-8'
        ]
        
        # Remover duplicatas mantendo ordem
        codificacoes_para_testar = list(dict.fromkeys(filter(None, codificacoes_para_testar)))
        
        for codificacao in codificacoes_para_testar:
            try:
                print(f"Tentando codificação: {codificacao}")
                
                # Ler arquivo com a codificação específica
                with open(caminho_arquivo, 'r', encoding=codificacao) as f:
                    conteudo = f.read()
                
                # Corrigir caracteres problemáticos específicos
                conteudo = corrigir_caracteres_especiais(conteudo)
                
                # Criar arquivo corrigido
                arquivo_corrigido = caminho_arquivo.with_suffix(f'.corrigido{caminho_arquivo.suffix}')
                
                with open(arquivo_corrigido, 'w', encoding='utf-8') as f:
                    f.write(conteudo)
                
                print(f"  ✅ Sucesso! Arquivo salvo como: {arquivo_corrigido}")
                return True
                
            except UnicodeDecodeError:
                print(f"  ❌ Erro de decodificação com {codificacao}")
                continue
            except Exception as e:
                print(f"  ❌ Erro: {e}")
                continue
        
        print("  ❌ Nenhuma codificação funcionou")
        return False
        
    except Exception as e:
        print(f"  ❌ Erro ao processar arquivo: {e}")
        return False

def corrigir_caracteres_especiais(conteudo):
    """
    Corrige caracteres especiais mal codificados
    """
    # Mapeamento de caracteres problemáticos
    correções = {
        'Ã¡': 'á',
        'Ã ': 'à',
        'Ã¢': 'â',
        'Ã£': 'ã',
        'Ã©': 'é',
        'Ãª': 'ê',
        'Ã­': 'í',
        'Ã³': 'ó',
        'Ã´': 'ô',
        'Ãµ': 'õ',
        'Ãº': 'ú',
        'Ã§': 'ç',
        'Ã±': 'ñ',
        'Ã¼': 'ü',
        'Ã‡': 'Ç',
        'Ã€': 'À',
        'Ã': 'Á',
        'Ã‚': 'Â',
        'Ãƒ': 'Ã',
        'Ã‰': 'É',
        'ÃŠ': 'Ê',
        'Ã': 'Í',
        'Ã"': 'Ó',
        'Ã"': 'Ô',
        'Ã•': 'Õ',
        'Ãš': 'Ú',
        'Ã±': 'ñ',
        'Ã': 'Ñ',
        'ClÃ­nica': 'Clínica',
        'FisioterapÃªutico': 'Fisioterapêutico',
        'ExcelÃªncia': 'Excelência',
        'reabilitaÃ§Ã£o': 'reabilitação',
        'avaliaÃ§Ã£o': 'avaliação',
        'recuperaÃ§Ã£o': 'recuperação',
        'tratamento': 'tratamento',
        'tÃ©cnicas': 'técnicas',
        'prÃ³prio': 'próprio',
        'EspecializaÃ§Ã£o': 'Especialização',
        'VÃ¡rzea': 'Várzea',
        'JundiaÃ­': 'Jundiaí',
        'histÃ³ria': 'história',
        'âž': '→'
    }
    
    # Aplicar correções
    for errado, correto in correções.items():
        conteudo = conteudo.replace(errado, correto)
    
    return conteudo

def fazer_backup(pasta):
    """
    Cria backup da pasta original
    """
    pasta = Path(pasta)
    backup_path = pasta.parent / f"{pasta.name}_backup"
    
    if not backup_path.exists():
        shutil.copytree(pasta, backup_path)
        print(f"✅ Backup criado em: {backup_path}")
    else:
        print(f"⚠️  Backup já existe em: {backup_path}")

def processar_pasta(pasta, extensoes=['.html', '.css', '.js']):
    """
    Processa todos os arquivos da pasta com as extensões especificadas
    """
    pasta = Path(pasta)
    
    if not pasta.exists():
        print(f"❌ Pasta não encontrada: {pasta}")
        return
    
    # Fazer backup antes de processar
    fazer_backup(pasta)
    
    arquivos_encontrados = []
    
    # Buscar arquivos recursivamente
    for extensao in extensoes:
        arquivos_encontrados.extend(pasta.rglob(f"*{extensao}"))
    
    if not arquivos_encontrados:
        print(f"❌ Nenhum arquivo encontrado com extensões: {extensoes}")
        return
    
    print(f"📁 Encontrados {len(arquivos_encontrados)} arquivos para processar")
    
    sucessos = 0
    for arquivo in arquivos_encontrados:
        if detectar_e_corrigir_arquivo(arquivo):
            sucessos += 1
    
    print(f"\n{'='*50}")
    print(f"📊 RESUMO")
    print(f"{'='*50}")
    print(f"Arquivos processados: {len(arquivos_encontrados)}")
    print(f"✅ Sucessos: {sucessos}")
    print(f"❌ Falhas: {len(arquivos_encontrados) - sucessos}")

def substituir_originais(pasta):
    """
    Substitui arquivos originais pelos corrigidos
    """
    pasta = Path(pasta)
    
    arquivos_corrigidos = list(pasta.rglob("*.corrigido.*"))
    
    if not arquivos_corrigidos:
        print("❌ Nenhum arquivo corrigido encontrado!")
        return
    
    print(f"🔄 Substituindo {len(arquivos_corrigidos)} arquivos...")
    
    for arquivo_corrigido in arquivos_corrigidos:
        # Descobrir nome do arquivo original
        nome_original = str(arquivo_corrigido).replace('.corrigido', '')
        arquivo_original = Path(nome_original)
        
        try:
            # Substituir
            shutil.move(str(arquivo_corrigido), str(arquivo_original))
            print(f"✅ Substituído: {arquivo_original.name}")
        except Exception as e:
            print(f"❌ Erro ao substituir {arquivo_original.name}: {e}")

def instalar_dependencias():
    """
    Instala dependências necessárias
    """
    try:
        import chardet
        print("✅ Dependência 'chardet' já instalada")
    except ImportError:
        print("📦 Instalando dependência 'chardet'...")
        os.system("pip install chardet")

# Função principal
def main():
    print("🔧 CORRETOR DE ENCODING UTF-8")
    print("="*50)
    
    # Instalar dependências
    instalar_dependencias()
    
    # Pasta atual por padrão
    pasta_projeto = Path(".")
    
    print(f"📁 Pasta do projeto: {pasta_projeto.absolute()}")
    
    # Processar arquivos
    processar_pasta(pasta_projeto, ['.html', '.css', '.js'])
    
    print("\n" + "="*50)
    print("📋 PRÓXIMOS PASSOS:")
    print("="*50)
    print("1. ✅ Verifique os arquivos .corrigido gerados")
    print("2. ✅ Se estiverem corretos, execute a função substituir_originais()")
    print("3. ✅ Ou renomeie manualmente:")
    print("   - mv index.corrigido.html index.html")
    print("   - mv style.corrigido.css style.css")
    print("4. ✅ Delete os arquivos .corrigido após confirmar")
    
    # Perguntar se quer substituir automaticamente
    resposta = input("\n🤔 Deseja substituir os arquivos originais automaticamente? (s/N): ")
    if resposta.lower() in ['s', 'sim', 'y', 'yes']:
        substituir_originais(pasta_projeto)
        print("✅ Arquivos substituídos com sucesso!")
    else:
        print("⚠️  Substitua manualmente quando estiver pronto")

if __name__ == "__main__":
    main()