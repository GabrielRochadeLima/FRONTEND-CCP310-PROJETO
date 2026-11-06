
import React, { useEffect, useState } from "react";
import Inicio from "./Inicio";
import Biblioteca from "./Biblioteca";
import Metas from "./Metas";
import Login from "./Login";

export default function App() {
    const [pagina, setPagina] = useState(window.location.hash.replace("#", "") || "inicio");
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        fetch("/api/usuario")
            .then(resposta => resposta.ok ? resposta.json() : null)
            .then(dados => setUsuario(dados))
            .catch(() => setUsuario(null))
            .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        function mudarPagina() {
            setPagina(window.location.hash.replace("#", "") || "inicio");
        }

        window.addEventListener("hashchange", mudarPagina);

        return () => {
            window.removeEventListener("hashchange", mudarPagina);
        };
    }, []);

    function navegar(destino) {
        window.location.hash = destino;
        setPagina(destino);
    }

    async function sair() {
        await fetch("/api/sair", { method: "POST" });
        setUsuario(null);
        navegar("login");
    }

    function pesquisar(evento) {
        evento.preventDefault();
        navegar("biblioteca");
    }

    if (carregando) {
        return <p className="p-10">Carregando...</p>;
    }

    if (!usuario) {
        return <Login entrar={setUsuario} />;
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#25362F] xl:h-dvh xl:overflow-hidden">

            <header className="bg-white border-b border-[#E7EAE5] xl:shrink-0">

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-[84px] flex items-center justify-between gap-4">

                    <a href="#inicio" className="flex items-center gap-3 shrink-0 hover:opacity-80">

                        <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#246B55"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 6c-2.5-1.8-5.7-2-9-1v14c3.3-1 6.5-.8 9 1 2.5-1.8 5.7-2 9-1V5c-3.3-1-6.5-.8-9 1Z"/>
                            <path d="M12 6v14"/>
                        </svg>

                        <span className="text-[25px] font-bold tracking-tight">
                            LeituraJá
                        </span>

                    </a>

                    <nav className="hidden lg:flex items-center gap-9 h-full">

                        <a
                            href="#inicio"
                            className={
                                "h-full flex items-center border-b-[3px] text-[14px] hover:text-[#246B55] " +
                                (pagina === "inicio"
                                    ? "border-[#246B55] text-[#246B55] font-bold"
                                    : "border-transparent")
                            }
                        >
                            Início
                        </a>

                        <a
                            href="#biblioteca"
                            className={
                                "h-full flex items-center border-b-[3px] text-[14px] hover:text-[#246B55] " +
                                (pagina === "biblioteca"
                                    ? "border-[#246B55] text-[#246B55] font-bold"
                                    : "border-transparent")
                            }
                        >
                            Minha Biblioteca
                        </a>

                        <a
                            href="#metas"
                            className={
                                "h-full flex items-center border-b-[3px] text-[14px] hover:text-[#246B55] " +
                                (pagina === "metas"
                                    ? "border-[#246B55] text-[#246B55] font-bold"
                                    : "border-transparent")
                            }
                        >
                            Metas
                        </a>

                    </nav>

                    <div className="flex items-center gap-6">

                        <form
                            onSubmit={pesquisar}
                            className="hidden md:flex items-center gap-3 bg-[#F3F5F2] border border-[#E7EAE5] rounded-xl h-[46px] w-[220px] px-4"
                        >

                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#75837B"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                            >
                                <circle cx="10" cy="10" r="7"/>
                                <path d="m15 15 6 6"/>
                            </svg>

                            <input
                                type="search"
                                placeholder="Buscar livros..."
                                value={busca}
                                onChange={evento => setBusca(evento.target.value)}
                                className="w-full bg-transparent outline-none text-[12px] text-[#25362F]"
                            />

                        </form>

                        <button
                            type="button"
                            onClick={sair}
                            title="Sair da conta"
                            className="bg-[#DDEDE4] rounded-full w-[42px] h-[42px] flex items-center justify-center hover:bg-[#C5E1D2] cursor-pointer"
                        >

                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#246B55"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="8" r="4"/>
                                <path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>
                            </svg>

                        </button>

                    </div>

                </div>

            </header>

            <div className="xl:h-[calc(100dvh-84px)] xl:overflow-hidden">
                {pagina === "biblioteca" ? (
                    <Biblioteca />
                ) : pagina === "metas" ? (
                    <Metas />
                ) : (
                    <Inicio usuario={usuario} />
                )}
            </div>

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7EAE5] flex justify-around p-4 z-20">

                <a href="#inicio" className="text-sm hover:text-[#246B55]">
                    Início
                </a>

                <a href="#biblioteca" className="text-sm hover:text-[#246B55]">
                    Biblioteca
                </a>

                <a href="#metas" className="text-sm hover:text-[#246B55]">
                    Metas
                </a>

            </nav>

        </div>
    );
}
