# Arquitetura de Informação e Fluxo do Usuário

## 1. Arquitetura de Informação

A plataforma foi organizada para que o usuário consiga encontrar seus livros, acompanhar leituras e consultar metas de forma simples.

```mermaid
flowchart TD
    A["Plataforma de Leitura"]
    A --> B["Início"]
    A --> C["Minha Biblioteca"]
    A --> D["Pesquisar Livros"]
    A --> E["Metas"]
    C --> F["Quero ler / Lendo / Lido"]
    C --> G["Atualizar progresso"]
    D --> H["Adicionar livro"]
    E --> I["Criar / Consultar metas"]
```

## 2. Fluxo do Usuário

### 2.1 Cadastrar livro

O usuário pesquisa um título e adiciona à biblioteca.

```mermaid
flowchart LR
    A["Pesquisar"] --> B{"Encontrou?"}
    B -->|Sim| C["Adicionar livro"]
    B -->|Não| D["Nova pesquisa"]
    D --> A
    C --> E([Concluído])
```

### 2.2 Organizar biblioteca

O usuário seleciona um livro e altera sua situação de leitura.

```mermaid
flowchart LR
    A["Biblioteca"] --> B{"Livro disponível?"}
    B -->|Sim| C["Alterar situação"]
    B -->|Não| D["Pesquisar livro"]
    C --> E([Salvar])
```

### 2.3 Atualizar progresso

O usuário informa a página atual do livro.

```mermaid
flowchart LR
    A["Selecionar livro"] --> B["Informar página"]
    B --> C{"Valor válido?"}
    C -->|Sim| D([Salvar])
    C -->|Não| B
```

### 2.4 Consultar metas

O usuário acessa suas metas para verificar o progresso.

```mermaid
flowchart LR
    A["Metas"] --> B{"Existe meta?"}
    B -->|Sim| C["Ver progresso"]
    B -->|Não| D["Criar meta"]
    D --> C
```

## 3. Considerações finais

Os fluxos mostram como o usuário poderá realizar as principais tarefas da plataforma. A ideia é manter uma navegação simples, com poucas etapas e acesso rápido às funcionalidades.
