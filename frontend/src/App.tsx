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

  // Guarda a tarefa que estamos editando (ou null se for criação)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

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

  function handleTaskSaved(savedTask: Task) {
      const isEditing = tasks.some(task => task.id === savedTask.id);

      if (isEditing) {
        // Lógica de ATUALIZAR (UPDATE)
        setTasks((tarefasAnteriores) =>
          tarefasAnteriores.map((task) =>
            task.id === savedTask.id ? savedTask : task
          )
        );
      } else {
        // Lógica de ADICIONAR (CREATE)
        setTasks((tarefasAnteriores) => [savedTask, ...tarefasAnteriores]);
      }
    }

  async function handleDelete(id: string) {
    // 1. Confirmação (Boa prática de UX!)
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return; // Se o usuário clicar "Cancelar", para a função aqui
    }

    try {
      // 2. Chamar nossa nova API com o método 'DELETE'
      // Note as crases (`) para podermos injetar a variável ${id}
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
      });

    // 3. Se o backend deu erro (ex: 404), avisamos
    if (!response.ok) {
      throw new Error('Falha ao excluir a tarefa');
    }

    // Se deu certo, atualizamos o estado 'tasks'
    // 'filter' cria um NOVO array com todos os itens,
    // EXCETO aquele onde 'task.id === id'
    setTasks((tarefasAnteriores) =>
      tarefasAnteriores.filter((task) => task.id !== id)
    );

  } catch (error) {
    console.error('Erro no handleDelete:', error);
    alert('Não foi possível excluir a tarefa.');
  }
}


// 3. NOVAS FUNÇÕES PARA ABRIR/FECHAR O MODAL
  function handleOpenCreateModal() {
    setTaskToEdit(null); // Garante que é modo "criação"
    setIsModalOpen(true);
  }

  function handleOpenEditModal(task: Task) {
    setTaskToEdit(task); // Define qual tarefa vamos editar
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setTaskToEdit(null); // Limpa a tarefa de edição
    setIsModalOpen(false);
  }

  // 4. O JSX (limpo!)
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      
      {/* Header */}
      <header className="max-w-xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-5xl font-bold">
          Meu Projeto Trello
        </h1>
        
        {/* MODIFICADO: Botão de Criar agora chama a função nova */}
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-colors"
        >
          + Nova Tarefa
        </button>
      </header>

      {/* Lista de Tarefas */}
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        {tasks.map((task) => (
          // O card 'relative' para os botões 'absolute'
          <div key={task.id} className="bg-zinc-800 p-4 rounded-lg shadow-md relative">
            
            {/* NOVO: Wrapper para os botões de ação */}
            <div className="absolute top-2 right-2 flex gap-2">
              {/* Botão de Editar */}
              <button
                onClick={() => handleOpenEditModal(task)}
                className="text-zinc-400 hover:text-yellow-500 transition-colors"
                title="Editar tarefa"
              >
                {/* Ícone de "lápis" */}
                &#9998; 
              </button>
              
              {/* MODIFICADO: Botão de Excluir (agora junto com o de editar) */}
              <button
                onClick={() => handleDelete(task.id)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
                title="Excluir tarefa"
              >
                {/* Ícone de "X" */}
                &#10005;
              </button>
            </div>
            
            <span className="text-xs font-semibold px-2 py-1 bg-blue-500 text-white rounded-full mb-2 inline-block">
              {task.status}
            </span>
            <h2 className="text-xl font-semibold pt-4">{task.title}</h2> {/* 'pt-4'(padding-top) para não ficar embaixo dos botões */}
            <p className="text-zinc-400">{task.content}</p>
          </div>
        ))}
      </div>

      {/* MODIFICADO: chamada inteligente tome */}
      {isModalOpen && (
        <TaskFormModal
          onClose={handleCloseModal}
          onTaskSaved={handleTaskSaved}
          taskToEdit={taskToEdit}
        />
      )}
    </div>
  )
}

export default App