import type { Task } from '../App';
import { TaskCard } from './TaskCard'; // Importamos nosso novo componente!

// 1. Definindo as Props
interface ColumnProps {
  title: string;
  tasks: Task[]; // Recebe a lista de tarefas JÁ FILTRADA
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// 2. O Componente
export function Column({ title, tasks, onEdit, onDelete }: ColumnProps) {
  return (
    // O "Container" da Coluna
    <div className="bg-zinc-900/50 w-72 rounded-lg p-4 flex-shrink-0">
      
      {/* Título da Coluna */}
      <h3 className="text-lg font-semibold mb-4 text-zinc-300">{title}</h3>

      {/* Lista de Cards */}
      <div className="flex flex-col gap-4">
        {/* 3. Mapeamos as tarefas e passamos os dados para o TaskCard */}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}