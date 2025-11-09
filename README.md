# Projeto Trello Clone (Quadro Kanban Fullstack)

Um clone simplificado da funcionalidade principal do Trello, construído com um backend Node.js e um frontend React moderno. O foco deste projeto é demonstrar um fluxo de desenvolvimento fullstack completo, com ênfase em uma interface de usuário interativa e componentizada.

## Funcionalidades Principais

Este projeto implementa um quadro Kanban completo com todo o ciclo de vida (CRUD) para o gerenciamento de tarefas.

* **Visualização em Quadro (Board):** As tarefas são organizadas visualmente em colunas (ex: "A Fazer", "Em Andamento", "Concluído").
* **Criação de Tarefas:** Um modal permite a criação de novas tarefas, que são automaticamente adicionadas à coluna "A Fazer".
* **Edição Completa:** Clique em "Editar" em qualquer card para abrir um modal pré-preenchido, permitindo a alteração de título, conteúdo e **status**.
* **Exclusão de Tarefas:** Remova tarefas do quadro com um clique (e uma confirmação).
* **Drag and Drop (Arrastar e Soltar):**
    * Arraste e solte cards **entre colunas** para atualizar seu status.
    * Arraste e solte cards **dentro** da mesma coluna para reordená-los.
* **Persistência de API:** Todas as ações (Criar, Editar, Excluir, Mover) disparam requisições à API, garantindo que o backend esteja sempre sincronizado com a visualização do usuário.
* **Atualização Otimista:** Mover um card (Drag and Drop) atualiza a UI *instantaneamente* (antes mesmo da resposta da API), proporcionando uma experiência de usuário fluida.

---

## Tecnologias Utilizadas

### Backend
* **Node.js** com **Express**: Para a criação de uma API RESTful leve e rápida.
* **TypeScript**: Para tipagem estática e um desenvolvimento mais robusto e seguro.
* **tsx**: Para rodar o servidor de desenvolvimento Node.js com TypeScript e hot-reload.
* **CORS**: Para permitir a comunicação entre o frontend e o backend.

### Frontend
* **React** (com Hooks): Para a construção da interface de usuário reativa e componentizada.
* **TypeScript**: Para adicionar tipos estáticos aos componentes, props e estados do React.
* **Vite**: Como ferramenta de build e servidor de desenvolvimento (extremamente rápido).
* **TailwindCSS**: Para estilização utilitária moderna e responsiva.
* **@dnd-kit**: Uma biblioteca moderna e leve para implementar toda a funcionalidade de "Arrastar e Soltar".

### Arquitetura de Componentes (Frontend)
O frontend foi "quebrado" em componentes reutilizáveis para manter o código limpo e organizado:
* `App.tsx`: O "cérebro" que gerencia o estado principal (a lista de tarefas) e a lógica de API.
* `Column.tsx`: Renderiza uma única coluna e filtra as tarefas que pertencem a ela.
* `TaskCard.tsx`: Renderiza um único card arrastável.
* `TaskFormModal.tsx`: Um componente inteligente que lida tanto com a *criação* quanto com a *edição* de tarefas.

---

## Como Rodar o Projeto

Você precisará de dois terminais abertos para rodar o backend e o frontend simultaneamente.

### 1. Rodando o Backend (API)

```bash
# 1. Navegue para a pasta do backend
cd backend

# 2. Instale as dependências (apenas na primeira vez)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# O servidor estará rodando em http://localhost:3000
