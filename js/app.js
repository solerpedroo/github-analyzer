// app.js - Aplicação principal

class GitHubAnalyzer {
    constructor() {
        this.github = new GitHubAPI();
        this.ai = null;
        this.pdfExporter = new PDFExporter();
        this.currentData = {
            repo: null,
            analysis: null
        };
        
        this.elements = {
            repoUrl: document.getElementById('repoUrl'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            exportBtn: document.getElementById('exportBtn'),
            loading: document.getElementById('loading'),
            loadingStep: document.getElementById('loadingStep'),
            repoInfo: document.getElementById('repoInfo'),
            results: document.getElementById('results'),
            configAlert: document.getElementById('configAlert')
        };

        this.initEventListeners();
        this.checkConfiguration();
    }

    /**
     * Verifica se a API key está configurada
     */
    checkConfiguration() {
        if (!CONFIG.GROQ_API_KEY || CONFIG.GROQ_API_KEY.trim() === '') {
            this.elements.configAlert.classList.remove('hidden');
            this.elements.analyzeBtn.disabled = true;
        } else {
            this.elements.configAlert.classList.add('hidden');
            this.elements.analyzeBtn.disabled = false;
        }
    }

    /**
     * Inicializa event listeners
     */
    initEventListeners() {
        this.elements.analyzeBtn.addEventListener('click', () => this.analyze());
        this.elements.exportBtn.addEventListener('click', () => this.exportPDF());
        
        // Enter para analisar
        this.elements.repoUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.analyze();
        });
    }

    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        alert(`❌ Erro: ${message}`);
    }

    /**
     * Atualiza o step de loading
     */
    updateLoadingStep(message) {
        this.elements.loadingStep.textContent = message;
    }

    /**
     * Função principal de análise
     */
    async analyze() {
        const repoUrl = this.elements.repoUrl.value.trim();

        // Validações
        if (!repoUrl) {
            this.showError('Por favor, insira a URL do repositório');
            return;
        }

        if (!CONFIG.GROQ_API_KEY || CONFIG.GROQ_API_KEY.trim() === '') {
            this.showError('Configure sua API Key da Groq no arquivo config.js');
            return;
        }

        // Inicializa Groq AI
        this.ai = new GroqAI(CONFIG.GROQ_API_KEY);

        try {
            // Parse da URL
            const { owner, repo } = this.github.parseRepoURL(repoUrl);

            // Mostra loading
            this.showLoading();

            // 1. Busca informações do repositório
            this.updateLoadingStep('📦 Buscando informações do repositório...');
            const repoInfo = await this.github.getRepoInfo(owner, repo);
            
            // Salva dados do repositório
            this.currentData.repo = repoInfo;
            
            // Mostra informações básicas
            this.displayRepoInfo(repoInfo);

            // 2. Busca estrutura
            this.updateLoadingStep('📁 Analisando estrutura de arquivos...');
            const structure = await this.github.buildFileTree(owner, repo);
            const formattedStructure = this.github.formatStructure(structure);

            // 3. Busca arquivos importantes
            this.updateLoadingStep('📄 Lendo arquivos importantes...');
            const files = await this.github.getImportantFiles(owner, repo);

            // 4. Busca linguagens
            this.updateLoadingStep('💻 Identificando linguagens...');
            const languages = await this.github.getLanguages(owner, repo);

            // 5. Análise com IA - Resumo
            this.updateLoadingStep('🤖 Gerando resumo com IA...');
            const summary = await this.ai.generateSummary(repoInfo, files, languages);

            // 6. Análise de estrutura
            this.updateLoadingStep('🏗️ Analisando arquitetura...');
            const structureAnalysis = await this.ai.analyzeStructure(
                formattedStructure, 
                languages, 
                files
            );

            // 7. Documentação
            this.updateLoadingStep('📚 Gerando documentação...');
            const documentation = await this.ai.generateDocumentation(
                repoInfo, 
                files, 
                languages
            );

            // 8. Sugestões
            this.updateLoadingStep('💡 Criando sugestões de melhoria...');
            const suggestions = await this.ai.generateSuggestions(
                repoInfo, 
                files, 
                languages, 
                formattedStructure
            );

            // Salva dados da análise
            this.currentData.analysis = {
                summary,
                structure: structureAnalysis,
                documentation,
                suggestions
            };

            // Configura dados para exportação PDF
            this.pdfExporter.setData(this.currentData.repo, this.currentData.analysis);

            // Exibe resultados
            this.displayResults(this.currentData.analysis);

            // Esconde loading
            this.hideLoading();

        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
            console.error('Erro na análise:', error);
        }
    }

    /**
     * Exporta análise para PDF
     */
    async exportPDF() {
        if (!this.currentData.repo || !this.currentData.analysis) {
            this.showError('Nenhuma análise disponível para exportar');
            return;
        }

        try {
            this.elements.exportBtn.disabled = true;
            this.elements.exportBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Gerando PDF...
            `;

            await this.pdfExporter.generatePDF();

            this.elements.exportBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                PDF Gerado!
            `;

            setTimeout(() => {
                this.elements.exportBtn.disabled = false;
                this.elements.exportBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar PDF
                `;
            }, 2000);

        } catch (error) {
            this.showError(`Erro ao gerar PDF: ${error.message}`);
            this.elements.exportBtn.disabled = false;
            this.elements.exportBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Exportar PDF
            `;
        }
    }

    /**
     * Mostra seção de loading
     */
    showLoading() {
        this.elements.analyzeBtn.disabled = true;
        this.elements.loading.classList.remove('hidden');
        this.elements.repoInfo.classList.add('hidden');
        this.elements.results.classList.add('hidden');
    }

    /**
     * Esconde seção de loading
     */
    hideLoading() {
        this.elements.analyzeBtn.disabled = false;
        this.elements.loading.classList.add('hidden');
    }

    /**
     * Exibe informações do repositório
     */
    displayRepoInfo(info) {
        document.getElementById('repoAvatar').src = info.avatar;
        document.getElementById('repoName').textContent = info.name;
        document.getElementById('repoDescription').textContent = info.description;
        document.getElementById('repoStars').textContent = info.stars.toLocaleString();
        document.getElementById('repoForks').textContent = info.forks.toLocaleString();
        document.getElementById('repoLanguage').textContent = info.language;

        this.elements.repoInfo.classList.remove('hidden');
    }

    /**
     * Exibe resultados da análise
     */
    displayResults(results) {
        document.getElementById('summary').innerHTML = results.summary;
        document.getElementById('structure').innerHTML = results.structure;
        document.getElementById('documentation').innerHTML = results.documentation;
        document.getElementById('suggestions').innerHTML = results.suggestions;

        this.elements.results.classList.remove('hidden');

        // Scroll suave para os resultados
        this.elements.results.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new GitHubAnalyzer();
});