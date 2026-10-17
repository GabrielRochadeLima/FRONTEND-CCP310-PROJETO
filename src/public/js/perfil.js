const botaoPerfil = document.getElementById("botao-perfil");
const menuPerfil = document.getElementById("menu-perfil");
const botaoSair = document.getElementById("botao-sair");
async function carregarUsuario(){
    try{
        const resposta = await fetch("/api/usuario");
        if (resposta.status === 401){
            window.location.href = "/login.html";
            return;
        }
        if (!resposta.ok){
            throw new Error("Não foi possível carregar o usuário.");
        }
        const usuario = await resposta.json();
        document.getElementById("nome-usuario").textContent = usuario.nome.split(" ")[0];
        document.getElementById("email-usuario").textContent = usuario.email;
    }
    catch (erro){
        console.error(erro);
    }
}
function fecharMenu(){
    menuPerfil.classList.add("hidden");
    botaoPerfil.setAttribute("aria-expanded", "false");
}
botaoPerfil.addEventListener("click", () =>{
    const aberto = menuPerfil.classList.contains("hidden");
    menuPerfil.classList.toggle("hidden");
    botaoPerfil.setAttribute("aria-expanded", String(aberto));
}
);
document.addEventListener("click", (evento) =>{
    if (!evento.target.closest(".perfil-area")){
        fecharMenu();
    }
}
);
document.addEventListener("keydown", (evento) =>{
    if (evento.key === "Escape"){
        fecharMenu();
    }
}
);
botaoSair.addEventListener("click", async () =>{
    try{
        const resposta = await fetch("/api/sair",{
            method: "POST"
        }
        );
        if (!resposta.ok){
            throw new Error("Não foi possível sair da conta.");
        }
        window.location.href = "/login.html";
    }
    catch (erro){
        alert("Não foi possível sair da conta.");
        console.error(erro);
    }
}
);
carregarUsuario();
