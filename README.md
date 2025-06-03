🧾 README.md

# Live Board — Frontend

Este é o frontend do **Live Board**, um sistema de quadros estilo Kanban com colaboração em tempo real entre múltiplos usuários. Ele permite criar e gerenciar tarefas com drag-and-drop, atribuir membros e acompanhar tudo em tempo real.

## 🚀 Tecnologias utilizadas

- **React**
- **Zustand** (gerenciamento global de estado)
- **TailwindCSS**
- **@dnd-kit** (drag and drop entre colunas)
- **Socket.IO Client**
- **Axios**

## 📦 Instalação

```bash
git clone https://github.com/seu-usuario/liveboard-frontend.git
cd liveboard-frontend
npm install

▶️ Execução local

npm run dev

Certifique-se de que o backend esteja rodando em paralelo. O frontend está configurado para consumir a API via variável de ambiente (VITE_API_URL).
📁 Estrutura principal

    src/hooks/: lógica de WebSocket, boards, tarefas, etc.

    src/store/: Zustand stores para estado global

    src/components/: componentes reutilizáveis como cards, modais, dropdowns

    src/pages/: rotas como login, dashboard, etc.

🔐 Funcionalidades principais

    Login e cadastro de usuários

    CRUD de quadros e tarefas

    Organização de tarefas em lanes com drag and drop

    Adição de membros por autocomplete

    Atualizações em tempo real via WebSocket

    Exibição do número de tarefas por quadro (taskCount)

🌐 Variáveis de ambiente

Crie um .env:

VITE_API_URL=http://localhost:5000