import { useState, useEffect } from 'react';
// Importação de tipo continua a mesma
import type { Task } from '../App';

const STATUS_OPTIONS = ["A Fazer", "Em Andamento", "Concluído"];

// ATUALIZAR AS PROPS
interface TaskFormModalProps {
  onClose: () => void;
  onTaskSaved: (task: Task) => void; // Função ÚNICA para salvar (criação ou edição)
  taskToEdit: Task | null; // A tarefa que queremos editar (ou null se for criação)
}

export function TaskFormModal({ onClose, onTaskSaved, taskToEdit }: TaskFormModalProps) {
  // Estados do formulário (iguais)
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  // Poderíamos adicionar o 'status' aqui também, mas vamos focar no title/content
  const [newStatus, setNewStatus] = useState(STATUS_OPTIONS[0]); // Default "A Fazer"

  // Este 'useEffect' roda UMA VEZ quando o modal abre
  useEffect(() => {
    if (taskToEdit) {
      // Se estamos editando, preenchemos o formulário com os dados da tarefa
      setNewTitle(taskToEdit.title);
      setNewContent(taskToEdit.content);
      setNewStatus(taskToEdit.status);
    } else {
      // Se estamos criando, garantimos que o formulário está limpo
      setNewTitle('');
      setNewContent('');
      setNewStatus(STATUS_OPTIONS[0]);
    }
  }, [taskToEdit]); // Ele re-roda se 'taskToEdit' mudar

  
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newTitle || !newContent) {
      alert("Por favor, preencha o título e o conteúdo.");
      return;
    }

    // Prepara o "pacote" (payload)
    const taskPayload = {
      title: newTitle,
      content: newContent,
      status: newStatus,
    };

    // Define qual URL e Método usar
    const isEditing = !!taskToEdit; // !! transforma 'taskToEdit' em booleano
    const url = isEditing
      ? `http://localhost:3000/api/tasks/${taskToEdit.id}`
      : 'http://localhost:3000/api/tasks';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload),
      });

      if (!response.ok) throw new Error('Falha ao salvar a tarefa');

      const savedTask: Task = await response.json();

      // Avisa o "Pai" (App.tsx) que a tarefa foi salva
      onTaskSaved(savedTask);
      onClose(); // Fecha o modal

    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      alert("Não foi possível salvar a tarefa.");
    }
  }

  //O JSX (Vamos mudar o título e o botão)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-xl w-full">
        {/* Título dinâmico */}
        <h2 className="text-2xl font-bold mb-4">
          {taskToEdit ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* <label> é bom para acessibilidade */}
          <label htmlFor="status" className="text-sm font-medium text-zinc-300">Status</label>
          <select
            id="status"
            className="bg-zinc-700 p-2 rounded-lg text-white"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            {/* Mapeia nossas opções de status para <option> */}
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <label htmlFor="title" className="text-sm font-medium text-zinc-300">Título</label>

          <input 
            type="text"
            placeholder="Título da tarefa"
            className="bg-zinc-700 p-2 rounded-lg text-white"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea 
            placeholder="Conteúdo da tarefa"
            className="bg-zinc-700 p-2 rounded-lg text-white h-24"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}          
          />
          
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-600 hover:bg-zinc-700 p-2 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-colors"
            >
              {/* Botão dinâmico */}
              {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}