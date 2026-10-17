# Arquitetura de Informação e Fluxo do Usuário

## 1. Arquitetura de Informação

O LeituraJá foi organizado para que o usuário consiga encontrar seus livros, acompanhar suas leituras e consultar suas metas de forma simples.

```mermaid
flowchart TD
    A["LeituraJá"]
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

O usuário pesquisa um título e adiciona o livro à biblioteca.

```mermaid
flowchart LR
    A["Pesquisar"] --> B{"Encontrou?"}
    B -->|Sim| C["Adicionar livro"]
    B -->|Não| D["Nova pesquisa"]
    D --> A
    C --> E([Concluído])
```

### 2.2 Organizar biblioteca

O usuário seleciona um livro e altera sua situação de leitura. Se o livro não estiver na biblioteca, deverá adicioná-lo primeiro.

```mermaid
flowchart LR
    A["Biblioteca"] --> B{"Livro disponível?"}
    B -->|Sim| C["Alterar situação"]
    B -->|Não| D["Pesquisar livro"]
    D --> F["Adicionar à biblioteca"]
    F --> C
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

O usuário acessa suas metas para verificar seu progresso. Caso não tenha uma meta cadastrada, poderá criar uma.

```mermaid
flowchart LR
    A["Metas"] --> B{"Existe meta?"}
    B -->|Sim| C["Ver progresso"]
    B -->|Não| D["Criar meta"]
    D --> E["Salvar meta"]
    E --> C
    C --> F([Concluído])
```

## 3. Considerações Finais

Os fluxos mostram as principais tarefas que o usuário poderá realizar no LeituraJá. A ideia é manter uma navegação simples, com poucas etapas e acesso rápido às funcionalidades.
