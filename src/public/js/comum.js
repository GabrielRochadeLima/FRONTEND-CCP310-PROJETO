function capaDoLivro(titulo) {
    const nome = titulo.toLowerCase();

    if (nome.includes("duna") && nome.includes("messias")) return "img/capa-messias.svg";
    if (nome.includes("duna")) return "img/capa-duna.svg";
    if (nome.includes("hábito") || nome.includes("habito")) return "img/capa-habitos.svg";
    if (nome.includes("senhor dos anéis") || nome.includes("senhor dos aneis")) return "img/capa-aneis.svg";
    if (nome.includes("1984")) return "img/capa-1984.svg";
    if (nome.includes("hobbit")) return "img/capa-hobbit.svg";
    if (nome.includes("sapiens")) return "img/capa-sapiens.svg";
    if (nome.includes("psicologia do dinheiro")) return "img/capa-psicologia.svg";

    return "img/capa-generica.svg";
}

function criarImagemLivro(livro) {
    const imagem = document.createElement("img");
    imagem.className = "capa-livro";
    imagem.src = capaDoLivro(livro.titulo);
    imagem.alt = `Capa ilustrativa de ${livro.titulo}`;
    return imagem;
}

function criarBarra(progresso) {
    const barra = document.createElement("div");
    barra.className = "barra";

    const preenchimento = document.createElement("div");
    preenchimento.style.width = `${Math.min(100, Math.max(0, progresso))}%`;
    barra.appendChild(preenchimento);

    return barra;
}

function porcentagemLivro(livro) {
    if (!livro.total_paginas) return 0;
    return Math.round((Number(livro.pagina_atual || 0) / Number(livro.total_paginas)) * 100);
}

function buscarLivrosDoCabecalho() {
    const formulario = document.getElementById("formulario-busca-global");
    const botaoMovel = document.getElementById("botao-busca-movel");

    if (formulario) {
        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();
            const texto = document.getElementById("pesquisa-cabecalho").value.trim();
            window.location.href = `biblioteca.html?busca=${encodeURIComponent(texto)}`;
        });
    }

    if (botaoMovel) {
        botaoMovel.addEventListener("click", function() {
            window.location.href = "biblioteca.html?busca=";
        });
    }
}

buscarLivrosDoCabecalho();
