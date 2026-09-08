/**
 * =========================================================
 * SMARTDOCS
 * CLINICAL EXTRACTOR SERVICE
 * =========================================================
 *
 * Responsável por transformar o texto bruto do OCR em
 * informações estruturadas.
 *
 * Exemplo:
 *
 * "Glicemia em Jejum 92 70 - 99 mg/dL"
 *
 * vira:
 *
 * {
 *     nome: "Glicemia em Jejum",
 *     resultado: "92",
 *     referencia: "70 - 99",
 *     unidade: "mg/dL",
 *     status: "NORMAL"
 * }
 *
 * =========================================================
 */


/**
 * =========================================================
 * CATÁLOGO DE EXAMES
 * =========================================================
 */
const CATALOGO_EXAMES = [

    {
        nome: "Hemácias",
        aliases: [
            "hemacias",
            "hemácias",
            "eritrocitos",
            "eritrócitos"
        ]
    },

    {
        nome: "Hemoglobina",
        aliases: [
            "hemoglobina"
        ]
    },

    {
        nome: "Hematócrito",
        aliases: [
            "hematocrito",
            "hematócrito"
        ]
    },

    {
        nome: "VCM",
        aliases: [
            "vcm"
        ]
    },

    {
        nome: "HCM",
        aliases: [
            "hcm"
        ]
    },

    {
        nome: "CHCM",
        aliases: [
            "chcm"
        ]
    },

    {
        nome: "RDW",
        aliases: [
            "rdw"
        ]
    },

    {
        nome: "Leucócitos",
        aliases: [
            "leucocitos",
            "leucócitos"
        ]
    },

    {
        nome: "Neutrófilos",
        aliases: [
            "neutrofilos",
            "neutrófilos"
        ]
    },

    {
        nome: "Linfócitos",
        aliases: [
            "linfocitos",
            "linfócitos"
        ]
    },

    {
        nome: "Monócitos",
        aliases: [
            "monocitos",
            "monócitos"
        ]
    },

    {
        nome: "Eosinófilos",
        aliases: [
            "eosinofilos",
            "eosinófilos"
        ]
    },

    {
        nome: "Basófilos",
        aliases: [
            "basofilos",
            "basófilos"
        ]
    },

    {
        nome: "Plaquetas",
        aliases: [
            "plaquetas"
        ]
    },

    {
        nome: "Glicemia em Jejum",
        aliases: [
            "glicemia em jejum",
            "glicemia jejum",
            "glicose em jejum",
            "glicose"
        ]
    },

    {
        nome: "Ureia",
        aliases: [
            "ureia",
            "uréia"
        ]
    },

    {
        nome: "Creatinina",
        aliases: [
            "creatinina"
        ]
    },

    {
        nome: "Ácido Úrico",
        aliases: [
            "acido urico",
            "ácido úrico"
        ]
    },

    {
        nome: "Colesterol Total",
        aliases: [
            "colesterol total"
        ]
    },

    {
        nome: "HDL Colesterol",
        aliases: [
            "hdl colesterol",
            "colesterol hdl",
            "hdl"
        ]
    },

    {
        nome: "LDL Colesterol",
        aliases: [
            "ldl colesterol",
            "colesterol ldl",
            "ldl"
        ]
    },

    {
        nome: "Triglicérides",
        aliases: [
            "triglicerides",
            "triglicérides",
            "triglicerideos",
            "triglicerídeos"
        ]
    },

    {
        nome: "TGO (AST)",
        aliases: [
            "tgo",
            "ast",
            "tgo ast"
        ]
    },

    {
        nome: "TGP (ALT)",
        aliases: [
            "tgp",
            "alt",
            "tgp alt"
        ]
    },

    {
        nome: "Gama GT",
        aliases: [
            "gama gt",
            "gamma gt",
            "ggt"
        ]
    },

    {
        nome: "Bilirrubina Total",
        aliases: [
            "bilirrubina total"
        ]
    },

    {
        nome: "Bilirrubina Direta",
        aliases: [
            "bilirrubina direta"
        ]
    },

    {
        nome: "Bilirrubina Indireta",
        aliases: [
            "bilirrubina indireta"
        ]
    },

    {
        nome: "Sódio",
        aliases: [
            "sodio",
            "sódio"
        ]
    },

    {
        nome: "Potássio",
        aliases: [
            "potassio",
            "potássio"
        ]
    },

    {
        nome: "Cloro",
        aliases: [
            "cloro"
        ]
    },

    {
        nome: "Cálcio Total",
        aliases: [
            "calcio total",
            "cálcio total",
            "calcio",
            "cálcio"
        ]
    },

    {
        nome: "Magnésio",
        aliases: [
            "magnesio",
            "magnésio"
        ]
    },

    {
        nome: "Proteína C Reativa (PCR)",
        aliases: [
            "proteina c reativa",
            "proteína c reativa",
            "pcr"
        ]
    },

    {
        nome: "VHS",
        aliases: [
            "velocidade de hemossedimentacao",
            "velocidade de hemossedimentação",
            "vhs"
        ]
    },

    {
        nome: "Vitamina D",
        aliases: [
            "vitamina d",
            "25-oh",
            "25 oh"
        ]
    },

    {
        nome: "TSH",
        aliases: [
            "tsh",
            "hormonio tireoestimulante",
            "hormônio tireoestimulante"
        ]
    }

];


/**
 * =========================================================
 * NORMALIZAR TEXTO
 * =========================================================
 */
function normalizarTexto(texto = "") {

    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}


/**
 * =========================================================
 * CONVERTER NÚMERO
 * =========================================================
 */
function converterNumero(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return null;
    }


    const numero =
        String(valor)
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");


    const convertido =
        Number(numero);


    return Number.isFinite(convertido)
        ? convertido
        : null;
}


/**
 * =========================================================
 * EXTRAIR PACIENTE
 * =========================================================
 */
function extrairPaciente(texto) {

    const nome =
        texto.match(
            /paciente\s*[:\-]?\s*([^\n\r]+)/i
        );


    const nascimento =
        texto.match(
            /data\s+de\s+nascimento\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
        );


    const cpf =
        texto.match(
            /cpf\s*[:\-]?\s*([\d.\-]+)/i
        );


    return {

        nome:
            nome
                ? limparValor(nome[1])
                : null,

        dataNascimento:
            nascimento
                ? nascimento[1]
                : null,

        cpf:
            cpf
                ? cpf[1]
                : null

    };
}


/**
 * =========================================================
 * EXTRAIR DADOS DA COLETA
 * =========================================================
 */
function extrairColeta(texto) {

    const coleta =
        texto.match(
            /data\s+da\s+coleta\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
        );


    const resultado =
        texto.match(
            /data\s+do\s+resultado\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
        );


    return {

        data:
            coleta
                ? coleta[1]
                : null,

        dataResultado:
            resultado
                ? resultado[1]
                : null

    };
}


/**
 * =========================================================
 * EXTRAIR MÉDICO SOLICITANTE
 * =========================================================
 */
function extrairSolicitante(texto) {

    const linha =
        texto.match(
            /solicitante\s*[:\-]?\s*([^\n\r]+)/i
        );


    if (!linha) {

        return {
            nome: null,
            crm: null,
            uf: null
        };
    }


    const valor =
        limparValor(
            linha[1]
        );


    const crm =
        valor.match(
            /crm\s*([a-z]{0,2})?\s*([\d.]+)/i
        );


    let nome =
        valor
            .replace(
                /crm.*$/i,
                ""
            )
            .trim();


    return {

        nome:
            nome || null,

        crm:
            crm
                ? crm[2]
                : null,

        uf:
            crm && crm[1]
                ? crm[1].toUpperCase()
                : null

    };
}


/**
 * =========================================================
 * LIMPAR VALOR
 * =========================================================
 */
function limparValor(valor = "") {

    return String(valor)
        .replace(/\s+/g, " ")
        .replace(/\|/g, " ")
        .trim();
}


/**
 * =========================================================
 * EXTRAIR UNIDADE
 * =========================================================
 */
function extrairUnidade(linha) {

    const unidades = [

        "mg/dL",
        "g/dL",
        "mg/L",
        "ng/mL",
        "pg",
        "fL",
        "U/L",
        "mEq/L",
        "µUI/mL",
        "uUI/mL",
        "mm/h",
        "/mm³",
        "/mm3",
        "células/mm³",
        "celulas/mm3",
        "milhões/mm³",
        "milhoes/mm3",
        "%"

    ];


    for (const unidade of unidades) {

        if (
            normalizarTexto(linha)
                .includes(
                    normalizarTexto(unidade)
                )
        ) {

            return unidade;
        }

    }


    return null;
}


/**
 * =========================================================
 * EXTRAIR NÚMEROS DA LINHA
 * =========================================================
 */
function extrairNumeros(linha) {

    const encontrados =
        String(linha).match(
            /[<>]?\s*\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+(?:[.,]\d+)?)?/g
        );


    return encontrados
        ? encontrados.map(
            item =>
                item.trim()
        )
        : [];
}


/**
 * =========================================================
 * VERIFICAR STATUS COM BASE NA REFERÊNCIA
 * =========================================================
 */
function calcularStatus(
    resultado,
    referencia
) {

    if (
        !resultado ||
        !referencia
    ) {

        return "NAO_INTERPRETADO";
    }


    const valorResultado =
        converterNumero(
            resultado
        );


    if (
        valorResultado === null
    ) {

        return "NAO_INTERPRETADO";
    }


    const ref =
        String(referencia)
            .trim();


    /**
     * < 200
     */
    if (ref.includes("<")) {

        const limite =
            converterNumero(ref);


        if (limite === null) {
            return "NAO_INTERPRETADO";
        }


        return valorResultado < limite
            ? "NORMAL"
            : "FORA_DA_REFERENCIA";
    }


    /**
     * > 40
     */
    if (ref.includes(">")) {

        const limite =
            converterNumero(ref);


        if (limite === null) {
            return "NAO_INTERPRETADO";
        }


        return valorResultado > limite
            ? "NORMAL"
            : "FORA_DA_REFERENCIA";
    }


    /**
     * 70 - 99
     */
    const intervalo =
        ref.match(
            /(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)/
        );


    if (intervalo) {

        const minimo =
            converterNumero(
                intervalo[1]
            );


        const maximo =
            converterNumero(
                intervalo[2]
            );


        if (
            minimo === null ||
            maximo === null
        ) {

            return "NAO_INTERPRETADO";
        }


        return (
            valorResultado >= minimo &&
            valorResultado <= maximo
        )
            ? "NORMAL"
            : "FORA_DA_REFERENCIA";
    }


    /**
     * Exemplo:
     * Até 20
     */
    const ate =
        ref.match(
            /ate\s*(\d+(?:[.,]\d+)?)/i
        );


    if (ate) {

        const limite =
            converterNumero(
                ate[1]
            );


        return valorResultado <= limite
            ? "NORMAL"
            : "FORA_DA_REFERENCIA";
    }


    return "NAO_INTERPRETADO";
}


/**
 * =========================================================
 * IDENTIFICAR EXAME NA LINHA
 * =========================================================
 */
function identificarExameNaLinha(
    linha
) {

    const linhaNormalizada =
        normalizarTexto(linha);


    /**
     * Nomes maiores primeiro para evitar:
     *
     * "bilirrubina total"
     *
     * ser confundido antes por termos menores.
     */
    const catalogo =
        [...CATALOGO_EXAMES]
            .sort(
                (a, b) => {

                    const maiorA =
                        Math.max(
                            ...a.aliases.map(
                                item =>
                                    item.length
                            )
                        );


                    const maiorB =
                        Math.max(
                            ...b.aliases.map(
                                item =>
                                    item.length
                            )
                        );


                    return maiorB - maiorA;
                }
            );


    for (const exame of catalogo) {

        const alias =
            exame.aliases.find(
                item =>
                    linhaNormalizada.includes(
                        normalizarTexto(item)
                    )
            );


        if (alias) {

            return {
                exame,
                alias
            };
        }

    }


    return null;
}


/**
 * =========================================================
 * EXTRAIR REFERÊNCIA
 * =========================================================
 */
function extrairReferencia(
    linha,
    numeros
) {

    /**
     * Procura explicitamente intervalo.
     */
    const intervalo =
        String(linha).match(
            /\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?/
        );


    if (intervalo) {

        return intervalo[0];
    }


    /**
     * < 200 / > 40
     */
    const limite =
        String(linha).match(
            /[<>]\s*\d+(?:[.,]\d+)?/
        );


    if (limite) {

        return limite[0];
    }


    /**
     * Até 20
     */
    const ate =
        String(linha).match(
            /at[eé]\s+\d+(?:[.,]\d+)?/i
        );


    if (ate) {

        return ate[0];
    }


    /**
     * Se houver pelo menos três números,
     * considera segundo e terceiro como
     * referência mínima/máxima.
     */
    if (numeros.length >= 3) {

        return `${numeros[1]} - ${numeros[2]}`;
    }


    return null;
}


/**
 * =========================================================
 * EXTRAIR RESULTADOS LABORATORIAIS
 * =========================================================
 */
function extrairResultadosLaboratoriais(
    texto
) {

    if (!texto) {
        return [];
    }


    const linhas =
        String(texto)
            .split(/\r?\n/)
            .map(
                linha =>
                    limparValor(linha)
            )
            .filter(Boolean);


    const exames = [];


    for (const linha of linhas) {

        const identificado =
            identificarExameNaLinha(
                linha
            );


        if (!identificado) {
            continue;
        }


        const numeros =
            extrairNumeros(
                linha
            );


        if (
            numeros.length === 0
        ) {
            continue;
        }


        /**
         * Primeiro número encontrado é
         * considerado resultado.
         */
        const resultado =
            numeros[0];


        const referencia =
            extrairReferencia(
                linha,
                numeros
            );


        const unidade =
            extrairUnidade(
                linha
            );


        const status =
            calcularStatus(
                resultado,
                referencia
            );


        /**
         * Evita duplicação.
         */
        const jaExiste =
            exames.some(
                item =>
                    item.nome ===
                    identificado.exame.nome
            );


        if (jaExiste) {
            continue;
        }


        exames.push({

            nome:
                identificado.exame.nome,

            resultado,

            referencia,

            unidade,

            status,

            linhaOriginal:
                linha

        });

    }


    return exames;
}


/**
 * =========================================================
 * RESUMO DOS RESULTADOS
 * =========================================================
 */
function gerarResumoExames(
    exames
) {

    return {

        total:
            exames.length,

        normais:
            exames.filter(
                exame =>
                    exame.status ===
                    "NORMAL"
            ).length,

        foraReferencia:
            exames.filter(
                exame =>
                    exame.status ===
                    "FORA_DA_REFERENCIA"
            ).length,

        naoInterpretados:
            exames.filter(
                exame =>
                    exame.status ===
                    "NAO_INTERPRETADO"
            ).length

    };
}


/**
 * =========================================================
 * EXTRAÇÃO CLÍNICA PRINCIPAL
 * =========================================================
 */
function extrairDadosClinicos(
    texto,
    tipoDocumento
) {

    if (!texto) {

        return {

            paciente: {},

            coleta: {},

            solicitante: {},

            exames: [],

            resumoExames: {
                total: 0,
                normais: 0,
                foraReferencia: 0,
                naoInterpretados: 0
            }

        };
    }


    const paciente =
        extrairPaciente(
            texto
        );


    const coleta =
        extrairColeta(
            texto
        );


    const solicitante =
        extrairSolicitante(
            texto
        );


    let exames = [];


    if (
        tipoDocumento ===
        "RESULTADO_LABORATORIAL"
    ) {

        exames =
            extrairResultadosLaboratoriais(
                texto
            );
    }


    return {

        paciente,

        coleta,

        solicitante,

        exames,

        resumoExames:
            gerarResumoExames(
                exames
            )

    };
}


/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */
module.exports = {

    extrairDadosClinicos,

    extrairResultadosLaboratoriais,

    calcularStatus,

    extrairPaciente,

    extrairColeta,

    extrairSolicitante,

    normalizarTexto,

    CATALOGO_EXAMES

};