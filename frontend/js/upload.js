/**
 * =========================================================
 * SMARTDOCS
 * UPLOAD FRONTEND
 * =========================================================
 */

const API_URL =
    "http://localhost:3000";


const btnEnviar =
    document.getElementById(
        "btnEnviar"
    );


const inputDocumentos =
    document.getElementById(
        "documentos"
    );


const resultado =
    document.getElementById(
        "resultado"
    );


btnEnviar.addEventListener(
    "click",
    enviarArquivos
);


/**
 * =========================================================
 * ENVIAR ARQUIVOS
 * =========================================================
 */
async function enviarArquivos() {

    if (
        !inputDocumentos.files ||
        inputDocumentos.files.length === 0
    ) {

        alert(
            "Selecione pelo menos um arquivo."
        );

        return;

    }


    btnEnviar.disabled =
        true;


    btnEnviar.innerHTML = `
        <span
            class="
                spinner-border
                spinner-border-sm
                me-2
            "
        ></span>

        Processando...
    `;


    resultado.innerHTML = `

        <div class="alert alert-info">

            <div
                class="
                    d-flex
                    align-items-center
                    gap-2
                "
            >

                <div
                    class="
                        spinner-border
                        spinner-border-sm
                    "
                ></div>

                <div>

                    <strong>
                        SmartDocs está analisando os documentos.
                    </strong>

                    <div class="small mt-1">

                        Executando OCR, classificação e
                        extração das informações...

                    </div>

                </div>

            </div>

        </div>

    `;


    const formData =
        new FormData();


    for (
        const arquivo of inputDocumentos.files
    ) {

        formData.append(
            "documentos",
            arquivo
        );

    }


    formData.append(
        "tipoProcesso",
        "atendimento_ambulatorial"
    );


    try {

        const resposta =
            await fetch(
                `${API_URL}/api/upload`,
                {
                    method:
                        "POST",

                    body:
                        formData
                }
            );


        const dados =
            await resposta.json();


        console.log(
            "Resposta SmartDocs:",
            dados
        );


        if (
            !resposta.ok ||
            dados.sucesso === false
        ) {

            throw new Error(
                dados.mensagem ||
                "Erro no processamento."
            );

        }


        renderizarResultado(
            dados
        );


    } catch (erro) {

        console.error(
            "Erro no upload:",
            erro
        );


        resultado.innerHTML = `

            <div class="alert alert-danger">

                <strong>
                    Erro ao processar documentos.
                </strong>

                <div class="mt-2">

                    ${
                        escapeHtml(
                            erro.message
                        )
                    }

                </div>

            </div>

        `;

    } finally {

        btnEnviar.disabled =
            false;


        btnEnviar.innerHTML =
            "Enviar Arquivos";

    }

}


/**
 * =========================================================
 * RESULTADO
 * =========================================================
 */
function renderizarResultado(
    dados
) {

    const documentos =
        dados.documentosAnalisados ||
        dados.documentos ||
        [];


    resultado.innerHTML = `

        ${renderizarCabecalhoResultado(
            dados
        )}

        ${renderizarResumoProcessamento(
            dados
        )}

        ${renderizarAlertas(
            dados.alertas ||
            []
        )}

        <div class="mt-4">

            ${documentos
                .map(
                    (
                        documento,
                        indice
                    ) =>
                        renderizarDocumento(
                            documento,
                            indice
                        )
                )
                .join("")
            }

        </div>

    `;


    inicializarFiltrosExames();

}


/**
 * =========================================================
 * CABEÇALHO RESULTADO
 * =========================================================
 */
function renderizarCabecalhoResultado(
    dados
) {

    return `

        <div
            class="
                card
                border-0
                shadow-sm
                mb-4
            "
        >

            <div class="card-body">

                <div
                    class="
                        d-flex
                        flex-column
                        flex-md-row
                        justify-content-between
                        align-items-md-center
                        gap-3
                    "
                >

                    <div>

                        <h4 class="mb-1">
                            Processamento concluído
                        </h4>

                        <div
                            class="
                                text-secondary
                                small
                            "
                        >

                            ${
                                escapeHtml(
                                    dados.mensagem ||
                                    "Documentos analisados com sucesso."
                                )
                            }

                        </div>

                    </div>


                    <div>

                        ${criarBadgeStatusProcessamento(
                            dados.status
                        )}

                    </div>

                </div>


                ${
                    dados.processamentoId
                        ? `

                            <div
                                class="
                                    small
                                    text-secondary
                                    mt-3
                                "
                            >

                                Processamento:

                                <code>

                                    ${
                                        escapeHtml(
                                            dados.processamentoId
                                        )
                                    }

                                </code>

                            </div>

                        `
                        : ""
                }

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * RESUMO
 * =========================================================
 */
function renderizarResumoProcessamento(
    dados
) {

    const resumo =
        dados.resumo ||
        {};


    return `

        <div
            class="
                row
                g-3
                mb-4
            "
        >

            ${criarCardResumo(
                "Arquivos",
                resumo.totalArquivos ||
                dados.quantidade ||
                0,
                "primary"
            )}

            ${criarCardResumo(
                "Identificados",
                resumo.identificados ||
                0,
                "success"
            )}

            ${criarCardResumo(
                "Não identificados",
                resumo.naoIdentificados ||
                0,
                resumo.naoIdentificados
                    ? "danger"
                    : "secondary"
            )}

            ${criarCardResumo(
                "Exames laboratoriais",
                resumo.totalExames ||
                0,
                "info"
            )}

            ${criarCardResumo(
                "Laudos de imagem",
                resumo.totalLaudosImagem ||
                0,
                "primary"
            )}

            ${criarCardResumo(
                "Documentos faltantes",
                resumo.documentosFaltantes ||
                0,
                resumo.documentosFaltantes
                    ? "warning"
                    : "secondary"
            )}

        </div>

    `;

}


/**
 * =========================================================
 * CARD RESUMO
 * =========================================================
 */
function criarCardResumo(
    titulo,
    valor,
    cor
) {

    return `

        <div
            class="
                col-xl-2
                col-md-4
                col-sm-6
            "
        >

            <div class="card h-100">

                <div class="card-body">

                    <div
                        class="
                            text-secondary
                            small
                        "
                    >

                        ${
                            escapeHtml(
                                titulo
                            )
                        }

                    </div>

                    <div
                        class="
                            fs-3
                            fw-bold
                            text-${cor}
                            mt-1
                        "
                    >

                        ${
                            Number(
                                valor ||
                                0
                            ).toLocaleString(
                                "pt-BR"
                            )
                        }

                    </div>

                </div>

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * ALERTAS
 * =========================================================
 */
function renderizarAlertas(
    alertas
) {

    if (
        !Array.isArray(
            alertas
        ) ||
        alertas.length === 0
    ) {

        return "";

    }


    return `

        <div class="card mb-4">

            <div class="card-body">

                <h5 class="mb-3">
                    Alertas do processamento
                </h5>

                ${alertas
                    .map(
                        alerta => `

                            <div
                                class="
                                    alert
                                    ${
                                        alerta.nivel ===
                                        "ATENCAO"
                                            ? "alert-warning"
                                            : "alert-info"
                                    }
                                    mb-2
                                "
                            >

                                <strong>

                                    ${
                                        escapeHtml(
                                            formatarCodigo(
                                                alerta.tipo
                                            )
                                        )
                                    }

                                </strong>

                                <div class="small mt-1">

                                    ${
                                        escapeHtml(
                                            alerta.mensagem ||
                                            ""
                                        )
                                    }

                                </div>

                            </div>

                        `
                    )
                    .join("")
                }

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * DOCUMENTO
 * =========================================================
 */
function renderizarDocumento(
    documento,
    indice
) {

    const tipo =
        documento.tipo ||
        "DESCONHECIDO";


    return `

        <div
            class="
                card
                mb-4
                shadow-sm
            "
        >

            <div class="card-body">

                ${renderizarCabecalhoDocumento(
                    documento,
                    indice
                )}

                ${
                    tipo ===
                    "RESULTADO_LABORATORIAL"
                        ? renderizarLaboratorio(
                            documento
                        )
                        : ""
                }

                ${
                    tipo ===
                    "LAUDO_IMAGEM"
                        ? renderizarLaudoImagem(
                            documento
                        )
                        : ""
                }

                ${
                    tipo !==
                        "RESULTADO_LABORATORIAL" &&
                    tipo !==
                        "LAUDO_IMAGEM"
                        ? renderizarDocumentoGenerico(
                            documento
                        )
                        : ""
                }

                ${renderizarOCR(
                    documento
                )}

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * CABEÇALHO DOCUMENTO
 * =========================================================
 */
function renderizarCabecalhoDocumento(
    documento,
    indice
) {

    const confianca =
        normalizarPercentual(
            documento.confianca
        );


    return `

        <div
            class="
                d-flex
                flex-column
                flex-lg-row
                justify-content-between
                gap-3
                mb-4
            "
        >

            <div>

                <div
                    class="
                        text-secondary
                        small
                    "
                >

                    Documento ${
                        indice + 1
                    }

                </div>

                <h4 class="mb-1">

                    ${
                        escapeHtml(
                            documento.documento ||
                            "Documento não identificado"
                        )
                    }

                </h4>

                <div
                    class="
                        text-secondary
                        small
                    "
                >

                    ${
                        escapeHtml(
                            documento.arquivo ||
                            ""
                        )
                    }

                </div>

            </div>

            <div
                class="
                    d-flex
                    flex-wrap
                    gap-2
                    align-items-start
                "
            >

                <span
                    class="
                        badge
                        text-bg-light
                        border
                    "
                >

                    ${
                        escapeHtml(
                            formatarCodigo(
                                documento.tipo
                            )
                        )
                    }

                </span>

                <span
                    class="
                        badge
                        bg-primary
                    "
                >

                    Confiança:
                    ${confianca}%

                </span>

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * LABORATÓRIO
 * =========================================================
 */
function renderizarLaboratorio(
    documento
) {

    const dados =
        documento.dadosExtraidos ||
        {};


    const paciente =
        dados.paciente ||
        {};


    const solicitante =
        dados.solicitante ||
        {};


    const coleta =
        dados.coleta ||
        {};


    const exames =
        dados.exames ||
        [];


    const resumo =
        dados.resumoExames ||
        {};


    return `

        <div class="mb-4">

            <h5>
                Informações do exame laboratorial
            </h5>

        </div>


        ${renderizarTabelaInformacoes([
            [
                "Paciente",
                paciente.nome
            ],
            [
                "Data de nascimento",
                paciente.dataNascimento
            ],
            [
                "CPF",
                paciente.cpf
            ],
            [
                "Solicitante",
                solicitante.nome
            ],
            [
                "CRM",
                formatarCRM(
                    solicitante
                )
            ],
            [
                "Data da coleta",
                coleta.data
            ],
            [
                "Data do resultado",
                coleta.dataResultado
            ]
        ])}


        <div
            class="
                row
                g-3
                mb-4
            "
        >

            ${criarMiniCard(
                "Total de exames",
                resumo.total ||
                exames.length,
                "primary"
            )}

            ${criarMiniCard(
                "Dentro da referência",
                resumo.normais ||
                0,
                "success"
            )}

            ${criarMiniCard(
                "Fora da referência",
                resumo.foraReferencia ||
                0,
                "danger"
            )}

            ${criarMiniCard(
                "Não interpretados",
                resumo.naoInterpretados ||
                0,
                "secondary"
            )}

        </div>


        ${
            exames.length
                ? renderizarTabelaExames(
                    exames
                )
                : renderizarSemDados(
                    "Nenhum resultado laboratorial estruturado foi encontrado."
                )
        }

    `;

}


/**
 * =========================================================
 * TABELA EXAMES
 * =========================================================
 */
function renderizarTabelaExames(
    exames
) {

    const id =
        `exames-${Math.random()
            .toString(36)
            .substring(2, 9)}`;


    return `

        <div
            class="
                d-flex
                flex-column
                flex-md-row
                justify-content-between
                gap-2
                mb-3
            "
        >

            <h5 class="mb-0">
                Resultados laboratoriais
            </h5>

            <div
                class="
                    d-flex
                    gap-2
                "
            >

                <input
                    type="search"
                    class="
                        form-control
                        form-control-sm
                        filtro-exame-texto
                    "
                    placeholder="Buscar exame..."
                    data-target="${id}"
                >

                <select
                    class="
                        form-select
                        form-select-sm
                        filtro-exame-status
                    "
                    data-target="${id}"
                >

                    <option value="">
                        Todos
                    </option>

                    <option value="NORMAL">
                        Dentro da referência
                    </option>

                    <option value="FORA_DA_REFERENCIA">
                        Fora da referência
                    </option>

                    <option value="NAO_INTERPRETADO">
                        Não interpretado
                    </option>

                </select>

            </div>

        </div>


        <div class="table-responsive">

            <table
                class="
                    table
                    table-hover
                    align-middle
                "
            >

                <thead class="table-light">

                    <tr>

                        <th>Exame</th>

                        <th>Resultado</th>

                        <th>Referência</th>

                        <th>Unidade</th>

                        <th>Status</th>

                    </tr>

                </thead>


                <tbody id="${id}">

                    ${exames
                        .map(
                            exame => `

                                <tr
                                    data-nome="${
                                        escapeHtml(
                                            String(
                                                exame.nome ||
                                                ""
                                            ).toLowerCase()
                                        )
                                    }"

                                    data-status="${
                                        escapeHtml(
                                            exame.status ||
                                            ""
                                        )
                                    }"
                                >

                                    <td>

                                        <strong>

                                            ${
                                                escapeHtml(
                                                    exame.nome ||
                                                    "-"
                                                )
                                            }

                                        </strong>

                                    </td>

                                    <td>
                                        ${
                                            escapeHtml(
                                                exame.resultado ||
                                                "-"
                                            )
                                        }
                                    </td>

                                    <td>
                                        ${
                                            escapeHtml(
                                                exame.referencia ||
                                                "-"
                                            )
                                        }
                                    </td>

                                    <td>
                                        ${
                                            escapeHtml(
                                                exame.unidade ||
                                                "-"
                                            )
                                        }
                                    </td>

                                    <td>
                                        ${criarBadgeExame(
                                            exame.status
                                        )}
                                    </td>

                                </tr>

                            `
                        )
                        .join("")
                    }

                </tbody>

            </table>

        </div>

    `;

}


/**
 * =========================================================
 * LAUDO DE IMAGEM
 * =========================================================
 */
function renderizarLaudoImagem(
    documento
) {

    const dados =
        documento.dadosExtraidos ||
        {};


    const exame =
        dados.exameImagem ||
        {};


    const paciente =
        exame.paciente ||
        {};


    const medico =
        exame.medico ||
        {};


    const contraste =
        exame.contraste ||
        {};


    const completude =
        exame.completude ||
        {};


    const achados =
        Array.isArray(
            exame.achados
        )
            ? exame.achados
            : [];


    return `

        <div
            class="
                border-top
                pt-4
            "
        >

            <div
                class="
                    d-flex
                    flex-column
                    flex-lg-row
                    justify-content-between
                    align-items-lg-center
                    gap-3
                    mb-4
                "
            >

                <div>

                    <h5 class="mb-1">
                        Exame de imagem
                    </h5>

                    <div
                        class="
                            text-secondary
                            small
                        "
                    >

                        Informações estruturadas extraídas
                        do laudo radiológico.

                    </div>

                </div>

                <div>

                    <span
                        class="
                            badge
                            ${
                                Number(
                                    completude.percentual ||
                                    0
                                ) >= 80
                                    ? "bg-success"
                                    : Number(
                                        completude.percentual ||
                                        0
                                    ) >= 60
                                        ? "bg-warning text-dark"
                                        : "bg-danger"
                            }
                            fs-6
                        "
                    >

                        Completude:
                        ${
                            Number(
                                completude.percentual ||
                                0
                            )
                        }%

                    </span>

                </div>

            </div>


            <h6 class="mb-3">
                Informações gerais
            </h6>


            ${renderizarTabelaInformacoes([

                [
                    "Exame",
                    exame.exame
                ],

                [
                    "Modalidade",
                    formatarCodigo(
                        exame.modalidade
                    )
                ],

                [
                    "Região anatômica",
                    formatarCodigo(
                        exame.regiaoAnatomica
                    )
                ],

                [
                    "Lateralidade",
                    formatarCodigo(
                        exame.lateralidade
                    )
                ],

                [
                    "Data do exame",
                    exame.dataExame
                ],

                [
                    "Contraste",
                    formatarContraste(
                        contraste
                    )
                ]

            ])}


            <h6 class="mt-4 mb-3">
                Paciente
            </h6>


            ${renderizarTabelaInformacoes([

                [
                    "Nome",
                    paciente.nome
                ],

                [
                    "Data de nascimento",
                    paciente.dataNascimento
                ],

                [
                    "CPF",
                    paciente.cpf
                ]

            ])}


            <h6 class="mt-4 mb-3">
                Médico responsável
            </h6>


            ${renderizarTabelaInformacoes([

                [
                    "Nome",
                    medico.nome
                ],

                [
                    "CRM",
                    medico.crm
                ],

                [
                    "UF",
                    medico.uf
                ]

            ])}


            ${renderizarBlocoTexto(
                "Indicação clínica",
                exame.indicacao
            )}


            ${renderizarBlocoTexto(
                "Técnica",
                exame.tecnica
            )}


            <div class="mt-4">

                <h6>
                    Achados
                </h6>


                ${
                    achados.length > 0
                        ? `

                            <div class="table-responsive">

                                <table
                                    class="
                                        table
                                        table-hover
                                        align-middle
                                    "
                                >

                                    <thead class="table-light">

                                        <tr>

                                            <th
                                                style="
                                                    width:70px;
                                                "
                                            >
                                                #
                                            </th>

                                            <th>
                                                Achado
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        ${achados
                                            .map(
                                                (
                                                    achado,
                                                    indice
                                                ) => `

                                                    <tr>

                                                        <td>

                                                            <span
                                                                class="
                                                                    badge
                                                                    text-bg-light
                                                                    border
                                                                "
                                                            >

                                                                ${
                                                                    indice + 1
                                                                }

                                                            </span>

                                                        </td>

                                                        <td>

                                                            ${
                                                                escapeHtml(
                                                                    achado
                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                `
                                            )
                                            .join("")
                                        }

                                    </tbody>

                                </table>

                            </div>

                        `
                        : renderizarSemDados(
                            "Nenhum achado estruturado foi identificado."
                        )
                }

            </div>


            <div class="mt-4">

                <h6>
                    Conclusão do laudo
                </h6>


                ${
                    exame.conclusao
                        ? `

                            <div
                                class="
                                    alert
                                    alert-primary
                                    mb-0
                                "
                            >

                                ${
                                    escapeHtml(
                                        exame.conclusao
                                    )
                                }

                            </div>

                        `
                        : `

                            <div
                                class="
                                    alert
                                    alert-warning
                                    mb-0
                                "
                            >

                                Conclusão não identificada
                                automaticamente.

                            </div>

                        `
                }

            </div>


            ${renderizarCompletudeLaudo(
                completude
            )}


            <div
                class="
                    alert
                    alert-light
                    border
                    small
                    text-secondary
                    mt-4
                    mb-0
                "
            >

                <strong>
                    Observação:
                </strong>

                O SmartDocs está estruturando as informações
                presentes no laudo. A exibição dos achados
                e da conclusão não representa interpretação
                diagnóstica da imagem médica.

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * COMPLETUDE
 * =========================================================
 */
function renderizarCompletudeLaudo(
    completude
) {

    const itens = [

        [
            "Paciente",
            completude.possuiPaciente
        ],

        [
            "Data do exame",
            completude.possuiData
        ],

        [
            "Modalidade",
            completude.possuiModalidade
        ],

        [
            "Região anatômica",
            completude.possuiRegiaoAnatomica
        ],

        [
            "Técnica",
            completude.possuiTecnica
        ],

        [
            "Achados",
            completude.possuiAchados
        ],

        [
            "Conclusão",
            completude.possuiConclusao
        ],

        [
            "Médico",
            completude.possuiMedico
        ],

        [
            "CRM",
            completude.possuiCRM
        ]

    ];


    return `

        <div class="mt-4">

            <h6>
                Completude documental
            </h6>

            <div class="table-responsive">

                <table
                    class="
                        table
                        table-bordered
                        align-middle
                    "
                >

                    <thead class="table-light">

                        <tr>

                            <th>
                                Informação
                            </th>

                            <th
                                style="
                                    width:180px;
                                "
                            >
                                Encontrada
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${itens
                            .map(
                                item => `

                                    <tr>

                                        <td>
                                            ${
                                                escapeHtml(
                                                    item[0]
                                                )
                                            }
                                        </td>

                                        <td>

                                            ${
                                                item[1]
                                                    ? `
                                                        <span class="badge bg-success">
                                                            Sim
                                                        </span>
                                                    `
                                                    : `
                                                        <span class="badge bg-danger">
                                                            Não
                                                        </span>
                                                    `
                                            }

                                        </td>

                                    </tr>

                                `
                            )
                            .join("")
                        }

                    </tbody>

                    <tfoot>

                        <tr>

                            <th>
                                Completude geral
                            </th>

                            <th>

                                ${
                                    Number(
                                        completude.percentual ||
                                        0
                                    )
                                }%

                            </th>

                        </tr>

                    </tfoot>

                </table>

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * TABELA DE INFORMAÇÕES
 * =========================================================
 */
function renderizarTabelaInformacoes(
    dados
) {

    const linhas =
        dados.filter(
            item =>
                item[1] !== null &&
                item[1] !== undefined &&
                String(
                    item[1]
                ).trim() !== ""
        );


    if (
        linhas.length === 0
    ) {

        return renderizarSemDados(
            "Nenhuma informação estruturada disponível."
        );

    }


    return `

        <div class="table-responsive">

            <table
                class="
                    table
                    table-bordered
                    align-middle
                "
            >

                <tbody>

                    ${linhas
                        .map(
                            item => `

                                <tr>

                                    <th
                                        class="
                                            table-light
                                        "
                                        style="
                                            width:220px;
                                        "
                                    >

                                        ${
                                            escapeHtml(
                                                item[0]
                                            )
                                        }

                                    </th>

                                    <td>

                                        ${
                                            escapeHtml(
                                                item[1]
                                            )
                                        }

                                    </td>

                                </tr>

                            `
                        )
                        .join("")
                    }

                </tbody>

            </table>

        </div>

    `;

}


/**
 * =========================================================
 * BLOCO TEXTO
 * =========================================================
 */
function renderizarBlocoTexto(
    titulo,
    texto
) {

    if (!texto) {
        return "";
    }


    return `

        <div class="mt-4">

            <h6>
                ${
                    escapeHtml(
                        titulo
                    )
                }
            </h6>

            <div
                class="
                    p-3
                    bg-light
                    border
                    rounded
                    small
                "
                style="
                    white-space:
                    pre-wrap;
                    line-height:1.7;
                "
            >

                ${
                    escapeHtml(
                        texto
                    )
                }

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * DOCUMENTO GENÉRICO
 * =========================================================
 */
function renderizarDocumentoGenerico(
    documento
) {

    return `

        <div
            class="
                alert
                alert-light
                border
            "
        >

            <strong>
                Tipo identificado:
            </strong>

            ${
                escapeHtml(
                    documento.documento ||
                    documento.tipo ||
                    "Documento"
                )
            }

        </div>

    `;

}


/**
 * =========================================================
 * OCR
 * =========================================================
 */
function renderizarOCR(
    documento
) {

    const ocr =
        documento.ocr ||
        {};


    const confianca =
        normalizarPercentual(
            ocr.confianca
        );


    return `

        <div
            class="
                mt-4
                pt-3
                border-top
            "
        >

            <details>

                <summary
                    style="
                        cursor:pointer;
                        font-weight:600;
                    "
                >

                    Informações técnicas do OCR

                </summary>


                <div class="mt-3">

                    ${renderizarTabelaInformacoes([

                        [
                            "Método",
                            ocr.metodo
                        ],

                        [
                            "Confiança OCR",
                            `${confianca}%`
                        ],

                        [
                            "Páginas",
                            ocr.paginas
                        ],

                        [
                            "Status OCR",
                            ocr.sucesso
                                ? "Sucesso"
                                : "Falha"
                        ],

                        [
                            "Erro",
                            ocr.erro
                        ]

                    ])}


                    ${
                        documento.textoExtraido
                            ? `

                                <div class="mt-4">

                                    <div
                                        class="
                                            d-flex
                                            justify-content-between
                                            align-items-center
                                            mb-3
                                        "
                                    >

                                        <div>

                                            <h6 class="mb-1">
                                                Texto extraído
                                            </h6>

                                            <div
                                                class="
                                                    small
                                                    text-secondary
                                                "
                                            >
                                                Visualização formatada do conteúdo reconhecido.
                                            </div>

                                        </div>

                                    </div>

                                    ${formatarTextoExtraido(
                                        documento.textoExtraido
                                    )}

                                </div>

                            `
                            : ""
                    }

                </div>

            </details>

        </div>

    `;

}


/**
 * =========================================================
 * FORMATAR TEXTO OCR
 * =========================================================
 */
function formatarTextoExtraido(
    texto
) {

    if (!texto) {
        return "";
    }


    const linhas =
        String(texto)
            .replace(
                /\r/g,
                ""
            )
            .split("\n");


    let html =
        "";


    let paragrafo =
        [];


    function fecharParagrafo() {

        if (
            paragrafo.length === 0
        ) {
            return;
        }


        const conteudo =
            paragrafo
                .join(" ")
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        if (
            conteudo
        ) {

            html += `

                <p
                    style="
                        margin:0 0 14px;
                        line-height:1.8;
                        color:#394150;
                    "
                >

                    ${
                        escapeHtml(
                            conteudo
                        )
                    }

                </p>

            `;

        }


        paragrafo =
            [];

    }


    linhas.forEach(
        linhaOriginal => {

            const linha =
                String(
                    linhaOriginal
                )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            if (
                !linha
            ) {

                fecharParagrafo();

                return;

            }


            if (
                ehTituloOCR(
                    linha
                )
            ) {

                fecharParagrafo();


                html += `

                    <div
                        style="
                            margin-top:26px;
                            margin-bottom:12px;
                            padding-bottom:8px;
                            border-bottom:1px solid #dee2e6;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                font-weight:700;
                                text-transform:uppercase;
                                letter-spacing:.06em;
                                color:#0d6efd;
                            "
                        >

                            ${
                                escapeHtml(
                                    limparTituloOCR(
                                        linha
                                    )
                                )
                            }

                        </div>

                    </div>

                `;


                return;

            }


            if (
                ehCampoChaveValor(
                    linha
                )
            ) {

                fecharParagrafo();


                const indice =
                    linha.indexOf(
                        ":"
                    );


                const chave =
                    linha
                        .substring(
                            0,
                            indice
                        )
                        .trim();


                const valor =
                    linha
                        .substring(
                            indice + 1
                        )
                        .trim();


                html += `

                    <div
                        style="
                            display:grid;
                            grid-template-columns:minmax(160px,220px) 1fr;
                            gap:14px;
                            padding:8px 0;
                            border-bottom:1px solid #f0f2f5;
                        "
                    >

                        <div
                            style="
                                font-size:13px;
                                color:#6c757d;
                                font-weight:600;
                            "
                        >

                            ${
                                escapeHtml(
                                    chave
                                )
                            }

                        </div>


                        <div
                            style="
                                font-size:13px;
                                color:#212529;
                            "
                        >

                            ${
                                escapeHtml(
                                    valor ||
                                    "-"
                                )
                            }

                        </div>

                    </div>

                `;


                return;

            }


            if (
                ehListaOCR(
                    linha
                )
            ) {

                fecharParagrafo();


                const conteudo =
                    linha
                        .replace(
                            /^[-•▪●]\s*/,
                            ""
                        )
                        .trim();


                html += `

                    <div
                        style="
                            display:flex;
                            gap:10px;
                            margin-bottom:8px;
                            line-height:1.7;
                        "
                    >

                        <div
                            style="
                                color:#0d6efd;
                                font-weight:700;
                            "
                        >
                            •
                        </div>

                        <div
                            style="
                                color:#394150;
                            "
                        >

                            ${
                                escapeHtml(
                                    conteudo
                                )
                            }

                        </div>

                    </div>

                `;


                return;

            }


            paragrafo.push(
                linha
            );

        }
    );


    fecharParagrafo();


    return `

        <div
            style="
                background:#ffffff;
                border:1px solid #e3e7ee;
                border-radius:12px;
                padding:22px 24px;
                font-size:14px;
                max-height:600px;
                overflow:auto;
            "
        >

            ${html}

        </div>

    `;

}


/**
 * =========================================================
 * DETECTAR TÍTULO OCR
 * =========================================================
 */
function ehTituloOCR(
    linha
) {

    const texto =
        linha
            .replace(
                /:$/,
                ""
            )
            .trim();


    if (
        texto.length < 3 ||
        texto.length > 80
    ) {

        return false;

    }


    const normalizado =
        removerAcentos(
            texto
        )
            .toUpperCase();


    const titulosConhecidos = [

        "INDICACAO",

        "INDICACAO CLINICA",

        "TECNICA",

        "METODOLOGIA",

        "ACHADOS",

        "ACHADOS RADIOLOGICOS",

        "RESULTADO",

        "DESCRICAO",

        "CONCLUSAO",

        "CONCLUSOES",

        "IMPRESSAO",

        "IMPRESSAO DIAGNOSTICA",

        "OBSERVACOES",

        "DADOS CLINICOS",

        "HIPOTESE DIAGNOSTICA",

        "HEMOGRAMA COMPLETO",

        "BIOQUIMICA",

        "PERFIL LIPIDICO",

        "FUNCAO HEPATICA",

        "ELETROLITOS E MINERAIS",

        "HORMONIOS E TIREOIDE",

        "VITAMINAS E NUTRIENTES",

        "URINA TIPO I"

    ];


    if (
        titulosConhecidos.some(
            titulo =>
                normalizado.includes(
                    titulo
                )
        )
    ) {

        return true;

    }


    const letras =
        texto.match(
            /[A-Za-zÀ-ÿ]/g
        ) ||
        [];


    const maiusculas =
        texto.match(
            /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/g
        ) ||
        [];


    if (
        letras.length >= 5 &&
        maiusculas.length /
        letras.length >
        0.85
    ) {

        return true;

    }


    return false;

}


/**
 * =========================================================
 * LIMPAR TÍTULO
 * =========================================================
 */
function limparTituloOCR(
    linha
) {

    return String(
        linha
    )
        .replace(
            /:+$/,
            ""
        )
        .trim();

}


/**
 * =========================================================
 * CAMPO CHAVE / VALOR
 * =========================================================
 */
function ehCampoChaveValor(
    linha
) {

    if (
        !linha.includes(
            ":"
        )
    ) {

        return false;

    }


    const partes =
        linha.split(
            ":"
        );


    if (
        partes.length < 2
    ) {

        return false;

    }


    const chave =
        partes[0]
            .trim();


    if (
        chave.length < 2 ||
        chave.length > 45
    ) {

        return false;

    }


    const chavesConhecidas = [

        "paciente",

        "cpf",

        "nascimento",

        "data de nascimento",

        "data do exame",

        "data",

        "médico",

        "medico",

        "médico responsável",

        "medico responsavel",

        "radiologista",

        "crm",

        "exame",

        "modalidade",

        "unidade",

        "solicitante",

        "convênio",

        "convenio",

        "protocolo"

    ];


    const normalizado =
        removerAcentos(
            chave
        )
            .toLowerCase();


    return chavesConhecidas.some(
        item =>
            removerAcentos(
                item
            )
                .toLowerCase() ===
            normalizado
    );

}


/**
 * =========================================================
 * LISTA OCR
 * =========================================================
 */
function ehListaOCR(
    linha
) {

    return /^[-•▪●]\s+/.test(
        linha
    );

}


/**
 * =========================================================
 * REMOVER ACENTOS
 * =========================================================
 */
function removerAcentos(
    valor
) {

    return String(
        valor ||
        ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


/**
 * =========================================================
 * MINI CARD
 * =========================================================
 */
function criarMiniCard(
    titulo,
    valor,
    cor
) {

    return `

        <div
            class="
                col-xl-3
                col-md-6
            "
        >

            <div
                class="
                    border
                    rounded
                    p-3
                    h-100
                "
            >

                <div
                    class="
                        small
                        text-secondary
                    "
                >

                    ${
                        escapeHtml(
                            titulo
                        )
                    }

                </div>

                <div
                    class="
                        fs-4
                        fw-bold
                        text-${cor}
                    "
                >

                    ${
                        Number(
                            valor ||
                            0
                        ).toLocaleString(
                            "pt-BR"
                        )
                    }

                </div>

            </div>

        </div>

    `;

}


/**
 * =========================================================
 * SEM DADOS
 * =========================================================
 */
function renderizarSemDados(
    mensagem
) {

    return `

        <div
            class="
                alert
                alert-light
                border
                text-secondary
            "
        >

            ${
                escapeHtml(
                    mensagem
                )
            }

        </div>

    `;

}


/**
 * =========================================================
 * BADGE EXAME
 * =========================================================
 */
function criarBadgeExame(
    status
) {

    switch (
        status
    ) {

        case "NORMAL":

            return `
                <span class="badge bg-success">
                    Dentro da referência
                </span>
            `;


        case "FORA_DA_REFERENCIA":

            return `
                <span class="badge bg-danger">
                    Fora da referência
                </span>
            `;


        default:

            return `
                <span class="badge bg-secondary">
                    Não interpretado
                </span>
            `;

    }

}


/**
 * =========================================================
 * BADGE PROCESSAMENTO
 * =========================================================
 */
function criarBadgeStatusProcessamento(
    status
) {

    switch (
        status
    ) {

        case "APROVADO":

            return `
                <span class="badge bg-success fs-6">
                    Aprovado
                </span>
            `;


        case "PENDENTE":

            return `
                <span class="badge bg-warning text-dark fs-6">
                    Pendente
                </span>
            `;


        case "REVISAO_MANUAL":

            return `
                <span class="badge bg-warning text-dark fs-6">
                    Revisão manual
                </span>
            `;


        default:

            return `
                <span class="badge bg-secondary fs-6">
                    ${
                        escapeHtml(
                            formatarCodigo(
                                status
                            )
                        )
                    }
                </span>
            `;

    }

}


/**
 * =========================================================
 * CONTRASTE
 * =========================================================
 */
function formatarContraste(
    contraste
) {

    if (
        contraste.utilizado ===
        true
    ) {

        return (
            contraste.descricao ||
            "Com contraste"
        );

    }


    if (
        contraste.utilizado ===
        false
    ) {

        return (
            contraste.descricao ||
            "Sem contraste"
        );

    }


    return "Não informado";

}


/**
 * =========================================================
 * CRM
 * =========================================================
 */
function formatarCRM(
    medico
) {

    if (
        !medico ||
        !medico.crm
    ) {

        return null;

    }


    return medico.uf
        ? `CRM-${medico.uf} ${medico.crm}`
        : `CRM ${medico.crm}`;

}


/**
 * =========================================================
 * FORMATAR CÓDIGOS
 * =========================================================
 */
function formatarCodigo(
    valor
) {

    if (!valor) {
        return "-";
    }


    const mapa = {

        RESULTADO_LABORATORIAL:
            "Resultado laboratorial",

        LAUDO_IMAGEM:
            "Laudo de imagem",

        TOMOGRAFIA_COMPUTADORIZADA:
            "Tomografia computadorizada",

        RESSONANCIA_MAGNETICA:
            "Ressonância magnética",

        RADIOGRAFIA:
            "Radiografia",

        ULTRASSONOGRAFIA:
            "Ultrassonografia",

        MAMOGRAFIA:
            "Mamografia",

        DENSITOMETRIA_OSSEA:
            "Densitometria óssea",

        PET_CT:
            "PET-CT",

        ECOCARDIOGRAMA:
            "Ecocardiograma",

        ANGIOTOMOGRAFIA:
            "Angiotomografia",

        ANGIORRESSONANCIA:
            "Angiorressonância",

        TORAX:
            "Tórax",

        CRANIO:
            "Crânio",

        ABDOME:
            "Abdome",

        PELVIS:
            "Pelve",

        JOELHO:
            "Joelho",

        OMBRO:
            "Ombro",

        DIREITO:
            "Direito",

        ESQUERDO:
            "Esquerdo",

        BILATERAL:
            "Bilateral",

        NAO_IDENTIFICADA:
            "Não identificada"

    };


    if (
        mapa[valor]
    ) {

        return mapa[valor];

    }


    return String(
        valor
    )
        .replace(
            /_/g,
            " "
        )
        .toLowerCase()
        .replace(
            /\b\w/g,
            letra =>
                letra.toUpperCase()
        );

}


/**
 * =========================================================
 * PERCENTUAL
 * =========================================================
 */
function normalizarPercentual(
    valor
) {

    const numero =
        Number(
            valor ||
            0
        );


    if (
        numero <= 1
    ) {

        return Math.round(
            numero *
            100
        );

    }


    return Math.round(
        numero
    );

}


/**
 * =========================================================
 * FILTROS
 * =========================================================
 */
function inicializarFiltrosExames() {

    const filtrosTexto =
        document.querySelectorAll(
            ".filtro-exame-texto"
        );


    const filtrosStatus =
        document.querySelectorAll(
            ".filtro-exame-status"
        );


    filtrosTexto.forEach(
        input => {

            input.addEventListener(
                "input",
                aplicarFiltroExames
            );

        }
    );


    filtrosStatus.forEach(
        select => {

            select.addEventListener(
                "change",
                aplicarFiltroExames
            );

        }
    );

}


/**
 * =========================================================
 * APLICAR FILTRO
 * =========================================================
 */
function aplicarFiltroExames(
    evento
) {

    const targetId =
        evento.target.dataset.target;


    const tbody =
        document.getElementById(
            targetId
        );


    if (!tbody) {
        return;
    }


    const textoInput =
        document.querySelector(
            `.filtro-exame-texto[data-target="${targetId}"]`
        );


    const statusSelect =
        document.querySelector(
            `.filtro-exame-status[data-target="${targetId}"]`
        );


    const busca =
        String(
            textoInput?.value ||
            ""
        )
            .toLowerCase()
            .trim();


    const status =
        statusSelect?.value ||
        "";


    const linhas =
        tbody.querySelectorAll(
            "tr"
        );


    linhas.forEach(
        linha => {

            const nome =
                linha.dataset.nome ||
                "";


            const statusLinha =
                linha.dataset.status ||
                "";


            const correspondeBusca =
                !busca ||
                nome.includes(
                    busca
                );


            const correspondeStatus =
                !status ||
                statusLinha ===
                status;


            linha.style.display =
                correspondeBusca &&
                correspondeStatus
                    ? ""
                    : "none";

        }
    );

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

