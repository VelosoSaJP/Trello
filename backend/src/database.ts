// 1. Nosso "Contrato" de dados
export interface Task {
  id: string;
  title: string;
  content: string;
  status: string;
}

// 2. Nosso "Banco de Dados Fake"
// É um array que só pode conter objetos do tipo "Task"
export const db: Task[] = [];