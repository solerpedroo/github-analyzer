// pdf.js - Exportação para PDF

class PDFExporter {
    constructor() {
        this.repoData = null;
        this.analysisData = null;
    }

    /**
     * Define os dados para exportação
     */
    setData(repoData, analysisData) {
        this.repoData = repoData;
        this.analysisData = analysisData;
    }

    /**
     * Converte HTML em texto simples formatado
     */
    htmlToText(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        let text = temp.textContent || temp.innerText || '';
        
        // Remove espaços extras
        text = text.replace(/\n\s*\n/g, '\n\n');
        text = text.trim();
        
        return text;
    }

    /**
     * Adiciona cabeçalho ao PDF
     */
    addHeader(doc, pageWidth) {
        doc.setFillColor(14, 165, 233);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('GitHub Analyzer', 20, 25);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Análise de Repositório com IA', 20, 33);
    }

    /**
     * Adiciona rodapé ao PDF
     */
    addFooter(doc, pageNumber, pageWidth, pageHeight) {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        
        const date = new Date().toLocaleDateString('pt-BR');
        doc.text(`Gerado em ${date}`, 20, pageHeight - 11);
        
        doc.text(`Página ${pageNumber}`, pageWidth - 40, pageHeight - 11);
    }

    /**
     * Adiciona título de seção
     */
    addSectionTitle(doc, title, yPos) {
        doc.setFillColor(14, 165, 233);
        doc.rect(15, yPos - 5, 5, 10, 'F');
        
        doc.setTextColor(14, 165, 233);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(title, 25, yPos + 2);
        
        return yPos + 15;
    }

    /**
     * Adiciona texto formatado
     */
    addFormattedText(doc, text, yPos, pageWidth, pageHeight) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        const maxWidth = pageWidth - 40;
        const lines = doc.splitTextToSize(text, maxWidth);
        
        let currentY = yPos;
        
        for (let i = 0; i < lines.length; i++) {
            // Verifica se precisa de nova página
            if (currentY > pageHeight - 40) {
                doc.addPage();
                this.addHeader(doc, pageWidth);
                currentY = 50;
            }
            
            doc.text(lines[i], 20, currentY);
            currentY += 7;
        }
        
        return currentY + 5;
    }

    /**
     * Adiciona informações do repositório
     */
    addRepoInfo(doc, yPos, pageWidth, pageHeight) {
        yPos = this.addSectionTitle(doc, '📦 Informações do Repositório', yPos);
        
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(this.repoData.name, 20, yPos + 10);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(148, 163, 184);
        
        const description = doc.splitTextToSize(this.repoData.description, pageWidth - 50);
        doc.text(description, 20, yPos + 18);
        
        doc.setFontSize(9);
        doc.text(`⭐ ${this.repoData.stars} estrelas`, 20, yPos + 35);
        doc.text(`🔀 ${this.repoData.forks} forks`, 90, yPos + 35);
        doc.text(`💻 ${this.repoData.language}`, 160, yPos + 35);
        
        return yPos + 55;
    }

    /**
     * Gera e baixa o PDF
     */
    async generatePDF() {
        if (!this.repoData || !this.analysisData) {
            throw new Error('Dados não configurados para exportação');
        }

        // Inicializa jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Adiciona cabeçalho
        this.addHeader(doc, pageWidth);

        let yPos = 55;

        // Informações do repositório
        yPos = this.addRepoInfo(doc, yPos, pageWidth, pageHeight);
        yPos += 10;

        // Resumo
        yPos = this.addSectionTitle(doc, '📄 Resumo do Projeto', yPos);
        const summaryText = this.htmlToText(this.analysisData.summary);
        yPos = this.addFormattedText(doc, summaryText, yPos, pageWidth, pageHeight);
        yPos += 10;

        // Nova página para estrutura
        if (yPos > pageHeight - 80) {
            doc.addPage();
            this.addHeader(doc, pageWidth);
            yPos = 55;
        }

        // Análise de Estrutura
        yPos = this.addSectionTitle(doc, '🏗️ Análise da Estrutura', yPos);
        const structureText = this.htmlToText(this.analysisData.structure);
        yPos = this.addFormattedText(doc, structureText, yPos, pageWidth, pageHeight);
        yPos += 10;

        // Nova página para documentação
        doc.addPage();
        this.addHeader(doc, pageWidth);
        yPos = 55;

        // Documentação
        yPos = this.addSectionTitle(doc, '📚 Documentação', yPos);
        const docText = this.htmlToText(this.analysisData.documentation);
        yPos = this.addFormattedText(doc, docText, yPos, pageWidth, pageHeight);
        yPos += 10;

        // Nova página para sugestões
        doc.addPage();
        this.addHeader(doc, pageWidth);
        yPos = 55;

        // Sugestões
        yPos = this.addSectionTitle(doc, '💡 Sugestões de Melhoria', yPos);
        const suggestionsText = this.htmlToText(this.analysisData.suggestions);
        yPos = this.addFormattedText(doc, suggestionsText, yPos, pageWidth, pageHeight);

        // Adiciona rodapé em todas as páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            this.addFooter(doc, i, pageWidth, pageHeight);
        }

        // Salva o PDF
        const fileName = `${this.repoData.name.replace('/', '_')}_analise.pdf`;
        doc.save(fileName);
    }
}

// Exporta para uso global
window.PDFExporter = PDFExporter;