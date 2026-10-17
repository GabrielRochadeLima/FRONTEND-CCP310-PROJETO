let metas = [];
let livros = [];
const listaMetas = document.getElementById("lista-metas");
const janelaMeta = document.getElementById("janela-meta");
const formularioMeta = document.getElementById("formulario-meta");
const mensagemFormulario = document.getElementById("mensagem-formulario");
async function carregarMetas(){
    try{
        const respostaMetas=await fetch("/api/metas");
        if (respostaMetas.status===401){
            window.location.href="login.html";
            return;
        }
        const respostaLivros=await fetch("/api/livros");
        if (!respostaMetas.ok||!respostaLivros.ok) throw new Error("Erro ao carregar dados");
        metas=await respostaMetas.json();
        livros=await respostaLivros.json();
        mostrarMetas();
        atualizarResumo();
    }
    catch(erro){
        console.error(erro);
        listaMetas.textContent="Não foi possível carregar as metas.";
    }
}
function atualizarResumo(){
    const anoAtual=new Date().getFullYear();
    const metaAtual=metas.find(meta=>Number(meta.ano)===anoAtual);
    const quantidadeMeta=metaAtual?Number(metaAtual.quantidade_livros):0;
    const lidos=livros.filter(l=>l.status==="Lido").length;
    const lendo=livros.filter(l=>l.status==="Lendo").length;
    const queroLer=livros.filter(l=>l.status==="Quero ler").length;
    const faltam=Math.max(0,quantidadeMeta-lidos);
    const porcentagem=quantidadeMeta?Math.min(100,Math.round(lidos/quantidadeMeta*100)):0;
    document.getElementById("total-lidos").textContent=lidos;
    document.getElementById("total-meta").textContent=quantidadeMeta;
    document.getElementById("total-faltam").textContent=faltam;
    document.getElementById("total-porcentagem").textContent=`${porcentagem}%`;
    document.getElementById("quantidade-quero-ler").textContent=queroLer;
    document.getElementById("quantidade-lendo").textContent=lendo;
    document.getElementById("quantidade-lidos").textContent=lidos;
    document.getElementById("ano-meta").textContent=`Meta de ${anoAtual}`;
    document.getElementById("texto-progresso").textContent=`${lidos} / ${quantidadeMeta} livros`;
    document.getElementById("barra-progresso").style.width=`${porcentagem}%`;
    document.getElementById("mensagem-progresso").textContent=quantidadeMeta===0?"Nenhuma meta cadastrada para este ano.":faltam===0?"Parabéns! Você alcançou sua meta de leitura!":`Faltam ${faltam} livros para alcançar sua meta.`;
}
function mostrarMetas(){
    listaMetas.innerHTML="";
    if(!metas.length){
        listaMetas.textContent="Nenhuma meta cadastrada.";
        return;
    }
    metas.forEach(meta=>{
        const cartao=document.createElement("div");cartao.className="border border-[#E7EAE5] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4";const info=document.createElement("div");const ano=document.createElement("h3");ano.className="font-bold";ano.textContent=`Meta de ${meta.ano}`;const quantidade=document.createElement("p");quantidade.className="text-[#75837B] text-sm";quantidade.textContent=`${meta.quantidade_livros} livros`;info.append(ano,quantidade);const botoes=document.createElement("div");botoes.className="flex gap-2";const editar=document.createElement("button");editar.textContent="Editar";editar.className="bg-[#DDEDE4] text-[#246B55] px-4 py-2 rounded-lg";editar.onclick=()=>editarMeta(meta.id);const excluir=document.createElement("button");excluir.textContent="Excluir";excluir.className="bg-red-50 text-red-600 px-4 py-2 rounded-lg";excluir.onclick=()=>excluirMeta(meta.id);botoes.append(editar,excluir);cartao.append(info,botoes);listaMetas.appendChild(cartao);
    }
    );
}
function abrirFormulario(){
    formularioMeta.reset();
    document.getElementById("meta-id").value="";
    document.getElementById("meta-ano").value=new Date().getFullYear();
    document.getElementById("titulo-formulario").textContent="Nova meta";
    mensagemFormulario.textContent="";
    janelaMeta.classList.remove("hidden");
    janelaMeta.classList.add("flex");
}
function fecharFormulario(){
    janelaMeta.classList.add("hidden");
    janelaMeta.classList.remove("flex");
}
function editarMeta(id){
    const meta=metas.find(item=>Number(item.id)===Number(id));
    if(!meta)return;
    document.getElementById("meta-id").value=meta.id;
    document.getElementById("meta-ano").value=meta.ano;
    document.getElementById("meta-quantidade").value=meta.quantidade_livros;
    document.getElementById("titulo-formulario").textContent="Editar meta";
    mensagemFormulario.textContent="";
    janelaMeta.classList.remove("hidden");
    janelaMeta.classList.add("flex");
}
async function salvarMeta(evento){
    evento.preventDefault();
    const id=document.getElementById("meta-id").value;
    const meta={
        ano:Number(document.getElementById("meta-ano").value),quantidade_livros:Number(document.getElementById("meta-quantidade").value)
    }
    ;
    if(meta.quantidade_livros<=0){
        mensagemFormulario.textContent="Informe uma quantidade válida de livros.";
        return;
    }
    try{
        const resposta=await fetch(id?`/api/metas/${id}`:"/api/metas",{
            method:id?"PUT":"POST",headers:{
                "Content-Type":"application/json"
            }
            ,body:JSON.stringify(meta)
        }
        );
        if(!resposta.ok)throw new Error("Erro ao salvar meta");
        fecharFormulario();
        await carregarMetas();
    }
    catch(erro){
        console.error(erro);
        mensagemFormulario.textContent="Não foi possível salvar a meta.";
    }
}
async function excluirMeta(id){
    if(!confirm("Deseja realmente excluir esta meta?"))return;
    try{
        const resposta=await fetch(`/api/metas/${id}`,{
            method:"DELETE"
        }
        );
        if(!resposta.ok)throw new Error("Erro ao excluir meta");
        await carregarMetas();
    }
    catch(erro){
        console.error(erro);
        alert("Não foi possível excluir a meta.");
    }
}
document.getElementById("botao-adicionar-meta").addEventListener("click",abrirFormulario);
document.getElementById("botao-fechar").addEventListener("click",fecharFormulario);
document.getElementById("botao-cancelar").addEventListener("click",fecharFormulario);
formularioMeta.addEventListener("submit",salvarMeta);
carregarMetas();
