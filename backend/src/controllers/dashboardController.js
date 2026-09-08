const Processamento =
    require("../models/Processamento");


/**
 * =========================================================
 * RESUMO PRINCIPAL
 * =========================================================
 */
exports.resumo =
    async (
        req,
        res
    ) => {

        try {

            const processamentos =
                await Processamento
                    .find()
                    .lean();


            let totalDocumentos = 0;

            let totalExames = 0;

            let dentroReferencia = 0;

            let foraReferencia = 0;

            let naoInterpretados = 0;

            let somaConfianca = 0;

            let documentosComConfianca = 0;


            processamentos.forEach(
                processamento => {

                    const documentos =
                        processamento
                            .documentos || [];


                    totalDocumentos +=
                        documentos.length;


                    documentos.forEach(
                        documento => {

                            if (
                                Number.isFinite(
                                    Number(
                                        documento
                                            .confianca
                                    )
                                )
                            ) {

                                somaConfianca +=
                                    Number(
                                        documento
                                            .confianca
                                    );


                                documentosComConfianca++;

                            }


                            const exames =
                                documento
                                    .exames || [];


                            totalExames +=
                                exames.length;


                            exames.forEach(
                                exame => {

                                    switch (
                                        exame.status
                                    ) {

                                        case "NORMAL":

                                            dentroReferencia++;

                                            break;


                                        case "FORA_DA_REFERENCIA":

                                            foraReferencia++;

                                            break;


                                        default:

                                            naoInterpretados++;

                                    }

                                }
                            );

                        });

                }
            );


            const confiancaMedia =
                documentosComConfianca > 0

                    ? (
                        somaConfianca /
                        documentosComConfianca
                    ) * 100

                    : 0;


            return res.json({

                sucesso:
                    true,

                totalProcessamentos:
                    processamentos.length,

                totalDocumentos,

                totalExames,

                dentroReferencia,

                foraReferencia,

                naoInterpretados,

                confiancaMedia:
                    Number(
                        confiancaMedia
                            .toFixed(1)
                    )

            });


        } catch (erro) {

            console.error(
                "Erro dashboard resumo:",
                erro
            );


            return res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Erro ao carregar resumo do dashboard."

                });

        }

    };


/**
 * =========================================================
 * STATUS DOS EXAMES
 * =========================================================
 */
exports.statusExames =
    async (
        req,
        res
    ) => {

        try {

            const dados =
                await Processamento
                    .aggregate([

                        {
                            $unwind:
                                "$documentos"
                        },

                        {
                            $unwind:
                                "$documentos.exames"
                        },

                        {
                            $group: {

                                _id:
                                    "$documentos.exames.status",

                                total: {
                                    $sum: 1
                                }

                            }
                        },

                        {
                            $sort: {
                                total: -1
                            }
                        }

                    ]);


            return res.json({

                sucesso:
                    true,

                dados

            });


        } catch (erro) {

            console.error(
                erro
            );


            return res
                .status(500)
                .json({

                    sucesso:
                        false,

                    mensagem:
                        "Erro ao carregar status dos exames."

                });

        }

    };


/**
 * =========================================================
 * EXAMES MAIS PROCESSADOS
 * =========================================================
 */
exports.examesMaisProcessados =
    async (
        req,
        res
    ) => {

        try {

            const dados =
                await Processamento
                    .aggregate([

                        {
                            $unwind:
                                "$documentos"
                        },

                        {
                            $unwind:
                                "$documentos.exames"
                        },

                        {
                            $group: {

                                _id:
                                    "$documentos.exames.nome",

                                total: {
                                    $sum: 1
                                },

                                foraReferencia: {

                                    $sum: {

                                        $cond: [

                                            {
                                                $eq: [
                                                    "$documentos.exames.status",
                                                    "FORA_DA_REFERENCIA"
                                                ]
                                            },

                                            1,

                                            0
                                        ]

                                    }

                                }

                            }
                        },

                        {
                            $sort: {
                                total: -1
                            }
                        },

                        {
                            $limit: 12
                        }

                    ]);


            return res.json({

                sucesso:
                    true,

                dados

            });


        } catch (erro) {

            console.error(
                erro
            );


            return res
                .status(500)
                .json({

                    sucesso:
                        false,

                    mensagem:
                        "Erro ao carregar exames."

                });

        }

    };


/**
 * =========================================================
 * TIPOS DE DOCUMENTOS
 * =========================================================
 */
exports.tiposDocumentos =
    async (
        req,
        res
    ) => {

        try {

            const dados =
                await Processamento
                    .aggregate([

                        {
                            $unwind:
                                "$documentos"
                        },

                        {
                            $group: {

                                _id:
                                    "$documentos.tipo",

                                total: {
                                    $sum: 1
                                }

                            }
                        },

                        {
                            $sort: {
                                total: -1
                            }
                        }

                    ]);


            return res.json({

                sucesso:
                    true,

                dados

            });


        } catch (erro) {

            return res
                .status(500)
                .json({

                    sucesso:
                        false,

                    mensagem:
                        "Erro ao carregar tipos documentais."

                });

        }

    };


/**
 * =========================================================
 * PROCESSAMENTOS RECENTES
 * =========================================================
 */
exports.recentes =
    async (
        req,
        res
    ) => {

        try {

            const dados =
                await Processamento
                    .find()
                    .sort({
                        createdAt: -1
                    })
                    .limit(10)
                    .select(
                        "tipoProcesso nomeProcesso status resumo documentos createdAt"
                    )
                    .lean();


            const resultado =
                dados.map(
                    processamento => {

                        const primeiroDocumento =
                            processamento
                                .documentos?.[0];


                        return {

                            id:
                                processamento._id,

                            processo:
                                processamento
                                    .nomeProcesso,

                            tipoProcesso:
                                processamento
                                    .tipoProcesso,

                            status:
                                processamento
                                    .status,

                            criadoEm:
                                processamento
                                    .createdAt,

                            totalArquivos:
                                processamento
                                    ?.resumo
                                    ?.totalArquivos ||
                                0,

                            totalExames:
                                processamento
                                    ?.resumo
                                    ?.totalExames ||
                                0,

                            paciente:
                                primeiroDocumento
                                    ?.paciente
                                    ?.nome ||
                                "Não identificado",

                            documento:
                                primeiroDocumento
                                    ?.documento ||
                                "Documento",

                            confianca:
                                primeiroDocumento
                                    ?.confianca ||
                                0

                        };

                    }
                );


            return res.json({

                sucesso:
                    true,

                dados:
                    resultado

            });


        } catch (erro) {

            console.error(
                erro
            );


            return res
                .status(500)
                .json({

                    sucesso:
                        false,

                    mensagem:
                        "Erro ao carregar processamentos recentes."

                });

        }

    };


/**
 * =========================================================
 * VOLUME DIÁRIO
 * =========================================================
 */
exports.volume =
    async (
        req,
        res
    ) => {

        try {

            const dados =
                await Processamento
                    .aggregate([

                        {
                            $group: {

                                _id: {

                                    $dateToString: {

                                        format:
                                            "%Y-%m-%d",

                                        date:
                                            "$createdAt"

                                    }

                                },

                                totalProcessamentos: {
                                    $sum: 1
                                },

                                totalDocumentos: {

                                    $sum: {
                                        $size:
                                            "$documentos"
                                    }

                                }

                            }

                        },

                        {
                            $sort: {
                                _id: 1
                            }
                        },

                        {
                            $limit: 30
                        }

                    ]);


            return res.json({

                sucesso:
                    true,

                dados

            });


        } catch (erro) {

            return res
                .status(500)
                .json({

                    sucesso:
                        false,

                    mensagem:
                        "Erro ao carregar volume."

                });

        }

    };

    