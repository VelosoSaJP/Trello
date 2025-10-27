// frontend/src/components/TaskCard.tsx

import type { Task } from '../App';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 1. As Props (estão corretas)
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// 2. O Componente (está correto)
export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {

  // 3. A lógica D&D (está correta)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 4. O JSX (AQUI ESTÁ A CORREÇÃO)
  return (
    // Aplicamos o D&D DIRETAMENTE neste 'div' (o único 'div' pai)
    <div
      ref={setNodeRef}   // O 'ref' do dnd-kit
      style={style}      // Os estilos de D&D
      {...attributes}  // Props do dnd-kit
      {...listeners}   // "Ouvintes" de clique/arraste
      className="bg-zinc-800 p-4 rounded-lg shadow-md relative" // Nossas classes de estilo
    >
      
      {/* TUDO agora está DENTRO do 'div' arrastável.
        Não há mais um 'div' duplicado.
      */}

      {/* Botões de Ação */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="text-zinc-400 hover:text-yellow-500 transition-colors"
          title="Editar tarefa"
        >
          &#9998; {/* Lápis */}
        </button>
        <button
          onClick={() => onDelete(task.id)}
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