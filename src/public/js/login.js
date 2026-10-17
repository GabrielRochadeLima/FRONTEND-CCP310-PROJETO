const formularioLogin = document.getElementById("formulario-login");
const mensagemLogin = document.getElementById("mensagem-login");

async function entrar(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    mensagemLogin.textContent = "";

    if (!email || !senha) {
        mensagemLogin.textContent = "Preencha o e-mail e a senha.";
        return;
    }

    try {
        const resposta = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
            mensagemLogin.textContent = dados.mensagem || "E-mail ou senha incorretos.";
            return;
        }

        window.location.href = "index.html";
    } catch (erro) {
        console.error(erro);
        mensagemLogin.textContent = "Não foi possível conectar ao servidor.";
    }
}

formularioLogin.addEventListener("submit", entrar);
