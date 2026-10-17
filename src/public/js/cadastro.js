const formularioCadastro = document.getElementById("formulario-cadastro");
const mensagemCadastro = document.getElementById("mensagem-cadastro");

async function cadastrar(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    mensagemCadastro.textContent = "";

    if (!nome || !email || !senha || !confirmarSenha) {
        mensagemCadastro.textContent = "Preencha todos os campos.";
        return;
    }

    if (senha.length < 8) {
        mensagemCadastro.textContent = "A senha deve ter pelo menos 8 caracteres.";
        return;
    }

    if (senha !== confirmarSenha) {
        mensagemCadastro.textContent = "As senhas não são iguais.";
        return;
    }

    try {
        const resposta = await fetch("/api/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
            mensagemCadastro.textContent = dados.mensagem || "Não foi possível realizar o cadastro.";
            return;
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
    } catch (erro) {
        console.error(erro);
        mensagemCadastro.textContent = "Não foi possível conectar ao servidor.";
    }
}

formularioCadastro.addEventListener("submit", cadastrar);
