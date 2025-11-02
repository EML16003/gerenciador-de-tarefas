console.log('renderer.js carregado');

let tasks = [];
let filter = 'all'; // all | pending | done

function loadTasks() {
  tasks = TaskStorage.getTasks();
  renderTasks();
}

function saveTasks() {
  TaskStorage.saveTasks(tasks);
}

function addTask(text) {
  if (tasks.some(t => t.text === text)) return; // evita duplicadas
  tasks.push({ text, done: false });
  saveTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

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

// Evento do botão "Adicionar"
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('taskInput');
  const texto = input.value.trim();

  if (texto !== '') {
    if (!tasks.some(t => t.text === texto)) {
      addTask(texto);
      renderTasks();
    }
    input.value = '';
    setTimeout(() => input.focus(), 0);
  }
});

// Filtros
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

loadTasks();
