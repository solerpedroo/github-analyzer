// github.js - Funções para interagir com a GitHub API

class GitHubAPI {
    constructor() {
        this.baseURL = 'https://api.github.com';
    }

    /**
     * Extrai owner e repo da URL do GitHub
     */
    parseRepoURL(url) {
        const patterns = [
            /github\.com\/([^\/]+)\/([^\/]+)/,
            /^([^\/]+)\/([^\/]+)$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return {
                    owner: match[1],
                    repo: match[2].replace(/\.git$/, '')
                };
            }
        }

        throw new Error('URL inválida. Use o formato: github.com/user/repo');
    }

    /**
     * Busca informações básicas do repositório
     */
    async getRepoInfo(owner, repo) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Repositório não encontrado');
                }
                throw new Error(`Erro ao buscar repositório: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                name: data.full_name,
                description: data.description || 'Sem descrição',
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language || 'Não especificada',
                avatar: data.owner.avatar_url,
                url: data.html_url,
                topics: data.topics || [],
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                size: data.size,
                defaultBranch: data.default_branch
            };
        } catch (error) {
            throw new Error(`Erro ao acessar GitHub API: ${error.message}`);
        }
    }

    /**
     * Busca a estrutura de arquivos do repositório
     */
    async getRepoStructure(owner, repo, path = '') {
        try {
            const response = await fetch(
                `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`
            );

            if (!response.ok) {
                throw new Error(`Erro ao buscar estrutura: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Erro ao buscar estrutura: ${error.message}`);
        }
    }

    /**
     * Cria uma árvore de arquivos recursiva (limitada para performance)
     */
    async buildFileTree(owner, repo, path = '', depth = 0, maxDepth = 3) {
        if (depth >= maxDepth) {
            return null;
        }

        try {
            const contents = await this.getRepoStructure(owner, repo, path);
            const tree = [];

            // Limita para evitar muitas requisições
            const limitedContents = contents.slice(0, 20);

            for (const item of limitedContents) {
                if (item.type === 'dir') {
                    tree.push({
                        name: item.name,
                        type: 'dir',
                        path: item.path
                    });
                } else {
                    tree.push({
                        name: item.name,
                        type: 'file',
                        path: item.path,
                        size: item.size
                    });
                }
            }

            return tree;
        } catch (error) {
            console.error('Erro ao construir árvore:', error);
            return [];
        }
    }

    /**
     * Busca o conteúdo de arquivos importantes (README, package.json, etc)
     */
    async getImportantFiles(owner, repo) {
        const importantFiles = [
            'README.md',
            'package.json',
            'requirements.txt',
            'setup.py',
            'Cargo.toml',
            'go.mod',
            'pom.xml',
            'build.gradle'
        ];

        const files = {};

        for (const filename of importantFiles) {
            try {
                const response = await fetch(
                    `${this.baseURL}/repos/${owner}/${repo}/contents/${filename}`
                );

                if (response.ok) {
                    const data = await response.json();
                    // Decodifica conteúdo base64
                    const content = atob(data.content);
                    files[filename] = content;
                }
            } catch (error) {
                // Arquivo não existe, continua
                continue;
            }
        }

        return files;
    }

    /**
     * Busca linguagens usadas no repositório
     */
    async getLanguages(owner, repo) {
        try {
            const response = await fetch(
                `${this.baseURL}/repos/${owner}/${repo}/languages`
            );

            if (!response.ok) {
                return {};
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar linguagens:', error);
            return {};
        }
    }

    /**
     * Formata a estrutura para visualização
     */
    formatStructure(tree, indent = 0) {
        if (!tree || tree.length === 0) {
            return 'Estrutura não disponível';
        }

        let output = '';
        const prefix = '  '.repeat(indent);

        for (const item of tree) {
            const icon = item.type === 'dir' ? '📁' : '📄';
            output += `${prefix}${icon} ${item.name}\n`;
        }

        return output;
    }

    /**
     * Calcula estatísticas do repositório
     */
    calculateStats(languages, files) {
        const stats = {
            totalFiles: Object.keys(files).length,
            languages: Object.keys(languages).length,
            mainLanguage: null,
            hasTests: false,
            hasDocs: false,
            hasCI: false
        };

        // Linguagem principal
        if (Object.keys(languages).length > 0) {
            const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
            stats.mainLanguage = sorted[0][0];
        }

        // Verifica presença de arquivos importantes
        stats.hasTests = Object.keys(files).some(f => 
            f.includes('test') || f.includes('spec')
        );
        
        stats.hasDocs = 'README.md' in files;
        
        stats.hasCI = Object.keys(files).some(f => 
            f.includes('.github') || f.includes('.gitlab-ci') || f.includes('jenkinsfile')
        );

        return stats;
    }
}

// Exporta para uso global
window.GitHubAPI = GitHubAPI;