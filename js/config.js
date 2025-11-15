// config.js - Arquivo de Configuração
// IMPORTANTE: Adicione sua API Key da Groq aqui

const CONFIG = {
    // Obtenha sua chave gratuita em: https://console.groq.com/keys
    GROQ_API_KEY: 'sua_api_key_aqui', // COLOQUE SUA API KEY AQUI
    
    // Modelo de IA (recomendado: llama-3.3-70b-versatile)
    AI_MODEL: 'llama-3.3-70b-versatile',
    
    // Configurações de análise
    MAX_FOLDER_DEPTH: 3, // Profundidade máxima para análise de pastas
    MAX_FILES_PER_FOLDER: 20, // Máximo de arquivos por pasta
    
    // Configurações de PDF
    PDF_CONFIG: {
        title: 'Análise de Repositório GitHub',
        author: 'GitHub Analyzer',
        subject: 'Análise Automatizada com IA',
        keywords: 'github, análise, ia, groq'
    }
};

// Exporta a configuração
window.CONFIG = CONFIG;