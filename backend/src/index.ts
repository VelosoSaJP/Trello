// 1. Importar o express
import express from 'express';
import { db , Task } from './database';
import cors from 'cors'; // <-- ADICIONA O CORS

// 2. Inicializar o express e colocá-lo na variável 'app'
const app = express();
// Middleware para o Express "entender" JSON
app.use(express.json());
app.use(cors()); // <-- ADICIONA VALIDAÇÃO DO CORS

// 3. Definir a porta que o servidor vai rodar
const PORT = 3000;

// 4. Criar nossa primeira rota (o "caminho")
// Quando alguém acessar http://localhost:3000/
// O servidor vai responder com "Olá, mundo!"
// ROTA 1: Listar todas as tarefas
app.get('/api/tasks', (request, response) => {
  // Simplesmente retorna nosso array 'db'
  return response.json(db);
});
// --------------ROTA 2: Criar uma nova tarefa-------------------
app.post('/api/tasks', (request, response) => {
  // 1. Pegar os dados do corpo da requisição
  // Usamos a "desestruturação" para pegar o title e content
  // E aqui o TypeScript brilha: ele sabe que 'body' pode ter 'title' e 'content'
  const { title, content, status } = request.body;
  //const status = request.body.status || "A Fazer";

  // VALIDAÇÃO!
  // Checamos se os campos obrigatórios vieram
  if (!title || !content) {
    // 400 = Bad Request (Requisição Ruim)
    // Se não vieram, avisamos o cliente e paramos a execução.
    return response.status(400).json({ 
      error: "O 'title' e o 'content' são obrigatórios." 
    });
  }

  // 2. Criar a nova tarefa com um ID único
  const newTask: Task = {
    // Vamos usar um ID "fake" por enquanto, só para ter algo
    id: `task_${Date.now()}`, 
    title: title,
    content: content,
    status: status,
  };

  // 3. Adicionar a nova tarefa no nosso "banco de dados"
  db.push(newTask);

  // 4. Retornar a tarefa que acabamos de criar
  // O status 201 significa "Created" (Criado com sucesso)
  return response.status(201).json(newTask);
});

// -----------------------ROTA 3: Excluir uma tarefa --------------------------
app.delete('/api/tasks/:id', (request, response) => {
  // 1. Pegar o ID que veio na URL (nos "parâmetros")
  const { id } = request.params;

  // 2. Encontrar o *índice* (a posição) da tarefa no array
  // findIndex é perfeito para isso
  const taskIndex = db.findIndex((task) => task.id === id);

  // 3. Validação: E se não encontrar a tarefa?
  if (taskIndex === -1) {
    // 404 = Not Found (Não Encontrado)
    return response.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  // 4. Se encontrou, remove a tarefa do array
  // O 'splice' modifica o array original, removendo 1 item na posição 'taskIndex'
  db.splice(taskIndex, 1);

  // 5. Enviar uma resposta de sucesso
  // 204 = No Content (Sem Conteúdo). É o padrão para um DELETE bem-sucedido.
  return response.status(204).send();
});

// -----------------------ROTA 4: Atualizar uma tarefa (UPDATE) -------------------------
app.put('/api/tasks/:id', (request, response) => {
  // 1. Pegar o ID da URL
  const { id } = request.params;

  // 2. Pegar os NOVOS dados do corpo da requisição
  // Usamos a mesma validação/default do POST
  const { title, content, status } = request.body;

  // 3. Validação dos campos obrigatórios
  if (!title || !content || !status) {
    return response.status(400).json({ 
      error: "O 'title' e o 'content' são obrigatórios." 
    });
  }

  // 4. Encontrar a tarefa no DB
  const taskIndex = db.findIndex((task) => task.id === id);

  // 5. Se não encontrar, 404
  if (taskIndex === -1) {
    return response.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  // 6. Se encontrou, atualiza o objeto
  const updatedTask: Task = {
    ...db[taskIndex], // Pega a tarefa antiga (para manter o 'id')
    title: title,       // Sobrescreve o title
    content: content,   // Sobrescreve o content
    status: status,     // Sobrescreve o status
  };

  // 7. Coloca a tarefa atualizada de volta no array
  db[taskIndex] = updatedTask;

  // 8. Retorna a tarefa atualizada
  return response.json(updatedTask);
});

// 5. "Ligar" o servidor e fazê-lo "ouvir" a porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});