async function carregarInicio(){
    try{
        const respostaLivros = await fetch("/api/livros");
        if (respostaLivros.status === 401){
            window.location.href = "login.html";
            return;
        }
        if (!respostaLivros.ok) throw new Error("Não foi possível carregar os livros");
        const livros = await respostaLivros.json();
        const lidos = livros.filter(livro => livro.status === "Lido").length;
        const lendo = livros.filter(livro => livro.status === "Lendo");
        document.getElementById("total-livros").textContent = livros.length;
        document.getElementById("total-lendo").textContent = lendo.length;
        document.getElementById("total-quero-ler").textContent = livros.filter(livro => livro.status === "Quero ler").length;
        document.getElementById("total-lidos").textContent = lidos;
        const area = document.getElementById("livros-andamento");
        area.innerHTML = "";
        if (!lendo.length) area.textContent = "Nenhum livro em andamento.";
        lendo.slice(0, 4).forEach(livro =>{
            const card = document.createElement("article");
            card.className = "cartao p-5 flex gap-4 items-start";
            const capa = document.createElement("div");
            capa.className = "capa capa-verde";
            capa.textContent = "LeituraJá";
            const informacoes = document.createElement("div");
            informacoes.className = "min-w-0 flex-1";
            const titulo = document.createElement("h3");
            titulo.className = "font-bold mb-1";
            titulo.textContent = livro.titulo;
            const autor = document.createElement("p");
            autor.className = "text-[#75837B] text-sm mb-3";
            autor.textContent = livro.autor;
            const paginas = document.createElement("p");
            paginas.className = "text-[#246B55] text-sm font-semibold";
            paginas.textContent = `${livro.pagina_atual || 0} / ${livro.total_paginas || 0} páginas`;
            informacoes.append(titulo, autor, paginas);
            card.append(capa, informacoes);
            area.appendChild(card);
        }
        );
        const respostaMetas = await fetch("/api/metas");
        if (!respostaMetas.ok) throw new Error("Não foi possível carregar as metas");
        const metas = await respostaMetas.json();
        const meta = metas.find(item => Number(item.ano) === new Date().getFullYear());
        const total = meta ? Number(meta.quantidade_livros) : 0;
        const porcentagem = total ? Math.min(100, Math.round(lidos / total * 100)) : 0;
        document.getElementById("texto-meta").textContent = `${lidos} / ${total} livros`;
        document.getElementById("porcentagem-meta").textContent = `${porcentagem}%`;
        document.getElementById("barra-meta").style.width = `${porcentagem}%`;
    }
    catch (erro){
        console.error(erro);
        document.getElementById("livros-andamento").textContent = "Não foi possível carregar seus dados.";
    }
}
carregarInicio();
