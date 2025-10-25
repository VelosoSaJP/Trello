import { useState, useEffect } from 'react';
// 1. Importar nosso novo componente!
import { TaskFormModal } from './components/TaskFormModal';

// 2. A interface agora é usada pelos dois arquivos,
//    então vamos "exportá-la" para o Modal poder importar
export interface Task {
  id: string;
  title: string;
  content: string;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // Nosso "interruptor"
  const [isModalOpen, setIsModalOpen] = useState(false);

  // O useEffect de buscar dados (GET) continua o mesmo
  useEffect(() => {
    fetch('http://localhost:3000/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Erro ao buscar tarefas:', error));
  }, []);

  // 3. Função que o Modal vai chamar para adicionar a tarefa
  function handleAddTask(createdTask: Task) {
    // A mesma lógica de antes, mas agora em uma função separada
    setTasks((tarefasAnteriores) => [createdTask, ...tarefasAnteriores]);
  }

  // 4. O JSX (limpo!)
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      
      {/* Header */}
      <header className="max-w-xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-5xl font-bold">
          Meu Projeto Trello
        </h1>
        {/* 5. Botão que ABRE o modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-colors"
        >
          + Nova Tarefa
        </button>
      </header>

      {/* Lista de Tarefas (não muda) */}
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        {tasks.map((task) => (
          <div key={task.id} className="bg-zinc-800 p-4 rounded-lg shadow-md">
            <span className="text-xs font-semibold px-2 py-1 bg-blue-500 text-white rounded-full mb-2 inline-block">
              {task.status}
            </span>
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-zinc-400">{task.content}</p>
          </div>
        ))}
      </div>

      {/* 6. A MÁGICA: Renderização Condicional */}
      {/* "Se 'isModalOpen' for 'true', MOSTRE o componente TaskFormModal" */}
      {isModalOpen && (
        <TaskFormModal
          // Passamos a função de fechar
          onClose={() => setIsModalOpen(false)} 
          // Passamos a função de adicionar tarefa
          onAddTask={handleAddTask}
        />
      )}
    </div>
  )
}

export default App