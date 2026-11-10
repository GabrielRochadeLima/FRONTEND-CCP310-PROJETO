/**
 * LeituraJá - Prototipação de Alta Fidelidade
 * JavaScript Puro (Vanilla JS) com dados voláteis em memória
 */

// ==========================================================================
// Base Inicial em Memória (Dados Voláteis)
// ==========================================================================

let nextBookId = 9;
let nextGoalId = 4;

let currentUser = {
    id: 1,
    nome: "Gabriel Lima",
    email: "gabriel@fei.edu.br"
};

let livros = [
    {
        id: 1,
        titulo: "Duna",
        autor: "Frank Herbert",
        status: "Lendo",
        total_paginas: 680,
        pagina_atual: 340
    },
    {
        id: 2,
        titulo: "Sapiens: Uma Breve História da Humanidade",
        autor: "Yuval Noah Harari",
        status: "Lendo",
        total_paginas: 464,
        pagina_atual: 200
    },
    {
        id: 3,
        titulo: "Hábitos Atômicos",
        autor: "James Clear",
        status: "Lido",
        total_paginas: 320,
        pagina_atual: 320
    },
    {
        id: 4,
        titulo: "1984",
        autor: "George Orwell",
        status: "Lido",
        total_paginas: 416,
        pagina_atual: 416
    },
    {
        id: 5,
        titulo: "O Messias de Duna",
        autor: "Frank Herbert",
        status: "Quero ler",
        total_paginas: 272,
        pagina_atual: 0
    },
    {
        id: 6,
        titulo: "O Hobbit",
        autor: "J.R.R. Tolkien",
        status: "Quero ler",
        total_paginas: 336,
        pagina_atual: 0
    },
    {
        id: 7,
        titulo: "O Senhor dos Anéis: A Sociedade do Anel",
        autor: "J.R.R. Tolkien",
        status: "Lido",
        total_paginas: 576,
        pagina_atual: 576
    },
    {
        id: 8,
        titulo: "A Psicologia Financeira",
        autor: "Morgan Housel",
        status: "Quero ler",
        total_paginas: 304,
        pagina_atual: 0
    }
];

let metas = [
    { id: 1, ano: 2024, quantidade_livros: 15 },
    { id: 2, ano: 2025, quantidade_livros: 18 },
    { id: 3, ano: 2026, quantidade_livros: 24 }
];

// Estado da visualização da Biblioteca
let libraryState = {
    search: "",
    filter: "Todos",
    showFilters: true,
    page: 1,
    perPage: 8
};

// Livro e Meta sendo editados atualmente no modal
let editingBookId = null;
let editingGoalId = null;

// ==========================================================================
// Utilitários de Capa e Porcentagem
// ==========================================================================

function getBookCover(titulo) {
    const nome = (titulo || "").toLowerCase();
    if (nome.includes("messias")) return "assets/capa-messias.svg";
    if (nome.includes("duna")) return "assets/capa-duna.svg";
    if (nome.includes("hábito") || nome.includes("habito")) return "assets/capa-habitos.svg";
    if (nome.includes("anéis") || nome.includes("aneis") || nome.includes("senhor dos")) return "assets/capa-aneis.svg";
    if (nome.includes("hobbit")) return "assets/capa-hobbit.svg";
    if (nome.includes("sapiens")) return "assets/capa-sapiens.svg";
    if (nome.includes("1984")) return "assets/capa-1984.svg";
    if (nome.includes("psicologia")) return "assets/capa-psicologia.svg";
    return "assets/capa-generica.svg";
}

function calculateProgress(paginaAtual, totalPaginas) {
    const total = Number(totalPaginas);
    const atual = Number(paginaAtual);
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((atual * 100) / total)));
}

// ==========================================================================
// Sistema de Roteamento SPA
// ==========================================================================

function navigateTo(viewName) {
    if (!viewName) viewName = "inicio";

    // Se estiver deslogado e tentar ir para outra tela, vai para login
    if (!currentUser && viewName !== "login") {
        viewName = "login";
    }

    // Se estiver logado e tentar abrir login, vai para início
    if (currentUser && viewName === "login") {
        viewName = "inicio";
    }

    window.location.hash = viewName;

    // Atualiza visibilidade das seções
    document.querySelectorAll(".view-section").forEach(sec => {
        sec.classList.remove("active");
    });
    const targetSection = document.getElementById("view-" + viewName);
    if (targetSection) {
        targetSection.classList.add("active");
    }

    // Atualiza links da barra de navegação desktop e mobile
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.getAttribute("data-view") === viewName);
    });
    document.querySelectorAll(".mobile-nav-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-view") === viewName);
    });

    // Controla exibição do cabeçalho e menu inferior (ocultos na tela de login)
    const headerEl = document.getElementById("app-header");
    const mobileNavEl = document.getElementById("mobile-nav");
    if (viewName === "login") {
        if (headerEl) headerEl.style.display = "none";
        if (mobileNavEl) mobileNavEl.style.display = "none";
    } else {
        if (headerEl) headerEl.style.display = "block";
        if (mobileNavEl) mobileNavEl.style.display = "flex";
    }

    // Renderiza a tela específica
    if (viewName === "inicio") renderHomeView();
    if (viewName === "biblioteca") renderLibraryView();
    if (viewName === "metas") renderGoalsView();
    if (viewName === "login") renderLoginView();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================================================
// Renderização: Tela Início
// ==========================================================================

function renderHomeView() {
    const lendo = livros.filter(l => l.status === "Lendo");
    const lidos = livros.filter(l => l.status === "Lido");
    const queroLer = livros.filter(l => l.status === "Quero ler");

    // Nome no banner
    const welcomeTitle = document.getElementById("home-welcome-title");
    if (welcomeTitle && currentUser) {
        welcomeTitle.textContent = `Bem-vindo de volta, ${currentUser.nome.split(" ")[0]}!`;
    }

    // Métricas dos cards superiores
    document.getElementById("metric-library-count").textContent = livros.length;
    document.getElementById("metric-reading-count").textContent = lendo.length;
    document.getElementById("metric-want-count").textContent = queroLer.length;
    document.getElementById("metric-read-count").textContent = lidos.length;

    // Leituras em andamento
    const readingGrid = document.getElementById("home-reading-grid");
    if (readingGrid) {
        if (lendo.length === 0) {
            readingGrid.innerHTML = `
                <div class="empty-state">
                    Você ainda não possui livros marcados como "Lendo".
                </div>
            `;
        } else {
            readingGrid.innerHTML = lendo.slice(0, 3).map(livro => {
                const pct = calculateProgress(livro.pagina_atual, livro.total_paginas);
                return `
                    <article class="card-reading-home">
                        <div class="card-top">
                            <img src="${getBookCover(livro.titulo)}" alt="${livro.titulo}" class="book-cover-thumb">
                            <div class="book-meta">
                                <h3 class="book-title" title="${livro.titulo}">${livro.titulo}</h3>
                                <p class="book-author" title="${livro.autor}">${livro.autor}</p>
                                <span class="badge reading">Lendo</span>
                            </div>
                        </div>
                        <div style="margin-top: auto; padding-top: 14px;">
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pct}%"></div>
                            </div>
                            <div class="progress-info">
                                <span>${livro.pagina_atual || 0} de ${livro.total_paginas} páginas</span>
                                <b>${pct}%</b>
                            </div>
                            <button type="button" class="btn-continue" onclick="openBookModal(${livro.id})">
                                Continuar lendo
                            </button>
                        </div>
                    </article>
                `;
            }).join("");
        }
    }

    // Painel Lateral: Meta Anual
    const anoAtual = new Date().getFullYear();
    const metaAtual = metas.find(m => Number(m.ano) === anoAtual) || { ano: anoAtual, quantidade_livros: 20 };
    const pctMeta = metaAtual.quantidade_livros > 0
        ? Math.min(100, Math.round((lidos.length * 100) / metaAtual.quantidade_livros))
        : 0;

    document.getElementById("home-goal-text").textContent = `${lidos.length} de ${metaAtual.quantidade_livros} livros`;
    document.getElementById("home-goal-pct").textContent = `${pctMeta}%`;
    document.getElementById("home-goal-progress").style.width = `${pctMeta}%`;

    // Painel Lateral: Próximo da lista
    const nextBookBox = document.getElementById("home-next-book");
    if (nextBookBox) {
        const proximo = queroLer[0];
        if (proximo) {
            nextBookBox.innerHTML = `
                <div class="next-book-item" onclick="openBookModal(${proximo.id})">
                    <img src="${getBookCover(proximo.titulo)}" alt="${proximo.titulo}" class="book-cover-thumb" style="width: 60px; height: 84px;">
                    <div style="min-width: 0; flex: 1;">
                        <p class="book-title" title="${proximo.titulo}">${proximo.titulo}</p>
                        <p class="book-author" title="${proximo.autor}">${proximo.autor}</p>
                        <span style="color: var(--status-want-text); font-size: 12px; font-weight: 600; display: block; margin-top: 6px;">
                            Quero ler →
                        </span>
                    </div>
                </div>
            `;
        } else {
            nextBookBox.innerHTML = `
                <p style="color: var(--text-muted); font-size: 13px; margin-top: 16px;">
                    Nenhum livro marcado como "Quero ler".
                </p>
            `;
        }
    }
}

// ==========================================================================
// Renderização: Tela Minha Biblioteca
// ==========================================================================

function renderLibraryView() {
    const inputSearch = document.getElementById("library-search-input");
    if (inputSearch && inputSearch.value !== libraryState.search) {
        inputSearch.value = libraryState.search;
    }

    // Filtragem
    const filtrados = livros.filter(item => {
        const matchesStatus = libraryState.filter === "Todos" || item.status === libraryState.filter;
        const textoCompleto = `${item.titulo} ${item.autor}`.toLowerCase();
        const matchesSearch = textoCompleto.includes(libraryState.search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Contagem
    const countEl = document.getElementById("library-count-text");
    if (countEl) {
        if (libraryState.search || libraryState.filter !== "Todos") {
            countEl.textContent = `${filtrados.length} livro(s) encontrado(s)`;
        } else {
            countEl.textContent = `${livros.length} livro(s) cadastrado(s)`;
        }
    }

    // Pílulas de filtro ativas
    document.querySelectorAll(".filter-pill").forEach(pill => {
        pill.classList.toggle("active", pill.getAttribute("data-status") === libraryState.filter);
    });

    // Paginação
    const totalPages = Math.ceil(filtrados.length / libraryState.perPage) || 1;
    if (libraryState.page > totalPages) libraryState.page = totalPages;

    const inicio = (libraryState.page - 1) * libraryState.perPage;
    const livrosPagina = filtrados.slice(inicio, inicio + libraryState.perPage);

    // Grid de livros
    const grid = document.getElementById("library-grid");
    if (grid) {
        if (filtrados.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    Nenhum livro encontrado com os filtros atuais.
                </div>
            `;
        } else {
            grid.innerHTML = livrosPagina.map(item => {
                let badgeClass = "want";
                if (item.status === "Lendo") badgeClass = "reading";
                if (item.status === "Lido") badgeClass = "read";

                const pct = calculateProgress(item.pagina_atual, item.total_paginas);

                return `
                    <article class="book-card-item" onclick="openBookModal(${item.id})">
                        <div class="card-top">
                            <img src="${getBookCover(item.titulo)}" alt="${item.titulo}" class="book-cover-thumb">
                            <div class="book-meta">
                                <h2 class="book-title" title="${item.titulo}">${item.titulo}</h2>
                                <p class="book-author" title="${item.autor}">${item.autor}</p>
                                <span class="badge ${badgeClass}">${item.status}</span>
                            </div>
                        </div>
                        ${item.status === "Lendo" ? `
                            <div style="margin-top: auto; padding-top: 10px;">
                                <div class="progress-bar-bg" style="height: 6px;">
                                    <div class="progress-bar-fill" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        ` : `
                            <span class="card-arrow">›</span>
                        `}
                    </article>
                `;
            }).join("");
        }
    }

    // Barra de paginação
    const pagRow = document.getElementById("library-pagination");
    if (pagRow) {
        if (totalPages > 1) {
            pagRow.style.display = "flex";
            document.getElementById("btn-page-prev").disabled = libraryState.page === 1;
            document.getElementById("btn-page-next").disabled = libraryState.page === totalPages;
            document.getElementById("library-page-indicator").textContent = `${libraryState.page} de ${totalPages}`;
        } else {
            pagRow.style.display = "none";
        }
    }
}

// ==========================================================================
// Renderização: Tela Metas
// ==========================================================================

function renderGoalsView() {
    const anoAtual = new Date().getFullYear();
    const metaAtual = metas.find(m => Number(m.ano) === anoAtual);
    const totalMetaAtual = metaAtual ? Number(metaAtual.quantidade_livros) : 0;

    const lidosTotal = livros.filter(l => l.status === "Lido").length;
    const progressoAtual = totalMetaAtual > 0
        ? Math.min(100, Math.round((lidosTotal * 100) / totalMetaAtual))
        : 0;
    const faltam = Math.max(0, totalMetaAtual - lidosTotal);

    // Cards Superiores
    document.getElementById("goal-card-year-title").textContent = `Meta de ${anoAtual}`;
    document.getElementById("goal-metric-year").textContent = totalMetaAtual;
    document.getElementById("goal-metric-read").textContent = lidosTotal;
    document.getElementById("goal-metric-pct").textContent = `${progressoAtual}%`;
    document.getElementById("goal-metric-missing").textContent = faltam;

    // Gráfico de Colunas Anuais
    const chartContainer = document.getElementById("goals-chart");
    if (chartContainer) {
        if (metas.length === 0) {
            chartContainer.innerHTML = `<div class="empty-state">Nenhuma meta cadastrada.</div>`;
        } else {
            const metasOrdenadas = [...metas].sort((a, b) => Number(a.ano) - Number(b.ano));
            const maiorMeta = Math.max(1, ...metasOrdenadas.map(m => Number(m.quantidade_livros)));

            chartContainer.innerHTML = metasOrdenadas.map(item => {
                const isCurrent = Number(item.ano) === anoAtual;
                const alturaPorcentagem = Math.max(10, Math.round((Number(item.quantidade_livros) * 80) / maiorMeta));

                return `
                    <div class="chart-bar-group ${isCurrent ? 'current' : ''}" onclick="openGoalModal(${item.id})">
                        <span class="chart-bar-val">${item.quantidade_livros}</span>
                        <div class="chart-bar-fill" style="height: ${alturaPorcentagem}%"></div>
                        <span class="chart-bar-year">${item.ano}</span>
                    </div>
                `;
            }).join("");
        }
    }

    // Lista Lateral de Metas
    const goalsList = document.getElementById("goals-list");
    if (goalsList) {
        if (metas.length === 0) {
            goalsList.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">Clique em Nova meta para começar.</p>`;
        } else {
            const metasOrdenadas = [...metas].sort((a, b) => Number(b.ano) - Number(a.ano));
            goalsList.innerHTML = metasOrdenadas.map(item => {
                const isCurrent = Number(item.ano) === anoAtual;
                return `
                    <button type="button" class="goal-item-row" onclick="openGoalModal(${item.id})">
                        <div class="goal-item-top">
                            <span>Ler ${item.quantidade_livros} livros em ${item.ano}</span>
                            <span style="color: var(--text-muted); font-size: 18px;">›</span>
                        </div>
                        <div class="progress-bar-bg" style="height: 7px; margin-top: 8px;">
                            ${isCurrent ? `
                                <div class="progress-bar-fill" style="width: ${progressoAtual}%"></div>
                            ` : `
                                <div class="progress-bar-fill" style="width: 100%; background-color: var(--primary-light);"></div>
                            `}
                        </div>
                    </button>
                `;
            }).join("");
        }
    }
}

// ==========================================================================
// Renderização: Tela Login / Cadastro
// ==========================================================================

let isRegisterMode = false;

function renderLoginView() {
    const titleEl = document.getElementById("auth-title");
    const subEl = document.getElementById("auth-subtitle");
    const submitBtn = document.getElementById("auth-submit-btn");
    const togglePrompt = document.getElementById("auth-toggle-prompt");
    const toggleBtn = document.getElementById("auth-toggle-btn");
    const nameField = document.getElementById("auth-name-group");
    const forgotLink = document.getElementById("auth-forgot-link");
    const errorEl = document.getElementById("auth-error-msg");

    if (errorEl) errorEl.textContent = "";

    if (isRegisterMode) {
        titleEl.textContent = "Criar conta";
        subEl.textContent = "Crie sua conta para começar suas leituras.";
        submitBtn.textContent = "Cadastrar";
        togglePrompt.textContent = "Já tem uma conta?";
        toggleBtn.textContent = "Entrar";
        nameField.style.display = "block";
        forgotLink.style.display = "none";
    } else {
        titleEl.textContent = "Bem-vindo de volta";
        subEl.textContent = "Entre na sua conta para continuar lendo.";
        submitBtn.textContent = "Entrar";
        togglePrompt.textContent = "Ainda não tem uma conta?";
        toggleBtn.textContent = "Cadastre-se";
        nameField.style.display = "none";
        forgotLink.style.display = "block";
    }
}

// ==========================================================================
// Modais: Livro (Adicionar / Editar / Excluir)
// ==========================================================================

function openBookModal(bookId) {
    editingBookId = bookId || null;
    const modal = document.getElementById("modal-book");
    const titleEl = document.getElementById("modal-book-title");
    const deleteBtn = document.getElementById("btn-delete-book");
    const errorEl = document.getElementById("book-form-error");

    errorEl.textContent = "";

    const inputTitulo = document.getElementById("book-title-input");
    const inputAutor = document.getElementById("book-author-input");
    const selectStatus = document.getElementById("book-status-select");
    const inputTotal = document.getElementById("book-total-input");
    const inputAtual = document.getElementById("book-current-input");

    if (editingBookId) {
        const book = livros.find(l => l.id === editingBookId);
        if (!book) return;

        titleEl.textContent = "Editar livro";
        deleteBtn.style.display = "inline-block";

        inputTitulo.value = book.titulo;
        inputAutor.value = book.autor;
        selectStatus.value = book.status;
        inputTotal.value = book.total_paginas;
        inputAtual.value = book.pagina_atual;
    } else {
        titleEl.textContent = "Adicionar livro";
        deleteBtn.style.display = "none";

        inputTitulo.value = "";
        inputAutor.value = "";
        selectStatus.value = "Quero ler";
        inputTotal.value = 100;
        inputAtual.value = 0;
    }

    handleStatusChange();
    modal.classList.add("open");
}

function closeBookModal() {
    document.getElementById("modal-book").classList.remove("open");
    editingBookId = null;
}

function handleStatusChange() {
    const status = document.getElementById("book-status-select").value;
    const inputTotal = document.getElementById("book-total-input");
    const inputAtual = document.getElementById("book-current-input");

    const total = Number(inputTotal.value) || 0;

    if (status === "Quero ler") {
        inputAtual.value = 0;
        inputAtual.disabled = true;
    } else if (status === "Lido") {
        inputAtual.value = total;
        inputAtual.disabled = true;
    } else {
        inputAtual.disabled = false;
        if (Number(inputAtual.value) >= total && total > 0) {
            inputAtual.value = Math.max(0, Math.floor(total / 2));
        }
    }
}

function handleTotalPagesChange() {
    const status = document.getElementById("book-status-select").value;
    const inputTotal = document.getElementById("book-total-input");
    const inputAtual = document.getElementById("book-current-input");

    const total = Number(inputTotal.value) || 0;
    if (status === "Lido") {
        inputAtual.value = total;
    }
}

function saveBook(e) {
    e.preventDefault();
    const errorEl = document.getElementById("book-form-error");
    errorEl.textContent = "";

    const titulo = document.getElementById("book-title-input").value.trim();
    const autor = document.getElementById("book-author-input").value.trim();
    const status = document.getElementById("book-status-select").value;
    const totalPaginas = Number(document.getElementById("book-total-input").value);
    let paginaAtual = Number(document.getElementById("book-current-input").value);

    if (!titulo) {
        errorEl.textContent = "Informe o título do livro.";
        return;
    }
    if (!autor) {
        errorEl.textContent = "Informe o autor do livro.";
        return;
    }
    if (totalPaginas < 1) {
        errorEl.textContent = "O livro precisa ter pelo menos 1 página.";
        return;
    }

    if (status === "Quero ler") paginaAtual = 0;
    if (status === "Lido") paginaAtual = totalPaginas;

    if (paginaAtual < 0 || paginaAtual > totalPaginas) {
        errorEl.textContent = "A página atual deve estar entre 0 e o total de páginas.";
        return;
    }

    if (editingBookId) {
        // Atualiza livro existente
        const index = livros.findIndex(l => l.id === editingBookId);
        if (index !== -1) {
            livros[index] = {
                ...livros[index],
                titulo,
                autor,
                status,
                total_paginas: totalPaginas,
                pagina_atual: paginaAtual
            };
        }
    } else {
        // Novo livro
        const novoLivro = {
            id: nextBookId++,
            titulo,
            autor,
            status,
            total_paginas: totalPaginas,
            pagina_atual: paginaAtual
        };
        livros.unshift(novoLivro);
    }

    closeBookModal();
    renderHomeView();
    renderLibraryView();
    renderGoalsView();
}

function deleteCurrentBook() {
    if (!editingBookId) return;
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    livros = livros.filter(l => l.id !== editingBookId);
    closeBookModal();
    renderHomeView();
    renderLibraryView();
    renderGoalsView();
}

// ==========================================================================
// Modais: Meta (Adicionar / Editar / Excluir)
// ==========================================================================

function openGoalModal(goalId) {
    editingGoalId = goalId || null;
    const modal = document.getElementById("modal-goal");
    const titleEl = document.getElementById("modal-goal-title");
    const deleteBtn = document.getElementById("btn-delete-goal");
    const errorEl = document.getElementById("goal-form-error");

    errorEl.textContent = "";

    const inputAno = document.getElementById("goal-year-input");
    const inputQtd = document.getElementById("goal-qty-input");

    if (editingGoalId) {
        const meta = metas.find(m => m.id === editingGoalId);
        if (!meta) return;

        titleEl.textContent = "Editar meta";
        deleteBtn.style.display = "inline-block";
        inputAno.value = meta.ano;
        inputQtd.value = meta.quantidade_livros;
    } else {
        titleEl.textContent = "Adicionar meta";
        deleteBtn.style.display = "none";
        inputAno.value = new Date().getFullYear();
        inputQtd.value = 20;
    }

    modal.classList.add("open");
}

function closeGoalModal() {
    document.getElementById("modal-goal").classList.remove("open");
    editingGoalId = null;
}

function saveGoal(e) {
    e.preventDefault();
    const errorEl = document.getElementById("goal-form-error");
    errorEl.textContent = "";

    const ano = Number(document.getElementById("goal-year-input").value);
    const quantidade = Number(document.getElementById("goal-qty-input").value);

    if (ano < 2000 || ano > 2100) {
        errorEl.textContent = "Informe um ano válido entre 2000 e 2100.";
        return;
    }
    if (quantidade < 1 || quantidade > 1000) {
        errorEl.textContent = "Informe uma quantidade de livros entre 1 e 1000.";
        return;
    }

    if (editingGoalId) {
        const index = metas.findIndex(m => m.id === editingGoalId);
        if (index !== -1) {
            metas[index] = { ...metas[index], ano, quantidade_livros: quantidade };
        }
    } else {
        // Se já existir meta com esse ano, atualiza
        const existente = metas.find(m => m.ano === ano);
        if (existente) {
            existente.quantidade_livros = quantidade;
        } else {
            metas.push({
                id: nextGoalId++,
                ano,
                quantidade_livros: quantidade
            });
        }
    }

    closeGoalModal();
    renderHomeView();
    renderGoalsView();
}

function deleteCurrentGoal() {
    if (!editingGoalId) return;
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return;

    metas = metas.filter(m => m.id !== editingGoalId);
    closeGoalModal();
    renderHomeView();
    renderGoalsView();
}

// ==========================================================================
// Inicialização de Eventos
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Roteamento por hash
    window.addEventListener("hashchange", () => {
        const hash = window.location.hash.replace("#", "") || "inicio";
        navigateTo(hash);
    });

    // Links de navegação desktop
    document.querySelectorAll(".nav-link").forEach(btn => {
        btn.addEventListener("click", () => {
            const view = btn.getAttribute("data-view");
            navigateTo(view);
        });
    });

    // Links de navegação mobile
    document.querySelectorAll(".mobile-nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const view = btn.getAttribute("data-view");
            navigateTo(view);
        });
    });

    // Logo vai para início
    document.getElementById("header-logo-link").addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("inicio");
    });

    // Busca rápida no Header
    const headerSearchForm = document.getElementById("header-search-form");
    const headerSearchInput = document.getElementById("header-search-input");
    if (headerSearchForm) {
        headerSearchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const termo = headerSearchInput.value.trim();
            libraryState.search = termo;
            libraryState.page = 1;
            navigateTo("biblioteca");
        });
    }

    // Busca na Biblioteca
    const librarySearchInput = document.getElementById("library-search-input");
    if (librarySearchInput) {
        librarySearchInput.addEventListener("input", (e) => {
            libraryState.search = e.target.value;
            libraryState.page = 1;
            renderLibraryView();
        });
    }

    // Pílulas de filtro da Biblioteca
    document.querySelectorAll(".filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            libraryState.filter = pill.getAttribute("data-status");
            libraryState.page = 1;
            renderLibraryView();
        });
    });

    // Botão de toggle dos filtros da Biblioteca
    const btnToggleFilters = document.getElementById("btn-toggle-filters");
    const filterPillsRow = document.getElementById("filter-pills-row");
    if (btnToggleFilters && filterPillsRow) {
        btnToggleFilters.addEventListener("click", () => {
            libraryState.showFilters = !libraryState.showFilters;
            filterPillsRow.style.display = libraryState.showFilters ? "flex" : "none";
        });
    }

    // Paginação da Biblioteca
    const btnPrev = document.getElementById("btn-page-prev");
    const btnNext = document.getElementById("btn-page-next");
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (libraryState.page > 1) {
                libraryState.page--;
                renderLibraryView();
            }
        });
    }
    if (btnNext) {
        btnNext.addEventListener("click", () => {
            libraryState.page++;
            renderLibraryView();
        });
    }

    // Menu do Usuário no Header
    const userBtn = document.getElementById("user-profile-btn");
    const userMenu = document.getElementById("user-menu-dropdown");
    if (userBtn && userMenu) {
        userBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            userMenu.classList.toggle("open");
        });
        document.addEventListener("click", () => {
            userMenu.classList.remove("open");
        });
    }

    // Ação de Sair da Conta
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            currentUser = null;
            navigateTo("login");
        });
    }

    // Submissão do Formulário de Login / Cadastro
    const authForm = document.getElementById("auth-form");
    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("auth-email").value.trim();
            const senha = document.getElementById("auth-senha").value;
            const nomeInput = document.getElementById("auth-nome");
            const errorEl = document.getElementById("auth-error-msg");

            if (!email || !senha) {
                errorEl.textContent = "Preencha todos os campos.";
                return;
            }

            if (senha.length < 6) {
                errorEl.textContent = "A senha deve ter pelo menos 6 caracteres.";
                return;
            }

            if (isRegisterMode) {
                const nome = nomeInput.value.trim();
                if (!nome) {
                    errorEl.textContent = "Informe seu nome completo.";
                    return;
                }
                currentUser = { id: 99, nome, email };
            } else {
                currentUser = {
                    id: 1,
                    nome: email.includes("gabriel") ? "Gabriel Lima" : "Leitor LeituraJá",
                    email: email
                };
            }

            // Atualiza informações no menu do usuário
            document.getElementById("user-name-display").textContent = currentUser.nome;
            document.getElementById("user-email-display").textContent = currentUser.email;

            navigateTo("inicio");
        });
    }

    // Alternar entre Login e Cadastro
    const toggleAuthBtn = document.getElementById("auth-toggle-btn");
    if (toggleAuthBtn) {
        toggleAuthBtn.addEventListener("click", () => {
            isRegisterMode = !isRegisterMode;
            renderLoginView();
        });
    }

    // Eventos do Modal Livro
    document.getElementById("book-form").addEventListener("submit", saveBook);
    document.getElementById("btn-cancel-book").addEventListener("click", closeBookModal);
    document.getElementById("btn-delete-book").addEventListener("click", deleteCurrentBook);
    document.getElementById("book-status-select").addEventListener("change", handleStatusChange);
    document.getElementById("book-total-input").addEventListener("input", handleTotalPagesChange);

    // Eventos do Modal Meta
    document.getElementById("goal-form").addEventListener("submit", saveGoal);
    document.getElementById("btn-cancel-goal").addEventListener("click", closeGoalModal);
    document.getElementById("btn-delete-goal").addEventListener("click", deleteCurrentGoal);

    // Fechar modais ao clicar no fundo
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) {
                closeBookModal();
                closeGoalModal();
            }
        });
    });

    // Inicia rota atual
    const initialView = window.location.hash.replace("#", "") || "inicio";
    navigateTo(initialView);
});
