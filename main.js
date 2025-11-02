document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");

  let tasks = TaskStorage.getTasks();

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";
      li.innerHTML = `
        <span>${task.text}</span>
        <button class="toggleBtn">${task.done ? "Desfazer" : "Concluir"}</button>
        <button class="deleteBtn">Excluir</button>
      `;

      // Alternar status de conclusão
      li.querySelector(".toggleBtn").addEventListener("click", () => {
        tasks[index].done = !tasks[index].done;
        TaskStorage.saveTasks(tasks);
        renderTasks();
      });

      // Excluir tarefa
      li.querySelector(".deleteBtn").addEventListener("click", () => {
        tasks.splice(index, 1);
        TaskStorage.saveTasks(tasks);
        renderTasks();
      });

      taskList.appendChild(li);
    });
  }

  // Adicionar nova tarefa
  addBtn.addEventListener("click", function () {
    const text = taskInput.value.trim();

    // Evita tarefas vazias ou duplicadas
    if (text !== "" && !tasks.some(t => t.text === text)) {
      tasks.push({ text: text, done: false });
      TaskStorage.saveTasks(tasks);
      taskInput.value = "";
      renderTasks();
    }
  });

  renderTasks();
});
