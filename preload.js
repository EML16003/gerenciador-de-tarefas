const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getTasks: () => ipcRenderer.invoke('tasks-get'),
  saveTasks: (tasks) => ipcRenderer.invoke('tasks-save', tasks)
});
