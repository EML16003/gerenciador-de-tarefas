console.log("renderer.js carregado");

// --- Armazena as tarefas em memória ---
let tasks = [];
let filter = "all"; // all | pending | done

// --- Ao carregar a página ---
document.addEventListener("DOMContentLoaded", loadTasks);

// --- Função: carregar tarefas do armazenamento local ---
function loadTasks() {
  tasks = TaskStorage.getTasks();
  renderTasks();
}

// --- Função: salvar tarefas no localStorage e atualizar tela ---
function saveTasks() {
  TaskStorage.saveTasks(tasks);
  renderTasks();
}

// --- Adiciona nova tarefa ---
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const name = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categorySelect").value.trim();
  const timeValue = document.getElementById("timeValue").value.trim();
  const timeUnit = document.getElementById("timeUnit").value;

  if (!name) {
    alert("Digite o nome da tarefa!");
    return;
  }

  const newTask = {
    id: Date.now(),
    name,
    category: category || "Sem categoria",
    timeValue: timeValue || "0",
    timeUnit: timeUnit || "segundo",
    done: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  saveTasks();

  // Limpa campos
  document.getElementById("taskInput").value = "";
  document.getElementById("categorySelect").value = "";
  document.getElementById("timeValue").value = "";
  document.getElementById("timeUnit").value = "segundo";
  document.getElementById("taskInput").focus();

  scheduleTaskNotification(newTask);
});

// --- Renderiza as tarefas na tela ---
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  // Aplica o filtro
  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "done"
      ? tasks.filter((t) => t.done)
      : tasks.filter((t) => !t.done);

  // Cria o elemento de cada tarefa
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div>
        <strong>${task.name}</strong>
        <small> - ${task.category}</small><br>
        <small>Tempo: ${task.timeValue} ${task.timeUnit}${
      task.timeValue > 1 ? "s" : ""
    }</small>
      </div>
      <div>
        <button class="done-btn">${task.done ? "✔ Concluída" : "Concluir"}</button>
        <button class="delete-btn">🗑 Excluir</button>
      </div>
    `;

    // Botão "Concluir"
    li.querySelector(".done-btn").addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
    });

    // Botão "Excluir"
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
    });

    list.appendChild(li);
  });
}

// --- Filtro de exibição ---
function setFilter(type) {
  filter = type;
  renderTasks();
}

// --- Agenda a notificação ---
function scheduleTaskNotification(task) {
  if (!task.timeValue || isNaN(task.timeValue)) return;

  const timeMs = convertToMilliseconds(task.timeValue, task.timeUnit);

  setTimeout(() => {
    showNotification(
      "Prazo expirado!",
      `A tarefa "${task.name}" ultrapassou o tempo estimado. Verifique ou conclua.`
    );
  }, timeMs);
}

// --- Converte unidades de tempo ---
function convertToMilliseconds(value, unit) {
  const v = parseInt(value);
  switch (unit) {
    case "segundo": return v * 1000;
    case "minuto": return v * 60 * 1000;
    case "hora": return v * 60 * 60 * 1000;
    case "dia": return v * 24 * 60 * 60 * 1000;
    case "mês": return v * 30 * 24 * 60 * 60 * 1000;
    case "ano": return v * 365 * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}

// --- Exibe notificação ---
function showNotification(title, message) {
  if (!("Notification" in window)) {
    alert(`${title}\n${message}`);
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") new Notification(title, { body: message });
    });
  }
}
