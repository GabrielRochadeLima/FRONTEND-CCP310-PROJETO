
import React, { useEffect, useState } from "react";

export default function Metas() {
    const [livros, setLivros] = useState([]);
    const [metas, setMetas] = useState([]);
    const [mostrar, setMostrar] = useState(false);
    const [metaEditando, setMetaEditando] = useState(null);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [quantidade, setQuantidade] = useState(20);
    const [erro, setErro] = useState("");

    let anoAtual = new Date().getFullYear();

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        try {
            let respostaLivros = await fetch("/api/livros");
            let respostaMetas = await fetch("/api/metas");

            if (respostaLivros.ok) {
                let dados = await respostaLivros.json();
                setLivros(dados);
            }

            if (respostaMetas.ok) {
                let dados = await respostaMetas.json();
                setMetas(dados);
            }
        } catch {
            setErro("Não foi possível carregar as informações.");
        }
    }

    let metaAtual = metas.find(item => Number(item.ano) === anoAtual);
    let total = metaAtual ? Number(metaAtual.quantidade_livros) : 0;

    let lidos = livros.filter(item => item.status === "Lido").length;
    let progresso = total > 0 ? Math.min(100, Math.round(lidos * 100 / total)) : 0;
    let faltam = Math.max(0, total - lidos);

    let maiorMeta = Math.max(1, ...metas.map(item => Number(item.quantidade_livros)));

    function novaMeta() {
        setMetaEditando(null);
        setAno(anoAtual);
        setQuantidade(20);
        setErro("");
        setMostrar(true);
    }

    function editarMeta(meta) {
        setMetaEditando(meta);
        setAno(meta.ano);
        setQuantidade(meta.quantidade_livros);
        setErro("");
        setMostrar(true);
    }

    async function salvar(evento) {
        evento.preventDefault();
        setErro("");

        let anoNumero = Number(ano);
        let quantidadeNumero = Number(quantidade);

        if (anoNumero < 2000 || anoNumero > 2100) {
            setErro("Informe um ano entre 2000 e 2100.");
            return;
        }

        if (quantidadeNumero < 1 || quantidadeNumero > 1000) {
            setErro("Informe uma quantidade entre 1 e 1000.");
            return;
        }

        try {
            let endereco = metaEditando
                ? "/api/metas/" + metaEditando.id
                : "/api/metas";

            let resposta = await fetch(endereco, {
                method: metaEditando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ano: anoNumero,
                    quantidade_livros: quantidadeNumero
                })
            });

            if (!resposta.ok) {
                let dados = await resposta.json();
                setErro(dados.mensagem || "Erro ao salvar a meta.");
                return;
            }

            setMostrar(false);
            carregar();
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        }
    }

    async function excluir() {
        if (!metaEditando) return;

        if (!window.confirm("Excluir esta meta?")) return;

        try {
            let resposta = await fetch("/api/metas/" + metaEditando.id, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                setErro("Erro ao excluir a meta.");
                return;
            }

            setMostrar(false);
            carregar();
        } catch {
            setErro("Não foi possível excluir a meta.");
        }
    }

    return (
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 pb-20 lg:pb-5 xl:h-full xl:flex xl:flex-col xl:gap-4 xl:overflow-hidden">

            <div className="flex items-center justify-between gap-4 shrink-0">

                <div>
                    <h1 className="text-[30px] lg:text-[32px] font-bold">
                        Minhas metas
                    </h1>

                    <p className="text-[#75837B] text-[14px] mt-1">
                        Acompanhe suas conquistas e crie novos objetivos de leitura.
                    </p>
                </div>

                <button
                    onClick={novaMeta}
                    className="bg-[#246B55] text-white rounded-xl px-5 py-3 text-[14px] font-semibold hover:bg-[#183F34] cursor-pointer shrink-0"
                >
                    + Nova meta
                </button>

            </div>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 xl:mt-0 shrink-0">

                <div className="bg-[#DDEDE4] border border-[#E7EAE5] rounded-[14px] h-[98px] px-5 flex items-center gap-4">
                    <span className="text-[#246B55] text-[24px]">◎</span>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {total}
                        </p>
                        <p className="text-[#75837B] text-[13px]">
                            Meta de {anoAtual}
                        </p>
                    </div>
                </div>

                <div className="bg-[#E8F2F8] border border-[#E7EAE5] rounded-[14px] h-[98px] px-5 flex items-center gap-4">
                    <span className="text-[#3B7EAE] text-[24px]">✓</span>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {lidos}
                        </p>
                        <p className="text-[#75837B] text-[13px]">
                            Lidos no total
                        </p>
                    </div>
                </div>

                <div className="bg-[#FEF1D9] border border-[#E7EAE5] rounded-[14px] h-[98px] px-5 flex items-center gap-4">
                    <span className="text-[#D28C34] text-[24px]">↗</span>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {progresso}%
                        </p>
                        <p className="text-[#75837B] text-[13px]">
                            Referência geral
                        </p>
                    </div>
                </div>

                <div className="bg-[#FBEAED] border border-[#E7EAE5] rounded-[14px] h-[98px] px-5 flex items-center gap-4">
                    <span className="text-[#BC5D64] text-[24px]">▣</span>

                    <div>
                        <p className="text-[28px] font-bold leading-tight">
                            {faltam}
                        </p>
                        <p className="text-[#75837B] text-[13px]">
                            Faltam
                        </p>
                    </div>
                </div>

            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5 mt-6 xl:mt-0 xl:flex-1 xl:min-h-0">

                <section className="bg-white border border-[#E7EAE5] rounded-2xl p-5 flex flex-col min-h-[300px] xl:min-h-0">

                    <h2 className="font-bold text-[19px]">
                        Metas ao longo dos anos
                    </h2>

                    <p className="text-[#75837B] text-[13px] mt-1">
                        Quantidade de livros planejados por ano
                    </p>

                    {metas.length > 0 ? (

                        <div className="flex-1 flex items-end justify-around gap-4 pt-8 min-h-0">

                            {[...metas]
                                .sort((a, b) => Number(a.ano) - Number(b.ano))
                                .map(item => (

                                    <div
                                        key={item.id}
                                        className="flex-1 max-w-[100px] h-full flex flex-col justify-end items-center"
                                    >

                                        <span className="text-[12px] font-semibold mb-2">
                                            {item.quantidade_livros}
                                        </span>

                                        <div
                                            className={
                                                "w-full max-w-[55px] rounded-t-md " +
                                                (Number(item.ano) === anoAtual
                                                    ? "bg-[#246B55]"
                                                    : "bg-[#DDEDE4]")
                                            }
                                            style={{
                                                height: Math.max(5, Number(item.quantidade_livros) * 75 / maiorMeta) + "%"
                                            }}
                                        ></div>

                                        <span className="text-[#75837B] text-[12px] mt-3">
                                            {item.ano}
                                        </span>

                                    </div>

                                ))}

                        </div>

                    ) : (

                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-[#75837B] text-sm">
                                Nenhuma meta cadastrada.
                            </p>
                        </div>

                    )}

                </section>

                <section className="bg-white border border-[#E7EAE5] rounded-2xl p-5 flex flex-col min-h-[300px] xl:min-h-0">

                    <h2 className="font-bold text-[19px]">
                        Minhas metas
                    </h2>

                    <div className="flex-1 flex flex-col justify-around gap-3 mt-4 min-h-0 overflow-y-auto">

                        {metas.length > 0 ? (

                            metas.map(item => (

                                <button
                                    key={item.id}
                                    onClick={() => editarMeta(item)}
                                    className="text-left rounded-lg p-2 hover:bg-[#F3F5F2] cursor-pointer"
                                >

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="font-semibold text-[13px]">
                                            Ler {item.quantidade_livros} livros em {item.ano}
                                        </span>

                                        <span className="text-[#75837B] text-xl">
                                            ›
                                        </span>

                                    </div>

                                    <div className="bg-[#E7EAE5] h-[8px] rounded-full mt-3 overflow-hidden">

                                        {Number(item.ano) === anoAtual && (
                                            <div
                                                className="bg-[#246B55] h-full rounded-full"
                                                style={{ width: progresso + "%" }}
                                            ></div>
                                        )}

                                    </div>

                                </button>

                            ))

                        ) : (

                            <p className="text-[#75837B] text-sm">
                                Clique em Nova meta para começar.
                            </p>

                        )}

                    </div>

                </section>

            </div>

            <section className="bg-white border border-[#E7EAE5] rounded-2xl px-6 py-5 mt-5 xl:mt-0 shrink-0 flex items-center justify-between gap-4">

                <div>
                    <h2 className="text-[17px] font-bold">
                        Uma meta de cada vez
                    </h2>

                    <p className="text-[#75837B] text-[13px] mt-2">
                        Continue lendo e mantenha seu ritmo. Cada livro conta.
                    </p>
                </div>

                <button
                    onClick={() => metaAtual ? editarMeta(metaAtual) : novaMeta()}
                    className="border border-[#E7EAE5] rounded-xl px-5 py-3 text-[#246B55] font-semibold text-[13px] hover:bg-[#DDEDE4] cursor-pointer shrink-0"
                >
                    Editar metas
                </button>

            </section>

            {mostrar && (

                <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4">

                    <form
                        onSubmit={salvar}
                        className="bg-white rounded-2xl p-7 w-full max-w-[390px]"
                    >

                        <h2 className="text-[22px] font-bold mb-5">
                            {metaEditando ? "Editar meta" : "Adicionar meta"}
                        </h2>

                        <label className="block mb-2 text-[14px] font-semibold">
                            Ano da meta
                        </label>

                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            required
                            value={ano}
                            onChange={evento => setAno(evento.target.value)}
                            className="border border-[#E7EAE5] rounded-xl p-3 w-full mb-5 outline-none focus:border-[#246B55]"
                        />

                        <label className="block mb-2 text-[14px] font-semibold">
                            Quantidade de livros
                        </label>

                        <input
                            type="number"
                            min="1"
                            max="1000"
                            required
                            value={quantidade}
                            onChange={evento => setQuantidade(evento.target.value)}
                            className="border border-[#E7EAE5] rounded-xl p-3 w-full mb-5 outline-none focus:border-[#246B55]"
                        />

                        {erro && (
                            <p className="text-[#BC5D64] text-sm mb-3">
                                {erro}
                            </p>
                        )}

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => setMostrar(false)}
                                className="bg-[#F3F5F2] rounded-xl p-3 flex-1 hover:bg-[#E7EAE5]"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="bg-[#246B55] text-white rounded-xl p-3 flex-1 hover:bg-[#183F34]"
                            >
                                Salvar
                            </button>

                        </div>

                        {metaEditando && (
                            <button
                                type="button"
                                onClick={excluir}
                                className="text-[#BC5D64] text-sm mt-4 hover:underline"
                            >
                                Excluir meta
                            </button>
                        )}

                    </form>

                </div>

            )}

        </main>
    );
}
