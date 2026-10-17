
let metas = [];
let livros = [];
let anoSelecionado = new Date().getFullYear();

const janelaMeta = document.getElementById("janela-meta");
const formularioMeta = document.getElementById("formulario-meta");
const listaMetas = document.getElementById("lista-metas");
const mensagemFormulario = document.getElementById("mensagem-formulario");
const selecionarAno = document.getElementById("selecionar-ano");

function atualizarAnos() {
    const anos = new Set([new Date().getFullYear(), anoSelecionado]);

    metas.forEach(meta => anos.add(Number(meta.ano)));

    livros.forEach(livro => {
        if (livro.data_conclusao) {
            anos.add(Number(livro.data_conclusao.slice(0, 4)));
        }
    });

    selecionarAno.replaceChildren();

    [...anos]
        .filter(ano => Number.isInteger(ano) && ano >= 2020 && ano <= 2100)
        .sort((a, b) => b - a)
        .forEach(ano => {
            const opcao = document.createElement("option");
            opcao.value = ano;
            opcao.textContent = ano;
            selecionarAno.appendChild(opcao);
        });

    selecionarAno.value = String(anoSelecionado);
}

function atualizarGrafico(livrosDoAno) {
    const meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    const quantidades = Array(12).fill(0);

    livrosDoAno.forEach(livro => {
        const mes = Number(livro.data_conclusao.slice(5, 7));

        if (mes >= 1 && mes <= 12) {
            quantidades[mes - 1]++;
        }
    });

    const grafico = document.getElementById("grafico-leituras");
    grafico.replaceChildren();

    const maior = Math.max(1, ...quantidades);

    meses.forEach((mes, indice) => {
        const grupo = document.createElement("div");
        grupo.className = "barra-grafico";

        const contagem = document.createElement("strong");
        contagem.textContent = quantidades[indice];

        const coluna = document.createElement("div");
        coluna.className = "coluna";

        const preenchimento = document.createElement("div");
        preenchimento.className = "preenchimento";
        preenchimento.style.height =
            `${quantidades[indice] * 100 / maior}%`;

        coluna.appendChild(preenchimento);

        const nome = document.createElement("small");
        nome.textContent = mes;

        grupo.append(contagem, coluna, nome);
        grafico.appendChild(grupo);
    });

    document.getElementById("legenda-grafico").textContent =
        `Livros concluídos em ${anoSelecionado}.`;
}

function atualizarResumo() {
    const meta = metas.find(item =>
        Number(item.ano) === anoSelecionado
    );

    const objetivo = meta ? Number(meta.quantidade_livros) : 0;

    const livrosDoAno = livros.filter(livro =>
        livro.status === "Lido" &&
        livro.data_conclusao &&
        Number(livro.data_conclusao.slice(0, 4)) === anoSelecionado
    );

    const lidos = livrosDoAno.length;

    const lendo = livros.filter(livro =>
        livro.status === "Lendo"
    ).length;

    const quero = livros.filter(livro =>
        livro.status === "Quero ler"
    ).length;

    const faltam = Math.max(0, objetivo - lidos);

    const porcentagem = objetivo
        ? Math.min(100, Math.round(lidos * 100 / objetivo))
        : 0;

    document.getElementById("total-lidos").textContent = lidos;
    document.getElementById("total-meta").textContent = objetivo;
    document.getElementById("total-faltam").textContent = faltam;
    document.getElementById("total-porcentagem").textContent =
        `${porcentagem}%`;

    document.getElementById("quantidade-quero-ler").textContent = quero;
    document.getElementById("quantidade-lendo").textContent = lendo;
    document.getElementById("quantidade-lidos").textContent = lidos;

    document.getElementById("rotulo-lidos").textContent =
        `Lidos em ${anoSelecionado}`;

    document.getElementById("ano-meta").textContent =
        `Meta de ${anoSelecionado}`;

    document.getElementById("texto-progresso").textContent =
        `${lidos} de ${objetivo} livros`;

    document.getElementById("etiqueta-porcentagem").textContent =
        `${porcentagem}%`;

    document.getElementById("barra-progresso").style.width =
        `${porcentagem}%`;

    let mensagem =
        `Faltam ${faltam} livros para você alcançar sua meta.`;

    if (!objetivo) {
        mensagem = "Crie sua meta para acompanhar o progresso.";
    }

    if (objetivo && faltam === 0) {
        mensagem = "Parabéns! Você alcançou sua meta.";
    }

    document.getElementById("mensagem-progresso").textContent =
        mensagem;

    atualizarGrafico(livrosDoAno);
}

function mostrarMetas() {
    listaMetas.replaceChildren();

    if (metas.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "estado-vazio";
        aviso.textContent = "Nenhuma meta cadastrada.";

        listaMetas.appendChild(aviso);
        return;
    }

    metas.forEach(meta => {
        const cartao = document.createElement("article");
        cartao.className = "cartao-meta-lista";

        const informacoes = document.createElement("div");

        const ano = document.createElement("strong");
        ano.textContent = `Meta de ${meta.ano}`;

        const quantidade = document.createElement("p");
        quantidade.textContent = `${meta.quantidade_livros} livros`;

        informacoes.append(ano, quantidade);

        const acoes = document.createElement("div");
        acoes.className = "acoes-meta";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "botao-suave";
        editar.textContent = "Editar";
        editar.addEventListener("click", () => editarMeta(meta.id));

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "botao-perigo";
        excluir.textContent = "Excluir";
        excluir.addEventListener("click", () => excluirMeta(meta.id));

        acoes.append(editar, excluir);
        cartao.append(informacoes, acoes);

        listaMetas.appendChild(cartao);
    });
}

function abrirFormulario() {
    formularioMeta.reset();

    document.getElementById("meta-id").value = "";
    document.getElementById("meta-ano").value = anoSelecionado;

    document.getElementById("titulo-formulario").textContent =
        "Nova meta";

    mensagemFormulario.textContent = "";
    janelaMeta.hidden = false;
}

function fecharFormulario() {
    janelaMeta.hidden = true;
}

function editarMeta(id) {
    const meta = metas.find(item =>
        Number(item.id) === Number(id)
    );

    if (!meta) return;

    document.getElementById("meta-id").value = meta.id;
    document.getElementById("meta-ano").value = meta.ano;
    document.getElementById("meta-quantidade").value =
        meta.quantidade_livros;

    document.getElementById("titulo-formulario").textContent =
        "Editar meta";

    mensagemFormulario.textContent = "";
    janelaMeta.hidden = false;
}

async function carregarMetas() {
    try {
        const resposta = await fetch("/api/metas");

        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const respostaLivros = await fetch("/api/livros");

        if (respostaLivros.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!resposta.ok || !respostaLivros.ok) {
            throw new Error("Erro ao carregar dados");
        }

        metas = await resposta.json();
        livros = await respostaLivros.json();

        atualizarAnos();
        mostrarMetas();
        atualizarResumo();
    } catch (erro) {
        console.error(erro);

        listaMetas.innerHTML =
            '<p class="estado-vazio">Não foi possível carregar as metas.</p>';
    }
}

async function salvarMeta(evento) {
    evento.preventDefault();

    const id = document.getElementById("meta-id").value;

    const meta = {
        ano: Number(document.getElementById("meta-ano").value),
        quantidade_livros: Number(
            document.getElementById("meta-quantidade").value
        )
    };

    if (
        !Number.isInteger(meta.ano) ||
        meta.ano < 2020 ||
        meta.ano > 2100 ||
        !Number.isInteger(meta.quantidade_livros) ||
        meta.quantidade_livros <= 0
    ) {
        mensagemFormulario.textContent =
            "Informe um ano e uma quantidade válidos.";
        return;
    }

    try {
        const resposta = await fetch(
            id ? `/api/metas/${id}` : "/api/metas",
            {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(meta)
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagemFormulario.textContent =
                dados.mensagem || "Erro ao salvar meta.";
            return;
        }

        fecharFormulario();

        anoSelecionado = meta.ano;
        await carregarMetas();
    } catch (erro) {
        console.error(erro);
        mensagemFormulario.textContent =
            "Não foi possível salvar a meta.";
    }
}

async function excluirMeta(id) {
    if (!confirm("Deseja realmente excluir esta meta?")) {
        return;
    }

    try {
        const resposta = await fetch(`/api/metas/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir meta");
        }

        await carregarMetas();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir a meta.");
    }
}

selecionarAno.addEventListener("change", () => {
    anoSelecionado = Number(selecionarAno.value);
    atualizarResumo();
});

document.getElementById("botao-adicionar-meta")
    .addEventListener("click", abrirFormulario);

document.getElementById("botao-fechar")
    .addEventListener("click", fecharFormulario);

document.getElementById("botao-cancelar")
    .addEventListener("click", fecharFormulario);

formularioMeta.addEventListener("submit", salvarMeta);

janelaMeta.addEventListener("click", function(evento) {
    if (evento.target === janelaMeta) {
        fecharFormulario();
    }
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && !janelaMeta.hidden) {
        fecharFormulario();
    }
});

carregarMetas();
