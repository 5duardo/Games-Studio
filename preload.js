const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  navigate: (page) => ipcRenderer.send('navigate', page),

  getData: () => ipcRenderer.invoke('get-data'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  getTeams: () => ipcRenderer.invoke('get-teams'),
  createTeam: (team) => ipcRenderer.invoke('create-team', team),
  updateTeam: (teamId, updates) => ipcRenderer.invoke('update-team', teamId, updates),
  deleteTeam: (teamId) => ipcRenderer.invoke('delete-team', teamId),

  getCategories: () => ipcRenderer.invoke('get-categories'),
  createCategory: (cat) => ipcRenderer.invoke('create-category', cat),
  updateCategory: (catId, updates) => ipcRenderer.invoke('update-category', catId, updates),
  deleteCategory: (catId) => ipcRenderer.invoke('delete-category', catId),

  addQuestion: (catId, question) => ipcRenderer.invoke('add-question', catId, question),
  updateQuestion: (catId, questionId, updates) => ipcRenderer.invoke('update-question', catId, questionId, updates),
  deleteQuestion: (catId, questionId) => ipcRenderer.invoke('delete-question', catId, questionId),

  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data'),

  onUpdaterStatus: (callback) => ipcRenderer.on('updater-status', (_event, status) => callback(status)),
  onUpdaterVersion: (callback) => ipcRenderer.on('updater-version', (_event, version) => callback(version)),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
