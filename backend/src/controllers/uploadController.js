const documentoService =
    require("../services/documentoService");


const {
    analisarDocumentos
} =
    require("../services/analyzerService");


const processamentoService =
    require("../services/processamentoService");


/**
 * =========================================================
 * UPLOAD
 * =========================================================
 */
exports.upload =
    async (
        req,
        res
    ) => {

        try {

            /**
             * =================================================
             * VALIDAR ARQUIVOS
             * =================================================
             */
            if (
                !req.files ||
                req.files.length === 0
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso:
                            false,

                        mensagem:
                            "Nenhum arquivo enviado."

                    });

            }


            /**
             * =================================================
             * REGISTRAR DOCUMENTOS
             * =================================================
             */
            const documentosCriados =
                req.files.map(
                    file =>
                        documentoService
                            .criarDocumento(
                                file
                            )
                );


            /**
             * =================================================
             * PROCESSO
             * =================================================
             */
            const tipoProcesso =
                req.body
                    ?.tipoProcesso ||
                "atendimento_ambulatorial";


            /**
             * =================================================
             * ANALISAR
             * =================================================
             */
            const analise =
                await analisarDocumentos(
                    req.files,
                    tipoProcesso
                );


            /**
             * =================================================
             * SALVAR NO MONGODB
             * =================================================
             */
            const processamento =
                await processamentoService
                    .salvarProcessamento(
                        analise
                    );


            /**
             * =================================================
             * RESPOSTA
             * =================================================
             */
            return res
                .status(200)
                .json({

                    sucesso:
                        true,

                    processamentoId:
                        processamento._id,

                    mensagem:
                        analise.mensagem,

                    quantidade:
                        req.files.length,

                    processo:
                        analise.processo,

                    resumo:
                        analise.resumo,

                    status:
                        analise.status,

                    documentosCriados,

                    documentosAnalisados:
                        analise.documentos,

                    verificacao:
                        analise.verificacao,

                    alertas:
                        analise.alertas,

                    salvo:
                        true

                });


        } catch (erro) {

            console.error(
                "Erro no uploadController:",
                erro
            );


            return res
                .status(500)
                .json({

                    sucesso:
                        false,

                    mensagem:
                        "Ocorreu um erro ao processar os documentos.",

                    erro:
                        erro.message

                });

        }

    };

    