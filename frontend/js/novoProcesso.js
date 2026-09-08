let processos = [];

async function carregarProcessos() {
    const resposta = await fetch("../data/processos.json");
    processos = await resposta.json();
    preencherSelect();
}

function preencherSelect() {
    const select =
    document.getElementById("processoSelect");
    select.innerHTML = "";
    processos.forEach(processo => {

        const option =
        document.createElement("option");
        option.value = processo.id;
        option.textContent = processo.nome;
        select.appendChild(option);
    });
    mostrarDocumentos();

}

function mostrarDocumentos() {
    const id =
    Number(document.getElementById("processoSelect").value);

    const processo =
    processos.find(p => p.id === id);

    const lista =
    document.getElementById("listaDocumentos");
    lista.innerHTML = "";
    processo.documentos.forEach(doc => {

        lista.innerHTML += `

<div class="card mt-3">

<div class="card-body">

<input
type="checkbox">

<strong>

${doc.nome}

</strong>

${doc.obrigatorio
? "<span class='badge bg-danger ms-2'>Obrigatório</span>"
: "<span class='badge bg-secondary ms-2'>Opcional</span>"}

</div>

</div>

`;

    });

}

document.getElementById("processoSelect")?.addEventListener("change",mostrarDocumentos);
carregarProcessos();