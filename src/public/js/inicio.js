const areaLeituras = document.getElementById("livros-andamento");
const areaProximo = document.getElementById("proximo-livro");

function criarCartaoLeitura(livro) {
    const cartao = document.createElement("article");
    cartao.className = "cartao-leitura";

    const topo = document.createElement("div");
    topo.className = "livro-superior";

    const detalhes = document.createElement("div");
    detalhes.className = "livro-detalhes";

    const titulo = document.createElement("h3");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("p");
    autor.textContent = livro.autor;

    const status = document.createElement("span");
    status.className = "estado";
    status.textContent = "Lendo";

    detalhes.append(titulo, autor, status);
    topo.append(criarImagemLivro(livro), detalhes);

    const rodape = document.createElement("div");
    rodape.className = "livro-rodape";

    const porcentagem = porcentagemLivro(livro);
    const progresso = document.createElement("div");
    progresso.className = "pagina-progresso";

    const paginas = document.createElement("span");
    paginas.textContent = `${livro.pagina_atual} de ${livro.total_paginas} páginas`;

    const percentual = document.createElement("strong");
    percentual.textContent = `${porcentagem}%`;

    progresso.append(paginas, percentual);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-continuar";
    botao.textContent = "Continuar lendo";
    botao.addEventListener("click", function() {
        window.location.href = `biblioteca.html?editar=${livro.id}`;
    });

    rodape.append(criarBarra(porcentagem), progresso, botao);
    cartao.append(topo, rodape);
    return cartao;
}

function mostrarProximoLivro(livros) {
    areaProximo.replaceChildren();
    const livro = livros.find(item => item.status === "Quero ler");

    if (!livro) {
        const aviso = document.createElement("p");
        aviso.className = "estado-vazio";
        aviso.textContent = "Adicione um livro à lista Quero ler.";
        areaProximo.appendChild(aviso);
        return;
    }

    const cartao = document.createElement("div");
    cartao.className = "proximo-livro";

    const informacoes = document.createElement("div");
    const titulo = document.createElement("strong");
    titulo.textContent = livro.titulo;
    const autor = document.createElement("small");
    autor.textContent = livro.autor;
    informacoes.append(titulo, autor);

    const estado = document.createElement("span");
    estado.className = "estado";
    estado.textContent = "Quero ler";
    cartao.append(criarImagemLivro(livro), informacoes, estado);
    areaProximo.appendChild(cartao);
}

async function carregarInicio() {
    try {
        const respostaLivros = await fetch("/api/livros");
        if (respostaLivros.status === 401) {
            window.location.href = "login.html";
            return;
        }
        if (!respostaLivros.ok) throw new Error("Erro ao carregar livros");

        const livros = await respostaLivros.json();
        const lendo = livros.filter(livro => livro.status === "Lendo");
        const queroLer = livros.filter(livro => livro.status === "Quero ler");
        const lidos = livros.filter(livro => livro.status === "Lido");

        document.getElementById("total-livros").textContent = livros.length;
        document.getElementById("total-lendo").textContent = lendo.length;
        document.getElementById("total-quero-ler").textContent = queroLer.length;
        document.getElementById("total-lidos").textContent = lidos.length;

        areaLeituras.replaceChildren();

        if (lendo.length === 0) {
            const aviso = document.createElement("p");
            aviso.className = "estado-vazio";
            aviso.textContent = "Nenhum livro em andamento. Escolha um livro da sua biblioteca para começar.";
            areaLeituras.appendChild(aviso);
        } else {
            lendo.slice(0, 3).forEach(livro => areaLeituras.appendChild(criarCartaoLeitura(livro)));
        }

        mostrarProximoLivro(livros);

        const respostaMetas = await fetch("/api/metas");
        if (!respostaMetas.ok) throw new Error("Erro ao carregar metas");

        const metas = await respostaMetas.json();
        const meta = metas.find(item => Number(item.ano) === new Date().getFullYear());
        const objetivo = meta ? Number(meta.quantidade_livros) : 0;
        const percentual = objetivo ? Math.min(100, Math.round(lidos.length * 100 / objetivo)) : 0;

        document.getElementById("texto-meta").textContent = `${lidos.length} de ${objetivo} livros`;
        document.getElementById("porcentagem-meta").textContent = `${percentual}%`;
        document.getElementById("barra-meta").style.width = `${percentual}%`;
    } catch (erro) {
        console.error(erro);
        areaLeituras.innerHTML = '<p class="estado-vazio">Não foi possível carregar suas leituras.</p>';
    }
}

carregarInicio();
