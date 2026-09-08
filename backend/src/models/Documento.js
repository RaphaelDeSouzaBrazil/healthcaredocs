class Documento {

    constructor({
        nomeOriginal,
        nomeArquivo,
        caminho,
        tipo,
        tamanho,
        status = "recebido",
        tipoDocumento = null,
        dadosExtraidos = null,
        confianca = null
    }) {

        this.id = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;

        this.nomeOriginal = nomeOriginal;

        this.nomeArquivo = nomeArquivo;

        this.caminho = caminho;

        this.tipo = tipo;

        this.tamanho = tamanho;

        this.status = status;

        this.tipoDocumento = tipoDocumento;

        this.dadosExtraidos = dadosExtraidos;

        this.confianca = confianca;

        this.criadoEm = new Date();

        this.atualizadoEm = new Date();
    }


    /**
     * Atualiza os dados da análise do documento.
     */
    atualizarAnalise({
        tipoDocumento,
        dadosExtraidos,
        confianca,
        status = "analisado"
    }) {

        if (tipoDocumento !== undefined) {
            this.tipoDocumento = tipoDocumento;
        }

        if (dadosExtraidos !== undefined) {
            this.dadosExtraidos = dadosExtraidos;
        }

        if (confianca !== undefined) {
            this.confianca = confianca;
        }

        this.status = status;

        this.atualizadoEm = new Date();

        return this;
    }


    /**
     * Marca o documento como pendente de revisão manual.
     */
    marcarParaRevisao() {

        this.status = "revisao_manual";

        this.atualizadoEm = new Date();

        return this;
    }


    /**
     * Retorna uma representação simples do documento.
     */
    toJSON() {

        return {
            id: this.id,
            nomeOriginal: this.nomeOriginal,
            nomeArquivo: this.nomeArquivo,
            caminho: this.caminho,
            tipo: this.tipo,
            tamanho: this.tamanho,
            status: this.status,
            tipoDocumento: this.tipoDocumento,
            dadosExtraidos: this.dadosExtraidos,
            confianca: this.confianca,
            criadoEm: this.criadoEm,
            atualizadoEm: this.atualizadoEm
        };
    }
}


module.exports = Documento;