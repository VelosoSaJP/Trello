import type { Task } from '../App';
import { TaskCard } from './TaskCard'; 
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// 1. Definindo as Props
interface ColumnProps {
  title: string;
  tasks: Task[]; // Recebe a lista de tarefas JÁ FILTRADA
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// 2. O Componente
export function Column({ title, tasks, onEdit, onDelete }: ColumnProps) {

  const { setNodeRef } = useDroppable({   
      id: title,
    });

  // 3. Precisamos de um array de IDs para o SortableContext
  const taskIds = tasks.map(task => task.id);

  return (
    // 4. Conectamos o 'setNodeRef' no <div> principal
    <div ref={setNodeRef} className="bg-zinc-900/50 w-72 rounded-lg p-4 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-4 text-zinc-300">{title}</h3>

      {/* 5. "Abraçamos" a lista de cards com o SortableContext */}
      {/* Isso permite que os cards sejam "arrastáveis" DENTRO da coluna */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
