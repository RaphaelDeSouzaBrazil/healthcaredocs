async function carregarProcessos() {

    const resposta = await fetch("data/processos.json");

    const processos = await resposta.json();

    console.log(processos);

}

carregarProcessos();