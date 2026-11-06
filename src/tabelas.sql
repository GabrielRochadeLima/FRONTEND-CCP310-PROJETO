CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_paginas INTEGER NOT NULL,
    pagina_atual INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    ano INTEGER NOT NULL,
    quantidade_livros INTEGER NOT NULL
);
