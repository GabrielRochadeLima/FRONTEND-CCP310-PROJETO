const botaoPerfil = document.getElementById("botao-perfil");
const menuPerfil = document.getElementById("menu-perfil");
const botaoSair = document.getElementById("botao-sair");

async function carregarPerfil() {
    try {
        const resposta = await fetch("/api/usuario");

        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!resposta.ok) throw new Error("Erro ao carregar perfil");

        const usuario = await resposta.json();
        document.getElementById("nome-usuario").textContent = usuario.nome;
        document.getElementById("email-usuario").textContent = usuario.email;
    } catch (erro) {
        console.error(erro);
    }
}

botaoPerfil.addEventListener("click", function() {
    const aberto = !menuPerfil.hidden;
    menuPerfil.hidden = aberto;
    botaoPerfil.setAttribute("aria-expanded", String(!aberto));
});

document.addEventListener("click", function(evento) {
    if (!evento.target.closest(".perfil")) {
        menuPerfil.hidden = true;
        botaoPerfil.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        menuPerfil.hidden = true;
        botaoPerfil.setAttribute("aria-expanded", "false");
    }
});

botaoSair.addEventListener("click", async function() {
    try {
        const resposta = await fetch("/api/sair", { method: "POST" });
        if (!resposta.ok) throw new Error("Erro ao sair da conta");
        window.location.href = "login.html";
    } catch (erro) {
        alert("Não foi possível sair da conta.");
        console.error(erro);
    }
});

carregarPerfil();
