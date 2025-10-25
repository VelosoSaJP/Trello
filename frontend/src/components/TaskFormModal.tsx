import { useState } from 'react';
import type{ Task } from '../App'; // Vamos precisar importar a interface

// 1. Definindo as "Props" (Propriedades) que este componente recebe
// Pense nisso como os "parâmetros" do componente
interface TaskFormModalProps {
  onClose: () => void; // Uma função para fechar o modal
  onAddTask: (newTask: Task) => void; // Uma função para adicionar a nova tarefa à lista
}

// 2. O componente!
// Recebemos as props 'onClose' e 'onAddTask'
export function TaskFormModal({ onClose, onAddTask }: TaskFormModalProps) {
  // 3. Os estados do formulário agora vivem AQUI
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // 4. A função handleSubmit agora vive AQUI
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newTitle || !newContent) {
      alert("Por favor, preencha o título e o conteúdo.");
      return;
    }

    const newTaskPayload = {
      title: newTitle,
      content: newContent,
    };

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskPayload),
      });

      if (!response.ok) throw new Error('Falha ao criar a tarefa');

      const createdTask: Task = await response.json();

      // 5. EM VEZ de 'setTasks', chamamos a função 'onAddTask'
      // que recebemos do "Pai" (App.tsx)
      onAddTask(createdTask); 
      
      // 6. Limpamos os campos e fechamos o modal
      setNewTitle('');
      setNewContent('');
      onClose(); // Chamamos a função 'onClose'

    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      alert("Não foi possível criar a tarefa.");
    }
  }

  // 7. O JSX do Modal
  return (
    // O Fundo Escuro (Overlay)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      
      {/* O Conteúdo do Modal */}
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Criar Nova Tarefa</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          
          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button" // 'type="button"' impede ele de submeter o form
              onClick={onClose} // "Ligar" ao evento de fechar
              className="bg-zinc-600 hover:bg-zinc-700 p-2 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-colors"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}