// 1. Importar os 'Hooks' que vamos usar
import { useState, useEffect } from 'react';

// 2. Definir a "Interface" (o "Contrato") da Tarefa
// Note que é o MESMO formato que definimos no backend
// Isso garante que o frontend e o backend "falam a mesma língua"
interface Task {
  id: string;
  title: string;
  content: string;
  status: string;
}

function App() {
  // 3. Criar o nosso "Estado" (a "memória")
  // 'tasks' vai ser a lista de tarefas
  // 'setTasks' é a função que usamos para ATUALIZAR a lista
  // Começa como um array vazio: []
  const [tasks, setTasks] = useState<Task[]>([]);

  // 👇 NOSSOS NOVOS ESTADOS PARA O FORMULÁRIO 👇
  // "Memória" para o campo de input do título
  const [newTitle, setNewTitle] = useState('');
  // "Memória" para o campo de textarea do conteúdo
  const [newContent, setNewContent] = useState('');

  // 4. O "Gatilho" para buscar dados
  useEffect(() => {
    // Esta é a função que será executada
    // 'fetch' é a ferramenta do navegador para fazer requisições HTTP
    fetch('http://localhost:3000/api/tasks') // Nosso endpoint GET
      .then(response => response.json()) // Converte a resposta para JSON
      .then(data => {
        // 5. Recebemos os dados! Agora, guardamos no nosso estado
        setTasks(data);
      })
      .catch(error => {
        // Importante: sempre bom tratar erros
        console.error('Erro ao buscar tarefas:', error);
      });

    // O array vazio '[]' no final significa:
    // "Execute esta função APENAS UMA VEZ, quando o componente carregar"
  }, []);

  // ------------ NOVA FUNÇÃO DE SUBMISSÃO ------------------- 
  async function handleSubmit(event: React.FormEvent) {
    // 1. Impede o formulário de recarregar a página (comportamento padrão)
    event.preventDefault();

    // 2. Validação simples no frontend (não deixa criar tarefa vazia)
    if (!newTitle || !newContent) {
      alert("Por favor, preencha o título e o conteúdo.");
      return; // Para a execução da função
    }

    // 3. O "pacote" de dados que vamos enviar para o backend
    const newTaskPayload = {
      title: newTitle,
      content: newContent,
      // Não precisamos enviar 'status', o backend vai usar "A Fazer"
    };

    // 4. A mágica do FETCH (POST)!
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST', // Definimos o método como POST
        headers: {
          // Avisamos o backend que estamos enviando JSON
          'Content-Type': 'application/json',
        },
        // Enviamos nosso "pacote" (payload) como JSON
        body: JSON.stringify(newTaskPayload),
      });

      // Se a resposta não for OK (ex: 400 ou 500), damos um erro
      if (!response.ok) {
        throw new Error('Falha ao criar a tarefa');
      }

      // 5. O backend nos devolveu a tarefa criada (com id, status, etc)
      const createdTask: Task = await response.json();

      // 6. O "Pulo do Gato" - Atualização Imediata!
      // Adicionamos a nova tarefa à nossa lista 'tasks' local.
      // Isso faz o React redesenhar a tela com a nova tarefa na lista!
      setTasks( (tarefasAnteriores) => [createdTask, ...tarefasAnteriores] );

      // 7. Limpamos os campos do formulário para a próxima tarefa
      setNewTitle('');
      setNewContent('');

    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      alert("Não foi possível criar a tarefa.");
    }
  }

  // 6. O que será mostrado na tela (HTML/JSX)
  return (
    // 'p-8' adiciona um "padding" (espaçamento interno)
    <div className="min-h-screen bg-zinc-900 text-white p-8">
        <h1 className="text-5xl font-bold text-center mb-8">
        Meu Projeto Trello
      </h1>

      {/* NOSSO NOVO FORMULÁRIO  */}
      <form 
        onSubmit={handleSubmit} // 1. "Ligar" o form à nossa função
        className="max-w-xl mx-auto mb-8 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Título da tarefa"
          className="bg-zinc-800 p-2 rounded-lg text-white"
          value={newTitle} // 2. "Ligar" o input ao estado 'newTitle'
          onChange={ (e) => setNewTitle(e.target.value) } // 3. Atualizar o estado a cada tecla
        />
        <textarea
          placeholder="Conteúdo da tarefa"
          className="bg-zinc-800 p-2 rounded-lg text-white h-24"
          value={newContent} // 2. "Ligar" o textarea ao estado 'newContent'
          onChange={ (e) => setNewContent(e.target.value) } // 3. Atualizar o estado
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-colors"
        >
          Criar Tarefa
        </button>
      </form>
      {/*  FIM DO FORMULÁRIO */}

      {/* 7. Renderizando a nossa lista de tarefas */}
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        {/* Usamos '.map()' para transformar cada item do array 'tasks' em um card */}
        {tasks.map((task) => (
          // 'key' é obrigatório para o React saber identificar cada item
          <div key={task.id} className="bg-zinc-800 p-4 rounded-lg shadow-md">

            {/* Adicionando uma "tag" para o status */}
            <span className="text-xs font-semibold px-2 py-1 bg-blue-500 text-white rounded-full mb-2 inline-block">
              {task.status} 
            </span>

            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-zinc-400">{task.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App