#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import chardet
from pathlib import Path
import shutil

def mostrar_preview(conteudo, linhas=10):
    """
    Mostra preview do conteúdo corrigido
    """
    linhas_conteudo = conteudo.split('\n')
    print(f"\n📄 PREVIEW (primeiras {linhas} linhas):")
    print("=" * 50)
    
    for i, linha in enumerate(linhas_conteudo[:linhas], 1):
        print(f"{i:2d}: {linha}")
    
    if len(linhas_conteudo) > linhas:
        print(f"... (mais {len(linhas_conteudo) - linhas} linhas)")
    print("=" * 50)

def corrigir_caracteres_especiais(conteudo):
    """
    Corrige caracteres especiais mal codificados
    """
    correcoes = {
        'Ã¡': 'á', 'Ã ': 'à', 'Ã¢': 'â', 'Ã£': 'ã',
        'Ã©': 'é', 'Ãª': 'ê', 'Ã­': 'í', 'Ã³': 'ó',
        'Ã´': 'ô', 'Ãµ': 'õ', 'Ãº': 'ú', 'Ã§': 'ç',
        'Ã±': 'ñ', 'Ã¼': 'ü', 'Ã‡': 'Ç', 'Ã€': 'À',
        'Ã�': 'Á', 'Ã‚': 'Â', 'Ãƒ': 'Ã', 'Ã‰': 'É',
        'ÃŠ': 'Ê', 'Ã�': 'Í', 'Ã“': 'Ó', 'Ã”': 'Ô',
        'Ã•': 'Õ', 'Ãš': 'Ú', 'Ã‘': 'Ñ',

        # Correções específicas do seu projeto
        'ClÃ­nica': 'Clínica',
        'FisioterapÃªutico': 'Fisioterapêutico',
        'ExcelÃªncia': 'Excelência',
        'reabilitaÃ§Ã£o': 'reabilitação',
        'avaliaÃ§Ã£o': 'avaliação',
        'recuperaÃ§Ã£o': 'recuperação',
        'tÃ©cnicas': 'técnicas',
        'prÃ³prio': 'próprio',
        'EspecializaÃ§Ã£o': 'Especialização',
        'VÃ¡rzea': 'Várzea',
        'JundiaÃ­': 'Jundiaí',
        'histÃ³ria': 'história',
    }

    for errado, correto in correcoes.items():
        conteudo = conteudo.replace(errado, correto)

    return conteudo


def processar_arquivo_interativo(caminho_arquivo):
    """
    Processa um arquivo com confirmação do usuário
    """
    print(f"\n{'='*60}")
    print(f"📁 PROCESSANDO: {caminho_arquivo.name}")
    print(f"🔍 Caminho: {caminho_arquivo}")
    print(f"{'='*60}")
    
    try:
        # Ler arquivo em modo binário
        with open(caminho_arquivo, 'rb') as f:
            conteudo_bruto = f.read()
        
        # Detectar codificação
        resultado = chardet.detect(conteudo_bruto)
        codificacao_detectada = resultado['encoding']
        confianca = resultado['confidence']
        
        print(f"🔍 Codificação detectada: {codificacao_detectada} (confiança: {confianca:.1%})")
        
        # Lista de codificações para tentar
        codificacoes = [codificacao_detectada, 'utf-8', 'iso-8859-1', 'windows-1252', 'latin1']
        codificacoes = list(dict.fromkeys(filter(None, codificacoes)))
        
        conteudo_original = None
        codificacao_usada = None
        
        # Tentar ler com diferentes codificações
        for codificacao in codificacoes:
            try:
                with open(caminho_arquivo, 'r', encoding=codificacao) as f:
                    conteudo_original = f.read()
                codificacao_usada = codificacao
                print(f"✅ Leitura bem-sucedida com: {codificacao}")
                break
            except UnicodeDecodeError:
                print(f"❌ Falha com: {codificacao}")
                continue
        
        if not conteudo_original:
            print("❌ Não foi possível ler o arquivo com nenhuma codificação!")
            return False
        
        # Verificar se precisa de correção
        caracteres_problematicos = ['Ã¡', 'Ã§', 'Ã£', 'Ã©', 'ClÃ­nica', 'ExcelÃªncia', 'ÃƒÂ¡', 'ÃƒÂ§']
        precisa_correcao = any(char in conteudo_original for char in caracteres_problematicos)
        
        if not precisa_correcao:
            print("✅ Arquivo já está correto! Nenhuma correção necessária.")
            input("\n⏸️  Pressione ENTER para continuar...")
            return True
        
        print("\n⚠️  CARACTERES PROBLEMÁTICOS ENCONTRADOS!")
        
        # Mostrar preview do conteúdo original
        print("\n📄 CONTEÚDO ATUAL (com problemas):")
        mostrar_preview(conteudo_original)
        
        # Aplicar correções
        print("\n🔧 APLICANDO CORREÇÕES...")
        conteudo_corrigido = corrigir_caracteres_especiais(conteudo_original)
        
        # Mostrar preview do conteúdo corrigido
        print("\n📄 CONTEÚDO CORRIGIDO:")
        mostrar_preview(conteudo_corrigido)
        
        # Perguntar se quer aplicar
        print(f"\n🤔 O que deseja fazer com {caminho_arquivo.name}?")
        print("1 - ✅ Aplicar correções e substituir arquivo")
        print("2 - 💾 Salvar como .corrigido (manter original)")
        print("3 - ⏭️  Pular este arquivo")
        print("4 - 🛑 Sair do programa")
        
        while True:
            escolha = input("\nDigite sua escolha (1/2/3/4): ").strip()
            
            if escolha == '1':
                # Substituir arquivo original
                with open(caminho_arquivo, 'w', encoding='utf-8') as f:
                    f.write(conteudo_corrigido)
                print(f"✅ Arquivo {caminho_arquivo.name} atualizado com sucesso!")
                return True
                
            elif escolha == '2':
                # Salvar como .corrigido
                arquivo_corrigido = caminho_arquivo.with_suffix(f'.corrigido{caminho_arquivo.suffix}')
                with open(arquivo_corrigido, 'w', encoding='utf-8') as f:
                    f.write(conteudo_corrigido)
                print(f"💾 Salvo como: {arquivo_corrigido.name}")
                return True
                
            elif escolha == '3':
                print("⏭️ Arquivo pulado.")
                return True
                
            elif escolha == '4':
                print("🛑 Programa encerrado pelo usuário.")
                return False
                
            else:
                print("❌ Opção inválida! Digite 1, 2, 3 ou 4.")
    
    except Exception as e:
        print(f"❌ Erro ao processar {caminho_arquivo.name}: {e}")
        return True

def selecionar_arquivos(pasta, extensoes=['.html', '.css', '.js']):
    """
    Permite ao usuário selecionar quais arquivos processar
    """
    pasta = Path(pasta)
    
    # Encontrar todos os arquivos
    arquivos_encontrados = []
    for extensao in extensoes:
        arquivos_encontrados.extend(pasta.rglob(f"*{extensao}"))
    
    if not arquivos_encontrados:
        print(f"❌ Nenhum arquivo encontrado com extensões: {extensoes}")
        return []
    
    print(f"\n🔍 ARQUIVOS ENCONTRADOS ({len(arquivos_encontrados)}):")
    print("="*50)
    
    for i, arquivo in enumerate(arquivos_encontrados, 1):
        print(f"{i:2d}. {arquivo.name} ({arquivo.parent})")
    
    print("\n🎯 OPÇÕES:")
    print("A - Processar TODOS os arquivos")
    print("N - Escolher arquivos por NÚMERO (ex: 1,3,5)")
    print("Q - Sair")
    
    while True:
        escolha = input("\nSua escolha: ").strip().upper()
        
        if escolha == 'A':
            return arquivos_encontrados
            
        elif escolha == 'Q':
            return []
            
        elif escolha == 'N':
            numeros = input("Digite os números separados por vírgula (ex: 1,3,5): ").strip()
            try:
                indices = [int(n.strip()) - 1 for n in numeros.split(',')]
                arquivos_selecionados = [arquivos_encontrados[i] for i in indices if 0 <= i < len(arquivos_encontrados)]
                return arquivos_selecionados
            except (ValueError, IndexError):
                print("❌ Números inválidos! Tente novamente.")
        else:
            print("❌ Opção inválida! Digite A, N ou Q.")

def main():
    print("🔧 CORRETOR INTERATIVO DE ENCODING UTF-8")
    print("="*60)
    print("🔍 Este script irá processar seus arquivos um por um")
    print("👀 Você poderá ver as mudanças antes de aplicá-las")
    print("="*60)
    
    # Pasta atual
    pasta_projeto = Path(".")
    print(f"📁 Pasta: {pasta_projeto.absolute()}")
    
    # Selecionar arquivos
    arquivos = selecionar_arquivos(pasta_projeto)
    
    if not arquivos:
        print("🛑 Nenhum arquivo selecionado. Encerrando...")
        return
    
    print(f"\n🚀 INICIANDO PROCESSAMENTO DE {len(arquivos)} ARQUIVO(S)...")
    
    # Processar arquivo por arquivo
    processados = 0
    for i, arquivo in enumerate(arquivos, 1):
        print(f"\n📊 PROGRESSO: {i}/{len(arquivos)}")
        
        if not processar_arquivo_interativo(arquivo):
            print("🛑 Processamento interrompido.")
            break
        
        processados += 1
    
    print(f"\n🎉 CONCLUÍDO!")
    print(f"📊 Arquivos processados: {processados}/{len(arquivos)}")
    print("✅ Encoding UTF-8 aplicado com sucesso!")

if __name__ == "__main__":
    main()