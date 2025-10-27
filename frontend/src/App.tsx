import { useState, useEffect } from 'react';
import { TaskFormModal } from './components/TaskFormModal';
import { Column } from './components/Column';

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

  const columns = ["A Fazer", "Em Andamento", "Concluído"];

  // 4. O JSX (limpo!)
  return (
    // MODIFICADO: min-h-screen agora tem 'overflow-x-auto' para scroll horizontal
    <div className="min-h-screen bg-zinc-900 text-white p-8 overflow-x-auto">
      
      {/* Header (não muda) */}
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-5xl font-bold">
          Meu Projeto Trello
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-colors"
        >
          + Nova Tarefa
        </button>
      </header>

      {/* MODIFICADO: A "Lista de Tarefas" agora é um "Quadro" (Board) */}
      {/* 'flex gap-6' vai alinhar as colunas lado a lado */}
      <main className="flex gap-6 max-w-6xl mx-auto">
        
        {/* Mapeamos o array de COLUNAS (e não de tarefas) */}
        {columns.map((columnTitle) => {
          
          // 1. FILTRAMOS as tarefas que pertencem a esta coluna
          const columnTasks = tasks.filter(
            (task) => task.status === columnTitle
          );

          // 2. Renderizamos o componente Coluna
          return (
            <Column
              key={columnTitle}
              title={columnTitle}
              tasks={columnTasks} // Passamos a lista filtrada
              onEdit={handleOpenEditModal} // Passamos a função de editar
              onDelete={handleDelete} // Passamos a função de deletar
            />
          );
        })}
      </main>

      {/* O Modal (não muda nada aqui) */}
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