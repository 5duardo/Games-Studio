const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// Data storage path
const dataPath = path.join(app.getPath('userData'), 'games-studio-data.json');

// Default data structure
function getDefaultData() {
  return {
    teams: [],
    categories: [],
    settings: {
      timerEnabled: true,
      defaultTimeLimit: 30,
      showCorrectAnswer: true
    }
  };
}

// Load data from disk
function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      let data = JSON.parse(raw);
      
      // MIGRATION: If old data has teams with questions, move them to categories
      if (data.teams && data.teams.length > 0 && data.teams[0].questions !== undefined) {
        data.categories = [...data.teams];
        data.teams = []; // Reset real teams so user can add players
        saveData(data);
      }
      
      if (!data.categories) data.categories = [];
      if (!data.teams) data.teams = [];
      if (!data.settings) data.settings = getDefaultData().settings;
      
      // AUTO-RECOVERY OF LEGACY DATA DUE TO PACKAGE RENAME
      try {
        const legacyPath = path.join(app.getPath('appData'), 'iteec-quiz', 'iteec-quiz-data.json'); // legacy path kept for migration
        if (data.categories.length === 0 && fs.existsSync(legacyPath)) {
          const legacyRaw = fs.readFileSync(legacyPath, 'utf-8');
          const legacyData = JSON.parse(legacyRaw);
          if (legacyData.teams && legacyData.teams.length > 0 && legacyData.teams[0].questions !== undefined) {
             data.categories = [...legacyData.teams];
             saveData(data);
          } else if (legacyData.categories && legacyData.categories.length > 0) {
             data.categories = legacyData.categories;
             saveData(data);
          }
        }
      } catch(e) {}
      
      // AUTO-LOAD 50 DEFAULT QUESTIONS IF EMPTY
      if (data.categories.length === 0) {
        try {
          const defaultDataPath = path.join(__dirname, 'preguntas_espanol_importar.json');
          if (fs.existsSync(defaultDataPath)) {
            const defaultRaw = fs.readFileSync(defaultDataPath, 'utf-8');
            const defaultImport = JSON.parse(defaultRaw);
            if (defaultImport.teams && defaultImport.teams.length > 0) {
               const defaultCats = defaultImport.teams.filter(t => t.questions && t.questions.length > 0);
               if (defaultCats.length > 0) data.categories = defaultCats;
            } else if (defaultImport.categories && defaultImport.categories.length > 0) {
               data.categories = defaultImport.categories;
            }
            saveData(data);
          }
        } catch(e) { console.error('Error loading default questions:', e); }
      }
      
      // Inject default Azul and Rojo only once
      if (!data.settings.hasDefaultTeams) {
        if (data.teams.length === 0) {
          data.teams.push({ id: generateId(), name: 'Equipo Azul', color: '#3b82f6', icon: '🔵' });
          data.teams.push({ id: generateId(), name: 'Equipo Rojo', color: '#ef4444', icon: '🔴' });
        }
        data.settings.hasDefaultTeams = true;
        saveData(data);
      }
      
      return data;
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  
  // Si no hay archivo, creamos default data
  const defData = getDefaultData();
  defData.teams = [
    { id: generateId(), name: 'Equipo Azul', color: '#3b82f6', icon: '🔵' },
    { id: generateId(), name: 'Equipo Rojo', color: '#ef4444', icon: '🔴' }
  ];
  defData.settings.hasDefaultTeams = true;

  try {
    const defaultDataPath = path.join(__dirname, 'preguntas_espanol_importar.json');
    if (fs.existsSync(defaultDataPath)) {
      const defaultRaw = fs.readFileSync(defaultDataPath, 'utf-8');
      const defaultImport = JSON.parse(defaultRaw);
      if (defaultImport.teams && defaultImport.teams.length > 0) {
         const defaultCats = defaultImport.teams.filter(t => t.questions && t.questions.length > 0);
         if (defaultCats.length > 0) defData.categories = defaultCats;
      } else if (defaultImport.categories && defaultImport.categories.length > 0) {
         defData.categories = defaultImport.categories;
      }
    }
  } catch(e) { console.error('Error loading default questions:', e); }

  saveData(defData);
  return defData;
}

// Save data to disk
function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving data:', e);
    return false;
  }
}

// Generate UUID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0d0d1a',
    show: false,
    icon: path.join(__dirname, 'renderer', 'assets', 'logo-pantera.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Setup Auto Updater
  try {
    autoUpdater.on('checking-for-update', () => {
      if (mainWindow) mainWindow.webContents.send('updater-status', 'checking');
    });
    autoUpdater.on('update-available', () => {
      if (mainWindow) mainWindow.webContents.send('updater-status', 'available');
    });
    autoUpdater.on('update-not-available', () => {
      if (mainWindow) mainWindow.webContents.send('updater-status', 'not-available');
    });
    autoUpdater.on('error', () => {
      if (mainWindow) mainWindow.webContents.send('updater-status', 'error');
    });
    autoUpdater.checkForUpdatesAndNotify();
  } catch(err) {
    console.error('AutoUpdater Error:', err);
    if (mainWindow) mainWindow.webContents.send('updater-status', 'error');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ─── IPC Handlers ────────────────────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('window-close', () => app.quit());
ipcMain.on('navigate', (event, page) => {
  mainWindow.loadFile(path.join(__dirname, 'renderer', page));
});

// ─── Data IPC ────────────────────────────────────────────────────────────────
ipcMain.handle('get-data', () => loadData());
ipcMain.handle('get-settings', () => loadData().settings);
ipcMain.handle('save-settings', (event, settings) => {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  return saveData(data);
});

// ─── Teams (Jugadores) ───────────────────────────────────────────────────────
ipcMain.handle('get-teams', () => loadData().teams);
ipcMain.handle('create-team', (event, team) => {
  const data = loadData();
  const newTeam = {
    id: generateId(),
    name: team.name || 'Nuevo Equipo',
    color: team.color || '#6366f1',
    icon: team.icon || '🏆'
  };
  data.teams.push(newTeam);
  saveData(data);
  return newTeam;
});
ipcMain.handle('update-team', (event, teamId, updates) => {
  const data = loadData();
  const idx = data.teams.findIndex(t => t.id === teamId);
  if (idx === -1) return false;
  data.teams[idx] = { ...data.teams[idx], ...updates };
  return saveData(data);
});
ipcMain.handle('delete-team', (event, teamId) => {
  const data = loadData();
  data.teams = data.teams.filter(t => t.id !== teamId);
  return saveData(data);
});

// ─── Categorías (Preguntas) ──────────────────────────────────────────────────
ipcMain.handle('get-categories', () => loadData().categories);
ipcMain.handle('create-category', (event, cat) => {
  const data = loadData();
  const newCat = {
    id: generateId(),
    name: cat.name || 'Nueva Categoría',
    color: cat.color || '#ec4899',
    icon: cat.icon || '📚',
    questions: []
  };
  data.categories.push(newCat);
  saveData(data);
  return newCat;
});
ipcMain.handle('update-category', (event, catId, updates) => {
  const data = loadData();
  const idx = data.categories.findIndex(c => c.id === catId);
  if (idx === -1) return false;
  data.categories[idx] = { ...data.categories[idx], ...updates };
  return saveData(data);
});
ipcMain.handle('delete-category', (event, catId) => {
  const data = loadData();
  data.categories = data.categories.filter(c => c.id !== catId);
  return saveData(data);
});

// Questions inside categories
ipcMain.handle('add-question', (event, catId, question) => {
  const data = loadData();
  const cat = data.categories.find(c => c.id === catId);
  if (!cat) return false;
  const newQ = {
    id: generateId(),
    text: question.text,
    options: question.options,
    correct: question.correct,
    timeLimit: question.timeLimit || data.settings.defaultTimeLimit
  };
  cat.questions.push(newQ);
  saveData(data);
  return newQ;
});
ipcMain.handle('update-question', (event, catId, questionId, updates) => {
  const data = loadData();
  const cat = data.categories.find(c => c.id === catId);
  if (!cat) return false;
  const qIdx = cat.questions.findIndex(q => q.id === questionId);
  if (qIdx === -1) return false;
  cat.questions[qIdx] = { ...cat.questions[qIdx], ...updates };
  return saveData(data);
});
ipcMain.handle('delete-question', (event, catId, questionId) => {
  const data = loadData();
  const cat = data.categories.find(c => c.id === catId);
  if (!cat) return false;
  cat.questions = cat.questions.filter(q => q.id !== questionId);
  return saveData(data);
});

// ─── Import / Export ─────────────────────────────────────────────────────────
ipcMain.handle('export-data', async () => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exportar configuración',
    defaultPath: 'games-studio-config.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (!filePath) return false;
  const data = loadData();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return true;
});

ipcMain.handle('import-data', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Importar configuración',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (!filePaths || filePaths.length === 0) return false;
  try {
    const raw = fs.readFileSync(filePaths[0], 'utf-8');
    const imported = JSON.parse(raw);
    saveData(imported);
    return true;
  } catch (e) { return false; }
});
