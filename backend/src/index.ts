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
// ROTA 2: Criar uma nova tarefa
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

// 5. "Ligar" o servidor e fazê-lo "ouvir" a porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});