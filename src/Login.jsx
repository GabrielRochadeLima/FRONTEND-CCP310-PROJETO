import React, { useState } from "react";

export default function Login({ entrar }) {
    const [cadastro, setCadastro] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function enviar(evento) {
        evento.preventDefault();
        setErro("");

        try {
            let endereco = cadastro ? "/api/cadastro" : "/api/login";

            let resposta = await fetch(endereco, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    cadastro ? { nome, email, senha } : { email, senha }
                )
            });

            let dados = await resposta.json();

            if (!resposta.ok) {
                setErro(dados.mensagem || "Erro ao entrar.");
                return;
            }

            if (cadastro) {
                setCadastro(false);
                setSenha("");
                setErro("Conta criada! Agora entre com seu e-mail e senha.");
                return;
            }

            let usuarioResposta = await fetch("/api/usuario");
            let usuario = await usuarioResposta.json();

            entrar(usuario);
            window.location.hash = "inicio";

        } catch {
            setErro("Não foi possível conectar ao servidor.");
        }
    }

    function trocarTela() {
        setCadastro(!cadastro);
        setErro("");
        setSenha("");
    }

    return (
        <main className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row text-[#25362F]">

            <section className="bg-[#DDEDE4] lg:w-[45%] px-8 py-10 lg:px-16 lg:py-12 flex flex-col">

                <a href="#inicio" className="flex items-center gap-3 hover:opacity-80">

                    <svg width="28" height="28" viewBox="0 0 24 24"
                         fill="none" stroke="#246B55" strokeWidth="1.5"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/>
                        <path d="M12 6v14"/>
                    </svg>

                    <span className="text-[27px] font-bold">
                        LeituraJá
                    </span>

                </a>

                <div className="mt-14 lg:mt-20">

                    <h1 className="text-[28px] lg:text-[32px] font-bold">
                        Um espaço para suas leituras.
                    </h1>

                    <p className="text-[#75837B] text-[15px] mt-4">
                        Guarde seus livros, acompanhe seu progresso e leia mais.
                    </p>

                </div>

                <div className="flex-1 flex items-center justify-center py-10">

                    <img
                        src="/img/ilustracao-livros.svg"
                        alt="Ilustração de livros e planta"
                        className="w-[420px] max-w-full max-h-[320px] object-contain"
                    />

                </div>

                <p className="text-[#246B55] font-semibold text-[14px] mt-5">
                    Feito para quem gosta de ler.
                </p>

            </section>

            <section className="bg-white lg:w-[55%] px-8 py-12 lg:px-20 lg:py-10 flex flex-col justify-center">

                <div className="w-full max-w-[550px] mx-auto">

                    <h2 className="text-[30px] lg:text-[32px] font-bold">
                        {cadastro ? "Criar conta" : "Bem-vindo de volta"}
                    </h2>

                    <p className="text-[#75837B] text-[15px] mt-2">
                        {cadastro
                            ? "Crie sua conta para começar suas leituras."
                            : "Entre na sua conta para continuar lendo."}
                    </p>

                    <form onSubmit={enviar} className="mt-10">

                        {cadastro && (
                            <div className="mb-6">

                                <label htmlFor="nome" className="block text-[14px] font-semibold mb-2">
                                    Nome
                                </label>

                                <input
                                    id="nome"
                                    type="text"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    placeholder="Digite seu nome"
                                    required
                                    className="w-full h-[56px] border border-[#E7EAE5] rounded-xl px-4 outline-none focus:border-[#246B55]"
                                />

                            </div>
                        )}

                        <label htmlFor="email" className="block text-[14px] font-semibold mb-2">
                            E-mail
                        </label>

                        <div className="flex items-center gap-3 border border-[#E7EAE5] rounded-xl h-[56px] px-4 focus-within:border-[#246B55]">

                            <svg width="19" height="19" viewBox="0 0 24 24"
                                 fill="none" stroke="#75837B" strokeWidth="1.7"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="5" width="18" height="14" rx="2"/>
                                <path d="m3 7 9 7 9-7"/>
                            </svg>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seuemail@exemplo.com"
                                required
                                className="w-full bg-transparent outline-none text-[14px]"
                            />

                        </div>

                        <label htmlFor="senha" className="block text-[14px] font-semibold mt-8 mb-2">
                            Senha
                        </label>

                        <div className="flex items-center gap-3 border border-[#E7EAE5] rounded-xl h-[56px] px-4 focus-within:border-[#246B55]">

                            <svg width="19" height="19" viewBox="0 0 24 24"
                                 fill="none" stroke="#75837B" strokeWidth="1.7"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="10" width="14" height="11" rx="2"/>
                                <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                            </svg>

                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                placeholder="••••••••"
                                minLength={8}
                                required
                                className="w-full bg-transparent outline-none text-[14px]"
                            />

                            <svg width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="#75837B" strokeWidth="1.7"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>

                        </div>

                        {!cadastro && (
                            <div className="text-right mt-5">
                                <span className="text-[#246B55] text-[13px] font-semibold">
                                    Esqueci minha senha
                                </span>
                            </div>
                        )}

                        {erro && (
                            <p className="text-[#BC5D64] text-sm mt-4">
                                {erro}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="bg-[#246B55] text-white w-full h-[55px] rounded-xl font-semibold text-[15px] mt-10 hover:bg-[#183F34] cursor-pointer"
                        >
                            {cadastro ? "Cadastrar" : "Entrar"}
                        </button>

                    </form>

                    <div className="flex items-center justify-center gap-4 mt-12">

                        <p className="text-[#75837B] text-[14px]">
                            {cadastro ? "Já tem uma conta?" : "Ainda não tem uma conta?"}
                        </p>

                        <button
                            type="button"
                            onClick={trocarTela}
                            className="text-[#246B55] text-[14px] font-semibold hover:underline cursor-pointer"
                        >
                            {cadastro ? "Entrar" : "Cadastre-se"}
                        </button>

                    </div>

                </div>

                <p className="text-[#75837B] text-[12px] mt-16 lg:mt-20 max-w-[550px] w-full mx-auto">
                    LeituraJá © 2026
                </p>

            </section>

        </main>
    );
}
