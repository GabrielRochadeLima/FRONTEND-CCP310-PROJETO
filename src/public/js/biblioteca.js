let livros = [];
let filtroAtual = "Todos";

const listaLivros = document.getElementById("lista-livros");
const campoPesquisa = document.getElementById("pesquisa-livros");
const janelaLivro = document.getElementById("janela-livro");
const formularioLivro = document.getElementById("formulario-livro");
const mensagemFormulario = document.getElementById("mensagem-formulario");

function abrirFormulario() {
    formularioLivro.reset();
    document.getElementById("livro-id").value = "";
    document.getElementById("livro-pagina-atual").value = "0";
    document.getElementById("titulo-formulario").textContent = "Adicionar livro";
    mensagemFormulario.textContent = "";
    janelaLivro.hidden = false;
    document.getElementById("livro-titulo").focus();
}

function fecharFormulario() {
    janelaLivro.hidden = true;
}

function editarLivro(id) {
    const livro = livros.find(item => Number(item.id) === Number(id));
    if (!livro) return;

    document.getElementById("livro-id").value = livro.id;
    document.getElementById("livro-titulo").value = livro.titulo;
    document.getElementById("livro-autor").value = livro.autor;
    document.getElementById("livro-status").value = livro.status;
    document.getElementById("livro-total-paginas").value = livro.total_paginas;
    document.getElementById("livro-pagina-atual").value = livro.pagina_atual || 0;
    document.getElementById("titulo-formulario").textContent = "Editar livro";
    mensagemFormulario.textContent = "";
    janelaLivro.hidden = false;
}

function mostrarLivros() {
    const pesquisa = campoPesquisa.value.trim().toLowerCase();
    const filtrados = livros.filter(livro => {
        const statusCerto = filtroAtual === "Todos" || livro.status === filtroAtual;
        const tituloCerto = livro.titulo.toLowerCase().includes(pesquisa);
        const autorCerto = livro.autor.toLowerCase().includes(pesquisa);
        return statusCerto && (tituloCerto || autorCerto);
    });

    document.getElementById("quantidade-livros").textContent = `${filtrados.length} livro(s)`;
    listaLivros.replaceChildren();

    if (filtrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "estado-vazio";
        aviso.textContent = "Nenhum livro encontrado.";
        listaLivros.appendChild(aviso);
        return;
    }

    filtrados.forEach(livro => {
        const cartao = document.createElement("article");
        cartao.className = "painel cartao-biblioteca";

        const capa = document.createElement("div");
        capa.className = "cartao-biblioteca-capa";
        capa.appendChild(criarImagemLivro(livro));

        const titulo = document.createElement("h3");
        titulo.textContent = livro.titulo;

        const autor = document.createElement("p");
        autor.className = "autor";
        autor.textContent = livro.autor;

        const situacao = document.createElement("div");
        situacao.className = "situacao";
        const etiqueta = document.createElement("span");
        etiqueta.className = "selo-status";
        if (livro.status === "Quero ler") etiqueta.classList.add("quero");
        if (livro.status === "Lido") etiqueta.classList.add("lido");
        etiqueta.textContent = livro.status;
        situacao.appendChild(etiqueta);

        const paginas = document.createElement("p");
        paginas.className = "paginas";
        paginas.textContent = `${livro.pagina_atual || 0} de ${livro.total_paginas} páginas`;

        const botoes = document.createElement("div");
        botoes.className = "botoes-livro";
        const editar = document.createElement("button");
        editar.className = "botao-suave";
        editar.textContent = "Editar";
        editar.type = "button";
        editar.addEventListener("click", () => editarLivro(livro.id));

        const excluir = document.createElement("button");
        excluir.className = "botao-perigo";
        excluir.textContent = "Excluir";
        excluir.type = "button";
        excluir.addEventListener("click", () => excluirLivro(livro.id));

        botoes.append(editar, excluir);
        cartao.append(capa, titulo, autor, situacao, criarBarra(porcentagemLivro(livro)), paginas, botoes);
        listaLivros.appendChild(cartao);
    });
}

async function carregarLivros() {
    try {
        const resposta = await fetch("/api/livros");
        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }
        if (!resposta.ok) throw new Error("Erro ao buscar livros");
        livros = await resposta.json();
        mostrarLivros();

        const parametros = new URLSearchParams(window.location.search);
        const editar = parametros.get("editar");
        const adicionar = parametros.get("adicionar");
        const busca = parametros.get("busca");

        if (busca !== null) {
            campoPesquisa.value = busca;
            mostrarLivros();
            campoPesquisa.focus();
        }
        if (editar) editarLivro(editar);
        if (adicionar === "1") abrirFormulario();

        if (editar || adicionar) {
            window.history.replaceState({}, "", "biblioteca.html");
        }
    } catch (erro) {
        console.error(erro);
        listaLivros.innerHTML = '<p class="estado-vazio">Não foi possível carregar os livros.</p>';
    }
}

async function salvarLivro(evento) {
    evento.preventDefault();
    const id = document.getElementById("livro-id").value;
    const livro = {
        titulo: document.getElementById("livro-titulo").value.trim(),
        autor: document.getElementById("livro-autor").value.trim(),
        status: document.getElementById("livro-status").value,
        total_paginas: Number(document.getElementById("livro-total-paginas").value),
        pagina_atual: Number(document.getElementById("livro-pagina-atual").value)
    };

    if (livro.total_paginas <= 0 || livro.pagina_atual < 0 || livro.pagina_atual > livro.total_paginas) {
        mensagemFormulario.textContent = "A página atual precisa estar entre zero e o total de páginas.";
        return;
    }

    try {
        const resposta = await fetch(id ? `/api/livros/${id}` : "/api/livros", {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagemFormulario.textContent = dados.mensagem || "Erro ao salvar livro.";
            return;
        }

        fecharFormulario();
        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        mensagemFormulario.textContent = "Não foi possível salvar o livro.";
    }
}

async function excluirLivro(id) {
    if (!confirm("Deseja realmente excluir este livro?")) return;

    try {
        const resposta = await fetch(`/api/livros/${id}`, { method: "DELETE" });
        if (!resposta.ok) throw new Error("Erro ao excluir livro");
        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o livro.");
    }
}

document.getElementById("botao-adicionar").addEventListener("click", abrirFormulario);
document.getElementById("botao-fechar").addEventListener("click", fecharFormulario);
document.getElementById("botao-cancelar").addEventListener("click", fecharFormulario);
formularioLivro.addEventListener("submit", salvarLivro);
campoPesquisa.addEventListener("input", mostrarLivros);

janelaLivro.addEventListener("click", function(evento) {
    if (evento.target === janelaLivro) fecharFormulario();
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && !janelaLivro.hidden) fecharFormulario();
});

document.querySelectorAll(".filtro").forEach(botao => {
    botao.addEventListener("click", function() {
        filtroAtual = botao.dataset.status;
        document.querySelectorAll(".filtro").forEach(item => item.classList.remove("ativo"));
        botao.classList.add("ativo");
        mostrarLivros();
    });
});

carregarLivros();
