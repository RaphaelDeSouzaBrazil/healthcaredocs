/**
 * =========================================================
 * SMARTDOCS
 * IMAGING EXTRACTOR SERVICE
 * =========================================================
 *
 * Responsável por extrair informações estruturadas
 * de laudos de exames de imagem.
 *
 * IMPORTANTE:
 * Este serviço interpreta o TEXTO do laudo.
 * Ele NÃO realiza diagnóstico a partir da imagem médica.
 * =========================================================
 */


/**
 * =========================================================
 * MODALIDADES
 * =========================================================
 */
const MODALIDADES = [

    {
        codigo: "TOMOGRAFIA_COMPUTADORIZADA",

        termos: [
            "tomografia computadorizada",
            "tomografia",
            "tc de",
            "tc do",
            "tc da",
            "tc dos",
            "tc das"
        ]
    },

    {
        codigo: "RESSONANCIA_MAGNETICA",

        termos: [
            "ressonancia magnetica",
            "ressonancia",
            "rm de",
            "rm do",
            "rm da",
            "rm dos",
            "rm das"
        ]
    },

    {
        codigo: "RADIOGRAFIA",

        termos: [
            "radiografia",
            "raio x",
            "raio-x",
            "rx de",
            "rx do",
            "rx da",
            "rx dos",
            "rx das"
        ]
    },

    {
        codigo: "ULTRASSONOGRAFIA",

        termos: [
            "ultrassonografia",
            "ultrassom",
            "ecografia",
            "usg"
        ]
    },

    {
        codigo: "MAMOGRAFIA",

        termos: [
            "mamografia"
        ]
    },

    {
        codigo: "DENSITOMETRIA_OSSEA",

        termos: [
            "densitometria ossea",
            "densitometria"
        ]
    },

    {
        codigo: "PET_CT",

        termos: [
            "pet ct",
            "pet-ct",
            "pet scan",
            "pet-scan"
        ]
    },

    {
        codigo: "ECOCARDIOGRAMA",

        termos: [
            "ecocardiograma",
            "ecocardiografia"
        ]
    },

    {
        codigo: "ANGIOTOMOGRAFIA",

        termos: [
            "angiotomografia",
            "angio tc",
            "angio-tc"
        ]
    },

    {
        codigo: "ANGIORRESSONANCIA",

        termos: [
            "angiorressonancia",
            "angio rm",
            "angio-rm"
        ]
    }

];


/**
 * =========================================================
 * REGIÕES ANATÔMICAS
 * =========================================================
 */
const REGIOES_ANATOMICAS = [

    {
        codigo: "CRANIO",
        termos: [
            "cranio",
            "encefalo",
            "cerebro"
        ]
    },

    {
        codigo: "PESCOCO",
        termos: [
            "pescoco",
            "regiao cervical"
        ]
    },

    {
        codigo: "TORAX",
        termos: [
            "torax",
            "pulmao",
            "pulmoes"
        ]
    },

    {
        codigo: "ABDOME",
        termos: [
            "abdome",
            "abdomen",
            "abdominal"
        ]
    },

    {
        codigo: "PELVIS",
        termos: [
            "pelve",
            "pelvis"
        ]
    },

    {
        codigo: "COLUNA_CERVICAL",
        termos: [
            "coluna cervical",
            "cervical"
        ]
    },

    {
        codigo: "COLUNA_TORACICA",
        termos: [
            "coluna toracica",
            "dorsal"
        ]
    },

    {
        codigo: "COLUNA_LOMBAR",
        termos: [
            "coluna lombar",
            "lombar"
        ]
    },

    {
        codigo: "OMBRO",
        termos: [
            "ombro"
        ]
    },

    {
        codigo: "COTOVELO",
        termos: [
            "cotovelo"
        ]
    },

    {
        codigo: "PUNHO",
        termos: [
            "punho"
        ]
    },

    {
        codigo: "MAO",
        termos: [
            "mao",
            "maos"
        ]
    },

    {
        codigo: "QUADRIL",
        termos: [
            "quadril"
        ]
    },

    {
        codigo: "JOELHO",
        termos: [
            "joelho"
        ]
    },

    {
        codigo: "TORNOZELO",
        termos: [
            "tornozelo"
        ]
    },

    {
        codigo: "PE",
        termos: [
            "pe",
            "pes"
        ]
    },

    {
        codigo: "MAMA",
        termos: [
            "mama",
            "mamas"
        ]
    },

    {
        codigo: "PROSTATA",
        termos: [
            "prostata"
        ]
    },

    {
        codigo: "CORACAO",
        termos: [
            "coracao",
            "cardiaco"
        ]
    },

    {
        codigo: "TIREOIDE",
        termos: [
            "tireoide"
        ]
    },

    {
        codigo: "RINS",
        termos: [
            "rim",
            "rins",
            "renal"
        ]
    }

];


/**
 * =========================================================
 * NORMALIZAR TEXTO
 * =========================================================
 */
function normalizarTexto(texto) {

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
            /\r/g,
            ""
        );

}


/**
 * =========================================================
 * LIMPAR TEXTO
 * =========================================================
 */
function limparTexto(valor) {

    if (!valor) {
        return null;
    }


    return String(valor)
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/**
 * =========================================================
 * IDENTIFICAR MODALIDADE
 * =========================================================
 */
function identificarModalidade(texto) {

    const normalizado =
        normalizarTexto(texto);


    /**
     * Modalidades mais específicas
     * precisam ser verificadas primeiro.
     */
    const prioridades = [

        "ANGIOTOMOGRAFIA",

        "ANGIORRESSONANCIA",

        "PET_CT",

        "TOMOGRAFIA_COMPUTADORIZADA",

        "RESSONANCIA_MAGNETICA",

        "MAMOGRAFIA",

        "DENSITOMETRIA_OSSEA",

        "ECOCARDIOGRAMA",

        "ULTRASSONOGRAFIA",

        "RADIOGRAFIA"

    ];


    for (
        const codigo of prioridades
    ) {

        const modalidade =
            MODALIDADES.find(
                item =>
                    item.codigo ===
                    codigo
            );


        if (!modalidade) {
            continue;
        }


        const encontrou =
            modalidade.termos.some(
                termo =>
                    normalizado.includes(
                        normalizarTexto(
                            termo
                        )
                    )
            );


        if (encontrou) {

            return modalidade.codigo;

        }

    }


    return "NAO_IDENTIFICADA";

}


/**
 * =========================================================
 * IDENTIFICAR REGIÃO
 * =========================================================
 */
function identificarRegiaoAnatomica(
    texto
) {

    const normalizado =
        normalizarTexto(texto);


    for (
        const regiao of REGIOES_ANATOMICAS
    ) {

        const encontrou =
            regiao.termos.some(
                termo =>
                    normalizado.includes(
                        normalizarTexto(
                            termo
                        )
                    )
            );


        if (encontrou) {

            return regiao.codigo;

        }

    }


    return "NAO_IDENTIFICADA";

}


/**
 * =========================================================
 * LATERALIDADE
 * =========================================================
 */
function identificarLateralidade(
    texto
) {

    const normalizado =
        normalizarTexto(texto);


    if (
        /\bbilateral\b/.test(
            normalizado
        ) ||
        /\bambos\b/.test(
            normalizado
        )
    ) {

        return "BILATERAL";

    }


    if (
        /\bdireito\b/.test(
            normalizado
        ) ||
        /\bdireita\b/.test(
            normalizado
        )
    ) {

        return "DIREITO";

    }


    if (
        /\besquerdo\b/.test(
            normalizado
        ) ||
        /\besquerda\b/.test(
            normalizado
        )
    ) {

        return "ESQUERDO";

    }


    return null;

}


/**
 * =========================================================
 * PACIENTE
 * =========================================================
 */
function extrairPaciente(
    texto
) {

    const nome =
        texto.match(
            /paciente\s*[:\-]\s*([^\n]+)/i
        );


    const nascimento =
        texto.match(
            /(?:data\s*de\s*nascimento|nascimento|dn)\s*[:\-]\s*(\d{2}\/\d{2}\/\d{4})/i
        );


    const cpf =
        texto.match(
            /cpf\s*[:\-]\s*([\d.\-]+)/i
        );


    return {

        nome:
            limparTexto(
                nome?.[1]
            ),

        dataNascimento:
            nascimento?.[1] ||
            null,

        cpf:
            cpf?.[1] ||
            null

    };

}


/**
 * =========================================================
 * DATA DO EXAME
 * =========================================================
 */
function extrairDataExame(
    texto
) {

    const padroes = [

        /data\s*do\s*exame\s*[:\-]\s*(\d{2}\/\d{2}\/\d{4})/i,

        /realizado\s*em\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i,

        /data\s*de\s*realizacao\s*[:\-]\s*(\d{2}\/\d{2}\/\d{4})/i,

        /data\s*[:\-]\s*(\d{2}\/\d{2}\/\d{4})/i

    ];


    for (
        const padrao of padroes
    ) {

        const resultado =
            texto.match(
                padrao
            );


        if (
            resultado?.[1]
        ) {

            return resultado[1];

        }

    }


    return null;

}


/**
 * =========================================================
 * MÉDICO
 * =========================================================
 */
function extrairMedico(
    texto
) {

    const nome =
        texto.match(
            /(?:medico|m[eé]dico\s*respons[aá]vel|radiologista)\s*[:\-]\s*([^\n]+)/i
        );


    const crm =
        texto.match(
            /crm\s*[-:]?\s*([A-Z]{2})?\s*(\d{4,8})/i
        );


    return {

        nome:
            limparTexto(
                nome?.[1]
            ),

        crm:
            crm?.[2] ||
            null,

        uf:
            crm?.[1]
                ? crm[1]
                    .toUpperCase()
                : null

    };

}


/**
 * =========================================================
 * EXTRAÇÃO DE SEÇÃO
 * =========================================================
 */
function extrairSecao(
    texto,
    titulosInicio,
    titulosFim
) {

    const linhas =
        String(texto || "")
            .replace(/\r/g, "")
            .split("\n");


    let inicio =
        -1;


    let fim =
        linhas.length;


    for (
        let i = 0;
        i < linhas.length;
        i++
    ) {

        const linha =
            normalizarTexto(
                linhas[i]
            )
                .trim();


        const encontrou =
            titulosInicio.some(
                titulo =>
                    linha ===
                    normalizarTexto(
                        titulo
                    ) ||
                    linha.startsWith(
                        normalizarTexto(
                            titulo
                        ) + ":"
                    )
            );


        if (encontrou) {

            inicio =
                i;

            break;

        }

    }


    if (
        inicio === -1
    ) {

        return null;

    }


    for (
        let i =
            inicio + 1;
        i < linhas.length;
        i++
    ) {

        const linha =
            normalizarTexto(
                linhas[i]
            )
                .trim();


        const encontrouFim =
            titulosFim.some(
                titulo =>
                    linha ===
                    normalizarTexto(
                        titulo
                    ) ||
                    linha.startsWith(
                        normalizarTexto(
                            titulo
                        ) + ":"
                    )
            );


        if (encontrouFim) {

            fim =
                i;

            break;

        }

    }


    /**
     * Algumas vezes o conteúdo aparece
     * depois de ":" na própria linha.
     */
    const primeiraLinha =
        linhas[inicio];


    const partes =
        primeiraLinha.split(":");


    const conteudoInicial =
        partes.length > 1
            ? partes
                .slice(1)
                .join(":")
                .trim()
            : "";


    const conteudo =
        [

            conteudoInicial,

            ...linhas.slice(
                inicio + 1,
                fim
            )

        ]
            .filter(Boolean)
            .join("\n")
            .trim();


    return conteudo || null;

}


/**
 * =========================================================
 * INDICAÇÃO
 * =========================================================
 */
function extrairIndicacao(
    texto
) {

    return extrairSecao(

        texto,

        [
            "indicação",
            "indicação clínica",
            "hipótese diagnóstica",
            "dados clínicos"
        ],

        [
            "técnica",
            "metodologia",
            "achados",
            "resultado",
            "descrição",
            "conclusão"
        ]

    );

}


/**
 * =========================================================
 * TÉCNICA
 * =========================================================
 */
function extrairTecnica(
    texto
) {

    return extrairSecao(

        texto,

        [
            "técnica",
            "metodologia",
            "protocolo"
        ],

        [
            "achados",
            "resultado",
            "descrição",
            "análise",
            "conclusão",
            "impressão diagnóstica"
        ]

    );

}


/**
 * =========================================================
 * ACHADOS
 * =========================================================
 */
function extrairAchadosTexto(
    texto
) {

    return extrairSecao(

        texto,

        [
            "achados",
            "achados radiológicos",
            "descrição",
            "resultado",
            "análise"
        ],

        [
            "conclusão",
            "impressão diagnóstica",
            "impressão",
            "opinião",
            "considerações finais"
        ]

    );

}


/**
 * =========================================================
 * ACHADOS ESTRUTURADOS
 * =========================================================
 */
function estruturarAchados(
    achadosTexto
) {

    if (
        !achadosTexto
    ) {

        return [];

    }


    return achadosTexto
        .split(
            /\n|(?<=\.)\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/
        )
        .map(
            item =>
                limparTexto(
                    item
                )
        )
        .filter(
            item =>
                item &&
                item.length >= 5
        );

}


/**
 * =========================================================
 * CONCLUSÃO
 * =========================================================
 */
function extrairConclusao(
    texto
) {

    return extrairSecao(

        texto,

        [
            "conclusão",
            "impressão diagnóstica",
            "impressão",
            "conclusões",
            "opinião"
        ],

        [
            "observações",
            "nota",
            "medico",
            "médico",
            "crm",
            "assinatura"
        ]

    );

}


/**
 * =========================================================
 * CONTRASTE
 * =========================================================
 */
function identificarContraste(
    texto
) {

    const normalizado =
        normalizarTexto(
            texto
        );


    const semContraste = [

        "sem contraste",

        "sem administracao de contraste",

        "sem administracao do meio de contraste",

        "nao foi administrado contraste"

    ];


    if (
        semContraste.some(
            termo =>
                normalizado.includes(
                    termo
                )
        )
    ) {

        return {

            utilizado:
                false,

            descricao:
                "Sem contraste"

        };

    }


    const comContraste = [

        "com contraste",

        "apos administracao de contraste",

        "contraste intravenoso",

        "meio de contraste"

    ];


    if (
        comContraste.some(
            termo =>
                normalizado.includes(
                    termo
                )
        )
    ) {

        return {

            utilizado:
                true,

            descricao:
                "Contraste mencionado no laudo"

        };

    }


    return {

        utilizado:
            null,

        descricao:
            null

    };

}


/**
 * =========================================================
 * NOME DO EXAME
 * =========================================================
 */
function extrairNomeExame(
    texto
) {

    const linhas =
        String(texto || "")
            .split("\n")
            .map(
                linha =>
                    limparTexto(
                        linha
                    )
            )
            .filter(Boolean);


    /**
     * Normalmente o nome do exame
     * está nas primeiras linhas.
     */
    for (
        const linha of linhas.slice(
            0,
            12
        )
    ) {

        const modalidade =
            identificarModalidade(
                linha
            );


        if (
            modalidade !==
            "NAO_IDENTIFICADA"
        ) {

            return linha;

        }

    }


    return null;

}


/**
 * =========================================================
 * COMPLETUDE DOCUMENTAL
 * =========================================================
 */
function calcularCompletude(
    dados
) {

    const verificacoes = {

        possuiPaciente:
            Boolean(
                dados
                    ?.paciente
                    ?.nome
            ),

        possuiData:
            Boolean(
                dados.dataExame
            ),

        possuiModalidade:
            Boolean(
                dados.modalidade &&
                dados.modalidade !==
                    "NAO_IDENTIFICADA"
            ),

        possuiRegiaoAnatomica:
            Boolean(
                dados.regiaoAnatomica &&
                dados.regiaoAnatomica !==
                    "NAO_IDENTIFICADA"
            ),

        possuiTecnica:
            Boolean(
                dados.tecnica
            ),

        possuiAchados:
            Boolean(
                dados.achadosTexto
            ),

        possuiConclusao:
            Boolean(
                dados.conclusao
            ),

        possuiMedico:
            Boolean(
                dados
                    ?.medico
                    ?.nome
            ),

        possuiCRM:
            Boolean(
                dados
                    ?.medico
                    ?.crm
            )

    };


    const total =
        Object.keys(
            verificacoes
        ).length;


    const encontrados =
        Object.values(
            verificacoes
        )
            .filter(Boolean)
            .length;


    return {

        ...verificacoes,

        percentual:
            Math.round(
                (
                    encontrados /
                    total
                ) *
                100
            )

    };

}


/**
 * =========================================================
 * EXTRAIR LAUDO
 * =========================================================
 */
function extrairLaudoImagem(
    texto
) {

    const paciente =
        extrairPaciente(
            texto
        );


    const modalidade =
        identificarModalidade(
            texto
        );


    const regiaoAnatomica =
        identificarRegiaoAnatomica(
            texto
        );


    const lateralidade =
        identificarLateralidade(
            texto
        );


    const dataExame =
        extrairDataExame(
            texto
        );


    const medico =
        extrairMedico(
            texto
        );


    const nomeExame =
        extrairNomeExame(
            texto
        );


    const indicacao =
        extrairIndicacao(
            texto
        );


    const tecnica =
        extrairTecnica(
            texto
        );


    const achadosTexto =
        extrairAchadosTexto(
            texto
        );


    const achados =
        estruturarAchados(
            achadosTexto
        );


    const conclusao =
        extrairConclusao(
            texto
        );


    const contraste =
        identificarContraste(
            texto
        );


    const dados = {

        modalidade,

        exame:
            nomeExame,

        regiaoAnatomica,

        lateralidade,

        paciente,

        dataExame,

        medico,

        indicacao,

        tecnica,

        achadosTexto,

        achados,

        conclusao,

        contraste

    };


    return {

        ...dados,

        completude:
            calcularCompletude(
                dados
            )

    };

}


/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */
module.exports = {

    extrairLaudoImagem,

    identificarModalidade,

    identificarRegiaoAnatomica,

    identificarLateralidade,

    extrairPaciente,

    extrairDataExame,

    extrairMedico,

    extrairTecnica,

    extrairConclusao,

    normalizarTexto,

    MODALIDADES,

    REGIOES_ANATOMICAS

};

