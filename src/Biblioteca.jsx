
import React, { useEffect, useState } from "react";
import { capaLivro } from "./Livro";

const vazio = {
    titulo: "",
    autor: "",
    status: "Quero ler",
    total_paginas: 100,
    pagina_atual: 0
};

export default function Biblioteca() {
    const [livros, setLivros] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtro, setFiltro] = useState("Todos");
    const [mostrarFiltros, setMostrarFiltros] = useState(true);
    const [formulario, setFormulario] = useState(false);
    const [livro, setLivro] = useState({ ...vazio });
    const [erro, setErro] = useState("");
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        try {
            let resposta = await fetch("/api/livros");

            if (!resposta.ok) {
                setErro("Não foi possível buscar os livros.");
                return;
            }

            let dados = await resposta.json();
            setLivros(dados);
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        }
    }

    function abrir(item) {
        let dados = item ? { ...item } : { ...vazio };

        if (dados.status === "Quero ler") {
            dados.pagina_atual = 0;
        }

        if (dados.status === "Lido") {
            dados.pagina_atual = dados.total_paginas;
        }

        setLivro(dados);
        setErro("");
        setFormulario(true);
    }

    function mudarStatus(status) {
        let paginaAtual = livro.pagina_atual;

        if (status === "Quero ler") {
            paginaAtual = 0;
        }

        if (status === "Lido") {
            paginaAtual = livro.total_paginas;
        }

        if (status === "Lendo" && livro.status === "Lido") {
            paginaAtual = 0;
        }

        setLivro({
            ...livro,
            status: status,
            pagina_atual: paginaAtual
        });
    }

    function mudarTotal(valor) {
        let paginaAtual = livro.pagina_atual;

        if (livro.status === "Lido") {
            paginaAtual = valor;
        }

        if (livro.status === "Quero ler") {
            paginaAtual = 0;
        }

        setLivro({
            ...livro,
            total_paginas: valor,
            pagina_atual: paginaAtual
        });
    }

    async function salvar(evento) {
        evento.preventDefault();
        setErro("");

        let total = Number(livro.total_paginas);
        let atual = Number(livro.pagina_atual);

        if (livro.status === "Quero ler") {
            atual = 0;
        }

        if (livro.status === "Lido") {
            atual = total;
        }

        if (total < 1) {
            setErro("O livro precisa ter pelo menos uma página.");
            return;
        }

        if (atual < 0 || atual > total) {
            setErro("A página atual deve estar entre 0 e o total de páginas.");
            return;
        }

        let dadosLivro = {
            ...livro,
            total_paginas: total,
            pagina_atual: atual
        };

        try {
            let resposta = await fetch(
                livro.id ? "/api/livros/" + livro.id : "/api/livros",
                {
                    method: livro.id ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosLivro)
                }
            );

            if (!resposta.ok) {
                let dados = await resposta.json();
                setErro(dados.mensagem || "Erro ao salvar o livro.");
                return;
            }

            setFormulario(false);
            carregar();
        } catch {
            setErro("Não foi possível salvar o livro.");
        }
    }

    async function excluir() {
        if (!window.confirm("Excluir este livro?")) {
            return;
        }

        try {
            let resposta = await fetch("/api/livros/" + livro.id, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                setErro("Erro ao excluir o livro.");
                return;
            }

            setFormulario(false);
            carregar();
        } catch {
            setErro("Não foi possível excluir o livro.");
        }
    }

    function pesquisar(texto) {
        setPesquisa(texto);
        setPagina(1);
    }

    function filtrar(status) {
        setFiltro(status);
        setPagina(1);
    }

    let visiveis = livros.filter(item => {
        let correspondeStatus = filtro === "Todos" || item.status === filtro;
        let texto = (item.titulo + " " + item.autor).toLowerCase();
        let correspondePesquisa = texto.includes(pesquisa.toLowerCase());

        return correspondeStatus && correspondePesquisa;
    });

    let totalPaginas = Math.ceil(visiveis.length / 8);
    let livrosPagina = visiveis.slice((pagina - 1) * 8, pagina * 8);

    function progresso(item) {
        if (!item.total_paginas || Number(item.total_paginas) <= 0) {
            return 0;
        }

        return Math.min(100, Math.round(
            Number(item.pagina_atual || 0) * 100 / Number(item.total_paginas)
        ));
    }

    return (
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 pb-20 lg:pb-6 xl:h-full xl:overflow-hidden flex flex-col">

            <div className="shrink-0">
                <h1 className="text-[32px] font-bold">
                    Minha Biblioteca
                </h1>

                <p className="text-[#75837B] text-[15px] mt-2">
                    Organize seus livros do seu jeito.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mt-8 shrink-0">

                <div className="bg-white border border-[#E7EAE5] rounded-xl h-[56px] flex items-center gap-3 px-5 flex-1">

                    <svg width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="#75837B" strokeWidth="1.8"
                         strokeLinecap="round">
                        <circle cx="10" cy="10" r="7"/>
                        <path d="M15 15l6 6"/>
                    </svg>

                    <input
                        type="search"
                        value={pesquisa}
                        onChange={evento => pesquisar(evento.target.value)}
                        placeholder="Buscar livro, autor ou gênero..."
                        className="w-full bg-transparent outline-none text-[14px]"
                    />

                </div>

                <button
                    type="button"
                    onClick={() => abrir()}
                    className="bg-[#246B55] text-white h-[56px] px-6 rounded-xl flex items-center justify-center gap-2 font-semibold text-[14px] hover:bg-[#183F34] cursor-pointer"
                >
                    <span className="text-xl leading-none">+</span>
                    Adicionar livro
                </button>

                <button
                    type="button"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="bg-white border border-[#E7EAE5] h-[56px] px-5 rounded-xl flex items-center justify-center gap-2 text-[14px] hover:bg-[#F3F5F2] cursor-pointer"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24"
                         fill="none" stroke="#246B55" strokeWidth="1.8"
                         strokeLinecap="round">
                        <path d="M4 6h16M7 12h10M10 18h4"/>
                    </svg>
                    Filtros
                </button>

            </div>

            {mostrarFiltros && (
                <div className="flex flex-wrap gap-3 mt-7 shrink-0">

                    {["Todos", "Quero ler", "Lendo", "Lido"].map(status => (
                        <button
                            type="button"
                            key={status}
                            onClick={() => filtrar(status)}
                            className={
                                "rounded-full px-5 py-2 text-[13px] cursor-pointer " +
                                (filtro === status
                                    ? "bg-[#246B55] text-white font-semibold"
                                    : "bg-[#F3F5F2] text-[#75837B] hover:bg-[#DDEDE4]")
                            }
                        >
                            {status}
                        </button>
                    ))}

                </div>
            )}

            <p className="text-[#75837B] text-[13px] mt-6 mb-5 shrink-0">
                {pesquisa || filtro !== "Todos"
                    ? visiveis.length + " livros encontrados"
                    : livros.length + " livros cadastrados"}
            </p>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5 content-start flex-1 min-h-0">

                {livrosPagina.map(item => (
                    <article
                        key={item.id}
                        onClick={() => abrir(item)}
                        className="bg-white border border-[#E7EAE5] rounded-[15px] h-[180px] p-[15px] flex flex-col cursor-pointer hover:shadow-md min-w-0"
                    >

                        <div className="flex gap-4 min-w-0">

                            <img
                                src={capaLivro(item.titulo)}
                                alt={item.titulo}
                                className="w-[76px] h-[105px] rounded-md object-cover shrink-0"
                            />

                            <div className="min-w-0 flex-1">

                                <h2 className="text-[14px] font-bold leading-snug line-clamp-2">
                                    {item.titulo}
                                </h2>

                                <p className="text-[#75837B] text-[11px] mt-2 truncate">
                                    {item.autor}
                                </p>

                                <span className={
                                    "inline-block rounded-lg px-3 py-1 text-[11px] mt-3 " +
                                    (item.status === "Lendo"
                                        ? "bg-[#E8F2F8] text-[#3B7EAE]"
                                        : item.status === "Lido"
                                            ? "bg-[#FBEAED] text-[#BC5D64]"
                                            : "bg-[#FEF1D9] text-[#D28C34]")
                                }>
                                    {item.status}
                                </span>

                            </div>

                        </div>

                        {item.status === "Lendo" ? (
                            <div className="mt-auto">

                                <div className="h-[6px] bg-[#E7EAE5] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#246B55] rounded-full"
                                        style={{ width: progresso(item) + "%" }}
                                    ></div>
                                </div>

                            </div>
                        ) : (
                            <span className="text-[#75837B] text-lg ml-auto mt-auto">
                                ›
                            </span>
                        )}

                    </article>
                ))}

                {visiveis.length === 0 && (
                    <p className="text-[#75837B] text-sm col-span-full">
                        Nenhum livro encontrado.
                    </p>
                )}

            </section>

            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4 shrink-0">

                    <button
                        type="button"
                        onClick={() => setPagina(pagina - 1)}
                        disabled={pagina === 1}
                        className="border border-[#E7EAE5] bg-white rounded-lg px-4 py-2 text-sm disabled:opacity-40 hover:bg-[#DDEDE4] cursor-pointer"
                    >
                        Anterior
                    </button>

                    <span className="text-[13px] text-[#75837B]">
                        {pagina} de {totalPaginas}
                    </span>

                    <button
                        type="button"
                        onClick={() => setPagina(pagina + 1)}
                        disabled={pagina === totalPaginas}
                        className="border border-[#E7EAE5] bg-white rounded-lg px-4 py-2 text-sm disabled:opacity-40 hover:bg-[#DDEDE4] cursor-pointer"
                    >
                        Próxima
                    </button>

                </div>
            )}

            {formulario && (
                <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4">

                    <form
                        onSubmit={salvar}
                        className="bg-white rounded-2xl w-full max-w-[440px] p-7 max-h-[90vh] overflow-auto"
                    >

                        <h2 className="text-[24px] font-bold mb-5">
                            {livro.id ? "Editar livro" : "Adicionar livro"}
                        </h2>

                        <label htmlFor="titulo" className="block mb-2 text-sm font-semibold">
                            Título
                        </label>

                        <input
                            id="titulo"
                            required
                            maxLength={200}
                            value={livro.titulo}
                            onChange={evento => setLivro({
                                ...livro,
                                titulo: evento.target.value
                            })}
                            className="w-full border border-[#E7EAE5] p-3 rounded-lg mb-4 outline-none focus:border-[#246B55]"
                        />

                        <label htmlFor="autor" className="block mb-2 text-sm font-semibold">
                            Autor
                        </label>

                        <input
                            id="autor"
                            required
                            maxLength={150}
                            value={livro.autor}
                            onChange={evento => setLivro({
                                ...livro,
                                autor: evento.target.value
                            })}
                            className="w-full border border-[#E7EAE5] p-3 rounded-lg mb-4 outline-none focus:border-[#246B55]"
                        />

                        <label htmlFor="status" className="block mb-2 text-sm font-semibold">
                            Status
                        </label>

                        <select
                            id="status"
                            value={livro.status}
                            onChange={evento => mudarStatus(evento.target.value)}
                            className="w-full border border-[#E7EAE5] p-3 rounded-lg mb-4 outline-none focus:border-[#246B55]"
                        >
                            <option>Quero ler</option>
                            <option>Lendo</option>
                            <option>Lido</option>
                        </select>

                        <div className="flex gap-4">

                            <div className="flex-1">

                                <label htmlFor="total" className="block mb-2 text-sm font-semibold">
                                    Total de páginas
                                </label>

                                <input
                                    id="total"
                                    type="number"
                                    min="1"
                                    required
                                    value={livro.total_paginas}
                                    onChange={evento => mudarTotal(evento.target.value)}
                                    className="w-full border border-[#E7EAE5] p-3 rounded-lg mb-4 outline-none focus:border-[#246B55]"
                                />

                            </div>

                            <div className="flex-1">

                                <label htmlFor="pagina" className="block mb-2 text-sm font-semibold">
                                    Página atual
                                </label>

                                <input
                                    id="pagina"
                                    type="number"
                                    min="0"
                                    max={livro.total_paginas}
                                    required
                                    disabled={livro.status !== "Lendo"}
                                    value={
                                        livro.status === "Quero ler"
                                            ? 0
                                            : livro.status === "Lido"
                                                ? livro.total_paginas
                                                : livro.pagina_atual
                                    }
                                    onChange={evento => setLivro({
                                        ...livro,
                                        pagina_atual: evento.target.value
                                    })}
                                    className="w-full border border-[#E7EAE5] p-3 rounded-lg mb-4 outline-none focus:border-[#246B55] disabled:bg-[#F3F5F2] disabled:text-[#75837B]"
                                />

                            </div>

                        </div>

                        {erro && (
                            <p className="text-[#BC5D64] text-sm mb-3">
                                {erro}
                            </p>
                        )}

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => setFormulario(false)}
                                className="bg-[#F3F5F2] rounded-lg p-3 flex-1 hover:bg-[#E7EAE5] cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="bg-[#246B55] text-white rounded-lg p-3 flex-1 hover:bg-[#183F34] cursor-pointer"
                            >
                                Salvar
                            </button>

                        </div>

                        {livro.id && (
                            <button
                                type="button"
                                onClick={excluir}
                                className="text-[#BC5D64] text-sm mt-4 hover:underline cursor-pointer"
                            >
                                Excluir livro
                            </button>
                        )}

                    </form>

                </div>
            )}

            {!formulario && erro && (
                <p className="text-[#BC5D64] text-sm mt-3">
                    {erro}
                </p>
            )}

        </main>
    );
}
