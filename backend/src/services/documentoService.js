const Documento = require("../models/Documento");


/**
 * =========================================================
 * SMARTDOCS - DOCUMENTO SERVICE
 * =========================================================
 *
 * Responsável por criar e armazenar temporariamente
 * os objetos Documento recebidos através do upload.
 *
 * A análise inteligente dos documentos NÃO acontece aqui.
 * Essa responsabilidade pertence ao analyzerService.
 *
 * =========================================================
 */


/**
 * Armazenamento temporário em memória.
 *
 * Futuramente isso poderá ser substituído por:
 *
 * - MongoDB
 * - PostgreSQL
 * - outro banco de dados
 */
const documentos = [];


/**
 * =========================================================
 * CRIAR DOCUMENTO
 * =========================================================
 *
 * Recebe um arquivo vindo do Multer e transforma
 * esse arquivo em uma instância do model Documento.
 */
function criarDocumento(file) {

    if (!file) {
        throw new Error(
            "Arquivo inválido ao criar documento."
        );
    }


    const documento = new Documento({

        nomeOriginal:
            file.originalname,

        nomeArquivo:
            file.filename,

        caminho:
            file.path,

        tipo:
            file.mimetype,

        tamanho:
            file.size,

        /**
         * O documento acabou de ser recebido.
         *
         * A análise será feita posteriormente
         * pelo analyzerService.
         */
        status:
            "recebido"
    });


    /**
     * Por enquanto guardamos em memória.
     */
    documentos.push(documento);


    return documento;
}


/**
 * =========================================================
 * LISTAR DOCUMENTOS
 * =========================================================
 */
function listarDocumentos() {

    return documentos;
}


/**
 * =========================================================
 * BUSCAR DOCUMENTO
 * =========================================================
 *
 * Procura pelo nome gerado pelo Multer.
 */
function buscarDocumento(nomeArquivo) {

    return documentos.find(
        documento =>
            documento.nomeArquivo === nomeArquivo
    ) || null;
}


/**
 * =========================================================
 * REMOVER DOCUMENTO
 * =========================================================
 */
function removerDocumento(nomeArquivo) {

    const indice = documentos.findIndex(
        documento =>
            documento.nomeArquivo === nomeArquivo
    );


    if (indice === -1) {
        return false;
    }


    documentos.splice(indice, 1);

    return true;
}


/**
 * =========================================================
 * ATUALIZAR DOCUMENTO APÓS ANÁLISE
 * =========================================================
 *
 * Essa função poderá ser usada futuramente para
 * transferir os resultados do analyzerService para
 * o model Documento.
 */
function atualizarAnalise(
    nomeArquivo,
    analise
) {

    const documento =
        buscarDocumento(nomeArquivo);


    if (!documento) {
        return null;
    }


    if (analise.tipoDocumento !== undefined) {
        documento.tipoDocumento =
            analise.tipoDocumento;
    }


    if (analise.dadosExtraidos !== undefined) {
        documento.dadosExtraidos =
            analise.dadosExtraidos;
    }


    if (analise.confianca !== undefined) {
        documento.confianca =
            analise.confianca;
    }


    documento.status =
        analise.status ||
        "analisado";


    return documento;
}


/**
 * =========================================================
 * LIMPAR DOCUMENTOS
 * =========================================================
 *
 * Útil durante desenvolvimento/testes.
 */
function limparDocumentos() {

    documentos.length = 0;

    return true;
}


/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */
module.exports = {

    criarDocumento,

    listarDocumentos,

    buscarDocumento,

    removerDocumento,

    atualizarAnalise,

    limparDocumentos
};