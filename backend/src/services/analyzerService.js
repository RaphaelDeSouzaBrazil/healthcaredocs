/**
 * =========================================================
 * SMARTDOCS
 * ANALYZER SERVICE
 * =========================================================
 */


const path =
    require("path");


const ocrService =
    require("./ocrService");


const clinicalExtractorService =
    require("./clinicalExtractorService");


const imagingExtractorService =
    require("./imagingExtractorService");


/**
 * =========================================================
 * DOCUMENT TYPES
 * =========================================================
 */
const TIPOS_DOCUMENTOS = [

    {
        codigo:
            "RESULTADO_LABORATORIAL",

        nome:
            "Resultado Laboratorial",

        categoria:
            "EXAMES",

        palavrasChave: [

            "resultado de exames laboratoriais",

            "resultado laboratorial",

            "exame laboratorial",

            "laboratorio de analises clinicas",

            "hemograma",

            "hemoglobina",

            "leucocitos",

            "plaquetas",

            "glicemia",

            "creatinina",

            "colesterol",

            "triglicerides"

        ]

    },


    {
        codigo:
            "LAUDO_IMAGEM",

        nome:
            "Laudo de Exame de Imagem",

        categoria:
            "DIAGNOSTICO_POR_IMAGEM",

        palavrasChave: [

            "laudo radiologico",

            "laudo de imagem",

            "tomografia computadorizada",

            "ressonancia magnetica",

            "radiografia",

            "raio x",

            "raio-x",

            "ultrassonografia",

            "ultrassom",

            "mamografia",

            "densitometria ossea",

            "pet ct",

            "pet-ct",

            "ecocardiograma",

            "angiotomografia",

            "angiorressonancia",

            "achados radiologicos",

            "impressao diagnostica"

        ]

    },


    {
        codigo:
            "LAUDO_MEDICO",

        nome:
            "Laudo Médico",

        categoria:
            "CLINICO",

        palavrasChave: [

            "laudo medico",

            "parecer medico",

            "diagnostico",

            "medico responsavel"

        ]

    },


    {
        codigo:
            "PRESCRICAO_MEDICA",

        nome:
            "Prescrição Médica",

        categoria:
            "CLINICO",

        palavrasChave: [

            "prescricao medica",

            "receita medica",

            "uso oral",

            "tomar",

            "medicamento"

        ]

    },


    {
        codigo:
            "PEDIDO_EXAME",

        nome:
            "Pedido de Exame",

        categoria:
            "EXAMES",

        palavrasChave: [

            "solicitacao de exame",

            "pedido de exame",

            "exames solicitados",

            "solicito"

        ]

    },


    {
        codigo:
            "EVOLUCAO_CLINICA",

        nome:
            "Evolução Clínica",

        categoria:
            "CLINICO",

        palavrasChave: [

            "evolucao clinica",

            "evolucao medica",

            "evolucao do paciente"

        ]

    },


    {
        codigo:
            "ANAMNESE",

        nome:
            "Anamnese",

        categoria:
            "CLINICO",

        palavrasChave: [

            "anamnese",

            "historia da doenca atual",

            "historia clinica",

            "queixa principal"

        ]

    },


    {
        codigo:
            "RELATORIO_MEDICO",

        nome:
            "Relatório Médico",

        categoria:
            "CLINICO",

        palavrasChave: [

            "relatorio medico",

            "relatorio clinico"

        ]

    },


    {
        codigo:
            "ATESTADO_MEDICO",

        nome:
            "Atestado Médico",

        categoria:
            "ADMINISTRATIVO",

        palavrasChave: [

            "atestado medico",

            "atesto para os devidos fins",

            "afastamento"

        ]

    },


    {
        codigo:
            "TERMO_CONSENTIMENTO",

        nome:
            "Termo de Consentimento",

        categoria:
            "ADMINISTRATIVO",

        palavrasChave: [

            "termo de consentimento",

            "consentimento informado",

            "consinto"

        ]

    },


    {
        codigo:
            "TERMO_CIRURGICO",

        nome:
            "Termo Cirúrgico",

        categoria:
            "CIRURGICO",

        palavrasChave: [

            "termo cirurgico",

            "procedimento cirurgico",

            "cirurgia"

        ]

    },


    {
        codigo:
            "AVALIACAO_PRE_ANESTESICA",

        nome:
            "Avaliação Pré-Anestésica",

        categoria:
            "CIRURGICO",

        palavrasChave: [

            "avaliacao pre anestesica",

            "avaliacao pre-anestesica",

            "risco anestesico",

            "anestesiologia"

        ]

    },


    {
        codigo:
            "SUMARIO_ALTA",

        nome:
            "Sumário de Alta",

        categoria:
            "INTERNACAO",

        palavrasChave: [

            "sumario de alta",

            "resumo de alta",

            "alta hospitalar"

        ]

    },


    {
        codigo:
            "GUIA_CONVENIO",

        nome:
            "Guia de Convênio",

        categoria:
            "ADMINISTRATIVO",

        palavrasChave: [

            "guia de convenio",

            "guia tiss",

            "operadora",

            "beneficiario"

        ]

    },


    {
        codigo:
            "AUTORIZACAO_PROCEDIMENTO",

        nome:
            "Autorização de Procedimento",

        categoria:
            "ADMINISTRATIVO",

        palavrasChave: [

            "autorizacao de procedimento",

            "procedimento autorizado",

            "senha de autorizacao"

        ]

    },


    {
        codigo:
            "DOCUMENTO_IDENTIFICACAO",

        nome:
            "Documento de Identificação",

        categoria:
            "CADASTRAL",

        palavrasChave: [

            "registro geral",

            "carteira de identidade",

            "cpf",

            "data de nascimento"

        ]

    },


    {
        codigo:
            "CARTEIRINHA_CONVENIO",

        nome:
            "Carteirinha de Convênio",

        categoria:
            "CADASTRAL",

        palavrasChave: [

            "carteirinha",

            "plano de saude",

            "numero do beneficiario",

            "beneficiario"

        ]

    },


    {
        codigo:
            "ENCAMINHAMENTO",

        nome:
            "Encaminhamento",

        categoria:
            "CLINICO",

        palavrasChave: [

            "encaminhamento",

            "encaminho o paciente",

            "encaminho para"

        ]

    }

];


/**
 * =========================================================
 * PROCESS RULES
 * =========================================================
 */
const REGRAS_PROCESSOS = {

    atendimento_ambulatorial: {

        codigo:
            "atendimento_ambulatorial",

        nome:
            "Atendimento Ambulatorial",

        obrigatorios: []

    },


    pronto_atendimento: {

        codigo:
            "pronto_atendimento",

        nome:
            "Pronto Atendimento",

        obrigatorios: []

    },


    internacao: {

        codigo:
            "internacao",

        nome:
            "Internação",

        obrigatorios: []

    },


    cirurgia: {

        codigo:
            "cirurgia",

        nome:
            "Cirurgia",

        obrigatorios: [

            "TERMO_CIRURGICO",

            "AVALIACAO_PRE_ANESTESICA"

        ]

    },


    exames_laboratoriais: {

        codigo:
            "exames_laboratoriais",

        nome:
            "Exames Laboratoriais",

        obrigatorios: [

            "RESULTADO_LABORATORIAL"

        ]

    },


    diagnostico_imagem: {

        codigo:
            "diagnostico_imagem",

        nome:
            "Diagnóstico por Imagem",

        obrigatorios: [

            "LAUDO_IMAGEM"

        ]

    },


    auditoria_clinica: {

        codigo:
            "auditoria_clinica",

        nome:
            "Auditoria Clínica",

        obrigatorios: []

    }

};


/**
 * =========================================================
 * NORMALIZE
 * =========================================================
 */
function normalizarTexto(
    texto
) {

    return String(
        texto || ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/**
 * =========================================================
 * DOCUMENT CLASSIFICATION
 * =========================================================
 */
function classificarDocumento(
    texto
) {

    const normalizado =
        normalizarTexto(
            texto
        );


    let melhorTipo =
        null;


    let melhorPontuacao =
        0;


    for (
        const tipo of TIPOS_DOCUMENTOS
    ) {

        let pontuacao =
            0;


        let palavrasEncontradas =
            0;


        for (
            const palavra of
            tipo.palavrasChave
        ) {

            const chave =
                normalizarTexto(
                    palavra
                );


            if (
                normalizado.includes(
                    chave
                )
            ) {

                palavrasEncontradas++;

                /**
                 * Expressões maiores valem
                 * um pouco mais.
                 */
                pontuacao +=
                    chave.includes(" ")
                        ? 2
                        : 1;

            }

        }


        if (
            palavrasEncontradas > 0 &&
            pontuacao >
                melhorPontuacao
        ) {

            melhorPontuacao =
                pontuacao;


            melhorTipo = {

                ...tipo,

                palavrasEncontradas,

                pontuacao

            };

        }

    }


    if (
        !melhorTipo
    ) {

        return {

            identificado:
                false,

            codigo:
                "DESCONHECIDO",

            nome:
                "Documento não identificado",

            categoria:
                "DESCONHECIDO",

            confianca:
                0

        };

    }


    const totalPalavras =
        melhorTipo
            .palavrasChave
            .length;


    const confianca =
        Math.min(

            1,

            (
                melhorTipo
                    .palavrasEncontradas /
                Math.max(
                    2,
                    totalPalavras * 0.35
                )
            )

        );


    return {

        identificado:
            true,

        codigo:
            melhorTipo.codigo,

        nome:
            melhorTipo.nome,

        categoria:
            melhorTipo.categoria,

        confianca:
            Number(
                confianca.toFixed(2)
            )

    };

}


/**
 * =========================================================
 * OCR CONFIDENCE
 * =========================================================
 */
function normalizarConfiancaOCR(
    ocr
) {

    const valor =
        Number(
            ocr?.confianca ||
            0
        );


    if (
        valor > 1
    ) {

        return Math.min(
            1,
            valor / 100
        );

    }


    return Math.max(
        0,
        Math.min(
            1,
            valor
        )
    );

}


/**
 * =========================================================
 * FINAL CONFIDENCE
 * =========================================================
 */
function calcularConfianca(
    classificacao,
    ocr
) {

    const confiancaOCR =
        normalizarConfiancaOCR(
            ocr
        );


    const classificacaoScore =
        Number(
            classificacao
                ?.confianca ||
            0
        );


    if (
        !classificacao
            ?.identificado
    ) {

        return Number(
            (
                confiancaOCR *
                0.35
            ).toFixed(2)
        );

    }


    return Number(
        (
            (
                confiancaOCR *
                0.55
            ) +
            (
                classificacaoScore *
                0.45
            )
        ).toFixed(2)
    );

}


/**
 * =========================================================
 * ANALYZE SINGLE FILE
 * =========================================================
 */
async function analisarArquivo(
    file
) {

    const extensao =
        path
            .extname(
                file.originalname ||
                ""
            )
            .toLowerCase();


    const ocr =
        await ocrService
            .extrairTexto(
                file
            );


    const textoExtraido =
        ocr?.texto ||
        "";


    const classificacao =
        classificarDocumento(
            textoExtraido
        );


    const confianca =
        calcularConfianca(
            classificacao,
            ocr
        );


    let dadosExtraidos =
        {};


    /**
     * =====================================================
     * LABORATÓRIO
     * =====================================================
     */
    if (
        classificacao.codigo ===
        "RESULTADO_LABORATORIAL"
    ) {

        dadosExtraidos =
            clinicalExtractorService
                .extrairDadosClinicos(
                    textoExtraido,
                    classificacao.codigo
                );

    }


    /**
     * =====================================================
     * EXAME DE IMAGEM
     * =====================================================
     */
    if (
        classificacao.codigo ===
        "LAUDO_IMAGEM"
    ) {

        dadosExtraidos = {

            exameImagem:
                imagingExtractorService
                    .extrairLaudoImagem(
                        textoExtraido
                    )

        };

    }


    let status =
        "ANALISADO";


    if (
        !classificacao.identificado
    ) {

        status =
            "REVISAO_MANUAL";

    }


    if (
        classificacao.identificado &&
        confianca < 0.45
    ) {

        status =
            "REVISAO_MANUAL";

    }


    return {

        arquivo:
            file.originalname,

        nomeArquivoServidor:
            file.filename,

        caminho:
            file.path,

        mimetype:
            file.mimetype,

        tamanho:
            file.size,

        extensao,

        identificado:
            classificacao
                .identificado,

        tipo:
            classificacao
                .codigo,

        documento:
            classificacao
                .nome,

        categoria:
            classificacao
                .categoria,

        confianca,

        status,

        textoExtraido,

        dadosExtraidos,

        ocr: {

            sucesso:
                ocr?.sucesso ??
                true,

            metodo:
                ocr?.metodo ||
                null,

            confianca:
                normalizarConfiancaOCR(
                    ocr
                ),

            paginas:
                ocr?.paginas ||
                0,

            erro:
                ocr?.erro ||
                null

        }

    };

}


/**
 * =========================================================
 * PROCESS VALIDATION
 * =========================================================
 */
function verificarProcesso(
    documentos,
    tipoProcesso
) {

    const regra =
        REGRAS_PROCESSOS[
            tipoProcesso
        ];


    if (!regra) {

        return {

            valido:
                false,

            processoReconhecido:
                false,

            obrigatorios:
                [],

            encontrados:
                [],

            faltantes:
                []

        };

    }


    const tiposEncontrados =
        documentos
            .filter(
                documento =>
                    documento
                        .identificado
            )
            .map(
                documento =>
                    documento.tipo
            );


    const faltantes =
        regra
            .obrigatorios
            .filter(
                obrigatorio =>
                    !tiposEncontrados
                        .includes(
                            obrigatorio
                        )
            );


    return {

        valido:
            faltantes.length ===
            0,

        processoReconhecido:
            true,

        obrigatorios:
            regra.obrigatorios,

        encontrados:
            [
                ...new Set(
                    tiposEncontrados
                )
            ],

        faltantes

    };

}


/**
 * =========================================================
 * ALERTS
 * =========================================================
 */
function gerarAlertas(
    documentos,
    verificacao
) {

    const alertas =
        [];


    documentos.forEach(
        documento => {

            if (
                !documento
                    .identificado
            ) {

                alertas.push({

                    tipo:
                        "DOCUMENTO_NAO_IDENTIFICADO",

                    nivel:
                        "ATENCAO",

                    arquivo:
                        documento.arquivo,

                    mensagem:
                        "O documento não pôde ser classificado automaticamente."

                });

            }


            if (
                documento.status ===
                "REVISAO_MANUAL"
            ) {

                alertas.push({

                    tipo:
                        "REVISAO_MANUAL",

                    nivel:
                        "ATENCAO",

                    arquivo:
                        documento.arquivo,

                    mensagem:
                        "O documento possui baixa confiança e deve ser revisado."

                });

            }


            /**
             * Laboratório
             */
            const exames =
                documento
                    ?.dadosExtraidos
                    ?.exames ||
                [];


            const foraReferencia =
                exames.filter(
                    exame =>
                        exame.status ===
                        "FORA_DA_REFERENCIA"
                );


            if (
                foraReferencia.length >
                0
            ) {

                alertas.push({

                    tipo:
                        "RESULTADO_FORA_REFERENCIA",

                    nivel:
                        "INFORMATIVO",

                    arquivo:
                        documento.arquivo,

                    quantidade:
                        foraReferencia.length,

                    mensagem:
                        `${foraReferencia.length} resultado(s) estão fora do intervalo de referência informado no documento.`

                });

            }


            /**
             * Laudo de imagem:
             * checagem apenas documental.
             */
            const exameImagem =
                documento
                    ?.dadosExtraidos
                    ?.exameImagem;


            if (
                exameImagem
            ) {

                const completude =
                    exameImagem
                        ?.completude
                        ?.percentual ||
                    0;


                if (
                    completude <
                    60
                ) {

                    alertas.push({

                        tipo:
                            "LAUDO_IMAGEM_INCOMPLETO",

                        nivel:
                            "ATENCAO",

                        arquivo:
                            documento.arquivo,

                        completude,

                        mensagem:
                            `O laudo de imagem apresentou ${completude}% de completude documental.`

                    });

                }


                if (
                    !exameImagem
                        ?.conclusao
                ) {

                    alertas.push({

                        tipo:
                            "CONCLUSAO_NAO_IDENTIFICADA",

                        nivel:
                            "ATENCAO",

                        arquivo:
                            documento.arquivo,

                        mensagem:
                            "Não foi possível identificar a conclusão do laudo de imagem."

                    });

                }

            }

        }
    );


    verificacao
        ?.faltantes
        ?.forEach(
            tipoDocumento => {

                alertas.push({

                    tipo:
                        "DOCUMENTO_FALTANTE",

                    nivel:
                        "ATENCAO",

                    documento:
                        tipoDocumento,

                    mensagem:
                        `Documento obrigatório ausente: ${tipoDocumento}.`

                });

            }
        );


    return alertas;

}


/**
 * =========================================================
 * MAIN ANALYSIS
 * =========================================================
 */
async function analisarDocumentos(
    files,
    tipoProcesso =
        "atendimento_ambulatorial"
) {

    if (
        !Array.isArray(
            files
        ) ||
        files.length === 0
    ) {

        return {

            sucesso:
                false,

            mensagem:
                "Nenhum documento recebido.",

            processo: {

                codigo:
                    tipoProcesso,

                nome:
                    REGRAS_PROCESSOS[
                        tipoProcesso
                    ]?.nome ||
                    tipoProcesso

            },

            resumo: {

                totalArquivos:
                    0,

                identificados:
                    0,

                naoIdentificados:
                    0,

                documentosFaltantes:
                    0,

                totalExames:
                    0,

                totalLaudosImagem:
                    0

            },

            documentos:
                [],

            verificacao:
                null,

            alertas:
                [],

            status:
                "SEM_DOCUMENTOS"

        };

    }


    const documentos =
        [];


    for (
        const file of files
    ) {

        try {

            const resultado =
                await analisarArquivo(
                    file
                );


            documentos.push(
                resultado
            );

        } catch (erro) {

            console.error(
                `Erro ao analisar ${file.originalname}:`,
                erro
            );


            documentos.push({

                arquivo:
                    file.originalname,

                nomeArquivoServidor:
                    file.filename,

                caminho:
                    file.path,

                mimetype:
                    file.mimetype,

                tamanho:
                    file.size,

                extensao:
                    path
                        .extname(
                            file.originalname ||
                            ""
                        )
                        .toLowerCase(),

                identificado:
                    false,

                tipo:
                    "DESCONHECIDO",

                documento:
                    "Documento não identificado",

                categoria:
                    "DESCONHECIDO",

                confianca:
                    0,

                status:
                    "REVISAO_MANUAL",

                textoExtraido:
                    "",

                dadosExtraidos:
                    {},

                ocr: {

                    sucesso:
                        false,

                    metodo:
                        null,

                    confianca:
                        0,

                    paginas:
                        0,

                    erro:
                        erro.message

                }

            });

        }

    }


    const verificacao =
        verificarProcesso(
            documentos,
            tipoProcesso
        );


    const alertas =
        gerarAlertas(
            documentos,
            verificacao
        );


    const identificados =
        documentos.filter(
            documento =>
                documento
                    .identificado
        ).length;


    const naoIdentificados =
        documentos.length -
        identificados;


    const totalExames =
        documentos.reduce(
            (
                total,
                documento
            ) => {

                return (
                    total +
                    (
                        documento
                            ?.dadosExtraidos
                            ?.exames
                            ?.length ||
                        0
                    )
                );

            },
            0
        );


    const totalLaudosImagem =
        documentos.filter(
            documento =>
                documento.tipo ===
                "LAUDO_IMAGEM"
        ).length;


    let status =
        "APROVADO";


    if (
        !verificacao
            .processoReconhecido
    ) {

        status =
            "PROCESSO_NAO_RECONHECIDO";

    } else if (
        verificacao
            .faltantes
            .length >
        0
    ) {

        status =
            "PENDENTE";

    } else if (
        documentos.some(
            documento =>
                documento.status ===
                "REVISAO_MANUAL"
        )
    ) {

        status =
            "REVISAO_MANUAL";

    }


    const regra =
        REGRAS_PROCESSOS[
            tipoProcesso
        ];


    return {

        sucesso:
            true,

        mensagem:
            "Documentos analisados com sucesso.",

        processo: {

            codigo:
                tipoProcesso,

            nome:
                regra?.nome ||
                tipoProcesso

        },

        resumo: {

            totalArquivos:
                documentos.length,

            identificados,

            naoIdentificados,

            documentosFaltantes:
                verificacao
                    ?.faltantes
                    ?.length ||
                0,

            totalExames,

            totalLaudosImagem

        },

        documentos,

        verificacao,

        alertas,

        status

    };

}


/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */
module.exports = {

    analisarDocumentos,

    analisarArquivo,

    classificarDocumento,

    verificarProcesso,

    gerarAlertas,

    normalizarTexto,

    TIPOS_DOCUMENTOS,

    REGRAS_PROCESSOS

};