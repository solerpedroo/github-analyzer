# 🚀 GitHub Analyzer - Análise Inteligente de Repositórios

Uma aplicação web moderna que utiliza **IA (Groq)** para analisar repositórios do GitHub automaticamente, gerando documentação, resumos e sugestões de melhorias. Inclui **exportação para PDF** formatado profissionalmente.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Groq](https://img.shields.io/badge/Groq-AI-orange)

## ✨ Funcionalidades

- 🔍 **Análise Completa**: Busca informações detalhadas de qualquer repositório público do GitHub
- 🤖 **IA Poderosa**: Utiliza Groq AI (Llama 3.3 70B) para análises inteligentes
- 📊 **Resumo Automático**: Gera resumos profissionais do projeto em Markdown
- 🏗️ **Análise de Arquitetura**: Identifica padrões e estrutura do código
- 📚 **Documentação Automática**: Cria documentação profissional formatada
- 💡 **Sugestões Inteligentes**: Recomendações práticas de melhorias priorizadas
- 📄 **Exportação PDF**: Gera relatórios PDF completos e bem formatados
- 🎨 **Interface Moderna**: Design com tema azul e animações suaves
- 📱 **Totalmente Responsivo**: Funciona em desktop, tablet e mobile
- 🔒 **Seguro**: API Key configurada em arquivo local (não exposta)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com animações
- **JavaScript**: Lógica da aplicação (ES6+)

### Bibliotecas
- **jsPDF**: Geração de PDF

### APIs
- **GitHub API**: Busca dados dos repositórios
- **Groq API**: Processamento de linguagem natural com IA

### Modelo de IA
- **Llama 3.3 70B Versatile**: Modelo rápido e poderoso da Meta

## 📁 Estrutura do Projeto

```
github-analyzer/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos e animações
├── js/
│   ├── config.js      # ⚙️ CONFIGURAÇÃO (API KEY aqui!)
│   ├── app.js         # Aplicação principal
│   ├── github.js      # Integração GitHub API
│   ├── ai.js          # Integração Groq API
│   └── pdf.js         # Exportação PDF
└── README.md          # Este arquivo
```

## 🚀 Como Usar

### 1. Clone o Repositório

```bash
git clone https://github.com/solerpedroo/github-analyzer
cd github-analyzer
```

### 2. Configure sua API Key da Groq

**IMPORTANTE**: Este projeto usa um arquivo de configuração para sua API Key, mantendo-a segura.

1. Acesse [console.groq.com/keys](https://console.groq.com/keys)
2. Crie uma conta gratuita
3. Gere uma nova API Key
4. **Abra o arquivo `js/config.js`**
5. Cole sua API Key no local indicado:

```javascript
const CONFIG = {
    GROQ_API_KEY: 'sua_api_key_aqui', // ⬅️ COLE AQUI
    // ...
};
```

### 3. Execute o Projeto

**Opção 1 - Live Server (VSCode - Recomendado)**:
```bash
# Instale a extensão "Live Server" no VSCode
# Clique com botão direito no index.html
# Selecione "Open with Live Server"
```

**Opção 2 - Python HTTP Server**:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Abra http://localhost:8000
```

**Opção 3 - Node.js HTTP Server**:
```bash
npx http-server -p 8000
# Abra http://localhost:8000
```

**Opção 4 - Abrir Diretamente**:
```bash
# Simplesmente abra o arquivo index.html no navegador
# Nota: Algumas funcionalidades podem não funcionar por CORS
```

### 4. Use a Aplicação

1. Cole a URL de um repositório GitHub
   - Exemplo: `https://github.com/facebook/react`
2. Clique em **"Analisar Repositório"**
3. Aguarde a análise (leva cerca de 30-60 segundos)
4. Veja os resultados formatados
5. Clique em **"Exportar PDF"** para baixar o relatório

## 📄 Exportação PDF

O sistema gera PDFs profissionais com:

- ✅ Cabeçalho com logo e título
- ✅ Informações do repositório com estatísticas
- ✅ Todas as seções da análise formatadas
- ✅ Rodapé com data e paginação
- ✅ Design moderno com cores azuis
- ✅ Quebras de página automáticas
- ✅ Nome do arquivo personalizado

**Formato do PDF**:
```
nome-do-repo_analise.pdf

Conteúdo:
├── 📦 Informações do Repositório
├── 📄 Resumo do Projeto
├── 🏗️ Análise da Estrutura
├── 📚 Documentação
└── 💡 Sugestões de Melhoria
```

## 💻 Exemplos de Repositórios para Testar

```
https://github.com/facebook/react
https://github.com/vuejs/vue
https://github.com/django/django
https://github.com/laravel/laravel
https://github.com/expressjs/express
https://github.com/torvalds/linux
https://github.com/microsoft/vscode
```

## 🔧 Configuração Avançada

### Alterar o Modelo de IA

No arquivo `js/config.js`:

```javascript
AI_MODEL: 'llama-3.3-70b-versatile',  // Atual (recomendado)
// Outras opções:
// 'mixtral-8x7b-32768'     - Alternativa rápida
// 'llama-3.1-8b-instant'   - Mais rápido, menos preciso
```

### Ajustar Profundidade da Análise

No arquivo `js/config.js`:

```javascript
MAX_FOLDER_DEPTH: 3,        // Profundidade de pastas
MAX_FILES_PER_FOLDER: 20,   // Arquivos por pasta
```

### Personalizar Configurações do PDF

No arquivo `js/config.js`:

```javascript
PDF_CONFIG: {
    title: 'Análise de Repositório GitHub',
    author: 'Seu Nome Aqui',
    subject: 'Análise Automatizada com IA',
    keywords: 'github, análise, ia, groq'
}
```

## 🎨 Personalização de Cores

### Alterar Paleta de Cores

Edite as variáveis CSS no `css/style.css`:

```css
:root {
    /* Cores Azuis Atuais */
    --primary: #0ea5e9;      /* Azul principal */
    --secondary: #06b6d4;    /* Azul secundário */
    --accent: #3b82f6;       /* Azul de destaque */
    
    /* Altere para outras cores se preferir */
    /* Exemplo - Verde:
    --primary: #10b981;
    --secondary: #059669;
    --accent: #34d399;
    */
}
```

## 📊 O que a IA Analisa

### 1. Resumo do Projeto
- Objetivo principal
- Tecnologias utilizadas
- Público-alvo
- Diferenciais

### 2. Análise de Estrutura
- Tipo de arquitetura (MVC, microserviços, etc)
- Organização de pastas
- Padrões de código
- Nota de qualidade (0-10)
- Pontos fortes e fracos

### 3. Documentação
- README completo
- Instruções de instalação
- Exemplos de uso
- Como contribuir
- Informações de licença

### 4. Sugestões Priorizadas
- 🔴 **Urgentes**: Críticas e imediatas
- 🟡 **Importantes**: Próximos passos
- 🟢 **Boas Práticas**: Longo prazo
- 💡 **Dicas**: Ferramentas e recursos
- 🎯 **Plano de Ação**: Passo a passo

## 🔒 Segurança

### Proteção da API Key

- ✅ API Key armazenada em arquivo local (`config.js`)
- ✅ Nunca exposta no HTML
- ✅ Adicione `config.js` ao `.gitignore` antes de fazer commit
- ✅ Não compartilhe seu arquivo `config.js` com ninguém

### Exemplo de `config.example.js`

Para compartilhar o projeto, crie um `js/config.example.js`:

```javascript
const CONFIG = {
    GROQ_API_KEY: '', // Obtenha em: https://console.groq.com/keys
    AI_MODEL: 'llama-3.3-70b-versatile',
    MAX_FOLDER_DEPTH: 3,
    MAX_FILES_PER_FOLDER: 20,
    PDF_CONFIG: {
        title: 'Análise de Repositório GitHub',
        author: 'GitHub Analyzer',
        subject: 'Análise Automatizada com IA',
        keywords: 'github, análise, ia, groq'
    }
};

window.CONFIG = CONFIG;
```

## 🐛 Solução de Problemas

### Erro: "API Key não configurada"
- ✅ Abra `js/config.js`
- ✅ Cole sua API Key da Groq
- ✅ Salve o arquivo e recarregue a página

### Erro: "Repositório não encontrado"
- ✅ Verifique se a URL está correta
- ✅ Certifique-se que o repositório é público
- ✅ Use o formato: `github.com/user/repo`

### Erro: "Erro na API da Groq"
- ✅ Verifique se sua API Key está correta
- ✅ Confirme que você tem créditos disponíveis
- ✅ Teste a conexão com a internet

### Erro: "Rate Limit Exceeded"
- ✅ GitHub API: 60 requisições/hora sem autenticação
- ✅ Aguarde alguns minutos
- ✅ Considere adicionar um token do GitHub (futuro)

### PDF não baixa
- ✅ Verifique se o jsPDF foi carregado
- ✅ Tente em outro navegador
- ✅ Desative bloqueadores de pop-up

## 👨‍💻 Autor

Desenvolvido por Pedro Soler, um estudante de Engenharia de Software