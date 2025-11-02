const TaskStorage = {
  getTasks: function () {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  },

  saveTasks: function (tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

