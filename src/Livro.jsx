
import React from "react";

export function capaLivro(titulo) {
    let nome = (titulo || "").toLowerCase();

    if (nome.includes("messias")) return "/img/capa-messias.svg";
    if (nome.includes("duna")) return "/img/capa-duna.svg";
    if (nome.includes("hábito")) return "/img/capa-habitos.svg";
    if (nome.includes("senhor dos anéis")) return "/img/capa-aneis.svg";
    if (nome.includes("hobbit")) return "/img/capa-hobbit.svg";
    if (nome.includes("sapiens")) return "/img/capa-sapiens.svg";
    if (nome.includes("1984")) return "/img/capa-1984.svg";
    if (nome.includes("psicologia")) return "/img/capa-psicologia.svg";

    return "/img/capa-generica.svg";
}

export function percentual(livro) {
    let total = Number(livro.total_paginas);
    let atual = Number(livro.pagina_atual);

    if (total <= 0) {
        return 0;
    }

    return Math.min(100, Math.round(atual * 100 / total));
}

export default function Livro({ livro, editar, resumo = false }) {
    let porcentagem = percentual(livro);

    let cor = "bg-[#FEF1D9] text-[#D28C34]";

    if (livro.status === "Lendo") {
        cor = "bg-[#E8F2F8] text-[#3B7EAE]";
    }

    if (livro.status === "Lido") {
        cor = "bg-[#FBEAED] text-[#BC5D64]";
    }

    return (
        <article
            onClick={() => {
                if (!resumo) editar(livro);
            }}
            className={
                "bg-white border border-[#E7EAE5] rounded-[15px] p-4 flex flex-col min-w-0 hover:shadow-md " +
                (resumo ? "h-full" : "h-[180px] cursor-pointer")
            }
        >

            <div className="flex gap-4 min-w-0">

                <img
                    src={capaLivro(livro.titulo)}
                    alt={livro.titulo}
                    className="w-[76px] h-[105px] rounded-md object-cover shrink-0"
                />

                <div className="min-w-0 flex-1">

                    <h3 className="font-bold text-[14px] leading-snug line-clamp-2">
                        {livro.titulo}
                    </h3>

                    <p className="text-[#75837B] text-[11px] mt-2 truncate">
                        {livro.autor}
                    </p>

                    <span className={cor + " inline-block rounded-lg px-3 py-1 text-[11px] mt-3"}>
                        {livro.status}
                    </span>

                </div>

            </div>

            {livro.status === "Lendo" && (
                <div className="mt-auto pt-4">

                    <div className="bg-[#E7EAE5] h-[6px] rounded-full overflow-hidden">

                        <div
                            className="bg-[#246B55] h-full rounded-full"
                            style={{ width: porcentagem + "%" }}
                        ></div>

                    </div>

                    {resumo && (
                        <div className="flex justify-between text-[11px] mt-2">

                            <span className="text-[#75837B]">
                                {livro.pagina_atual} de {livro.total_paginas} páginas
                            </span>

                            <b>{porcentagem}%</b>

                        </div>
                    )}

                </div>
            )}

            {resumo ? (
                <button
                    type="button"
                    onClick={() => editar(livro)}
                    className="bg-[#F3F5F2] hover:bg-[#DDEDE4] rounded-lg py-2 text-[13px] mt-4 cursor-pointer"
                >
                    Continuar lendo
                </button>
            ) : (
                livro.status !== "Lendo" && (
                    <span className="text-[#75837B] text-lg ml-auto mt-auto">
                        ›
                    </span>
                )
            )}

        </article>
    );
}
