const express = require("express");
const path = require("path");
const crypto = require("crypto");
const banco = require("./banco");

const app = express();
const porta = Number(process.env.PORT) || 3000;
const sessoes = new Map();

app.use(express.json());

function criarSenha(senha) {
    const sal = crypto.randomBytes(16).toString("hex");
    const codigo = crypto.scryptSync(senha, sal, 64).toString("hex");
    return `${sal}:${codigo}`;
}

function verificarSenha(senha, senhaSalva) {
    if (typeof senhaSalva !== "string") return false;
    const partes = senhaSalva.split(":");
    if (partes.length !== 2 || partes[1].length !== 128) return false;
    const salva = Buffer.from(partes[1], "hex");
    const digitada = crypto.scryptSync(senha, partes[0], 64);
    return salva.length === digitada.length && crypto.timingSafeEqual(salva, digitada);
}

function obterUsuario(requisicao) {
    const cookies = requisicao.headers.cookie || "";
    const sessao = cookies.split(";").map(item => item.trim()).find(item => item.startsWith("sessao="));
    const codigo = sessao ? sessao.substring(7) : "";
    const usuarioId = sessoes.get(codigo);
    return { usuarioId, codigo };
}

function verificarLogin(requisicao, resposta, proximo) {
    const { usuarioId } = obterUsuario(requisicao);
    if (!usuarioId) {
        return resposta.status(401).json({ mensagem: "Faça login para continuar." });
    }
    requisicao.usuarioId = usuarioId;
    proximo();
}

function validarLivro(livro) {
    return typeof livro.titulo === "string" && livro.titulo.trim().length > 0 &&
        typeof livro.autor === "string" && livro.autor.trim().length > 0 &&
        ["Quero ler", "Lendo", "Lido"].includes(livro.status) &&
        Number.isInteger(livro.total_paginas) && Number.isInteger(livro.pagina_atual) &&
        livro.total_paginas > 0 && livro.pagina_atual >= 0 &&
        livro.pagina_atual <= livro.total_paginas;
}

function validarMeta(meta) {
    return Number.isInteger(meta.ano) && meta.ano >= 2020 && meta.ano <= 2100 &&
        Number.isInteger(meta.quantidade_livros) && meta.quantidade_livros > 0;
}

app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/status", (requisicao, resposta) => {
    resposta.json({ mensagem: "LeituraJá funcionando!" });
});

app.post("/api/cadastro", async (requisicao, resposta) => {
    const { nome, email, senha } = requisicao.body;
    if (typeof nome !== "string" || !nome.trim() || typeof email !== "string" ||
        !email.includes("@") || typeof senha !== "string" || senha.length < 8) {
        return resposta.status(400).json({ mensagem: "Preencha os dados corretamente." });
    }
    try {
        await banco.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)",
            [nome.trim(), email.trim().toLowerCase(), criarSenha(senha)]
        );
        resposta.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
    } catch (erro) {
        if (erro.code === "23505") {
            return resposta.status(409).json({ mensagem: "Este e-mail já está cadastrado." });
        }
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
    }
});

app.post("/api/login", async (requisicao, resposta) => {
    const { email, senha } = requisicao.body;
    if (typeof email !== "string" || typeof senha !== "string") {
        return resposta.status(400).json({ mensagem: "Informe e-mail e senha." });
    }
    try {
        const resultado = await banco.query("SELECT * FROM usuarios WHERE email = $1", [email.trim().toLowerCase()]);
        const usuario = resultado.rows[0];
        if (!usuario || !verificarSenha(senha, usuario.senha)) {
            return resposta.status(401).json({ mensagem: "E-mail ou senha incorretos." });
        }
        const codigo = crypto.randomBytes(32).toString("hex");
        sessoes.set(codigo, usuario.id);
        resposta.cookie("sessao", codigo, { httpOnly: true, sameSite: "lax", secure: requisicao.secure || requisicao.get("x-forwarded-proto") === "https", path: "/" });
        resposta.json({ mensagem: "Login realizado com sucesso!", nome: usuario.nome });
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao realizar login." });
    }
});

app.get("/api/usuario", verificarLogin, async (requisicao, resposta) => {
    try {
        const resultado = await banco.query(
            "SELECT id, nome, email FROM usuarios WHERE id = $1", [requisicao.usuarioId]
        );
        if (!resultado.rows.length) return resposta.status(401).json({ mensagem: "Conta não encontrada." });
        resposta.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao buscar usuário." });
    }
});

app.post("/api/sair", (requisicao, resposta) => {
    const { codigo } = obterUsuario(requisicao);
    sessoes.delete(codigo);
    resposta.clearCookie("sessao", { path: "/" });
    resposta.json({ mensagem: "Você saiu da conta." });
});

app.get("/api/livros", verificarLogin, async (requisicao, resposta) => {
    try {
        const resultado = await banco.query(
            "SELECT * FROM livros WHERE usuario_id = $1 ORDER BY id DESC", [requisicao.usuarioId]
        );
        resposta.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao buscar livros." });
    }
});

app.post("/api/livros", verificarLogin, async (requisicao, resposta) => {
    const { titulo, autor, status, total_paginas, pagina_atual } = requisicao.body;
    if (!validarLivro(requisicao.body)) return resposta.status(400).json({ mensagem: "Dados do livro inválidos." });
    try {
        const resultado = await banco.query(
            `INSERT INTO livros (usuario_id, titulo, autor, status, total_paginas, pagina_atual)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [requisicao.usuarioId, titulo.trim(), autor.trim(), status, total_paginas, pagina_atual]
        );
        resposta.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao adicionar livro." });
    }
});

app.put("/api/livros/:id", verificarLogin, async (requisicao, resposta) => {
    const { titulo, autor, status, total_paginas, pagina_atual } = requisicao.body;
    if (!validarLivro(requisicao.body)) return resposta.status(400).json({ mensagem: "Dados do livro inválidos." });
    try {
        const resultado = await banco.query(
            `UPDATE livros SET titulo = $1, autor = $2, status = $3, total_paginas = $4, pagina_atual = $5
             WHERE id = $6 AND usuario_id = $7 RETURNING *`,
            [titulo.trim(), autor.trim(), status, total_paginas, pagina_atual, requisicao.params.id, requisicao.usuarioId]
        );
        if (!resultado.rows.length) return resposta.status(404).json({ mensagem: "Livro não encontrado." });
        resposta.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao editar livro." });
    }
});

app.delete("/api/livros/:id", verificarLogin, async (requisicao, resposta) => {
    try {
        const resultado = await banco.query(
            "DELETE FROM livros WHERE id = $1 AND usuario_id = $2 RETURNING id",
            [requisicao.params.id, requisicao.usuarioId]
        );
        if (!resultado.rows.length) return resposta.status(404).json({ mensagem: "Livro não encontrado." });
        resposta.json({ mensagem: "Livro excluído com sucesso!" });
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao excluir livro." });
    }
});

app.get("/api/metas", verificarLogin, async (requisicao, resposta) => {
    try {
        const resultado = await banco.query(
            "SELECT * FROM metas WHERE usuario_id = $1 ORDER BY ano DESC", [requisicao.usuarioId]
        );
        resposta.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao buscar metas." });
    }
});

app.post("/api/metas", verificarLogin, async (requisicao, resposta) => {
    const { ano, quantidade_livros } = requisicao.body;
    if (!validarMeta(requisicao.body)) return resposta.status(400).json({ mensagem: "Dados da meta inválidos." });
    try {
        const repetida = await banco.query(
            "SELECT id FROM metas WHERE usuario_id = $1 AND ano = $2", [requisicao.usuarioId, ano]
        );
        if (repetida.rows.length) return resposta.status(409).json({ mensagem: "Já existe uma meta para este ano." });
        const resultado = await banco.query(
            "INSERT INTO metas (usuario_id, ano, quantidade_livros) VALUES ($1, $2, $3) RETURNING *",
            [requisicao.usuarioId, ano, quantidade_livros]
        );
        resposta.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao criar meta." });
    }
});

app.put("/api/metas/:id", verificarLogin, async (requisicao, resposta) => {
    const { ano, quantidade_livros } = requisicao.body;
    if (!validarMeta(requisicao.body)) return resposta.status(400).json({ mensagem: "Dados da meta inválidos." });
    try {
        const repetida = await banco.query(
            "SELECT id FROM metas WHERE usuario_id = $1 AND ano = $2 AND id <> $3",
            [requisicao.usuarioId, ano, requisicao.params.id]
        );
        if (repetida.rows.length) return resposta.status(409).json({ mensagem: "Já existe uma meta para este ano." });
        const resultado = await banco.query(
            `UPDATE metas SET ano = $1, quantidade_livros = $2
             WHERE id = $3 AND usuario_id = $4 RETURNING *`,
            [ano, quantidade_livros, requisicao.params.id, requisicao.usuarioId]
        );
        if (!resultado.rows.length) return resposta.status(404).json({ mensagem: "Meta não encontrada." });
        resposta.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao editar meta." });
    }
});

app.delete("/api/metas/:id", verificarLogin, async (requisicao, resposta) => {
    try {
        const resultado = await banco.query(
            "DELETE FROM metas WHERE id = $1 AND usuario_id = $2 RETURNING id",
            [requisicao.params.id, requisicao.usuarioId]
        );
        if (!resultado.rows.length) return resposta.status(404).json({ mensagem: "Meta não encontrada." });
        resposta.json({ mensagem: "Meta excluída com sucesso!" });
    } catch (erro) {
        console.error(erro);
        resposta.status(500).json({ mensagem: "Erro ao excluir meta." });
    }
});

app.get("/{*caminho}", (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(porta, "0.0.0.0", () => {
    console.log(`Servidor LeituraJá iniciado na porta ${porta}`);
});
