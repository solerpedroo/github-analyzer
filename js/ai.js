// ai.js - Integração com Groq AI

class GroqAI {
    constructor(apiKey) {
        this.apiKey = apiKey || CONFIG.GROQ_API_KEY;
        this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = CONFIG.AI_MODEL;
    }

    /**
     * Faz uma requisição para a API da Groq
     */
    async chat(messages, temperature = 0.7) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: temperature,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erro na API da Groq');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            throw new Error(`Erro ao chamar Groq AI: ${error.message}`);
        }
    }

    /**
     * Formata texto em Markdown para HTML
     */
    formatMarkdown(text) {
        let html = text;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

        // Wrap lists
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Clean up
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-3]>)/g, '$1');
        html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');

        return html;
    }

    /**
     * Gera resumo do projeto
     */
    async generateSummary(repoInfo, files, languages) {
        const readme = files['README.md'] || '';
        const packageJson = files['package.json'] || '';
        
        const prompt = `Você é um analista de código experiente. Analise este repositório GitHub e forneça um resumo conciso e profissional em formato Markdown.

INFORMAÇÕES DO REPOSITÓRIO:
- Nome: ${repoInfo.name}
- Descrição: ${repoInfo.description}
- Linguagem principal: ${repoInfo.language}
- Estrelas: ${repoInfo.stars}
- Forks: ${repoInfo.forks}

LINGUAGENS USADAS:
${Object.entries(languages).map(([lang, bytes]) => `- ${lang}: ${bytes} bytes`).join('\n')}

README (primeiros 2000 caracteres):
${readme.substring(0, 2000)}

PACKAGE.JSON:
${packageJson.substring(0, 1000)}

Forneça um resumo em PORTUGUÊS (pt-BR) com estrutura Markdown:

## 🎯 Objetivo Principal
[2-3 frases descrevendo o propósito do projeto]

## 💻 Tecnologias Principais
- [Lista as tecnologias chave]

## 👥 Público-Alvo
[Quem deve usar este projeto]

## ⭐ Destaques
- [Principais diferenciais e características]

Seja direto e profissional. Use Markdown para formatação.`;

        const result = await this.chat([
            { role: 'user', content: prompt }
        ]);

        return this.formatMarkdown(result);
    }

    /**
     * Analisa a estrutura do projeto
     */
    async analyzeStructure(structure, languages, files) {
        const fileList = Object.keys(files).join(', ');
        
        const prompt = `Como analista de arquitetura de software, analise a estrutura deste projeto em formato Markdown:

ARQUIVOS PRINCIPAIS:
${fileList}

LINGUAGENS:
${Object.keys(languages).join(', ')}

ESTRUTURA:
${structure}

Forneça em PORTUGUÊS (pt-BR) uma análise estruturada em Markdown:

## 🏗️ Tipo de Arquitetura
[Identifique: MVC, microserviços, monolito, etc]

## 📁 Organização
[Explique a estrutura de pastas e convenções]

## 🎨 Padrões Detectados
[Liste os padrões de código identificados]

## 📊 Qualidade da Estrutura
**Nota:** [1-10]/10

### Pontos Fortes
- [Liste os pontos positivos]

### Áreas de Atenção
- [Liste o que pode melhorar]

Seja técnico mas compreensível.`;

        const result = await this.chat([
            { role: 'user', content: prompt }
        ]);

        return this.formatMarkdown(result);
    }

    /**
     * Gera documentação automática
     */
    async generateDocumentation(repoInfo, files, languages) {
        const readme = files['README.md'] || 'Sem README';
        const hasPackageJson = 'package.json' in files;
        const hasRequirements = 'requirements.txt' in files;
        
        const prompt = `Como escritor técnico, crie uma documentação profissional em Markdown para este projeto:

PROJETO: ${repoInfo.name}
DESCRIÇÃO: ${repoInfo.description}
LINGUAGEM: ${repoInfo.language}

README EXISTENTE:
${readme.substring(0, 1500)}

ARQUIVOS DE DEPENDÊNCIAS:
${hasPackageJson ? '✓ package.json encontrado' : '✗ package.json não encontrado'}
${hasRequirements ? '✓ requirements.txt encontrado' : '✗ requirements.txt não encontrado'}

Gere em PORTUGUÊS (pt-BR) uma documentação completa em Markdown:

# ${repoInfo.name}

## 📋 Visão Geral
[Descrição clara do que o projeto faz]

## 🚀 Como Usar

### Pré-requisitos
[Liste ferramentas necessárias]

### Instalação
\`\`\`bash
[Comandos de instalação]
\`\`\`

### Uso Básico
[Exemplos práticos]

## 🏗️ Estrutura do Projeto
[Explique a organização]

## 🤝 Como Contribuir
[Instruções para contribuidores]

## 📝 Licença
[Informações de licença]

Use Markdown completo com emojis.`;

        const result = await this.chat([
            { role: 'user', content: prompt }
        ], 0.5);

        return this.formatMarkdown(result);
    }

    /**
     * Gera sugestões de melhoria
     */
    async generateSuggestions(repoInfo, files, languages, structure) {
        const hasTests = Object.keys(files).some(f => 
            f.toLowerCase().includes('test')
        );
        const hasCI = Object.keys(files).some(f => 
            f.includes('.github') || f.includes('.gitlab')
        );
        const hasReadme = 'README.md' in files;
        const hasLicense = Object.keys(files).some(f => 
            f.toLowerCase().includes('license')
        );
        
        const prompt = `Como consultor de engenharia de software, analise este projeto e sugira melhorias em Markdown:

PROJETO: ${repoInfo.name}
LINGUAGEM: ${repoInfo.language}
ESTRELAS: ${repoInfo.stars}

STATUS ATUAL:
- README: ${hasReadme ? '✓ Presente' : '✗ Ausente'}
- Testes: ${hasTests ? '✓ Detectados' : '✗ Não detectados'}
- CI/CD: ${hasCI ? '✓ Configurado' : '✗ Não configurado'}
- Licença: ${hasLicense ? '✓ Presente' : '✗ Ausente'}

LINGUAGENS:
${Object.keys(languages).join(', ')}

Forneça em PORTUGUÊS (pt-BR) sugestões priorizadas em Markdown:

## 🔴 URGENTE
[2-3 melhorias críticas que devem ser feitas imediatamente]

## 🟡 IMPORTANTE
[3-4 melhorias relevantes para os próximos passos]

## 🟢 BOAS PRÁTICAS
[2-3 sugestões de longo prazo]

## 💡 DICAS EXTRAS
[Recomendações de ferramentas, bibliotecas, recursos]

## 🎯 Plano de Ação
1. [Primeiro passo]
2. [Segundo passo]
3. [Terceiro passo]

Seja específico e prático.`;

        const result = await this.chat([
            { role: 'user', content: prompt }
        ], 0.8);

        return this.formatMarkdown(result);
    }

    /**
     * Valida se a API key está configurada
     */
    isConfigured() {
        return this.apiKey && this.apiKey.trim().length > 0;
    }
}

// Exporta para uso global
window.GroqAI = GroqAI;