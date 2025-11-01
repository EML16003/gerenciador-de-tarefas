const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const TaskStore = require('./taskStore');

// ⬇️ Inicializa o módulo @electron/remote
require('@electron/remote/main').initialize();

let mainWindow;
const store = new TaskStore(path.join(app.getPath('userData'), 'tasks.json'));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // ⬇️ Habilita o remote para esta janela
  require('@electron/remote/main').enable(mainWindow.webContents);

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools(); // opcional: remove depois de testar
}

app.whenReady().then(createWindow);

// IPC handlers
ipcMain.handle('tasks-get', async () => {
  return store.read();
});

ipcMain.handle('tasks-save', async (_, tasks) => {
  return store.write(tasks);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

