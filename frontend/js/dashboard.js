/**
 * =========================================================
 * SMARTDOCS
 * DASHBOARD
 * =========================================================
 */


const API_BASE_URL =
    "http://localhost:3000/api/dashboard";


/**
 * =========================================================
 * CHART INSTANCES
 * =========================================================
 */
let chartVolume = null;

let chartStatus = null;

let chartExames = null;

let chartDocumentos = null;


/**
 * =========================================================
 * ELEMENTOS
 * =========================================================
 */
const btnRefresh =
    document.getElementById(
        "btnRefresh"
    );


const btnMobileMenu =
    document.getElementById(
        "btnMobileMenu"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


/**
 * =========================================================
 * INIT
 * =========================================================
 */
document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


/**
 * =========================================================
 * EVENTOS
 * =========================================================
 */
if (btnRefresh) {

    btnRefresh.addEventListener(
        "click",
        async () => {

            const icon =
                btnRefresh.querySelector(
                    "i"
                );


            icon.classList.add(
                "spin"
            );


            await carregarDashboard();


            icon.classList.remove(
                "spin"
            );

        }
    );

}


if (btnMobileMenu) {

    btnMobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/**
 * =========================================================
 * INICIAR
 * =========================================================
 */
async function iniciarDashboard() {

    configurarChartJS();

    await carregarDashboard();

}


/**
 * =========================================================
 * CARREGAR DASHBOARD
 * =========================================================
 */
async function carregarDashboard() {

    try {

        /**
         * As requisições são feitas
         * paralelamente.
         */
        const [

            resumo,

            status,

            exames,

            documentos,

            recentes,

            volume

        ] = await Promise.all([

            buscarAPI(
                "/resumo"
            ),

            buscarAPI(
                "/status-exames"
            ),

            buscarAPI(
                "/exames"
            ),

            buscarAPI(
                "/tipos-documentos"
            ),

            buscarAPI(
                "/recentes"
            ),

            buscarAPI(
                "/volume"
            )

        ]);


        renderizarResumo(
            resumo
        );


        renderizarStatus(
            status.dados || []
        );


        renderizarExames(
            exames.dados || []
        );


        renderizarDocumentos(
            documentos.dados || []
        );


        renderizarRecentes(
            recentes.dados || []
        );


        renderizarVolume(
            volume.dados || []
        );


        atualizarHorario();


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );


        renderizarErro();

    }

}


/**
 * =========================================================
 * FETCH
 * =========================================================
 */
async function buscarAPI(
    endpoint
) {

    const resposta =
        await fetch(
            `${API_BASE_URL}${endpoint}`
        );


    let dados;


    try {

        dados =
            await resposta.json();

    } catch {

        throw new Error(
            `Resposta inválida da API: ${endpoint}`
        );

    }


    if (
        !resposta.ok ||
        dados.sucesso === false
    ) {

        throw new Error(
            dados.mensagem ||
            `Erro ao acessar ${endpoint}`
        );

    }


    return dados;

}


/**
 * =========================================================
 * RESUMO
 * =========================================================
 */
function renderizarResumo(
    dados
) {

    atualizarTexto(
        "kpiProcessamentos",
        formatarNumero(
            dados.totalProcessamentos
        )
    );


    atualizarTexto(
        "kpiDocumentos",
        formatarNumero(
            dados.totalDocumentos
        )
    );


    atualizarTexto(
        "kpiExames",
        formatarNumero(
            dados.totalExames
        )
    );


    atualizarTexto(
        "kpiNormais",
        formatarNumero(
            dados.dentroReferencia
        )
    );


    atualizarTexto(
        "kpiAlterados",
        formatarNumero(
            dados.foraReferencia
        )
    );


    atualizarTexto(
        "kpiConfianca",
        `${formatarDecimal(
            dados.confiancaMedia
        )}%`
    );

}


/**
 * =========================================================
 * STATUS DOS EXAMES
 * =========================================================
 */
function renderizarStatus(
    dados
) {

    const labels = [];

    const valores = [];


    const mapa = {

        NORMAL:
            "Dentro da referência",

        FORA_DA_REFERENCIA:
            "Fora da referência",

        NAO_INTERPRETADO:
            "Não interpretado"

    };


    dados.forEach(
        item => {

            labels.push(
                mapa[item._id] ||
                item._id ||
                "Não informado"
            );


            valores.push(
                item.total || 0
            );

        }
    );


    if (
        chartStatus
    ) {

        chartStatus.destroy();

    }


    const canvas =
        document.getElementById(
            "chartStatus"
        );


    chartStatus =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels,

                    datasets: [

                        {

                            data:
                                valores,

                            backgroundColor: [
                                "#27AE76",
                                "#E95454",
                                "#AAB4C3"
                            ],

                            borderWidth:
                                0,

                            hoverOffset:
                                5

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "72%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle",

                                padding:
                                    20,

                                font: {
                                    size: 11
                                }

                            }

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        contexto
                                    ) {

                                        const total =
                                            valores.reduce(
                                                (
                                                    soma,
                                                    valor
                                                ) =>
                                                    soma + valor,
                                                0
                                            );


                                        const valor =
                                            contexto.raw;


                                        const percentual =
                                            total > 0
                                                ? (
                                                    (
                                                        valor /
                                                        total
                                                    ) *
                                                    100
                                                ).toFixed(1)
                                                : 0;


                                        return (
                                            ` ${contexto.label}: ` +
                                            `${valor} (${percentual}%)`
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/**
 * =========================================================
 * EXAMES MAIS PROCESSADOS
 * =========================================================
 */
function renderizarExames(
    dados
) {

    /**
     * Inverte para o gráfico horizontal
     * ficar com o maior no topo.
     */
    const lista =
        [...dados]
            .slice(
                0,
                10
            )
            .reverse();


    const labels =
        lista.map(
            item =>
                item._id ||
                "Exame"
        );


    const totais =
        lista.map(
            item =>
                item.total || 0
        );


    const fora =
        lista.map(
            item =>
                item.foraReferencia || 0
        );


    if (
        chartExames
    ) {

        chartExames.destroy();

    }


    const canvas =
        document.getElementById(
            "chartExames"
        );


    chartExames =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Total",

                            data:
                                totais,

                            backgroundColor:
                                "#447DF1",

                            borderRadius:
                                5

                        },

                        {

                            label:
                                "Fora da referência",

                            data:
                                fora,

                            backgroundColor:
                                "#EF6666",

                            borderRadius:
                                5

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    indexAxis:
                        "y",

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },

                    scales: {

                        x: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "#EEF2F6"

                            },

                            border: {
                                display:
                                    false
                            },

                            ticks: {
                                precision:
                                    0
                            }

                        },

                        y: {

                            grid: {
                                display:
                                    false
                            },

                            border: {
                                display:
                                    false
                            }

                        }

                    },

                    plugins: {

                        legend: {

                            position:
                                "top",

                            align:
                                "end",

                            labels: {

                                usePointStyle:
                                    true,

                                boxWidth:
                                    8,

                                font: {
                                    size: 11
                                }

                            }

                        }

                    }

                }

            }
        );

}


/**
 * =========================================================
 * TIPOS DOCUMENTAIS
 * =========================================================
 */
function renderizarDocumentos(
    dados
) {

    const labels =
        dados.map(
            item =>
                formatarTipoDocumento(
                    item._id
                )
        );


    const valores =
        dados.map(
            item =>
                item.total || 0
        );


    if (
        chartDocumentos
    ) {

        chartDocumentos.destroy();

    }


    const canvas =
        document.getElementById(
            "chartDocumentos"
        );


    chartDocumentos =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Documentos",

                            data:
                                valores,

                            backgroundColor:
                                "#7C63D8",

                            borderRadius:
                                6,

                            maxBarThickness:
                                45

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        x: {

                            grid: {
                                display:
                                    false
                            },

                            border: {
                                display:
                                    false
                            },

                            ticks: {

                                maxRotation:
                                    45,

                                minRotation:
                                    0,

                                font: {
                                    size: 9
                                }

                            }

                        },

                        y: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "#EEF2F6"

                            },

                            border: {
                                display:
                                    false
                            },

                            ticks: {
                                precision:
                                    0
                            }

                        }

                    },

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    }

                }

            }
        );

}


/**
 * =========================================================
 * VOLUME
 * =========================================================
 */
function renderizarVolume(
    dados
) {

    const labels =
        dados.map(
            item =>
                formatarDataCurta(
                    item._id
                )
        );


    const processamentos =
        dados.map(
            item =>
                item.totalProcessamentos ||
                0
        );


    const documentos =
        dados.map(
            item =>
                item.totalDocumentos ||
                0
        );


    if (
        chartVolume
    ) {

        chartVolume.destroy();

    }


    const canvas =
        document.getElementById(
            "chartVolume"
        );


    chartVolume =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Processamentos",

                            data:
                                processamentos,

                            borderColor:
                                "#316DE6",

                            backgroundColor:
                                "rgba(49,109,230,0.08)",

                            fill:
                                true,

                            tension:
                                0.35,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                5,

                            borderWidth:
                                2

                        },

                        {

                            label:
                                "Documentos",

                            data:
                                documentos,

                            borderColor:
                                "#16A36A",

                            backgroundColor:
                                "transparent",

                            fill:
                                false,

                            tension:
                                0.35,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                5,

                            borderWidth:
                                2

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        intersect:
                            false,

                        mode:
                            "index"

                    },

                    scales: {

                        x: {

                            grid: {
                                display:
                                    false
                            },

                            border: {
                                display:
                                    false
                            }

                        },

                        y: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "#EEF2F6"

                            },

                            border: {
                                display:
                                    false
                            },

                            ticks: {
                                precision:
                                    0
                            }

                        }

                    },

                    plugins: {

                        legend: {

                            position:
                                "top",

                            align:
                                "end",

                            labels: {

                                usePointStyle:
                                    true,

                                boxWidth:
                                    8,

                                font: {
                                    size: 11
                                }

                            }

                        }

                    }

                }

            }
        );

}


/**
 * =========================================================
 * PROCESSAMENTOS RECENTES
 * =========================================================
 */
function renderizarRecentes(
    dados
) {

    const tbody =
        document.getElementById(
            "recentesBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !Array.isArray(
            dados
        ) ||
        dados.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <i class="bi bi-inbox"></i>

                        Nenhum processamento encontrado.

                        <div class="mt-2">

                            <a
                                href="./upload.html"
                                class="
                                    btn
                                    btn-primary
                                    btn-sm
                                "
                            >

                                Enviar primeiro documento

                            </a>

                        </div>

                    </div>

                </td>

            </tr>

        `;


        return;

    }


    tbody.innerHTML =
        dados
            .map(
                processamento =>
                    criarLinhaProcessamento(
                        processamento
                    )
            )
            .join("");

}


/**
 * =========================================================
 * LINHA DE PROCESSAMENTO
 * =========================================================
 */
function criarLinhaProcessamento(
    item
) {

    const confianca =
        Math.round(
            (
                Number(
                    item.confianca
                ) ||
                0
            ) *
            100
        );


    return `

        <tr>

            <td>

                <div class="patient-name">

                    ${
                        escapeHtml(
                            item.paciente ||
                            "Não identificado"
                        )
                    }

                </div>

            </td>


            <td>

                ${
                    escapeHtml(
                        item.processo ||
                        "-"
                    )
                }

            </td>


            <td>

                <div class="document-name">

                    ${
                        escapeHtml(
                            item.documento ||
                            "-"
                        )
                    }

                </div>

            </td>


            <td>

                <strong>

                    ${
                        formatarNumero(
                            item.totalExames
                        )
                    }

                </strong>

            </td>


            <td>

                ${
                    confianca
                }%

            </td>


            <td>

                ${
                    criarStatusProcessamento(
                        item.status
                    )
                }

            </td>


            <td>

                ${
                    formatarDataHora(
                        item.criadoEm
                    )
                }

            </td>

        </tr>

    `;

}


/**
 * =========================================================
 * STATUS PROCESSAMENTO
 * =========================================================
 */
function criarStatusProcessamento(
    status
) {

    switch (
        status
    ) {

        case "APROVADO":

            return `

                <span
                    class="
                        status-badge
                        status-success
                    "
                >
                    Concluído
                </span>

            `;


        case "REVISAO_MANUAL":

            return `

                <span
                    class="
                        status-badge
                        status-warning
                    "
                >
                    Revisão
                </span>

            `;


        case "PENDENTE":

            return `

                <span
                    class="
                        status-badge
                        status-warning
                    "
                >
                    Pendente
                </span>

            `;


        case "PROCESSO_NAO_RECONHECIDO":

            return `

                <span
                    class="
                        status-badge
                        status-danger
                    "
                >
                    Não reconhecido
                </span>

            `;


        default:

            return `

                <span
                    class="
                        status-badge
                        status-neutral
                    "
                >

                    ${
                        escapeHtml(
                            status ||
                            "Indefinido"
                        )
                    }

                </span>

            `;

    }

}


/**
 * =========================================================
 * FORMATAR TIPO DOCUMENTO
 * =========================================================
 */
function formatarTipoDocumento(
    tipo
) {

    const mapa = {

        RESULTADO_LABORATORIAL:
            "Resultado laboratorial",

        LAUDO_MEDICO:
            "Laudo médico",

        LAUDO_IMAGEM:
            "Laudo de imagem",

        PRESCRICAO_MEDICA:
            "Prescrição",

        PEDIDO_EXAME:
            "Pedido de exame",

        EVOLUCAO_CLINICA:
            "Evolução clínica",

        ANAMNESE:
            "Anamnese",

        RELATORIO_MEDICO:
            "Relatório médico",

        ATESTADO_MEDICO:
            "Atestado",

        TERMO_CONSENTIMENTO:
            "Consentimento",

        TERMO_CIRURGICO:
            "Termo cirúrgico",

        AVALIACAO_PRE_ANESTESICA:
            "Pré-anestésica",

        SUMARIO_ALTA:
            "Sumário de alta",

        GUIA_CONVENIO:
            "Guia convênio",

        AUTORIZACAO_PROCEDIMENTO:
            "Autorização",

        DOCUMENTO_IDENTIFICACAO:
            "Identificação",

        CARTEIRINHA_CONVENIO:
            "Carteirinha",

        ENCAMINHAMENTO:
            "Encaminhamento",

        DESCONHECIDO:
            "Não identificado"

    };


    return (
        mapa[tipo] ||
        String(
            tipo ||
            "Documento"
        )
            .replace(
                /_/g,
                " "
            )
    );

}


/**
 * =========================================================
 * FORMATADORES
 * =========================================================
 */
function formatarNumero(
    valor
) {

    return Number(
        valor ||
        0
    ).toLocaleString(
        "pt-BR"
    );

}


function formatarDecimal(
    valor
) {

    return Number(
        valor ||
        0
    ).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits:
                1,

            maximumFractionDigits:
                1
        }
    );

}


function formatarDataCurta(
    data
) {

    if (!data) {
        return "-";
    }


    /**
     * Evita diferença de timezone
     * para datas YYYY-MM-DD.
     */
    const partes =
        String(data)
            .split("-");


    if (
        partes.length === 3
    ) {

        return (
            `${partes[2]}/${partes[1]}`
        );

    }


    return data;

}


function formatarDataHora(
    data
) {

    if (!data) {
        return "-";
    }


    const date =
        new Date(
            data
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleString(
        "pt-BR",
        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


/**
 * =========================================================
 * ATUALIZAÇÃO
 * =========================================================
 */
function atualizarHorario() {

    const elemento =
        document.getElementById(
            "ultimaAtualizacao"
        );


    if (!elemento) {
        return;
    }


    const agora =
        new Date();


    elemento.innerHTML = `

        <i
            class="
                bi
                bi-check-circle
                me-1
            "
        ></i>

        Atualizado às

        ${agora.toLocaleTimeString(
            "pt-BR",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        )}

    `;

}


/**
 * =========================================================
 * ERRO
 * =========================================================
 */
function renderizarErro() {

    atualizarTexto(
        "kpiProcessamentos",
        "-"
    );

    atualizarTexto(
        "kpiDocumentos",
        "-"
    );

    atualizarTexto(
        "kpiExames",
        "-"
    );

    atualizarTexto(
        "kpiNormais",
        "-"
    );

    atualizarTexto(
        "kpiAlterados",
        "-"
    );

    atualizarTexto(
        "kpiConfianca",
        "-"
    );


    const tbody =
        document.getElementById(
            "recentesBody"
        );


    if (tbody) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <i
                            class="
                                bi
                                bi-exclamation-circle
                            "
                        ></i>

                        Não foi possível carregar os dados.

                        <div
                            class="
                                small
                                mt-2
                            "
                        >

                            Verifique se o backend está
                            rodando em localhost:3000.

                        </div>

                    </div>

                </td>

            </tr>

        `;

    }

}


/**
 * =========================================================
 * CHART CONFIG
 * =========================================================
 */
function configurarChartJS() {

    if (
        typeof Chart ===
        "undefined"
    ) {

        console.error(
            "Chart.js não foi carregado."
        );

        return;

    }


    Chart.defaults.font.family =
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';


    Chart.defaults.color =
        "#68768B";


    Chart.defaults.plugins
        .tooltip
        .backgroundColor =
            "#0F172A";


    Chart.defaults.plugins
        .tooltip
        .padding =
            12;


    Chart.defaults.plugins
        .tooltip
        .cornerRadius =
            8;

}


/**
 * =========================================================
 * UTIL
 * =========================================================
 */
function atualizarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


/**
 * =========================================================
 * ESCAPE HTML
 * =========================================================
 */
function escapeHtml(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(
        valor
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/**
 * =========================================================
 * SPIN REFRESH
 * =========================================================
 */
const style =
    document.createElement(
        "style"
    );


style.textContent = `

    .spin {

        animation:
            smartdocs-spin
            0.75s
            linear
            infinite;

    }


    @keyframes smartdocs-spin {

        from {

            transform:
                rotate(0deg);

        }

        to {

            transform:
                rotate(360deg);

        }

    }

`;


document.head.appendChild(
    style
);

