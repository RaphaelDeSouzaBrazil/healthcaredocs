const mongoose =
    require("mongoose");


/**
 * =========================================================
 * LABORATORY EXAM
 * =========================================================
 */
const exameSchema =
    new mongoose.Schema(
        {

            nome: {
                type: String,
                default: null
            },

            resultado: {
                type: String,
                default: null
            },

            referencia: {
                type: String,
                default: null
            },

            unidade: {
                type: String,
                default: null
            },

            status: {

                type: String,

                enum: [
                    "NORMAL",
                    "FORA_DA_REFERENCIA",
                    "NAO_INTERPRETADO"
                ],

                default:
                    "NAO_INTERPRETADO"

            }

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * PATIENT
 * =========================================================
 */
const pacienteSchema =
    new mongoose.Schema(
        {

            nome: {
                type: String,
                default: null
            },

            dataNascimento: {
                type: String,
                default: null
            },

            cpf: {
                type: String,
                default: null
            }

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * DOCTOR
 * =========================================================
 */
const medicoSchema =
    new mongoose.Schema(
        {

            nome: {
                type: String,
                default: null
            },

            crm: {
                type: String,
                default: null
            },

            uf: {
                type: String,
                default: null
            }

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * IMAGE REPORT COMPLETENESS
 * =========================================================
 */
const completudeImagemSchema =
    new mongoose.Schema(
        {

            possuiPaciente: {
                type: Boolean,
                default: false
            },

            possuiData: {
                type: Boolean,
                default: false
            },

            possuiModalidade: {
                type: Boolean,
                default: false
            },

            possuiRegiaoAnatomica: {
                type: Boolean,
                default: false
            },

            possuiTecnica: {
                type: Boolean,
                default: false
            },

            possuiAchados: {
                type: Boolean,
                default: false
            },

            possuiConclusao: {
                type: Boolean,
                default: false
            },

            possuiMedico: {
                type: Boolean,
                default: false
            },

            possuiCRM: {
                type: Boolean,
                default: false
            },

            percentual: {
                type: Number,
                default: 0
            }

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * IMAGING EXAM
 * =========================================================
 */
const exameImagemSchema =
    new mongoose.Schema(
        {

            modalidade: {

                type: String,

                default:
                    "NAO_IDENTIFICADA",

                index:
                    true

            },

            exame: {
                type: String,
                default: null
            },

            regiaoAnatomica: {

                type: String,

                default:
                    "NAO_IDENTIFICADA",

                index:
                    true

            },

            lateralidade: {
                type: String,
                default: null
            },

            paciente:
                pacienteSchema,

            dataExame: {
                type: String,
                default: null
            },

            medico:
                medicoSchema,

            indicacao: {
                type: String,
                default: null
            },

            tecnica: {
                type: String,
                default: null
            },

            achadosTexto: {
                type: String,
                default: null
            },

            achados: {

                type: [
                    String
                ],

                default: []

            },

            conclusao: {
                type: String,
                default: null
            },

            contraste: {

                utilizado: {
                    type: Boolean,
                    default: null
                },

                descricao: {
                    type: String,
                    default: null
                }

            },

            completude:
                completudeImagemSchema

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * OCR
 * =========================================================
 */
const ocrSchema =
    new mongoose.Schema(
        {

            sucesso: {
                type: Boolean,
                default: false
            },

            metodo: {
                type: String,
                default: null
            },

            confianca: {
                type: Number,
                default: 0
            },

            paginas: {
                type: Number,
                default: 0
            },

            erro: {
                type: String,
                default: null
            }

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * ANALYZED DOCUMENT
 * =========================================================
 */
const documentoSchema =
    new mongoose.Schema(
        {

            arquivo: {
                type: String,
                default: null
            },

            nomeArquivoServidor: {
                type: String,
                default: null
            },

            caminho: {
                type: String,
                default: null
            },

            mimetype: {
                type: String,
                default: null
            },

            tamanho: {
                type: Number,
                default: 0
            },

            extensao: {
                type: String,
                default: null
            },

            identificado: {
                type: Boolean,
                default: false
            },

            tipo: {

                type: String,

                default:
                    "DESCONHECIDO",

                index:
                    true

            },

            documento: {
                type: String,
                default: null
            },

            categoria: {
                type: String,
                default: null
            },

            confianca: {
                type: Number,
                default: 0
            },

            status: {
                type: String,
                default: null
            },

            /**
             * Mantido por enquanto para
             * facilitar desenvolvimento/debug.
             *
             * Em produção devemos revisar
             * a necessidade de persistir OCR bruto.
             */
            textoExtraido: {
                type: String,
                default: ""
            },


            /**
             * =================================================
             * LABORATORY
             * =================================================
             */

            paciente:
                pacienteSchema,

            solicitante:
                medicoSchema,

            coleta: {

                data: {
                    type: String,
                    default: null
                },

                dataResultado: {
                    type: String,
                    default: null
                }

            },

            exames: [
                exameSchema
            ],

            resumoExames: {

                total: {
                    type: Number,
                    default: 0
                },

                normais: {
                    type: Number,
                    default: 0
                },

                foraReferencia: {
                    type: Number,
                    default: 0
                },

                naoInterpretados: {
                    type: Number,
                    default: 0
                }

            },


            /**
             * =================================================
             * DIAGNOSTIC IMAGING REPORT
             * =================================================
             */

            exameImagem:
                exameImagemSchema,


            /**
             * =================================================
             * OCR
             * =================================================
             */

            ocr:
                ocrSchema

        },
        {
            _id: false
        }
    );


/**
 * =========================================================
 * PROCESSING
 * =========================================================
 */
const processamentoSchema =
    new mongoose.Schema(
        {

            tipoProcesso: {

                type: String,

                required:
                    true,

                index:
                    true

            },

            nomeProcesso: {
                type: String,
                default: null
            },

            status: {

                type: String,

                enum: [

                    "APROVADO",

                    "PENDENTE",

                    "REVISAO_MANUAL",

                    "PROCESSO_NAO_RECONHECIDO",

                    "SEM_DOCUMENTOS"

                ],

                default:
                    "PENDENTE",

                index:
                    true

            },

            mensagem: {
                type: String,
                default: null
            },

            documentos: [
                documentoSchema
            ],

            resumo: {

                totalArquivos: {
                    type: Number,
                    default: 0
                },

                identificados: {
                    type: Number,
                    default: 0
                },

                naoIdentificados: {
                    type: Number,
                    default: 0
                },

                documentosFaltantes: {
                    type: Number,
                    default: 0
                },

                totalExames: {
                    type: Number,
                    default: 0
                },

                totalLaudosImagem: {
                    type: Number,
                    default: 0
                }

            },

            alertas: {

                type:
                    Array,

                default:
                    []

            }

        },

        {
            timestamps:
                true
        }
    );


/**
 * =========================================================
 * INDEXES
 * =========================================================
 */
processamentoSchema.index({
    createdAt: -1
});


/**
 * =========================================================
 * EXPORT
 * =========================================================
 */
module.exports =
    mongoose.model(
        "Processamento",
        processamentoSchema
    );