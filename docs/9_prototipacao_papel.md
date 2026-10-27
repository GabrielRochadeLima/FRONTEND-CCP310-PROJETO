# Documentação de Prototipação de Baixa Fidelidade (Desktop e Celular)

Este documento detalha o planejamento visual e funcional das telas do projeto, considerando a jornada do usuário desde o primeiro acesso até o acompanhamento diário de suas metas literárias.

---

## 1. Tela de Login e Boas-Vindas 

Porta de entrada da plataforma, projetada para transmitir acolhimento e incentivo à leitura logo no primeiro contato.

### Versão Desktop 

* **Layout em Tela Dividida (Split Screen):** A tela é dividida verticalmente em duas metades simétricas.
* **Lado Esquerdo (Identidade e Inspiração):**
* Contém o logotipo e o nome do site no canto superior esquerdo.
* Exibe uma **frase motivacional em negrito** acompanhada de uma frase explicativa menor.
* Centraliza uma **caixa dedicada para imagem ou ilustração** temática de leitura, criando apelo visual.
* Na parte inferior, reforça-se o tom encorajador com outra frase motivacional.

* **Lado Direito (Acesso à Conta):**
* Apresenta o título de boas-vindas ("Bem-Vindo!") com uma frase de apoio logo abaixo.
* Campos de entrada de dados limpos e espaçados para **E-mail** e **Senha**.
* Atalho útil para recuperação de senha (**"Esqueci a senha"**).
* Botão de ação principal destacado (**"Entrar"**) e link secundário para novos usuários (**"Cadastre-se"**).

<img width="3000" height="2339" alt="BEM-VINDO" src="https://github.com/user-attachments/assets/6e0c50e3-9b72-45cd-a182-93a88dc78455" />


### Versão Mobile 

* **Layout Vertical Otimizado:** Pensado para telas de smartphones, mantendo a verticalidade natural.
* **Cabeçalho:** Logotipo e nome do site simplificados no topo.
* **Bloco de Apresentação:** Frase motivacional e descritiva posicionadas antes do formulário.
* **Formulário Interativo:**
* Campos de E-mail e Senha com **ícones visuais** (um envelope para e-mail e um cadeado para senha) para facilitar a usabilidade.
* Link de "Esqueci minha senha" alinhado à direita do campo de senha.
* Botão de login de largura total ("Entrar") para facilitar o toque com o polegar.
* Rodapé com o texto de suporte: *"Ainda não tem uma conta? Cadastre-se"*.

<img width="3000" height="4000" alt="L" src="https://github.com/user-attachments/assets/6eec03c8-c8e9-46de-b8b3-2c019ebe6f38" />

---

## 2. Tela Inicial / Dashboard 

O painel principal serve como um resumo dinâmico do progresso do leitor, reunindo atalhos e status atuais.

### Versão Desktop 

* **Barra de Navegação Superior:** Fixa no topo, contendo o logotipo, links de navegação (*Início, Biblioteca, Metas*), uma barra de busca rápida de livros e o ícone de perfil do usuário.
* **Seção de Boas-Vindas e Acesso Rápido:**
* Dividida em blocos informativos: um cartão de boas-vindas com botão direto para **"+ Adicionar livro"**.
* Indicadores numéricos rápidos divididos em categorias: livros totais na biblioteca, livros lendo, quero ler e lidos.


* **Leituras em Andamento:**
* Seção dedicada exibindo capas de livros atuais, nome, autor e uma **barra de progresso visual** em porcentagem.
* Link interativo *"Ver todos"* para gerenciar a lista completa.


* **Widget de Meta de Leitura:** Um painel lateral ou inferior destacando o progresso da meta anual (ex: "X de Y próximos"), incentivando a consistência.

<img width="2997" height="2248" alt="INÍCIO" src="https://github.com/user-attachments/assets/bb39f84f-1a84-42c9-8020-2a5fcc976d83" />

### Versão Mobile 

* **Navegação Compacta:** Barra superior reduzida com logo, ícone de busca rápida e menu hambúrguer para opções extras.
* **Cards de Status Organizados:** Os indicadores de quantidade de livros aparecem em formato de grade com botões de toque rápido (Biblioteca, Lendo, Quero Ler, Lidos).
* **Carrossel de Leituras em Andamento:** Os livros em leitura utilizam uma interação intuitiva de **arrastar para o lado (scroll horizontal)**, sinalizada por uma seta e a palavra *"arrastar"*.
* **Barra de Navegação Inferior (Bottom Navigation):** Fixada na base da tela com três ícones essenciais para acesso rápido com o polegar: **Início**, **Biblioteca** e **Metas**.

<img width="3000" height="4000" alt="I" src="https://github.com/user-attachments/assets/37f032ab-5211-4321-bb51-1fa6fb2f0431" />


---

## 3. Tela da Biblioteca 

O espaço onde o usuário gerencia todo o seu acervo pessoal de leituras de forma organizada.

### Versão Desktop 

* **Cabeçalho Padrão:** Menu de navegação completo no topo.
* **Cabeçalho da Página:** Título *"Biblioteca"* acompanhado de uma frase explicativa sobre o propósito da página.
* **Barra de Ferramentas:**
* Campo de busca avançada de largura estendida.
* Botões de ação rápida: **"+ Adicionar livro"** e **"Filtros"**.


* **Filtros por Abas (Chips):** Botões em formato de pílula para alternar rapidamente entre os status: *Todos, Quero ler, Lendo* e *Lido*.
* **Grade de Livros (Grid):** Exibição em formato de cartões lado a lado. Cada cartão mostra a capa ilustrada, o autor, o status atual e uma barra de progresso de leitura. Um contador superior exibe o total de livros encontrados na busca ("X livros encontrados").

<img width="2890" height="2266" alt="BIBLIOTECA" src="https://github.com/user-attachments/assets/4caaf622-d305-4bc2-b98b-2a116f37ae1e" />


### Versão Mobile 

* **Adaptação Responsiva:** Mantém a barra de pesquisa e o botão de adicionar em pilha vertical para facilitar o toque.
* **Filtros Horizontais:** As opções de status (*Todos, Quero ler, Lendo, Lidos*) ficam dispostas em uma linha com rolagem horizontal.
* **Lista Empilhada:** Os livros são exibidos em cartões verticais detalhados, otimizados para telas menores sem perder informações cruciais (título, autor, status e barra de progresso).

<img width="3000" height="4000" alt="B" src="https://github.com/user-attachments/assets/a76ba3fd-7a65-49cb-b1a6-da835bcc7e4c" />


---

## 4. Tela de Metas e Estatísticas 

Focada em engajamento, esta tela ajuda o usuário a monitorar seu desempenho e manter hábitos de leitura consistentes.

### Versão Desktop 

* **Cabeçalho e Ações:** Título *"Metas"*, frase explicativa e um botão destacado para **"+ Nova Meta"**.
* **Painel de Indicadores Principais:** Quatro cartões distribuídos horizontalmente mostrando:
1. Meta atual (com ícone indicativo).
2. Total de livros lidos.
3. Porcentagem de progresso geral ($Z\%$).
4. Quantidade de livros restantes para finalizar o objetivo.


* **Gráfico de Progresso Temporal:** Um gráfico de barras verticais mapeando o desempenho do usuário **ao longo dos meses do ano** (de Janeiro a Dezembro, representados pelas iniciais J, F, M, A, M, J, J, A, S, O, N, D).
* **Painel Lateral de Detalhes:** Mostra as regras da meta ativa (ex: "X livros em Y tempo") e um lembrete motivacional com opção de edição rápida.

<img width="3000" height="2304" alt="METAS" src="https://github.com/user-attachments/assets/3c953b2c-e305-4d2f-bffd-ea9520ddb10b" />


### Versão Mobile 

* **Estrutura Verticalizada:** Os quatro cartões de métricas são organizados em uma grade de 2x2 para melhor aproveitamento do espaço da tela do celular.
* **Gráfico de Meses Compacto:** O gráfico de barras verticais dos meses do ano foi adaptado para manter a legibilidade em telas estreitas.
* **Rodapé com Navegação Fixa:** Acesso contínuo às abas principais (*Início, Biblioteca, Metas*).

<img width="3000" height="4000" alt="M" src="https://github.com/user-attachments/assets/fc47a5e7-6770-4df8-ae6e-e803e6cb19a5" />


---

## 5. Feedbacks dos Usuários (Validação de UX)

Com base nos testes realizados com os protótipos de baixa fidelidade, destacam-se os seguintes pontos de melhoria e validação:

* **Um dos usuários**: Destacou positivamente a organização da Biblioteca, afirmando que a divisão por status de leitura (quero ler, lendo, lido) torna a gestão do acervo muito intuitiva e simples de navegar.
* **Outro usuário**: Elogiou a versão para Celular (Mobile), ressaltando que a página de Metas ficou extremamente clara devido à representação visual do progresso das leituras ao longo do tempo.

