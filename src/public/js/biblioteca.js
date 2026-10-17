let livros = [];
let filtroAtual = "Todos";
const listaLivros = document.getElementById("lista-livros");
const janelaLivro = document.getElementById("janela-livro");
const formularioLivro = document.getElementById("formulario-livro");
const pesquisaLivros = document.getElementById("pesquisa-livros");
const mensagemFormulario = document.getElementById("mensagem-formulario");
async function carregarLivros(){
    try{
        const resposta = await fetch("/api/livros");
        if (resposta.status === 401){
            window.location.href = "login.html";
            return;
        }
        if (!resposta.ok) throw new Error("Erro ao buscar livros");
        livros = await resposta.json();
        mostrarLivros();
    }
    catch (erro){
        console.error(erro);
        listaLivros.textContent = "Não foi possível carregar os livros.";
    }
}
function mostrarLivros(){
    listaLivros.innerHTML = "";
    const pesquisa = pesquisaLivros.value.toLowerCase();
    const filtrados = livros.filter(livro => (filtroAtual === "Todos" || livro.status === filtroAtual) && (livro.titulo.toLowerCase().includes(pesquisa) || livro.autor.toLowerCase().includes(pesquisa)));
    document.getElementById("quantidade-livros").textContent = `${filtrados.length} livros`;
    if (!filtrados.length){
        listaLivros.textContent = "Nenhum livro encontrado.";
        return;
    }
    filtrados.forEach(livro =>{
        const card = document.createElement("article"); card.className = "cartao p-5 flex gap-4";
        const capa = document.createElement("div"); capa.className = "capa capa-azul"; capa.textContent = "LeituraJá";
        const coluna = document.createElement("div"); coluna.className = "flex-1 min-w-0";
        const titulo = document.createElement("h3"); titulo.textContent = livro.titulo; titulo.className = "font-bold mb-1";
        const autor = document.createElement("p"); autor.textContent = livro.autor; autor.className = "text-sm text-[#75837B] mb-2";
        const status = document.createElement("p"); status.textContent = livro.status; status.className = "text-sm text-[#246B55] font-semibold mb-2";
        const paginas = document.createElement("p"); paginas.textContent = `${livro.pagina_atual || 0} / ${livro.total_paginas || 0} páginas`; paginas.className = "text-sm text-[#75837B] mb-3";
        const botoes = document.createElement("div"); botoes.className = "flex flex-wrap gap-2";
        const editar = document.createElement("button"); editar.textContent = "Editar"; editar.className = "bg-[#DDEDE4] text-[#246B55] px-3 py-2 rounded-lg text-sm cursor-pointer"; editar.onclick = () => editarLivro(livro.id);
        const excluir = document.createElement("button"); excluir.textContent = "Excluir"; excluir.className = "bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm cursor-pointer"; excluir.onclick = () => excluirLivro(livro.id);
        botoes.append(editar, excluir); coluna.append(titulo, autor, status, paginas, botoes); card.append(capa, coluna); listaLivros.appendChild(card);
    }
    );
}
function abrirFormulario(){
    formularioLivro.reset();
    document.getElementById("livro-id").value = "";
    document.getElementById("titulo-formulario").textContent = "Adicionar livro";
    mensagemFormulario.textContent = "";
    janelaLivro.classList.remove("hidden");
    janelaLivro.classList.add("flex");
}
function fecharFormulario(){
    janelaLivro.classList.add("hidden");
    janelaLivro.classList.remove("flex");
}
function editarLivro(id){
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
    janelaLivro.classList.remove("hidden");
    janelaLivro.classList.add("flex");
}
async function salvarLivro(evento){
    evento.preventDefault();
    const id = document.getElementById("livro-id").value;
    const livro ={
        titulo: document.getElementById("livro-titulo").value.trim(),autor: document.getElementById("livro-autor").value.trim(),status: document.getElementById("livro-status").value,total_paginas: Number(document.getElementById("livro-total-paginas").value),pagina_atual: Number(document.getElementById("livro-pagina-atual").value)
    }
    ;
    if (livro.pagina_atual > livro.total_paginas || livro.pagina_atual < 0 || livro.total_paginas <= 0){
        mensagemFormulario.textContent = "Verifique a quantidade de páginas.";
        return;
    }
    try{
        const resposta = await fetch(id ? `/api/livros/${id}` : "/api/livros",{
            method:id ? "PUT" : "POST",headers:{
                "Content-Type":"application/json"
            }
            ,body:JSON.stringify(livro)
        }
        );
        if (!resposta.ok) throw new Error("Erro ao salvar livro");
        fecharFormulario();
        await carregarLivros();
    }
    catch(erro){
        console.error(erro);
        mensagemFormulario.textContent = "Não foi possível salvar o livro.";
    }
}
async function excluirLivro(id){
    if (!confirm("Deseja realmente excluir este livro?")) return;
    try{
        const resposta = await fetch(`/api/livros/${id}`,{
            method:"DELETE"
        }
        );
        if (!resposta.ok) throw new Error("Erro ao excluir livro");
        await carregarLivros();
    }
    catch(erro){
        console.error(erro);
        alert("Não foi possível excluir o livro.");
    }
}
document.getElementById("botao-adicionar").addEventListener("click", abrirFormulario);
document.getElementById("botao-fechar").addEventListener("click", fecharFormulario);
document.getElementById("botao-cancelar").addEventListener("click", fecharFormulario);
formularioLivro.addEventListener("submit", salvarLivro);
pesquisaLivros.addEventListener("input", mostrarLivros);
document.querySelectorAll(".filtro").forEach(botao => botao.addEventListener("click", () =>{
    filtroAtual = botao.dataset.status; document.querySelectorAll(".filtro").forEach(item =>{
        item.classList.remove("bg-[#246B55]","text-white"); item.classList.add("bg-gray-100");
    }
    ); botao.classList.remove("bg-gray-100"); botao.classList.add("bg-[#246B55]","text-white"); mostrarLivros();
}
));
carregarLivros();
