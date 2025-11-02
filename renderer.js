console.log('renderer.js carregado');

// --- Variáveis globais ---
let tasks = [];
let filter = 'all'; // all | pending | done

// --- Funções de armazenamento com localStorage ---
const TaskStorage = {
  getTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  },
  saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

// --- Carregar e salvar tarefas ---
function loadTasks() {
  tasks = TaskStorage.getTasks();
  renderTasks();
}

function saveTasks() {
  TaskStorage.saveTasks(tasks);
}

// --- Adicionar tarefa ---
function addTask(text) {
  tasks.push({ text, done: false });
  saveTasks();
}

// --- Alternar status ---
function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

// --- Excluir tarefa ---
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// --- Renderizar lista ---
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  filtered.forEach((task, i) => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(i));

    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.textDecoration = task.done ? 'line-through' : 'none';
    span.style.flex = '1';

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.setAttribute('aria-label', 'Excluir tarefa');
    delBtn.addEventListener('click', () => deleteTask(i));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// --- Botão "Adicionar" ---
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('taskInput');
  const texto = input.value.trim();

  // Se estiver vazio, apenas foca
  if (texto === '') {
    input.focus();
    return;
  }

  // Evita duplicadas
  if (tasks.some(t => t.text === texto)) {
    input.focus();
    return;
  }

  // Adiciona tarefa e atualiza lista
  addTask(texto);
  renderTasks();

  // ✅ Limpa campo e deixa cursor piscando
  input.value = '';
  input.focus();
});

// --- Permitir adicionar com ENTER ---
document.getElementById('taskInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    document.getElementById('addBtn').click();
  }
});

// --- Filtros ---
document.getElementById('filterAll').addEventListener('click', () => {
  filter = 'all';
  renderTasks();
});
document.getElementById('filterPending').addEventListener('click', () => {
  filter = 'pending';
  renderTasks();
});
document.getElementById('filterDone').addEventListener('click', () => {
  filter = 'done';
  renderTasks();
});

// --- Inicializa ---
loadTasks();
