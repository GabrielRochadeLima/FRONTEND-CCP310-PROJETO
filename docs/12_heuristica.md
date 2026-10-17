# Inspeção Heurística

**Exercício acadêmico com avaliações simuladas.** As violações abaixo são hipóteses de análise do protótipo, e não registros de avaliações individuais comprovadamente realizadas.

## 1. Avaliação de IHC por Inspeção Heurística

A inspeção considera as telas **Início, Biblioteca, Metas e Login** do LeituraJá, nas versões para computador e celular.

Foram aplicadas as dez heurísticas de Nielsen para identificar problemas de usabilidade e sugerir ajustes.

**Protótipo:** [LeituraJá no Figma](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9/LeituraJ%C3%A1---Prot%C3%B3tipos-Desktop-e-Celular?node-id=6-24)

### Escala de severidade

| Grau | Classificação |
| :---: | :--- |
| **0** | Sem importância |
| **1** | Cosmético |
| **2** | Simples, baixa prioridade |
| **3** | Grave, alta prioridade |
| **4** | Catastrófico |

**Referência:** [Dez heurísticas de usabilidade de Nielsen](https://www.nngroup.com/articles/ten-usability-heuristics/).

### 1.1 Avaliação simulada do Integrante 1

**Telas analisadas:** Início, Biblioteca, Metas e Login, computador e celular.

| Tela | Violação identificada | Heurística | Grau | Melhoria sugerida |
| :--- | :--- | :--- | :---: | :--- |
| Início | Os cartões de leitura indicam progresso, mas não fica evidente como o valor seria alterado diretamente. | 6. Reconhecimento em vez de memorização | **2** | Incluir ação visível de **Atualizar progresso**. |
| Biblioteca | Os filtros **Todos**, **Quero ler**, **Lendo** e **Lido** não mostram no protótipo como confirmar uma mudança de categoria. | 1. Visibilidade do status do sistema | **2** | Destacar claramente o filtro selecionado após a interação. |
| Metas | O gráfico mensal mostra resultados sem explicar como são calculados. | 2. Compatibilidade com o mundo real | **2** | Informar que cada barra representa livros concluídos no mês. |

**Telas para conferência:**

- [Início](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-2)
- [Biblioteca](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-139)
- [Metas](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-271)

### 1.2 Avaliação simulada do Integrante 2

**Telas analisadas:** Início, Biblioteca, Metas e Login, computador e celular.

| Tela | Violação identificada | Heurística | Grau | Melhoria sugerida |
| :--- | :--- | :--- | :---: | :--- |
| Login | O protótipo exibe campos e o botão de entrada, mas não apresenta mensagens para e-mail incorreto ou senha inválida. | 9. Ajudar a reconhecer e corrigir erros | **3** | Criar estados com mensagens de validação próximas aos campos. |
| Biblioteca | A ação para mudar a situação de um livro não aparece diretamente nos cartões. | 7. Flexibilidade e eficiência de uso | **2** | Disponibilizar um menu de ações em cada livro. |
| Início no celular | Há vários blocos de informação em sequência antes de chegar às metas. | 8. Estética e design minimalista | **1** | Reduzir espaçamentos ou oferecer acesso direto ao resumo das metas. |

**Telas para conferência:**

- [Login](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-375)
- [Biblioteca](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-139)
- [Início no celular](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=12-2)

### 1.3 Avaliação simulada do Integrante 3

**Telas analisadas:** Início, Biblioteca, Metas e Login, computador e celular.

| Tela | Violação identificada | Heurística | Grau | Melhoria sugerida |
| :--- | :--- | :--- | :---: | :--- |
| Metas | A ação **Nova meta** não possui uma tela de confirmação ou possibilidade visível de cancelar a operação no protótipo. | 3. Controle e liberdade do usuário | **2** | Prever ações **Salvar** e **Cancelar** no formulário. |
| Login | Não há orientação próxima ao formulário para quem tiver dificuldade de acesso, além de recuperar senha. | 10. Ajuda e documentação | **1** | Acrescentar uma orientação curta de ajuda. |
| Biblioteca no celular | O cadastro e a alteração de livros não têm estados de erro representados. | 5. Prevenção de erros | **2** | Validar campos e avisar quando informações obrigatórias estiverem faltando. |

**Telas para conferência:**

- [Metas](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-271)
- [Login](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=11-375)
- [Biblioteca no celular](https://www.figma.com/design/NuB9Sp4ITmEvThTK4Lx7G9?node-id=12-109)

## 2. Boas Práticas de Heurísticas Não Violadas

Esta seção traz um exemplo positivo para cada integrante, conforme a atividade do professor.

| Integrante | Tela | Heurística atendida | Exemplo |
| :--- | :--- | :--- | :--- |
| **1** | Biblioteca | 4. Consistência e padrões | Os estados de leitura aparecem com nomes e cores padronizados. |
| **2** | Início | 6. Reconhecimento em vez de memorização | O menu mantém as opções **Início**, **Biblioteca** e **Metas** visíveis. |
| **3** | Metas | 1. Visibilidade do status do sistema | A porcentagem de progresso e a quantidade de livros concluídos ficam visíveis. |

## 3. Conclusão

Na simulação, as principais oportunidades de melhoria foram tornar algumas ações mais visíveis, prever mensagens de erro e representar os estados de confirmação.

A estrutura geral da interface foi mantida, pois organiza bem livros, leituras e metas.

As telas correspondentes podem ser consultadas pelos links do Figma. Para atender à exigência de prints incorporados no Markdown, ainda será necessário inserir as capturas exportadas do protótipo.
