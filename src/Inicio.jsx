
import React, { useEffect, useState } from "react";
import { capaLivro } from "./Livro";

export default function Inicio({ usuario }) {
    const [livros, setLivros] = useState([]);
    const [metas, setMetas] = useState([]);

    useEffect(() => {
        fetch("/api/livros")
            .then(resposta => resposta.json())
            .then(dados => setLivros(dados))
            .catch(erro => console.log(erro));

        fetch("/api/metas")
            .then(resposta => resposta.json())
            .then(dados => setMetas(dados))
            .catch(erro => console.log(erro));
    }, []);

    let lendo = livros.filter(livro => livro.status === "Lendo");
    let lidos = livros.filter(livro => livro.status === "Lido");
    let queroLer = livros.filter(livro => livro.status === "Quero ler");

    let meta = metas.find(item => Number(item.ano) === new Date().getFullYear());
    let totalMeta = meta ? Number(meta.quantidade_livros) : 20;
    let porcentagem = totalMeta > 0
        ? Math.min(100, Math.round(lidos.length * 100 / totalMeta))
        : 0;

    let proximoLivro = queroLer[0];

    function porcentagemLivro(livro) {
        let total = Number(livro.total_paginas || livro.paginas || 0);
        let atual = Number(livro.pagina_atual || 0);

        if (total === 0) {
            return 0;
        }

        return Math.min(100, Math.round(atual * 100 / total));
    }

    return (
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 pb-20 lg:pb-6 xl:h-[calc(100dvh-84px)] xl:overflow-hidden xl:grid xl:grid-rows-[minmax(200px,1fr)_105px_minmax(255px,1.15fr)] xl:gap-5">

            <section className="border border-[#E7EAE5] rounded-2xl bg-white overflow-hidden flex min-h-[250px] xl:min-h-0">

                <div className="bg-[#F5F5F0] w-full lg:w-[54%] px-8 lg:px-10 py-7 flex flex-col justify-center">

                    <p className="text-[#246B55] text-[12px] font-bold">
                        ORGANIZE · ACOMPANHE · LEIA MAIS
                    </p>

                    <h1 className="text-[32px] lg:text-[38px] font-bold mt-4 leading-tight">
                        Bem-vindo de volta!
                    </h1>

                    <p className="text-[#75837B] text-[14px] mt-3">
                        Organize seus livros, acompanhe suas leituras e avance nas suas metas.
                    </p>

                    <div className="mt-6">
                        <a
                            href="#biblioteca"
                            className="inline-flex items-center gap-2 bg-[#246B55] text-white text-[14px] font-semibold px-5 py-3 rounded-xl hover:bg-[#183F34]"
                        >
                            <span className="text-lg leading-none">+</span>
                            Adicionar livro
                        </a>
                    </div>

                </div>

                <div className="hidden lg:flex w-[46%] items-center justify-center bg-white">

                    <img
                        src="/img/ilustracao-livros.svg"
                        alt="Livros e planta"
                        className="w-[340px] h-[90%] object-contain"
                    />

                </div>

            </section>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-5 xl:mt-0">

                <a
                    href="#biblioteca"
                    className="bg-[#DDEDE4] rounded-[14px] border border-[#E7EAE5] px-5 py-4 flex items-center gap-4 hover:shadow-md"
                >

                    <svg width="30" height="30" viewBox="0 0 24 24"
                         fill="none" stroke="#246B55" strokeWidth="1.7"
                         strokeLinecap="round" strokeLinejoin="round"
                         className="shrink-0">
                        <rect x="3" y="4" width="4" height="16" rx="1"/>
                        <rect x="9" y="4" width="4" height="16" rx="1"/>
                        <path d="M16 5l4-1 2 15-4 1-2-15Z"/>
                    </svg>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {livros.length}
                        </p>

                        <p className="text-[#75837B] text-[13px]">
                            Na biblioteca
                        </p>
                    </div>

                </a>

                <a
                    href="#biblioteca"
                    className="bg-[#E8F2F8] rounded-[14px] border border-[#E7EAE5] px-5 py-4 flex items-center gap-4 hover:shadow-md"
                >

                    <svg width="30" height="30" viewBox="0 0 24 24"
                         fill="none" stroke="#3B7EAE" strokeWidth="1.7"
                         strokeLinecap="round" strokeLinejoin="round"
                         className="shrink-0">
                        <path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/>
                        <path d="M12 6v14"/>
                    </svg>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {lendo.length}
                        </p>

                        <p className="text-[#75837B] text-[13px]">
                            Lendo
                        </p>
                    </div>

                </a>

                <a
                    href="#biblioteca"
                    className="bg-[#FEF1D9] rounded-[14px] border border-[#E7EAE5] px-5 py-4 flex items-center gap-4 hover:shadow-md"
                >

                    <svg width="30" height="30" viewBox="0 0 24 24"
                         fill="none" stroke="#D28C34" strokeWidth="1.7"
                         strokeLinecap="round" strokeLinejoin="round"
                         className="shrink-0">
                        <circle cx="12" cy="12" r="9"/>
                        <path d="M12 7v5l4 2"/>
                    </svg>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {queroLer.length}
                        </p>

                        <p className="text-[#75837B] text-[13px]">
                            Quero ler
                        </p>
                    </div>

                </a>

                <a
                    href="#biblioteca"
                    className="bg-[#FBEAED] rounded-[14px] border border-[#E7EAE5] px-5 py-4 flex items-center gap-4 hover:shadow-md"
                >

                    <svg width="30" height="30" viewBox="0 0 24 24"
                         fill="none" stroke="#BC5D64" strokeWidth="1.7"
                         strokeLinecap="round" strokeLinejoin="round"
                         className="shrink-0">
                        <circle cx="12" cy="12" r="9"/>
                        <path d="M7 12l3 3 6-6"/>
                    </svg>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {lidos.length}
                        </p>

                        <p className="text-[#75837B] text-[13px]">
                            Lidos
                        </p>
                    </div>

                </a>

            </section>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-5 mt-6 xl:mt-0 xl:min-h-0">

                <section className="flex flex-col min-w-0 xl:min-h-0">

                    <div className="flex items-center justify-between gap-3 mb-4">

                        <h2 className="text-[22px] font-bold">
                            Leituras em andamento
                        </h2>

                        <a
                            href="#biblioteca"
                            className="text-[#246B55] text-[13px] hover:underline"
                        >
                            Ver todos →
                        </a>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 xl:min-h-0">

                        {lendo.slice(0, 3).map(livro => (
                            <div
                                key={livro.id}
                                className="bg-white border border-[#E7EAE5] rounded-2xl p-4 flex flex-col hover:shadow-md min-h-[245px] xl:min-h-0"
                            >

                                <div className="flex gap-3 min-w-0">

                                    <img
                                        src={capaLivro(livro.titulo)}
                                        alt={livro.titulo}
                                        className="w-[75px] h-[105px] object-cover rounded-md shrink-0"
                                    />

                                    <div className="min-w-0">

                                        <h3 className="text-[14px] font-bold leading-snug line-clamp-3">
                                            {livro.titulo}
                                        </h3>

                                        <p className="text-[#75837B] text-[12px] mt-2 line-clamp-2">
                                            {livro.autor}
                                        </p>

                                        <span className="inline-block mt-3 bg-[#E8F2F8] text-[#3B7EAE] text-[11px] px-3 py-1 rounded-lg">
                                            Lendo
                                        </span>

                                    </div>

                                </div>

                                <div className="mt-auto pt-4">

                                    <div className="h-[7px] bg-[#E7EAE5] rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-[#246B55] rounded-full"
                                            style={{ width: porcentagemLivro(livro) + "%" }}
                                        ></div>

                                    </div>

                                    <div className="flex items-center justify-between text-[11px] text-[#75837B] mt-2">

                                        <span>
                                            {livro.pagina_atual || 0} de {livro.total_paginas || livro.paginas || 0} páginas
                                        </span>

                                        <span className="text-[#25362F] font-semibold">
                                            {porcentagemLivro(livro)}%
                                        </span>

                                    </div>

                                    <a
                                        href="#biblioteca"
                                        className="block text-center bg-[#F3F5F2] hover:bg-[#DDEDE4] rounded-lg py-2 text-[13px] mt-3"
                                    >
                                        Continuar lendo
                                    </a>

                                </div>

                            </div>
                        ))}

                        {lendo.length === 0 && (
                            <div className="bg-white border border-[#E7EAE5] rounded-2xl p-6 col-span-full">
                                <p className="text-[#75837B] text-sm">
                                    Você ainda não está lendo nenhum livro.
                                </p>
                            </div>
                        )}

                    </div>

                </section>

                <aside className="flex flex-col gap-4 xl:min-h-0">

                    <div className="bg-white border border-[#E7EAE5] rounded-2xl p-5 flex flex-col flex-1">

                        <div className="flex items-center justify-between gap-3">

                            <h2 className="text-[18px] font-bold">
                                Meta de leitura
                            </h2>

                            <a
                                href="#metas"
                                className="text-[#246B55] text-[12px] hover:underline"
                            >
                                Editar metas
                            </a>

                        </div>

                        <p className="text-[#75837B] text-[13px] mt-2">
                            Seu progresso de leitura neste ano
                        </p>

                        <div className="mt-auto pt-5">

                            <div className="flex items-center justify-between gap-3">

                                <p className="text-[23px] font-bold">
                                    {lidos.length} de {totalMeta} livros
                                </p>

                                <span className="text-[#246B55] text-[14px] font-semibold">
                                    {porcentagem}%
                                </span>

                            </div>

                            <div className="w-full h-[9px] bg-[#E7EAE5] rounded-full mt-4 overflow-hidden">

                                <div
                                    className="bg-[#246B55] h-full rounded-full"
                                    style={{ width: porcentagem + "%" }}
                                ></div>

                            </div>

                        </div>

                    </div>

                    <div className="bg-white border border-[#E7EAE5] rounded-2xl p-5 flex flex-col flex-1">

                        <h2 className="text-[18px] font-bold">
                            Próximos da sua lista
                        </h2>

                        {proximoLivro ? (

                            <a
                                href="#biblioteca"
                                className="flex items-center gap-4 mt-4 flex-1 hover:bg-[#F3F5F2] rounded-lg"
                            >

                                <img
                                    src={capaLivro(proximoLivro.titulo)}
                                    alt={proximoLivro.titulo}
                                    className="w-[65px] h-[88px] object-cover rounded-md shrink-0"
                                />

                                <div className="min-w-0">

                                    <p className="text-[14px] font-bold line-clamp-2">
                                        {proximoLivro.titulo}
                                    </p>

                                    <p className="text-[#75837B] text-[12px] mt-1">
                                        {proximoLivro.autor}
                                    </p>

                                    <p className="text-[#D28C34] text-[12px] mt-2">
                                        Quero ler →
                                    </p>

                                </div>

                            </a>

                        ) : (

                            <p className="text-[#75837B] text-[13px] mt-5">
                                Nenhum livro na sua lista.
                            </p>

                        )}

                    </div>

                </aside>

            </div>

        </main>
    );
}
