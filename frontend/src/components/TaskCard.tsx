import type { Task } from '../App';

// 1. Definindo as "Props" (Propriedades) que este componente recebe
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// 2. O Componente
// Ele recebe as props e as usa para renderizar o JSX
export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    // Este é o MESMO JSX que tínhamos no App.tsx
    <div className="bg-zinc-800 p-4 rounded-lg shadow-md relative">
      
      {/* Botões de Ação */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(task)} // Chama a função onEdit que veio do "pai"
          className="text-zinc-400 hover:text-yellow-500 transition-colors"
          title="Editar tarefa"
        >
          &#9998; {/* Lápis */}
        </button>
        <button
          onClick={() => onDelete(task.id)} // Chama a função onDelete que veio do "pai"
          className="text-zinc-400 hover:text-red-500 transition-colors"
          title="Excluir tarefa"
        >
          &#10005; {/* X */}
        </button>
      </div>
      
      {/* Conteúdo do Card */}
      <span className="text-xs font-semibold px-2 py-1 bg-blue-500 text-white rounded-full mb-2 inline-block">
        {task.status}
      </span>
      <h2 className="text-xl font-semibold pt-4">{task.title}</h2>
      <p className="text-zinc-400">{task.content}</p>
    </div>
  );
}