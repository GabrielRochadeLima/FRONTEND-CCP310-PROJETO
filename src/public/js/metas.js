let metas = [];
let livros = [];

const janelaMeta = document.getElementById("janela-meta");
const formularioMeta = document.getElementById("formulario-meta");
const listaMetas = document.getElementById("lista-metas");
const mensagemFormulario = document.getElementById("mensagem-formulario");

function atualizarResumo() {
    const ano = new Date().getFullYear();
    const meta = metas.find(item => Number(item.ano) === ano);
    const objetivo = meta ? Number(meta.quantidade_livros) : 0;
    const lendo = livros.filter(livro => livro.status === "Lendo").length;
    const quero = livros.filter(livro => livro.status === "Quero ler").length;
    const lidos = livros.filter(livro => livro.status === "Lido").length;
    const faltam = Math.max(0, objetivo - lidos);
    const porcentagem = objetivo ? Math.min(100, Math.round(lidos * 100 / objetivo)) : 0;

    document.getElementById("total-lidos").textContent = lidos;
    document.getElementById("total-meta").textContent = objetivo;
    document.getElementById("total-faltam").textContent = faltam;
    document.getElementById("total-porcentagem").textContent = `${porcentagem}%`;
    document.getElementById("quantidade-quero-ler").textContent = quero;
    document.getElementById("quantidade-lendo").textContent = lendo;
    document.getElementById("quantidade-lidos").textContent = lidos;
    document.getElementById("ano-meta").textContent = `Meta de ${ano}`;
    document.getElementById("texto-progresso").textContent = `${lidos} de ${objetivo} livros`;
    document.getElementById("etiqueta-porcentagem").textContent = `${porcentagem}%`;
    document.getElementById("barra-progresso").style.width = `${porcentagem}%`;

    let mensagem = `Faltam ${faltam} livros para você alcançar sua meta.`;
    if (!objetivo) mensagem = "Crie sua meta para acompanhar o progresso.";
    if (objetivo && faltam === 0) mensagem = "Parabéns! Você alcançou sua meta.";
    document.getElementById("mensagem-progresso").textContent = mensagem;

    const grafico = document.getElementById("grafico-leituras");
    grafico.replaceChildren();
    const maior = Math.max(quero, lendo, lidos, 1);

    [["Quero ler", quero], ["Lendo", lendo], ["Lidos", lidos]].forEach(item => {
        const grupo = document.createElement("div");
        grupo.className = "barra-grafico";
        const contagem = document.createElement("strong");
        contagem.textContent = item[1];
        const coluna = document.createElement("div");
        coluna.className = "coluna";
        const preenchimento = document.createElement("div");
        preenchimento.className = "preenchimento";
        preenchimento.style.height = `${item[1] * 100 / maior}%`;
        coluna.appendChild(preenchimento);
        const nome = document.createElement("small");
        nome.textContent = item[0];
        grupo.append(contagem, coluna, nome);
        grafico.appendChild(grupo);
    });
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
    document.getElementById("meta-ano").value = new Date().getFullYear();
    document.getElementById("titulo-formulario").textContent = "Nova meta";
    mensagemFormulario.textContent = "";
    janelaMeta.hidden = false;
}

function fecharFormulario() {
    janelaMeta.hidden = true;
}

function editarMeta(id) {
    const meta = metas.find(item => Number(item.id) === Number(id));
    if (!meta) return;

    document.getElementById("meta-id").value = meta.id;
    document.getElementById("meta-ano").value = meta.ano;
    document.getElementById("meta-quantidade").value = meta.quantidade_livros;
    document.getElementById("titulo-formulario").textContent = "Editar meta";
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
        if (!resposta.ok || !respostaLivros.ok) throw new Error("Erro ao carregar dados");

        metas = await resposta.json();
        livros = await respostaLivros.json();
        mostrarMetas();
        atualizarResumo();
    } catch (erro) {
        console.error(erro);
        listaMetas.innerHTML = '<p class="estado-vazio">Não foi possível carregar as metas.</p>';
    }
}

async function salvarMeta(evento) {
    evento.preventDefault();
    const id = document.getElementById("meta-id").value;
    const meta = {
        ano: Number(document.getElementById("meta-ano").value),
        quantidade_livros: Number(document.getElementById("meta-quantidade").value)
    };

    if (!Number.isInteger(meta.ano) || meta.ano < 2020 || meta.ano > 2100 || meta.quantidade_livros <= 0) {
        mensagemFormulario.textContent = "Informe um ano e uma quantidade válidos.";
        return;
    }

    try {
        const resposta = await fetch(id ? `/api/metas/${id}` : "/api/metas", {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(meta)
        });
        const dados = await resposta.json();
        if (!resposta.ok) {
            mensagemFormulario.textContent = dados.mensagem || "Erro ao salvar meta.";
            return;
        }
        fecharFormulario();
        await carregarMetas();
    } catch (erro) {
        console.error(erro);
        mensagemFormulario.textContent = "Não foi possível salvar a meta.";
    }
}

async function excluirMeta(id) {
    if (!confirm("Deseja realmente excluir esta meta?")) return;
    try {
        const resposta = await fetch(`/api/metas/${id}`, { method: "DELETE" });
        if (!resposta.ok) throw new Error("Erro ao excluir meta");
        await carregarMetas();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir a meta.");
    }
}

document.getElementById("botao-adicionar-meta").addEventListener("click", abrirFormulario);
document.getElementById("botao-fechar").addEventListener("click", fecharFormulario);
document.getElementById("botao-cancelar").addEventListener("click", fecharFormulario);
formularioMeta.addEventListener("submit", salvarMeta);
janelaMeta.addEventListener("click", function(evento) {
    if (evento.target === janelaMeta) fecharFormulario();
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && !janelaMeta.hidden) fecharFormulario();
});

carregarMetas();
