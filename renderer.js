console.log('renderer.js carregado');
const fs = require('fs');
const path = require('path');
const { app } = require('@electron/remote'); 
const dataPath = path.join(app.getPath('userData'), 'tasks.json');

let tasks = [];
let filter = 'all'; // all | pending | done

function loadTasks() {
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath, 'utf8');
    tasks = JSON.parse(data);
  }
  renderTasks();
}

function saveTasks() {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
}

function addTask(text) {
  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
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

    // Criação de checkbox com evento addEventListener
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(i));

    // Texto da tarefa
    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.textDecoration = task.done ? 'line-through' : 'none';
    span.style.flex = '1';

    // Botão de excluir
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.addEventListener('click', () => deleteTask(i));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Eventos dos botões
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('taskInput');
  const texto = input.value.trim();
  if (texto !== '') {
    addTask(texto);
    input.value = '';
    input.focus(); // mantém o cursor no campo
}

});

document.getElementById('filterAll').addEventListener('click', () => { filter = 'all'; renderTasks(); });
document.getElementById('filterPending').addEventListener('click', () => { filter = 'pending'; renderTasks(); });
document.getElementById('filterDone').addEventListener('click', () => { filter = 'done'; renderTasks(); });

// Atualização automática
fs.watch(dataPath, { encoding: 'utf8' }, (eventType) => {
  if (eventType === 'change') loadTasks();
});

loadTasks();

