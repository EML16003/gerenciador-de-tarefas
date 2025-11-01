document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");

  let tasks = TaskStorage.getTasks();

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task.text;
      taskList.appendChild(li);
    });
  }

  addBtn.addEventListener("click", function () {
    const text = taskInput.value.trim();
    if (text !== "") {
      tasks.push({ text: text });
      TaskStorage.saveTasks(tasks);
      taskInput.value = "";
      renderTasks();
    }
  });

  renderTasks();
});
