const Processamento =
    require("../models/Processamento");


/**
 * =========================================================
 * PREPARE DOCUMENT
 * =========================================================
 */
function prepararDocumento(
    documento
) {

    const dados =
        documento
            ?.dadosExtraidos ||
        {};


    return {

        arquivo:
            documento.arquivo,

        nomeArquivoServidor:
            documento
                .nomeArquivoServidor,

        caminho:
            documento.caminho,

        mimetype:
            documento.mimetype,

        tamanho:
            documento.tamanho,

        extensao:
            documento.extensao,

        identificado:
            documento.identificado,

        tipo:
            documento.tipo,

        documento:
            documento.documento,

        categoria:
            documento.categoria,

        confianca:
            documento.confianca,

        status:
            documento.status,

        textoExtraido:
            documento.textoExtraido,


        /**
         * =================================================
         * LABORATORY
         * =================================================
         */

        paciente:
            dados.paciente ||
            {},

        solicitante:
            dados.solicitante ||
            {},

        coleta:
            dados.coleta ||
            {},

        exames:
            dados.exames ||
            [],

        resumoExames:
            dados.resumoExames ||
            {},


        /**
         * =================================================
         * IMAGING
         * =================================================
         */

        exameImagem:
            dados.exameImagem ||
            undefined,


        /**
         * =================================================
         * OCR
         * =================================================
         */

        ocr:
            documento.ocr ||
            {}

    };

}


/**
 * =========================================================
 * SAVE
 * =========================================================
 */
async function salvarProcessamento(
    analise
) {

    if (!analise) {

        throw new Error(
            "Análise inválida."
        );

    }


    const processamento =
        new Processamento({

            tipoProcesso:
                analise
                    ?.processo
                    ?.codigo ||
                "desconhecido",

            nomeProcesso:
                analise
                    ?.processo
                    ?.nome ||
                null,

            status:
                analise.status,

            mensagem:
                analise.mensagem,

            resumo:
                analise.resumo ||
                {},

            alertas:
                analise.alertas ||
                [],

            documentos:
                (
                    analise.documentos ||
                    []
                ).map(
                    prepararDocumento
                )

        });


    await processamento.save();


    return processamento;

}


/**
 * =========================================================
 * LIST
 * =========================================================
 */
async function listarProcessamentos(
    limite = 20
) {

    return Processamento
        .find()
        .sort({
            createdAt:
                -1
        })
        .limit(
            limite
        )
        .lean();

}


/**
 * =========================================================
 * FIND BY ID
 * =========================================================
 */
async function buscarPorId(
    id
) {

    return Processamento
        .findById(
            id
        )
        .lean();

}


/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */
module.exports = {

    salvarProcessamento,

    listarProcessamentos,

    buscarPorId

};

